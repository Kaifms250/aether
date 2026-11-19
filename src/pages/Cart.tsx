import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Footer } from "@/components/aether/Footer";
import { Nav } from "@/components/aether/Nav";
import { ProductArtwork } from "@/components/aether/ProductArtwork";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

type CartRow = {
  id: string;
  quantity: number;
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

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        "id, quantity, product:products(id, slug, name, brand, price, currency, image_url, stock)",
      )
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

  const updateQty = async (row: CartRow, qty: number) => {
    if (qty < 1) return remove(row.id);
    if (row.product && qty > row.product.stock) {
      toast.error("Requested quantity exceeds available stock");
      return;
    }
    const previousRows = rows;
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, quantity: qty } : item)),
    );
    const { error } = await supabase.from("cart_items").update({ quantity: qty }).eq("id", row.id);
    if (error) {
      setRows(previousRows);
      toast.error(error.message);
    } else {
      window.dispatchEvent(new Event("aether-cart-updated"));
    }
  };

  const remove = async (id: string) => {
    const previousRows = rows;
    setRows((current) => current.filter((item) => item.id !== id));
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) {
      setRows(previousRows);
      toast.error(error.message);
    } else {
      window.dispatchEvent(new Event("aether-cart-updated"));
    }
  };

  const subtotal = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.product?.price ?? 0) * row.quantity, 0),
    [rows],
  );
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const currency = rows[0]?.product?.currency ?? "INR";
  const canCheckout =
    rows.length > 0 &&
    rows.every((row) => row.product && row.quantity <= row.product.stock && row.product.stock > 0);

  const continueToCheckout = () => {
    if (!user || !canCheckout) return;
    navigate("/checkout", {
      state: {
        clear_cart: true,
        items: rows.flatMap((row) =>
          row.product ? [{ product_id: row.product.id, quantity: row.quantity }] : [],
        ),
      },
    });
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">Your bag</p>
        <h1 className="mb-10 font-display text-5xl leading-[0.9] md:text-6xl">Shopping bag</h1>
        {loading ? (
          <p className="text-platinum/60">Loading your bag…</p>
        ) : loadError ? (
          <div role="alert" className="glass rounded-3xl p-8 text-center">
            <p className="text-rose-200">{loadError}</p>
            <button type="button" onClick={() => void load()} className="mt-4 text-sm underline">
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="glass rounded-[2rem] py-24 text-center">
            <p className="mb-6 text-platinum/60">Your bag is empty.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-platinum px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-background"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid content-start gap-3">
              {rows.map((row) => (
                <article
                  key={row.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl glass p-4 sm:flex-nowrap"
                >
                  <Link
                    to={row.product ? `/product/${row.product.slug}` : "/shop"}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  >
                    <ProductArtwork
                      src={row.product?.image_url ?? null}
                      alt={row.product?.name ?? "Unavailable product"}
                      brand={row.product?.brand}
                      className="h-full w-full"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
                      {row.product?.brand ?? "Unavailable"}
                    </div>
                    <Link
                      to={row.product ? `/product/${row.product.slug}` : "/shop"}
                      className="block truncate font-display text-lg"
                    >
                      {row.product?.name ?? "Product no longer available"}
                    </Link>
                    <div className="text-sm text-platinum/60">
                      {formatPrice(
                        Number(row.product?.price ?? 0),
                        row.product?.currency ?? currency,
                      )}
                    </div>
                    {row.product && row.quantity > row.product.stock && (
                      <p className="mt-1 text-xs text-rose-200">
                        Only {row.product.stock} currently available
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 rounded-full glass-strong px-2 py-1">
                    <button
                      type="button"
                      onClick={() => void updateQty(row, row.quantity - 1)}
                      className="h-7 w-7 rounded-full hover:bg-[oklch(1_0_0/0.08)]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{row.quantity}</span>
                    <button
                      type="button"
                      onClick={() => void updateQty(row, row.quantity + 1)}
                      disabled={!row.product || row.quantity >= row.product.stock}
                      className="h-7 w-7 rounded-full hover:bg-[oklch(1_0_0/0.08)] disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(row.id)}
                    className="text-[0.65rem] uppercase tracking-[0.22em] text-platinum/50 hover:text-platinum"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
            <aside className="h-fit rounded-[2rem] glass-strong p-6 lg:sticky lg:top-28">
              <h2 className="mb-6 font-display text-2xl">Estimate</h2>
              <dl className="grid gap-3 text-sm">
                <Line label="Subtotal" value={formatPrice(subtotal, currency)} />
                <Line
                  label="Shipping"
                  value={shipping === 0 ? "Free" : formatPrice(shipping, currency)}
                />
                <Line label="Estimated tax" value={formatPrice(tax, currency)} />
                <div className="my-1 h-px bg-platinum/10" />
                <Line
                  label="Estimated total"
                  value={formatPrice(subtotal + shipping + tax, currency)}
                  bold
                />
              </dl>
              <p className="mt-4 text-center text-[0.65rem] leading-relaxed text-platinum/45">
                Final prices, tax, shipping and coupon eligibility are recalculated securely at
                checkout.
              </p>
              <button
                type="button"
                onClick={continueToCheckout}
                disabled={!canCheckout}
                className="mt-6 w-full rounded-full bg-platinum py-4 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to checkout
              </button>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-platinum/60">{label}</dt>
      <dd className={bold ? "font-display text-lg text-platinum-gradient" : "text-platinum"}>
        {value}
      </dd>
    </div>
  );
}
