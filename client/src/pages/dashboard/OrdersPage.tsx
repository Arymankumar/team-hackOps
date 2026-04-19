import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";

const statusColor: Record<OrderStatus, string> = {
  processing: "bg-amber-500/15 text-amber-200",
  shipped: "bg-sky-500/15 text-sky-200",
  delivered: "bg-emerald-500/15 text-emerald-200",
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const data = await api<{ orders: Order[] }>("/orders");
      setOrders(data.orders);
    })().catch(() => setOrders([]));
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-white">Orders</h1>
      <p className="mt-2 text-ink-muted">Order tracking — extend with carrier APIs and webhooks.</p>
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <Card key={o.id} hover={false} className="!p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-ink-muted">{o.id}</p>
                <p className="mt-1 text-sm text-ink-faint">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor[o.status]}`}>
                {o.status}
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Tracking</p>
              <p className="mt-1 font-mono text-white">{o.trackingNumber}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 transition-all"
                  style={{
                    width: o.status === "delivered" ? "100%" : o.status === "shipped" ? "66%" : "33%",
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                {o.status === "delivered"
                  ? "Delivered"
                  : o.status === "shipped"
                    ? "In transit"
                    : "Preparing shipment"}
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {o.items.map((i) => (
                <li key={`${o.id}-${i.productId}`} className="flex justify-between">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right font-display text-xl text-white">${o.total.toFixed(2)}</p>
          </Card>
        ))}
      </div>
      {orders.length === 0 && <p className="mt-10 text-center text-ink-muted">No orders yet. Complete a checkout first.</p>}
    </div>
  );
}
