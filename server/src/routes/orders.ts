import { Router } from "express";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore } from "../data/store.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const orders = store.orders.filter((o) => o.userId === uid).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders });
});

router.get("/:id", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const order = store.orders.find((o) => o.id === req.params.id && o.userId === uid);
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ order });
});

export default router;
