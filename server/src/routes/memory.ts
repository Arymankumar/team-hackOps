import { Router, type Response } from "express";
import { authMiddleware, getUserId } from "../middleware/auth.js";
import {
  ensureUserBank,
  getHindsightApiKey,
  getHindsightClient,
  userMemoryBankId,
} from "../lib/hindsight.js";

const router = Router();

function requireHindsightConfigured(res: Response): boolean {
  if (!getHindsightApiKey()) {
    res.status(503).json({
      error: "Hindsight is not configured",
      hint: "Add HINDSIGHT_API_KEY to server/.env and restart the API.",
    });
    return false;
  }
  return true;
}

router.post("/retain", authMiddleware, async (req, res) => {
  if (!requireHindsightConfigured(res)) return;

  const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";
  if (!content) {
    res.status(400).json({ error: "Missing content" });
    return;
  }

  const bankId = userMemoryBankId(getUserId(req));

  try {
    await ensureUserBank(bankId);
    await getHindsightClient().retain(bankId, content);
    res.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to store memory";
    res.status(500).json({ error: message });
  }
});

router.post("/recall", authMiddleware, async (req, res) => {
  if (!requireHindsightConfigured(res)) return;

  const query = typeof req.body?.query === "string" ? req.body.query.trim() : "";
  if (!query) {
    res.status(400).json({ error: "Missing query" });
    return;
  }

  const bankId = userMemoryBankId(getUserId(req));

  try {
    await ensureUserBank(bankId);
    const result = await getHindsightClient().recall(bankId, query);
    res.json({
      memories: result.results.map((m) => ({
        text: m.text,
        type: m.type,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to recall memories";
    res.status(500).json({ error: message });
  }
});

export default router;
