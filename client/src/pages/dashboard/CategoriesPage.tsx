import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";

export function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await api<{ categories: string[] }>("/categories", { auth: false });
      setCategories(data.categories);
    })().catch(() => setCategories([]));
  }, []);

  async function onOpenCategory(name: string) {
    try {
      await api("/products/category-click", { method: "POST", body: JSON.stringify({ category: name }) });
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl text-white">Categories</h1>
      <p className="mt-2 text-ink-muted">Browsing a category records interest for AI ranking.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/app/products?category=${encodeURIComponent(c)}`} onClick={() => onOpenCategory(c)}>
              <Card className="!p-6" hover>
                <h3 className="font-display text-lg text-white">{c}</h3>
                <p className="mt-2 text-sm text-accent-muted">Open catalog →</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
