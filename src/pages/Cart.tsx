import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";

type Row = {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    price: number;
    currency: string | null;
    image_url: string | null;
    stock: number | null;
  } | null;
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, quantity, product:products(id, slug, name, brand, price, currency, image_url, stock)")
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

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return remove(id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, quantity: qty } : x)));
    const { error } = await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
    if (error) {
      toast.error(error.message);
      load();
    }
  };
  const remove = async (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) toast.error(error.message);
  };

  const subtotal = rows.reduce((s, r) => s + Number(r.product?.price ?? 0) * r.quantity, 0);
  const shipping = subtotal > 250 || subtotal === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  const currency = rows[0]?.product?.currency ?? "USD";

  const placeOrder = async () => {
    if (!user || rows.length === 0) return;
    setPlacing(true);
    const orderNumber = `AE-${Date.now().toString(36).toUpperCase()}`;
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "pending",
        payment_status: "pending",
        subtotal,
        shipping,
        tax,
        total,
        currency,
      })
      .select("id")
      .single();
    if (oErr || !order) {
      setPlacing(false);
      toast.error(oErr?.message ?? "Could not create order");
      return;
    }
    const items = rows
      .filter((r) => r.product)
      .map((r) => ({
        order_id: order.id,
        product_id: r.product!.id,
        product_name: r.product!.name,
        product_brand: r.product!.brand,
        unit_price: r.product!.price,
        quantity: r.quantity,
        subtotal: Number(r.product!.price) * r.quantity,
      }));
    const { error: iErr } = await supabase.from("order_items").insert(items);
    if (iErr) {
      setPlacing(false);
      toast.error(iErr.message);
      return;
    }
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setPlacing(false);
    toast.success("Order placed");
    navigate("/orders");
  };

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">Your bag</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-10">Checkout</h1>
        {loading ? (
          <p className="text-platinum/60">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="text-center py-24 glass rounded-[2rem]">
            <p className="text-platinum/60 mb-6">Your bag is empty.</p>
            <Link
              to="/"
              className="inline-block rounded-full bg-platinum text-background px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em]"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            <div className="grid gap-3">
              {rows.map((r) => (
                <div key={r.id} className="glass rounded-2xl p-4 flex gap-4 items-center">
                  <Link
                    to={`/product/${r.product?.slug}`}
                    className="h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-platinum/5"
                  >
                    {r.product?.image_url && (
                      <img src={r.product.image_url} alt={r.product.name} className="h-full w-full object-cover" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
                      {r.product?.brand ?? "Aether"}
                    </div>
                    <Link to={`/product/${r.product?.slug}`} className="font-display text-lg block truncate">
                      {r.product?.name ?? "Product"}
                    </Link>
                    <div className="text-platinum/60 text-sm">
                      {fmt(Number(r.product?.price ?? 0), r.product?.currency ?? "USD")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 glass-strong rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQty(r.id, r.quantity - 1)}
                      className="h-7 w-7 rounded-full hover:bg-[oklch(1_0_0/0.08)]"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{r.quantity}</span>
                    <button
                      onClick={() => updateQty(r.id, r.quantity + 1)}
                      className="h-7 w-7 rounded-full hover:bg-[oklch(1_0_0/0.08)]"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(r.id)}
                    className="text-[0.65rem] uppercase tracking-[0.22em] text-platinum/50 hover:text-platinum"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <aside className="glass-strong rounded-[2rem] p-6 h-fit lg:sticky lg:top-28">
              <h2 className="font-display text-2xl mb-6">Summary</h2>
              <dl className="grid gap-3 text-sm">
                <Line label="Subtotal" value={fmt(subtotal, currency)} />
                <Line label="Shipping" value={shipping === 0 ? "Free" : fmt(shipping, currency)} />
                <Line label="Tax (est.)" value={fmt(tax, currency)} />
                <div className="h-px bg-platinum/10 my-1" />
                <Line label="Total" value={fmt(total, currency)} bold />
              </dl>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="mt-6 w-full rounded-full bg-platinum text-background py-4 text-[0.72rem] uppercase tracking-[0.28em] font-medium disabled:opacity-60"
              >
                {placing ? "Placing…" : "Place order"}
              </button>
              <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-platinum/40 text-center">
                Demo checkout · no real payment
              </p>
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
      <dd className={bold ? "font-display text-lg text-platinum-gradient" : "text-platinum"}>{value}</dd>
    </div>
  );
}
