import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";

type Row = {
  id: string;
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    price: number;
    currency: string | null;
    image_url: string | null;
  } | null;
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id, product:products(id, slug, name, brand, price, currency, image_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (user) load();
  }, [user, authLoading, load, navigate]);

  const remove = async (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
    await supabase.from("wishlist_items").delete().eq("id", id);
  };

  const moveToBag = async (r: Row) => {
    if (!user || !r.product) return;
    const { error } = await supabase
      .from("cart_items")
      .upsert(
        { user_id: user.id, product_id: r.product.id, quantity: 1 },
        { onConflict: "user_id,product_id" },
      );
    if (error) return toast.error(error.message);
    await supabase.from("wishlist_items").delete().eq("id", r.id);
    setRows((rs) => rs.filter((x) => x.id !== r.id));
    toast.success("Moved to bag");
  };

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">Saved</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-10">Your wishlist</h1>
        {loading ? (
          <p className="text-platinum/60">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="text-center py-24 glass rounded-[2rem]">
            <p className="text-platinum/60 mb-6">Nothing saved yet.</p>
            <Link
              to="/"
              className="inline-block rounded-full bg-platinum text-background px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em]"
            >
              Discover pieces
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map((r) => (
              <div key={r.id} className="glass rounded-[1.5rem] overflow-hidden group">
                <Link to={`/product/${r.product?.slug}`} className="block aspect-[4/5] bg-platinum/5 relative">
                  {r.product?.image_url && (
                    <img
                      src={r.product.image_url}
                      alt={r.product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </Link>
                <div className="p-4">
                  <div className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
                    {r.product?.brand ?? "Aether"}
                  </div>
                  <div className="flex items-baseline justify-between gap-2 mt-1">
                    <Link to={`/product/${r.product?.slug}`} className="font-display text-lg truncate">
                      {r.product?.name}
                    </Link>
                    <span className="text-platinum text-sm">
                      {fmt(Number(r.product?.price ?? 0), r.product?.currency ?? "USD")}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      onClick={() => moveToBag(r)}
                      className="rounded-full bg-platinum text-background py-2 text-[0.65rem] uppercase tracking-[0.22em]"
                    >
                      Move to bag
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      className="rounded-full glass px-3 text-sm"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
