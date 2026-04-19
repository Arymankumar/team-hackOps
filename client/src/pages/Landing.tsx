import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    title: "AI Product Discovery",
    desc: "Surface trending and niche items tuned to shopper intent and seasonality.",
    abbr: "PD",
  },
  {
    title: "Personalized Feed",
    desc: "Ranked recommendations that adapt as customers browse categories and deals.",
    abbr: "PF",
  },
  {
    title: "Smart Deal Radar",
    desc: "Spot margin-safe promotions and flash windows before they expire.",
    abbr: "DR",
  },
  {
    title: "Cart Intelligence",
    desc: "Nudge completions with bundle suggestions and stock-aware messaging.",
    abbr: "CI",
  },
  {
    title: "Seller Analytics",
    desc: "Ready for pipelines: export signals for pricing, ads, and inventory tools.",
    abbr: "SA",
  },
];

const categories = [
  { name: "Electronics", hint: "Audio, wearables, workspace" },
  { name: "Fashion", hint: "Outerwear, essentials, accessories" },
  { name: "Home", hint: "Smart hubs, kitchen, decor" },
  { name: "Beauty", hint: "Skincare, wellness" },
  { name: "Sports", hint: "Training, recovery" },
  { name: "Books", hint: "Strategy, design, growth" },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    blurb: "For shoppers exploring AI-curated catalogs.",
    perks: ["Basic recommendations", "Saved lists", "Standard support"],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    blurb: "For power buyers and growing seller teams.",
    perks: ["Advanced AI ranking", "Deal alerts", "Priority email support", "CSV export hooks"],
    cta: "Get Pro",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$79",
    blurb: "For brands plugging into recommendation & payment backends.",
    perks: ["Custom model endpoints", "SSO-ready auth flows", "Dedicated success", "SLA options"],
    cta: "Talk to us",
    href: "/signup",
    highlight: false,
  },
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
            <a href="#features" className="hover:text-ink">
              Features
            </a>
            <a href="#categories" className="hover:text-ink">
              Categories
            </a>
            <a href="#pricing" className="hover:text-ink">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl px-3 py-2 text-sm text-ink-muted hover:text-ink sm:block"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <Button className="!py-2 !text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_45%)]" />
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.p
                custom={0}
                initial="hidden"
                animate="show"
                variants={fade}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                AI commerce platform
              </motion.p>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="show"
                variants={fade}
                className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Discover Smart Shopping Powered by AI
              </motion.h1>
              <motion.p
                custom={2}
                initial="hidden"
                animate="show"
                variants={fade}
                className="mt-6 max-w-xl text-lg text-ink-muted"
              >
                Find trending products, personalized recommendations, and best deals instantly.
              </motion.p>
              <motion.div
                custom={3}
                initial="hidden"
                animate="show"
                variants={fade}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link to="/signup">
                  <Button className="px-8 py-3 text-base">Get Started</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="secondary" className="px-8 py-3 text-base">
                    Explore Products
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                custom={4}
                initial="hidden"
                animate="show"
                variants={fade}
                className="mt-12 flex flex-wrap gap-8 text-sm text-ink-faint"
              >
                <div>
                  <p className="font-display text-2xl font-semibold text-white">4.9</p>
                  <p>Merchant satisfaction</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-white">120ms</p>
                  <p>Typical ranking latency</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-white">50+</p>
                  <p>Integration patterns</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-accent/20 via-transparent to-cyan-500/10 blur-2xl" />
              <Card className="relative overflow-hidden p-0">
                <div className="border-b border-white/5 bg-surface-elevated/50 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Live preview</p>
                  <p className="mt-1 font-display text-xl text-white">Recommendation panel</p>
                </div>
                <div className="space-y-4 p-6">
                  {[
                    { t: "Neural Buds Pro", s: "High intent · Audio", p: "Likely convert" },
                    { t: "Aero Home Hub", s: "Cross-sell · Smart home", p: "Bundle opportunity" },
                    { t: "Pulse Trainer Shoes", s: "Trending · Sports", p: "Upsell in cart" },
                  ].map((row) => (
                    <div
                      key={row.t}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-white">{row.t}</p>
                        <p className="text-xs text-ink-faint">{row.s}</p>
                      </div>
                      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent-muted">
                        {row.p}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="features" className="border-t border-white/5 bg-black/20 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent-muted">Toolkit</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
              Five AI tools for modern storefronts
            </h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              Modular surfaces you can extend with your own models, payments, and inventory systems.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} className="h-full" hover>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-xs font-semibold tracking-wide text-accent-muted">
                    {f.abbr}
                  </span>
                  <h3 className="mt-4 font-display text-lg text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="categories" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Shop by category</h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              Electronics, Fashion, Home, and more — structured for filters and AI ranking.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group rounded-3xl border border-white/8 bg-gradient-to-br from-surface-card to-surface-elevated p-6 transition-colors hover:border-accent/30"
                >
                  <p className="font-display text-lg text-white">{c.name}</p>
                  <p className="mt-2 text-sm text-ink-muted">{c.hint}</p>
                  <p className="mt-4 text-xs font-medium text-accent-muted opacity-0 transition-opacity group-hover:opacity-100">
                    Open in dashboard →
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-white/5 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Pricing for sellers & teams</h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              Start free, scale when you connect recommendation engines and payments.
            </p>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {pricing.map((tier) => (
                <Card
                  key={tier.name}
                  className={`flex flex-col ${tier.highlight ? "ring-2 ring-accent/40 shadow-glow" : ""}`}
                  hover={false}
                >
                  {tier.highlight && (
                    <span className="mb-4 w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-muted">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-xl text-white">{tier.name}</h3>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold text-white">{tier.price}</span>
                    <span className="text-ink-faint">/mo</span>
                  </p>
                  <p className="mt-4 text-sm text-ink-muted">{tier.blurb}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-ink">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link to={tier.href} className="mt-8 block">
                    <Button variant={tier.highlight ? "primary" : "secondary"} className="w-full">
                      {tier.cta}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-ink-muted">
              ShopForge AI is a demo-ready SaaS shell. Swap the JSON store for Postgres, wire Stripe, and plug your
              ranking service.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <p className="font-medium text-white">Product</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li>
                  <a href="#features" className="hover:text-ink">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-ink">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-ink">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white">Company</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li>
                  <span className="cursor-default">About</span>
                </li>
                <li>
                  <span className="cursor-default">Careers</span>
                </li>
                <li>
                  <span className="cursor-default">Contact</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white">Legal</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li>
                  <span className="cursor-default">Privacy</span>
                </li>
                <li>
                  <span className="cursor-default">Terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} ShopForge AI. Built for demonstration purposes.
        </p>
      </footer>
    </div>
  );
}
