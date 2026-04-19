import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Deal } from "@/types";

export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    (async () => {
      const data = await api<{ deals: Deal[] }>("/deals", { auth: false });
      setDeals(data.deals);
    })().catch(() => setDeals([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl text-white">Deals & Offers</h1>
      <p className="mt-2 text-ink-muted">Promotional surface — connect CRM or pricing rules.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {deals.map((d) => (
          <Card key={d.id} hover className="flex flex-col !p-6">
            <span className="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-muted">
              Ends {d.endsAt}
            </span>
            <h3 className="mt-4 font-display text-xl text-white">{d.title}</h3>
            <p className="mt-2 flex-1 text-ink-muted">{d.discount}</p>
            <p className="mt-6 font-mono text-sm text-white">
              Code: <span className="text-accent-muted">{d.code}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
