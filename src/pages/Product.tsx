import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string | null;
  price: number;
  currency: string | null;
  compare_at_price: number | null;
  image_url: string | null;
  images: any;
  rating: number | null;
  review_count: number | null;
  stock: number | null;
  tag: string | null;
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data as Product | null);
        setLoading(false);
      });
  }, [slug]);

  const addToBag = async () => {
    if (!user) {
      toast.error("Sign in to add to bag");
      return;
    }
    if (!product) return;
    const { error } = await supabase
      .from("cart_items")
      .upsert(
        { user_id: user.id, product_id: product.id, quantity: 1 },
        { onConflict: "user_id,product_id" },
      );
    if (error) toast.error(error.message);
    else toast.success("Added to bag");
  };

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {loading ? (
          <p className="text-platinum/60">Loading…</p>
        ) : !product ? (
          <div className="text-center py-24">
            <h1 className="font-display text-5xl mb-4">Not found</h1>
            <Link to="/" className="link-underline text-sm uppercase tracking-[0.22em]">
              ← Back home
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden glass shadow-elevated">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">
                {product.brand ?? "Aether"}
              </p>
              <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-6">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-4xl text-platinum-gradient">
                  {fmt(Number(product.price), product.currency ?? "USD")}
                </span>
                {product.compare_at_price && (
                  <span className="text-platinum/40 line-through">
                    {fmt(Number(product.compare_at_price), product.currency ?? "USD")}
                  </span>
                )}
              </div>
              <p className="text-platinum/70 leading-relaxed mb-10">
                {product.description ?? "Premium craftsmanship, engineered for the everyday."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={addToBag}
                  className="flex-1 rounded-full bg-platinum text-background py-4 text-[0.72rem] uppercase tracking-[0.28em] font-medium"
                >
                  Add to bag
                </button>
                <Link
                  to="/"
                  className="rounded-full glass px-6 py-4 text-[0.7rem] uppercase tracking-[0.22em]"
                >
                  Back
                </Link>
              </div>
              {product.rating != null && (
                <p className="mt-8 text-[0.7rem] uppercase tracking-[0.22em] text-platinum/50">
                  ★ {Number(product.rating).toFixed(1)} · {product.review_count ?? 0} reviews
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
