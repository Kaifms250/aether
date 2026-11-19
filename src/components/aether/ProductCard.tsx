import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { addProductToCart, formatPrice, type Product } from "@/lib/store";
import { ProductArtwork } from "./ProductArtwork";

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const addToCart = async () => {
    if (!user) {
      navigate("/auth", { state: { redirectTo: "/shop" } });
      return;
    }
    if (product.stock < 1) return;
    setAdding(true);
    try {
      await addProductToCart(product.id);
      toast.success("Added to bag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your bag");
    } finally {
      setAdding(false);
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      navigate("/auth", { state: { redirectTo: "/shop" } });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: product.id });
    setSaving(false);
    if (error && error.code !== "23505") toast.error(error.message);
    else {
      window.dispatchEvent(new Event("aether-wishlist-updated"));
      toast.success("Saved to wishlist");
    }
  };

  return (
    <article className="group overflow-hidden rounded-[1.5rem] glass shadow-elevated transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5]">
        <ProductArtwork
          src={product.image_url}
          alt={product.name}
          brand={product.brand}
          className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
        {product.discount_pct > 0 && (
          <span className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em]">
            {product.discount_pct}% off
          </span>
        )}
        {product.stock < 1 && (
          <span className="absolute right-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em]">
            Sold out
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
          {product.brand ?? "Aether"}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="mt-1 block font-display text-xl leading-tight"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg">
              {formatPrice(Number(product.price), product.currency)}
            </span>
            {product.compare_at_price != null && (
              <span className="text-xs text-platinum/45 line-through">
                {formatPrice(Number(product.compare_at_price), product.currency)}
              </span>
            )}
          </div>
          <span
            className="shrink-0 text-xs text-platinum/70"
            aria-label={`Rated ${product.rating} out of 5`}
          >
            ★ {Number(product.rating).toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-[0.65rem] text-platinum/45">
          {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
        </p>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={adding || product.stock < 1}
            className="rounded-full bg-platinum py-2.5 text-[0.65rem] uppercase tracking-[0.18em] text-background disabled:cursor-not-allowed disabled:opacity-45"
          >
            {adding ? "Adding…" : product.stock < 1 ? "Sold out" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={addToWishlist}
            disabled={saving}
            aria-label={`Save ${product.name} to wishlist`}
            className="rounded-full glass px-4 text-lg disabled:opacity-50"
          >
            ♡
          </button>
        </div>
      </div>
    </article>
  );
}
