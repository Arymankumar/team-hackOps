import { Router } from "express";
import { PRODUCTS, SAMPLE_REVIEWS } from "../data/seedProducts.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore, saveStore } from "../data/store.js";

const router = Router();

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

router.post("/:id/view", authMiddleware, (req, res) => {
  const p = PRODUCTS.find((x) => x.id === req.params.id);
  if (!p) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? { viewedProductIds: [], categoryClicks: {} };
  const viewed = [p.id, ...behavior.viewedProductIds.filter((id) => id !== p.id)].slice(0, 30);
  behavior.viewedProductIds = viewed;
  const cc = { ...behavior.categoryClicks };
  cc[p.category] = (cc[p.category] ?? 0) + 1;
  behavior.categoryClicks = cc;
  store.userBehavior[uid] = behavior;
  saveStore();
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
  const behavior = store.userBehavior[uid] ?? { viewedProductIds: [], categoryClicks: {} };
  const cc = { ...behavior.categoryClicks };
  cc[category] = (cc[category] ?? 0) + 1;
  behavior.categoryClicks = cc;
  store.userBehavior[uid] = behavior;
  saveStore();
  res.json({ ok: true });
});

export default router;
