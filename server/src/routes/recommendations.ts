import { Router } from "express";
import { PRODUCTS } from "../data/seedProducts.js";
import { getUserId, authMiddleware } from "../middleware/auth.js";
import { getStore } from "../data/store.js";

const router = Router();

function scoreProduct(
  p: (typeof PRODUCTS)[0],
  viewedIds: string[],
  categoryWeights: Record<string, number>
): number {
  let s = p.rating * 2 + (p.inStock ? 3 : 0);
  if (viewedIds.includes(p.id)) s -= 5;
  s += (categoryWeights[p.category] ?? 0) * 4;
  if (p.tags.includes("trending")) s += 2;
  return s;
}

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? { viewedProductIds: [], categoryClicks: {} };
  const viewed = behavior.viewedProductIds;
  const weights = behavior.categoryClicks;

  const ranked = [...PRODUCTS]
    .map((p) => ({ p, score: scoreProduct(p, viewed, weights) }))
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
    },
  });
});

export default router;
