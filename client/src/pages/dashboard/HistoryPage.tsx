import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export function HistoryPage() {
  const [recent, setRecent] = useState<Product[]>([]);
  const [clicks, setClicks] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const data = await api<{ recentProducts: Product[]; categoryClicks: Record<string, number> }>("/behavior");
      setRecent(data.recentProducts);
      setClicks(data.categoryClicks);
    })().catch(() => {
      setRecent([]);
      setClicks({});
    });
  }, []);

  const topCats = Object.entries(clicks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl text-white">History</h1>
      <p className="mt-2 text-ink-muted">Recent product views and category engagement from GET /api/behavior.</p>

      <h2 className="mt-10 font-display text-lg text-white">Recently viewed</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recent.map((p) => (
          <Link key={p.id} to={`/app/products/${p.id}`}>
            <Card className="overflow-hidden !p-0" hover>
              <img src={p.image} alt="" className="aspect-video w-full object-cover" />
              <div className="p-4">
                <p className="font-medium text-white">{p.name}</p>
                <p className="text-sm text-ink-muted">${p.price.toFixed(2)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {recent.length === 0 && <p className="mt-4 text-ink-muted">No views yet — open a few product pages.</p>}

      <h2 className="mt-12 font-display text-lg text-white">Category interest</h2>
      <Card className="mt-4 !p-6" hover={false}>
        {topCats.length === 0 ? (
          <p className="text-ink-muted">Explore categories to build this list.</p>
        ) : (
          <ul className="space-y-3">
            {topCats.map(([name, n]) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span className="text-white">{name}</span>
                <span className="text-ink-muted">{n} interactions</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
