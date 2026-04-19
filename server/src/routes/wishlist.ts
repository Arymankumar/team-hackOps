import { Router } from "express";
import { PRODUCTS } from "../data/seedProducts.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore, saveStore } from "../data/store.js";
import { defaultBehavior, retainBehaviorMemory } from "../lib/personalization.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const ids = store.wishlists[uid] ?? [];
  const products = ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  res.json({ products });
});

router.post("/:productId", authMiddleware, (req, res) => {
  const p = PRODUCTS.find((x) => x.id === req.params.productId);
  if (!p) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const list = store.wishlists[uid] ?? [];
  if (!list.includes(p.id)) list.push(p.id);
  store.wishlists[uid] = list;
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  behavior.wishlistProductIds = list;
  behavior.lastInteractedAt = new Date().toISOString();
  store.userBehavior[uid] = behavior;
  saveStore();
  void retainBehaviorMemory(uid, `Wishlisted product: ${p.name}`).catch(() => {});
  res.json({ ok: true, ids: list });
});

router.delete("/:productId", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const list = (store.wishlists[uid] ?? []).filter((id) => id !== req.params.productId);
  store.wishlists[uid] = list;
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  behavior.wishlistProductIds = list;
  behavior.lastInteractedAt = new Date().toISOString();
  store.userBehavior[uid] = behavior;
  saveStore();
  res.json({ ok: true, ids: list });
});

export default router;
