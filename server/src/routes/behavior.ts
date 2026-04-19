import { Router } from "express";
import { PRODUCTS } from "../data/seedProducts.js";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import { getStore } from "../data/store.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  const store = getStore();
  const uid = getUserId(req);
  const b = store.userBehavior[uid] ?? { viewedProductIds: [], categoryClicks: {} };
  const recentProducts = b.viewedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  res.json({
    recentProducts,
    categoryClicks: b.categoryClicks,
  });
});

export default router;
