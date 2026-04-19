import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StoreData } from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../../data");
const storePath = join(dataDir, "store.json");

const emptyStore = (): StoreData => ({
  users: [],
  carts: {},
  orders: [],
  wishlists: {},
  userBehavior: {},
});

let cache: StoreData | null = null;

export function getStore(): StoreData {
  if (cache) return cache;
  try {
    if (!existsSync(storePath)) {
      mkdirSync(dataDir, { recursive: true });
      cache = emptyStore();
      writeFileSync(storePath, JSON.stringify(cache, null, 2), "utf-8");
      return cache;
    }
    const raw = readFileSync(storePath, "utf-8");
    cache = JSON.parse(raw) as StoreData;
    if (!cache.carts) cache.carts = {};
    if (!cache.wishlists) cache.wishlists = {};
    if (!cache.userBehavior) cache.userBehavior = {};
    return cache;
  } catch {
    cache = emptyStore();
    return cache;
  }
}

export function saveStore(): void {
  if (!cache) return;
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(storePath, JSON.stringify(cache, null, 2), "utf-8");
}
