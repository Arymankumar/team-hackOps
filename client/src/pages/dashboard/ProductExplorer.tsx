import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export function ProductExplorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const minRating = searchParams.get("minRating") ?? "";

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (category && category !== "all") p.set("category", category);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (minRating) p.set("minRating", minRating);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [category, minPrice, maxPrice, minRating, q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api<{ products: Product[] }>(`/products${queryString}`, { auth: false }),
          api<{ categories: string[] }>("/categories", { auth: false }),
        ]);
        if (!cancelled) {
          setProducts(prodRes.products);
          setCategories(catRes.categories);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Product Explorer</h1>
          <p className="mt-2 text-ink-muted">Filter the catalog — wired to GET /api/products</p>
        </div>
        <Link
          to="/app/recommendations"
          className="text-sm font-medium text-accent-muted hover:text-accent"
        >
          View AI recommendations →
        </Link>
      </div>

      <Card className="mb-8 !p-5" hover={false}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Search</label>
            <input
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                const next = new URLSearchParams(searchParams);
                if (v.trim()) next.set("q", v);
                else next.delete("q");
                setSearchParams(next);
              }}
              placeholder="Name, tag…"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Category</label>
            <select
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent/40"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Min price</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => updateParam("minPrice", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Max price</label>
            <input
              type="number"
              placeholder="9999"
              value={maxPrice}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Min rating</label>
            <select
              value={minRating}
              onChange={(e) => updateParam("minRating", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            >
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="text-ink-muted">Loading products…</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/app/products/${p.id}`}>
                <Card className="overflow-hidden !p-0" hover>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-accent-muted">{p.category}</p>
                    <h3 className="mt-1 font-display text-lg text-white">{p.name}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                      <span className="text-amber-400">★</span>
                      {p.rating}
                      <span className="text-ink-faint">({p.reviewCount})</span>
                    </div>
                    <p className="mt-3 font-display text-xl text-white">${p.price.toFixed(2)}</p>
                    {!p.inStock && (
                      <span className="mt-2 inline-block rounded-lg bg-red-500/15 px-2 py-0.5 text-xs text-red-300">
                        Out of stock
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-ink-muted">No products match these filters.</p>
      )}
    </div>
  );
}
