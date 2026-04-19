import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api<{ products: Product[] }>("/wishlist");
        setProducts(data.products);
      } catch {
        setProducts([]);
      }
    })();
  }, []);

  async function remove(id: string) {
    await api(`/wishlist/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl text-white">Wishlist</h1>
      <p className="mt-2 text-ink-muted">Saved products for later consideration.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} hover={false} className="overflow-hidden !p-0">
            <Link to={`/app/products/${p.id}`}>
              <img src={p.image} alt="" className="aspect-video w-full object-cover" />
            </Link>
            <div className="p-5">
              <Link to={`/app/products/${p.id}`} className="font-display text-lg text-white hover:text-accent-muted">
                {p.name}
              </Link>
              <p className="mt-2 text-sm text-ink-muted">${p.price.toFixed(2)}</p>
              <button type="button" className="mt-4 text-sm text-red-300 hover:underline" onClick={() => remove(p.id)}>
                Remove
              </button>
            </div>
          </Card>
        ))}
      </div>
      {products.length === 0 && <p className="mt-10 text-center text-ink-muted">No saved items yet.</p>}
    </div>
  );
}
