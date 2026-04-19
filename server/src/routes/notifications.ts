import { Router } from "express";
import { PRODUCTS } from "../data/seedProducts.js";
import { getStore, saveStore } from "../data/store.js";
import type { DealNotification } from "../types.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { defaultBehavior } from "../lib/personalization.js";

const router = Router();
const platforms = ["Meesho", "Amazon", "Flipkart", "Shopsy"] as const;

function offerSeed(input: string): number {
  return Array.from(input).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function bestDiscountForProduct(productId: string): number {
  const baseSeed = offerSeed(productId);
  return Math.max(
    ...platforms.map((_, i) => {
      return Math.max(5, Math.min(42, 12 + ((baseSeed + i * 13) % 30)));
    })
  );
}

function buildNotification(productId: string, discountPercent: number): DealNotification | null {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return null;
  return {
    id: `deal-${productId}-${Date.now()}`,
    productId,
    title: `${product.name} has a new deal`,
    message: `${discountPercent}% discount available now. Check live comparison to grab the lowest price.`,
    discountPercent,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const behavior = store.userBehavior[uid] ?? defaultBehavior();
  const watchList = Array.from(new Set([...(store.wishlists[uid] ?? []), ...behavior.viewedProductIds.slice(0, 8)]));

  const watchState = store.dealWatch[uid] ?? {};
  const notifications = store.dealNotifications[uid] ?? [];
  for (const productId of watchList) {
    const latestDiscount = bestDiscountForProduct(productId);
    const previous = watchState[productId] ?? 0;
    if (latestDiscount >= 20 && latestDiscount > previous) {
      const next = buildNotification(productId, latestDiscount);
      if (next) notifications.unshift(next);
    }
    watchState[productId] = latestDiscount;
  }
  store.dealWatch[uid] = watchState;
  store.dealNotifications[uid] = notifications.slice(0, 20);
  saveStore();

  res.json({
    notifications: store.dealNotifications[uid],
    unreadCount: store.dealNotifications[uid].filter((item) => !item.read).length,
  });
});

router.post("/:id/read", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const notifications = store.dealNotifications[uid] ?? [];
  const next = notifications.map((item) => (item.id === req.params.id ? { ...item, read: true } : item));
  store.dealNotifications[uid] = next;
  saveStore();
  res.json({ ok: true });
});

export default router;
