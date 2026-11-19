import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Footer } from "@/components/aether/Footer";
import { Nav } from "@/components/aether/Nav";
import { ProductArtwork } from "@/components/aether/ProductArtwork";
import { useAuth } from "@/hooks/useAuth";
import { addProductToCart, formatPrice, useCategories, useProducts } from "@/lib/store";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: products = [], isLoading, isError } = useProducts();
  const { data: categories = [] } = useCategories();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const product = products.find((item) => item.slug === slug);
  const category = categories.find((item) => item.id === product?.category_id);

  useEffect(() => setQuantity(1), [slug]);

  const requireUser = () => {
    if (user) return true;
    toast.error("Sign in to continue");
    navigate("/auth", { state: { redirectTo: slug ? `/product/${slug}` : "/shop" } });
    return false;
  };

  const addToBag = async () => {
    if (!requireUser() || !product) return;
    setAdding(true);
    try {
      await addProductToCart(product.id, quantity);
      toast.success("Added to bag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your bag");
    } finally {
      setAdding(false);
    }
  };

  const buyNow = () => {
    if (!product || product.stock < quantity) return;
    if (!user) {
      navigate("/auth", {
        state: {
          redirectTo: "/checkout",
          checkoutState: { items: [{ product_id: product.id, quantity }] },
        },
      });
      return;
    }
    navigate("/checkout", {
      state: { items: [{ product_id: product.id, quantity }] },
    });
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        {isLoading ? (
          <p className="py-24 text-platinum/60">Loading product…</p>
        ) : isError ? (
          <p role="alert" className="py-24 text-rose-200">
            This product could not be loaded.
          </p>
        ) : !product ? (
          <div className="py-24 text-center">
            <h1 className="mb-4 font-display text-5xl">Not found</h1>
            <Link to="/shop" className="link-underline text-sm uppercase tracking-[0.22em]">
              Browse the catalogue
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductArtwork
              src={product.image_url}
              alt={product.name}
              brand={product.brand}
              className="aspect-square rounded-[2rem] glass shadow-elevated"
            />
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">
                {product.brand ?? "Aether"}
                {category ? ` · ${category.name}` : ""}
              </p>
              <h1 className="mb-6 font-display text-5xl leading-[0.9] md:text-6xl">
                {product.name}
              </h1>
              <div className="mb-4 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-4xl text-platinum-gradient">
                  {formatPrice(Number(product.price), product.currency)}
                </span>
                {product.compare_at_price != null && (
                  <span className="text-platinum/45 line-through">
                    {formatPrice(Number(product.compare_at_price), product.currency)}
                  </span>
                )}
                {product.discount_pct > 0 && (
                  <span className="rounded-full glass px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-aether">
                    Save {product.discount_pct}%
                  </span>
                )}
              </div>
              <p className="mb-5 text-sm text-platinum/70">
                ★ {Number(product.rating).toFixed(1)} · {product.review_count} reviews
              </p>
              <p className="mb-6 max-w-xl leading-relaxed text-platinum/70">
                {product.description ?? "A considered piece, selected for lasting everyday use."}
              </p>
              <p
                className={`mb-7 text-sm ${product.stock > 0 ? "text-emerald-200" : "text-rose-200"}`}
              >
                {product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}
              </p>

              {product.stock > 0 && (
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-platinum/60">
                    Quantity
                  </span>
                  <div className="flex items-center gap-2 rounded-full glass-strong px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      aria-label="Decrease quantity"
                      className="h-8 w-8 rounded-full hover:bg-[oklch(1_0_0/0.08)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                      className="h-8 w-8 rounded-full hover:bg-[oklch(1_0_0/0.08)] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={addToBag}
                  disabled={adding || product.stock < 1}
                  className="rounded-full glass py-4 text-[0.72rem] font-medium uppercase tracking-[0.24em] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {adding ? "Adding…" : "Add to cart"}
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={product.stock < 1}
                  className="rounded-full bg-platinum py-4 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Buy now
                </button>
              </div>
              <Link
                to="/shop"
                className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-platinum/50 hover:text-platinum"
              >
                Continue browsing
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
