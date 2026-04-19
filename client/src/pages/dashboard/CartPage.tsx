import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product } from "@/types";

type Line = { quantity: number; product: Product | null };

export function CartPage() {
  const [items, setItems] = useState<Line[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState("");

  async function refresh() {
    const data = await api<{ items: Line[]; subtotal: number }>("/cart");
    setItems(data.items);
    setSubtotal(data.subtotal);
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  async function updateQty(productId: string, quantity: number) {
    await api(`/cart/items/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity }) });
    await refresh();
  }

  async function remove(productId: string) {
    await api(`/cart/items/${productId}`, { method: "DELETE" });
    await refresh();
  }

  async function checkout() {
    setBusy(true);
    try {
      const res = await api<{ order: { id: string } }>("/cart/checkout", { method: "POST" });
      setOrderId(res.order.id);
      setStep("done");
      setItems([]);
      setSubtotal(0);
    } finally {
      setBusy(false);
    }
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card hover={false} className="!p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-white">Order placed</h1>
          <p className="mt-3 text-ink-muted">
            Order ID <span className="font-mono text-ink">{orderId}</span>. In production, redirect to payment provider
            and listen for webhooks.
          </p>
          <Link to="/app/orders" className="mt-8 inline-block">
            <Button className="w-full">Track orders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (step === "checkout") {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-white">Checkout</h1>
        <p className="mt-2 text-ink-muted">Demo confirmation — connect Stripe Elements or Payment Links here.</p>
        <Card className="mt-8 !p-6" hover={false}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-ink-faint">Full name</label>
              <input className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm" readOnly value="Demo customer" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-faint">Card</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
                readOnly
                value="4242 4242 4242 4242 (placeholder)"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-ink-muted">Total</span>
            <span className="font-display text-2xl text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep("cart")}>
              Back
            </Button>
            <Button className="flex-1" disabled={busy} onClick={checkout}>
              {busy ? "Processing…" : "Pay & place order"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-white">Cart</h1>
      <p className="mt-2 text-ink-muted">Items sync to the server per logged-in user.</p>

      {items.length === 0 ? (
        <Card className="mt-8 !p-10 text-center" hover={false}>
          <p className="text-ink-muted">Your cart is empty.</p>
          <Link to="/app/products" className="mt-6 inline-block">
            <Button>Browse products</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((line) =>
              line.product ? (
                <Card key={line.product.id} hover={false} className="flex flex-col gap-4 !p-5 sm:flex-row sm:items-center">
                  <img src={line.product.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <Link to={`/app/products/${line.product.id}`} className="font-medium text-white hover:text-accent-muted">
                      {line.product.name}
                    </Link>
                    <p className="text-sm text-ink-muted">${line.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-center text-sm"
                      value={line.quantity}
                      onChange={(e) => updateQty(line.product!.id, Number(e.target.value) || 1)}
                    />
                    <button type="button" className="text-sm text-red-300 hover:underline" onClick={() => remove(line.product!.id)}>
                      Remove
                    </button>
                  </div>
                  <p className="font-display text-lg text-white sm:text-right">
                    ${(line.product.price * line.quantity).toFixed(2)}
                  </p>
                </Card>
              ) : null
            )}
          </div>
          <Card className="mt-8 flex flex-col gap-6 !p-6 sm:flex-row sm:items-center sm:justify-between" hover={false}>
            <div>
              <p className="text-sm text-ink-muted">Subtotal</p>
              <p className="font-display text-3xl text-white">${subtotal.toFixed(2)}</p>
            </div>
            <Button className="sm:min-w-[200px]" onClick={() => setStep("checkout")}>
              Proceed to checkout
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
