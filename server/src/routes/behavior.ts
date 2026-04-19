import { Router } from "express";
import { PRODUCTS } from "../data/seedProducts.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore, saveStore } from "../data/store.js";
import { defaultBehavior, retainBehaviorMemory } from "../lib/personalization.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const b = store.userBehavior[uid] ?? defaultBehavior();
  const recentProducts = b.viewedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  res.json({
    recentProducts,
    categoryClicks: b.categoryClicks,
    searchTerms: b.searchTerms.slice(0, 8),
    wishlistProductIds: b.wishlistProductIds,
  });
});

router.post("/search", authMiddleware, (req, res) => {
  const term = typeof req.body?.term === "string" ? req.body.term.trim() : "";
  if (!term) {
    res.status(400).json({ error: "term required" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  behavior.searchTerms = [term, ...behavior.searchTerms.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(
    0,
    20
  );
  behavior.lastInteractedAt = new Date().toISOString();
  store.userBehavior[uid] = behavior;
  saveStore();
  void retainBehaviorMemory(uid, `Searched for: ${term}`).catch(() => {});
  res.json({ ok: true });
});

export default router;
