import { Router } from "express";
import { v4 as uuid } from "uuid";
import { PRODUCTS } from "../data/seedProducts.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore, saveStore } from "../data/store.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const items = store.carts[uid] ?? [];
  const enriched = items.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId);
    return p
      ? { ...i, product: p }
      : { ...i, product: null };
  });
  const subtotal = enriched.reduce((sum, i) => {
    if (!i.product) return sum;
    return sum + i.product.price * i.quantity;
  }, 0);
  res.json({ items: enriched, subtotal });
});

router.post("/items", authMiddleware, (req, res) => {
  const { productId, quantity } = req.body as { productId?: string; quantity?: number };
  if (!productId || typeof quantity !== "number" || quantity < 1) {
    res.status(400).json({ error: "productId and quantity (>=1) required" });
    return;
  }
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const cart = store.carts[uid] ?? [];
  const existing = cart.find((c) => c.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  store.carts[uid] = cart;
  saveStore();
  res.json({ ok: true, cart });
});

router.patch("/items/:productId", authMiddleware, (req, res) => {
  const { quantity } = req.body as { quantity?: number };
  if (typeof quantity !== "number" || quantity < 1) {
    res.status(400).json({ error: "quantity >= 1 required" });
    return;
  }
  const store = getStore();
  const uid = getUserId(req);
  const cart = store.carts[uid] ?? [];
  const item = cart.find((c) => c.productId === req.params.productId);
  if (!item) {
    res.status(404).json({ error: "Item not in cart" });
    return;
  }
  item.quantity = quantity;
  store.carts[uid] = cart;
  saveStore();
  res.json({ ok: true, cart });
});

router.delete("/items/:productId", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const cart = (store.carts[uid] ?? []).filter((c) => c.productId !== req.params.productId);
  store.carts[uid] = cart;
  saveStore();
  res.json({ ok: true, cart });
});

router.post("/checkout", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const cart = store.carts[uid] ?? [];
  if (!cart.length) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  let total = 0;
  const lineItems = cart.map((c) => {
    const p = PRODUCTS.find((x) => x.id === c.productId)!;
    total += p.price * c.quantity;
    return { productId: p.id, quantity: c.quantity, price: p.price, name: p.name };
  });
  const order = {
    id: uuid(),
    userId: uid,
    items: lineItems,
    total,
    status: "processing" as const,
    trackingNumber: `SF-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  store.carts[uid] = [];
  saveStore();
  res.status(201).json({ order });
});

export default router;
