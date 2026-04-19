import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Product, Review } from "@/types";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [img, setImg] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api<{ product: Product; reviews: Review[] }>(`/products/${id}`, { auth: false });
        if (!cancelled) {
          setProduct(data.product);
          setReviews(data.reviews);
          setImg(data.product.image);
        }
        await api(`/products/${id}/view`, { method: "POST" }).catch(() => {});
      } catch {
        if (!cancelled) setProduct(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function addToCart() {
    if (!product?.inStock) return;
    setMsg("");
    try {
      await api("/cart/items", { method: "POST", body: JSON.stringify({ productId: product.id, quantity: qty }) });
      setMsg("Added to cart");
      navigate("/app/cart");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  }

  async function toggleWishlist(add: boolean) {
    if (!product) return;
    setMsg("");
    try {
      if (add) await api(`/wishlist/${product.id}`, { method: "POST" });
      else await api(`/wishlist/${product.id}`, { method: "DELETE" });
      setMsg(add ? "Saved to wishlist" : "Removed from wishlist");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl text-ink-muted">
        <p>Product not found.</p>
        <Link to="/app/products" className="mt-4 inline-block text-accent-muted">
          ← Back to explorer
        </Link>
      </div>
    );
  }

  const gallery = product.images?.length ? product.images : [product.image];

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/app/products" className="text-sm text-accent-muted hover:text-accent">
        ← Product Explorer
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <motion.div layout className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <img src={img ?? product.image} alt="" className="aspect-square w-full object-cover" />
          </motion.div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {gallery.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setImg(u)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  img === u ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={u} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-accent-muted">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="font-display text-3xl text-white">${product.price.toFixed(2)}</span>
            <span className="flex items-center gap-1 text-ink-muted">
              <span className="text-amber-400">★</span> {product.rating}{" "}
              <span className="text-ink-faint">({product.reviewCount} reviews)</span>
            </span>
            {!product.inStock ? (
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300">Out of stock</span>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">In stock</span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-ink-muted">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-ink-muted">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-2xl border border-white/10">
              <button
                type="button"
                className="px-4 py-2 text-lg text-ink-muted hover:text-white"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center font-medium text-white">{qty}</span>
              <button
                type="button"
                className="px-4 py-2 text-lg text-ink-muted hover:text-white"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
            <Button disabled={!product.inStock} onClick={addToCart} className="px-8">
              Add to cart
            </Button>
            <Button variant="secondary" onClick={() => toggleWishlist(true)}>
              Wishlist
            </Button>
          </div>
          {msg && <p className="mt-4 text-sm text-accent-muted">{msg}</p>}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-xl text-white">Reviews</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <Card key={`${r.author}-${r.date}`} hover={false} className="!p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{r.author}</p>
                <span className="text-amber-400">{"★".repeat(Math.round(r.rating))}</span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{r.text}</p>
              <p className="mt-3 text-xs text-ink-faint">{r.date}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
