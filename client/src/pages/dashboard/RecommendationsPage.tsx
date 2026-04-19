import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export function RecommendationsPage() {
  const [data, setData] = useState<{
    recommendations: Product[];
    insight: string;
    signals: { topCategories: string[]; recentViews: string[] };
  } | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api<{
          recommendations: Product[];
          insight: string;
          signals: { topCategories: string[]; recentViews: string[] };
        }>("/recommendations");
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (err) {
    return <p className="text-red-300">{err}</p>;
  }

  if (!data) {
    return <p className="text-ink-muted">Loading recommendations…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold text-white">AI Recommendations</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Ranked via GET /api/recommendations using lightweight behavior signals. Replace with your model service when you
        go to production.
      </p>

      <Card className="mt-8 border-accent/20 bg-accent/5 !p-6" hover={false}>
        <p className="text-sm font-medium text-accent-muted">Insight</p>
        <p className="mt-2 text-lg text-white">{data.insight}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-muted">
          {data.signals.topCategories.length > 0 && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Top categories: {data.signals.topCategories.join(", ")}
            </span>
          )}
          {data.signals.recentViews.length > 0 && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Recent views: {data.signals.recentViews.length} sku(s)
            </span>
          )}
        </div>
      </Card>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.recommendations.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/app/products/${p.id}`}>
              <Card className="overflow-hidden !p-0" hover>
                <img src={p.image} alt="" className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs text-accent-muted">{p.category}</p>
                  <p className="mt-1 font-medium text-white">{p.name}</p>
                  <p className="mt-2 font-display text-lg text-white">${p.price.toFixed(2)}</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
