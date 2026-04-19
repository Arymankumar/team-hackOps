import { HindsightClient } from "@vectorize-io/hindsight-client";

const DEFAULT_BASE = "https://api.hindsight.vectorize.io";

let client: HindsightClient | null = null;

export function getHindsightApiKey(): string | undefined {
  return process.env.HINDSIGHT_API_KEY;
}

export function getHindsightClient(): HindsightClient {
  const apiKey = getHindsightApiKey();
  if (!apiKey) {
    throw new Error("HINDSIGHT_API_KEY is not set in server/.env");
  }
  if (!client) {
    client = new HindsightClient({
      baseUrl: process.env.HINDSIGHT_BASE_URL ?? DEFAULT_BASE,
      apiKey,
    });
  }
  return client;
}

export async function ensureUserBank(bankId: string): Promise<void> {
  const c = getHindsightClient();
  try {
    await c.getBankProfile(bankId);
  } catch {
    await c.createBank(bankId, {
      name: `SmartShopping AI memories (${bankId})`,
    });
  }
}

export function userMemoryBankId(userId: string): string {
  return `smartshopping-${userId}`;
}
