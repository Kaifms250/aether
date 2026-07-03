import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";

type Snapshot = { name?: string; brand?: string; image_url?: string; slug?: string };
type Item = {
  id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_snapshot: Snapshot | null;
};
type Order = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  order_items: Item[];
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-200",
  paid: "bg-emerald-500/15 text-emerald-200",
  processing: "bg-sky-500/15 text-sky-200",
  shipped: "bg-indigo-500/15 text-indigo-200",
  delivered: "bg-emerald-600/20 text-emerald-200",
  cancelled: "bg-rose-500/15 text-rose-200",
  refunded: "bg-platinum/15 text-platinum/70",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, status, total, currency, created_at, order_items(id, quantity, unit_price, line_total, product_snapshot)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as any) ?? []);
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">Archive</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-10">Your orders</h1>
        {loading ? (
          <p className="text-platinum/60">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 glass rounded-[2rem]">
            <p className="text-platinum/60 mb-6">No orders yet.</p>
            <Link
              to="/"
              className="inline-block rounded-full bg-platinum text-background px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <article key={o.id} className="glass rounded-[1.5rem] p-6">
                <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-[0.22em] text-platinum/50">
                      Order · {new Date(o.created_at).toLocaleDateString()}
                    </div>
                    <div className="font-display text-2xl mt-0.5">{o.order_number}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-[0.22em] ${statusStyle[o.status] ?? "bg-platinum/10 text-platinum/70"}`}
                    >
                      {o.status}
                    </span>
                    <span className="font-display text-xl text-platinum-gradient">
                      {fmt(Number(o.total), o.currency)}
                    </span>
                  </div>
                </header>
                <div className="grid gap-2">
                  {o.order_items?.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 text-sm">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-platinum/5 shrink-0">
                        {it.product_snapshot?.image_url && (
                          <img
                            src={it.product_snapshot.image_url}
                            alt={it.product_snapshot.name ?? ""}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
                          {it.product_snapshot?.brand ?? "Aether"}
                        </div>
                        <div className="truncate text-platinum">
                          {it.product_snapshot?.name ?? "Product"} × {it.quantity}
                        </div>
                      </div>
                      <div className="text-platinum/70">
                        {fmt(Number(it.line_total), o.currency)}
                      </div>
                    </div>
                  ))}
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
