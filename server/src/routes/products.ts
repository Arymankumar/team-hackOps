import { Router } from "express";
import { PRODUCTS, SAMPLE_REVIEWS } from "../data/seedProducts.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore, saveStore } from "../data/store.js";
import { defaultBehavior, retainBehaviorMemory } from "../lib/personalization.js";

const router = Router();
const platforms = ["Meesho", "Amazon", "Flipkart", "Shopsy"] as const;

function offerSeed(input: string): number {
  return Array.from(input).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

router.get("/", (req, res) => {
  const { category, minPrice, maxPrice, minRating, q } = req.query;
  let list = [...PRODUCTS];

  if (typeof category === "string" && category !== "all") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (typeof minPrice === "string") {
    const n = Number(minPrice);
    if (!Number.isNaN(n)) list = list.filter((p) => p.price >= n);
  }
  if (typeof maxPrice === "string") {
    const n = Number(maxPrice);
    if (!Number.isNaN(n)) list = list.filter((p) => p.price <= n);
  }
  if (typeof minRating === "string") {
    const n = Number(minRating);
    if (!Number.isNaN(n)) list = list.filter((p) => p.rating >= n);
  }
  if (typeof q === "string" && q.trim()) {
    const s = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tags.some((t) => t.includes(s))
    );
  }

  res.json({ products: list });
});

router.get("/:id", (req, res) => {
  const p = PRODUCTS.find((x) => x.id === req.params.id);
  if (!p) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const reviews = SAMPLE_REVIEWS[p.id] ?? SAMPLE_REVIEWS.default;
  res.json({ product: p, reviews });
});

router.get("/:id/comparison", (req, res) => {
  const p = PRODUCTS.find((x) => x.id === req.params.id);
  if (!p) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const baseSeed = offerSeed(p.id);
  const offers = platforms.map((platform, i) => {
    const variation = ((baseSeed + i * 17) % 22) - 9;
    const rawPrice = Math.max(1, p.price + variation);
    const discount = Math.max(5, Math.min(42, 12 + ((baseSeed + i * 13) % 30)));
    const finalPrice = Number((rawPrice * (1 - discount / 100)).toFixed(2));
    const deliveryDays = 1 + ((baseSeed + i * 5) % 5);
    return {
      platform,
      price: finalPrice,
      discountPercent: discount,
      deliveryTime: `${deliveryDays} day${deliveryDays > 1 ? "s" : ""}`,
      sellerName: `${platform} Seller ${String.fromCharCode(65 + ((baseSeed + i) % 26))}`,
    };
  });

  const lowestPrice = Math.min(...offers.map((offer) => offer.price));
  const topSellers = offers
    .map((offer, i) => {
      const rating = Number((3.8 + ((baseSeed + i * 11) % 14) / 10).toFixed(1));
      const reviews = 80 + ((baseSeed + i * 53) % 4200);
      return {
        name: offer.sellerName,
        platform: offer.platform,
        rating,
        reviews,
        trustBadge: rating > 4,
      };
    })
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 3);

  res.json({ offers, lowestPrice, topSellers });
});

router.post("/:id/view", authMiddleware, (req, res) => {
  const p = PRODUCTS.find((x) => x.id === req.params.id);
  if (!p) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  const viewed = [p.id, ...behavior.viewedProductIds.filter((id) => id !== p.id)].slice(0, 30);
  behavior.viewedProductIds = viewed;
  const cc = { ...behavior.categoryClicks };
  cc[p.category] = (cc[p.category] ?? 0) + 1;
  behavior.categoryClicks = cc;
  behavior.lastInteractedAt = new Date().toISOString();
  store.userBehavior[uid] = behavior;
  saveStore();
  void retainBehaviorMemory(uid, `Viewed product: ${p.name} (${p.category})`).catch(() => {});
  res.json({ ok: true });
});

router.post("/category-click", authMiddleware, (req, res) => {
  const { category } = req.body as { category?: string };
  if (!category) {
    res.status(400).json({ error: "category required" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  const cc = { ...behavior.categoryClicks };
  cc[category] = (cc[category] ?? 0) + 1;
  behavior.categoryClicks = cc;
  behavior.lastInteractedAt = new Date().toISOString();
  store.userBehavior[uid] = behavior;
  saveStore();
  res.json({ ok: true });
});

export default router;
