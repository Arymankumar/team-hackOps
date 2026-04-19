import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MemoryPanel } from "@/components/MemoryPanel";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

const tiles = [
  { title: "Product Explorer", desc: "Filter by price, rating, and category.", to: "/app/products", stat: "Live catalog" },
  { title: "AI Recommendations", desc: "Behavior-weighted ranking ready for your models.", to: "/app/recommendations", stat: "Personalized" },
  { title: "Cart & checkout", desc: "Demo flow — swap for Stripe or Adyen.", to: "/app/cart", stat: "One-click ready" },
  { title: "Orders", desc: "Tracking IDs and status pipeline.", to: "/app/orders", stat: "Fulfillment" },
];

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
        <p className="text-sm font-medium text-accent-muted">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
          Hi {user?.name?.split(" ")[0] ?? "there"}, here is your command center
        </h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          SmartShopping AI connects this dashboard to your recommendation engine, payments, and inventory. Everything here is
          wired to a real API so you can extend it without reworking the UI.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Plan", value: user?.plan ?? "—", hint: "Upgrade anytime" },
          { label: "API", value: "Healthy", hint: "/api/health" },
          { label: "Auth", value: "JWT", hint: "7-day sessions" },
          { label: "Theme", value: "Dark SaaS", hint: "Tailwind tokens" },
        ].map((k) => (
          <Card key={k.label} className="!p-5" hover={false}>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">{k.label}</p>
            <p className="mt-2 font-display text-xl capitalize text-white">{k.value}</p>
            <p className="mt-1 text-xs text-ink-muted">{k.hint}</p>
          </Card>
        ))}
      </div>

      <MemoryPanel />

      <h2 className="mt-14 font-display text-xl text-white">Jump back in</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to}>
            <Card className="h-full transition hover:border-accent/25" hover>
              <span className="text-xs font-medium text-accent-muted">{t.stat}</span>
              <h3 className="mt-2 font-display text-lg text-white">{t.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{t.desc}</p>
              <p className="mt-4 text-sm font-medium text-accent-muted">Open →</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
