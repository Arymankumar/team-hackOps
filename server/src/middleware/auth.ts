import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "smartshopping-dev-secret-change-in-production";

export type JwtPayload = { sub: string; email: string };

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as Request & { userId?: string; userEmail?: string }).userId = decoded.sub;
    (req as Request & { userId?: string; userEmail?: string }).userEmail = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function getUserId(req: Request): string {
  const id = (req as Request & { userId?: string }).userId;
  if (!id) throw new Error("Missing user");
  return id;
}
