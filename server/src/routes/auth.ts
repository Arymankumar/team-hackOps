import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { getStore, saveStore } from "../data/store.js";
import { signToken, authMiddleware, getUserId } from "../middleware/auth.js";
import type { User } from "../types.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  if (!email || !password || !name) {
    res.status(400).json({ error: "email, password, and name required" });
    return;
  }
  const store = getStore();
  if (store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: uuid(),
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    plan: "starter",
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  store.carts[user.id] = store.carts[user.id] ?? [];
  store.wishlists[user.id] = store.wishlists[user.id] ?? [];
  store.userBehavior[user.id] = store.userBehavior[user.id] ?? { viewedProductIds: [], categoryClicks: {} };
  saveStore();
  const token = signToken({ sub: user.id, email: user.email });
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password required" });
    return;
  }
  const store = getStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ sub: user.id, email: user.email });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
  });
});

router.get("/me", authMiddleware, (req, res) => {
  const store = getStore();
  const id = getUserId(req);
  const user = store.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, email: user.email, name: user.name, plan: user.plan });
});

router.patch("/me/plan", authMiddleware, (req, res) => {
  const { plan } = req.body as { plan?: string };
  if (plan !== "starter" && plan !== "pro" && plan !== "premium") {
    res.status(400).json({ error: "Invalid plan" });
    return;
  }
  const store = getStore();
  const id = getUserId(req);
  const user = store.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  user.plan = plan;
  saveStore();
  res.json({ id: user.id, email: user.email, name: user.name, plan: user.plan });
});

export default router;
