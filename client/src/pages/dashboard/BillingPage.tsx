import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function BillingPage() {
  const { user, setPlan } = useAuth();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-white">Billing</h1>
      <p className="mt-2 text-ink-muted">
        Placeholder for Stripe Customer Portal or Paddle. Current plan:{" "}
        <span className="capitalize text-white">{user?.plan}</span>.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { id: "starter" as const, name: "Starter", price: "$0", desc: "Explore the dashboard and APIs." },
          { id: "pro" as const, name: "Pro", price: "$29", desc: "Advanced ranking hooks and exports." },
          { id: "premium" as const, name: "Premium", price: "$79", desc: "Custom integrations and SLA." },
        ].map((tier) => (
          <Card key={tier.id} hover={false} className={`flex flex-col !p-6 ${user?.plan === tier.id ? "ring-2 ring-accent/40" : ""}`}>
            <h3 className="font-display text-lg text-white">{tier.name}</h3>
            <p className="mt-2 font-display text-2xl text-white">{tier.price}</p>
            <p className="mt-3 flex-1 text-sm text-ink-muted">{tier.desc}</p>
            <Button
              variant={user?.plan === tier.id ? "secondary" : "primary"}
              className="mt-6 w-full"
              disabled={user?.plan === tier.id}
              onClick={() => setPlan(tier.id)}
            >
              {user?.plan === tier.id ? "Current" : "Select (demo)"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-10 !p-6" hover={false}>
        <p className="text-sm font-medium text-white">Invoices</p>
        <p className="mt-2 text-sm text-ink-muted">No invoices in demo mode. Wire your billing provider to list PDFs here.</p>
      </Card>
    </div>
  );
}
