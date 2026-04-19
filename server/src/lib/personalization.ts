import { ensureUserBank, getHindsightApiKey, getHindsightClient, userMemoryBankId } from "./hindsight.js";

export type UserBehaviorProfile = {
  viewedProductIds: string[];
  categoryClicks: Record<string, number>;
  searchTerms: string[];
  wishlistProductIds: string[];
  lastInteractedAt: string;
};

export function defaultBehavior(): UserBehaviorProfile {
  return {
    viewedProductIds: [],
    categoryClicks: {},
    searchTerms: [],
    wishlistProductIds: [],
    lastInteractedAt: new Date().toISOString(),
  };
}

export async function retainBehaviorMemory(userId: string, content: string): Promise<void> {
  if (!getHindsightApiKey()) return;
  const bankId = userMemoryBankId(userId);
  await ensureUserBank(bankId);
  await getHindsightClient().retain(bankId, content);
}
