import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Footer } from "@/components/aether/Footer";
import { Nav } from "@/components/aether/Nav";
import { ProductArtwork } from "@/components/aether/ProductArtwork";
import { useAuth } from "@/hooks/useAuth";
import { addProductToCart, formatPrice } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

type WishlistRow = {
  id: string;
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    price: number;
    currency: string;
    image_url: string | null;
    stock: number;
  } | null;
};

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<WishlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id, product:products(id, slug, name, brand, price, currency, image_url, stock)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(error.message);
      setRows([]);
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (user) void load();
  }, [user, authLoading, load, navigate]);

  const remove = async (id: string) => {
    const previousRows = rows;
    setRows((current) => current.filter((row) => row.id !== id));
    const { error } = await supabase.from("wishlist_items").delete().eq("id", id);
    if (error) {
      setRows(previousRows);
      toast.error(error.message);
    } else {
      window.dispatchEvent(new Event("aether-wishlist-updated"));
    }
  };

  const moveToBag = async (row: WishlistRow) => {
    if (!user || !row.product) return;
    if (row.product.stock < 1) {
      toast.error("This product is out of stock");
      return;
    }
    try {
      await addProductToCart(row.product.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your bag");
      return;
    }
    const { error } = await supabase.from("wishlist_items").delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      await load();
      return;
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
    window.dispatchEvent(new Event("aether-wishlist-updated"));
    toast.success("Moved to bag");
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">Saved</p>
        <h1 className="mb-10 font-display text-5xl leading-[0.9] md:text-6xl">Your wishlist</h1>
        {loading ? (
          <p className="text-platinum/60">Loading your wishlist…</p>
        ) : loadError ? (
          <div role="alert" className="glass rounded-3xl p-8 text-center">
            <p className="text-rose-200">{loadError}</p>
            <button type="button" onClick={() => void load()} className="mt-4 text-sm underline">
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-[2rem] glass py-24 text-center">
            <p className="mb-6 text-platinum/60">Nothing saved yet.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-platinum px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-background"
            >
              Discover pieces
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <article key={row.id} className="group overflow-hidden rounded-[1.5rem] glass">
                <Link
                  to={row.product ? `/product/${row.product.slug}` : "/shop"}
                  className="relative block aspect-[4/5]"
                >
                  <ProductArtwork
                    src={row.product?.image_url ?? null}
                    alt={row.product?.name ?? "Unavailable product"}
                    brand={row.product?.brand}
                    className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="p-4">
                  <div className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
                    {row.product?.brand ?? "Unavailable"}
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-2">
                    <Link
                      to={row.product ? `/product/${row.product.slug}` : "/shop"}
                      className="truncate font-display text-lg"
                    >
                      {row.product?.name ?? "Product no longer available"}
                    </Link>
                    <span className="shrink-0 text-sm text-platinum">
                      {row.product
                        ? formatPrice(Number(row.product.price), row.product.currency)
                        : "—"}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      type="button"
                      onClick={() => void moveToBag(row)}
                      disabled={!row.product || row.product.stock < 1}
                      className="rounded-full bg-platinum py-2 text-[0.65rem] uppercase tracking-[0.22em] text-background disabled:opacity-45"
                    >
                      {row.product?.stock ? "Move to bag" : "Unavailable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(row.id)}
                      className="rounded-full glass px-3 text-sm"
                      aria-label="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
