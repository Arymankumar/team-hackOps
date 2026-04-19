import { Router } from "express";
import { CATEGORIES } from "../data/seedProducts.js";

const router = Router();

const DEALS = [
  { id: "d1", title: "Spring Tech Event", discount: "20% off electronics", endsAt: "2026-05-01", code: "TECH20" },
  { id: "d2", title: "Fashion Weekend", discount: "15% orders $100+", endsAt: "2026-04-25", code: "STYLE15" },
  { id: "d3", title: "Home Bundle", discount: "Free shipping over $75", endsAt: "2026-06-01", code: "HOMEship" },
];

router.get("/categories", (_req, res) => {
  res.json({ categories: [...CATEGORIES] });
});

router.get("/deals", (_req, res) => {
  res.json({ deals: DEALS });
});

export default router;
