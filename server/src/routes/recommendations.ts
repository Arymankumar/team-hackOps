import { Router } from "express";
import { PRODUCTS } from "../data/seedProducts.js";
import { getUserId, authMiddleware } from "../middleware/auth.js";
import { getStore } from "../data/store.js";
import { defaultBehavior } from "../lib/personalization.js";
import { ensureUserBank, getHindsightApiKey, getHindsightClient, userMemoryBankId } from "../lib/hindsight.js";

const router = Router();

function scoreProduct(
  p: (typeof PRODUCTS)[0],
  viewedIds: string[],
  categoryWeights: Record<string, number>,
  searchTerms: string[],
  wishlistIds: string[]
): number {
  let s = p.rating * 2 + (p.inStock ? 3 : 0);
  if (viewedIds.includes(p.id)) s -= 5;
  if (wishlistIds.includes(p.id)) s += 6;
  s += (categoryWeights[p.category] ?? 0) * 4;
  if (p.tags.includes("trending")) s += 2;
  const combined = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
  for (const term of searchTerms) {
    if (combined.includes(term.toLowerCase())) s += 2.5;
  }
  return s;
}

router.get("/", authMiddleware, async (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  const viewed = behavior.viewedProductIds;
  const weights = behavior.categoryClicks;
  const searches = behavior.searchTerms.slice(0, 5);
  const wishlistIds = behavior.wishlistProductIds;
  let memoryHints: string[] = [];

  if (getHindsightApiKey()) {
    try {
      const bankId = userMemoryBankId(uid);
      await ensureUserBank(bankId);
      const result = await getHindsightClient().recall(bankId, "What shopping preferences does this user have?");
      memoryHints = result.results.map((item) => item.text.toLowerCase());
    } catch {
      memoryHints = [];
    }
  }

  const ranked = [...PRODUCTS]
    .map((p) => {
      let score = scoreProduct(p, viewed, weights, searches, wishlistIds);
      const searchable = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      for (const hint of memoryHints.slice(0, 3)) {
        if (hint && searchable.includes(hint.split(" ").slice(0, 3).join(" "))) score += 1.5;
      }
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.p);

  const because = viewed.length
    ? `Based on your recent views and category interest.`
    : `Popular picks to get you started — interact with products to personalize.`;

  res.json({
    recommendations: ranked,
    insight: because,
    signals: {
      topCategories: Object.entries(weights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name),
      recentViews: viewed.slice(0, 5),
      recentSearches: searches.slice(0, 5),
      wishlistCount: wishlistIds.length,
    },
  });
});

export default router;
