import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/aether/Footer";
import { Nav } from "@/components/aether/Nav";
import { ProductArtwork } from "@/components/aether/ProductArtwork";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/store";
import type { Database, Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type Item = Pick<
  Database["public"]["Tables"]["order_items"]["Row"],
  "id" | "quantity" | "unit_price" | "line_total" | "product_snapshot"
>;
type Order = Pick<
  Database["public"]["Tables"]["orders"]["Row"],
  "id" | "order_number" | "status" | "total" | "currency" | "created_at"
> & { order_items: Item[] };

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
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, total, currency, created_at, order_items(id, quantity, unit_price, line_total, product_snapshot)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(error.message);
      setOrders([]);
    } else {
      setOrders(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (user) void load();
  }, [user, authLoading, load, navigate]);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">Archive</p>
        <h1 className="mb-10 font-display text-5xl leading-[0.9] md:text-6xl">Your orders</h1>
        {loading ? (
          <p className="text-platinum/60">Loading your orders…</p>
        ) : loadError ? (
          <div role="alert" className="glass rounded-3xl p-8 text-center">
            <p className="text-rose-200">{loadError}</p>
            <button type="button" onClick={() => void load()} className="mt-4 text-sm underline">
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass rounded-[2rem] py-24 text-center">
            <p className="mb-6 text-platinum/60">No orders yet.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-platinum px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-background"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[1.5rem] glass p-6">
                <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-[0.22em] text-platinum/50">
                      Order · {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="mt-0.5 font-display text-2xl">{order.order_number}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em] ${statusStyle[order.status] ?? "bg-platinum/10 text-platinum/70"}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-display text-xl text-platinum-gradient">
                      {formatPrice(Number(order.total), order.currency)}
                    </span>
                  </div>
                </header>
                <div className="grid gap-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <ProductArtwork
                        src={snapshotField(item.product_snapshot, "image_url")}
                        alt={snapshotField(item.product_snapshot, "name") ?? "Ordered product"}
                        brand={snapshotField(item.product_snapshot, "brand")}
                        className="h-12 w-12 shrink-0 rounded-lg"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[0.6rem] uppercase tracking-[0.22em] text-aether">
                          {snapshotField(item.product_snapshot, "brand") ?? "Aether"}
                        </div>
                        <div className="truncate text-platinum">
                          {snapshotField(item.product_snapshot, "name") ?? "Product"} ×{" "}
                          {item.quantity}
                        </div>
                      </div>
                      <div className="text-platinum/70">
                        {formatPrice(Number(item.line_total), order.currency)}
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

function snapshotField(snapshot: Json, field: string): string | null {
  if (!snapshot || Array.isArray(snapshot) || typeof snapshot !== "object") return null;
  const value = snapshot[field];
  return typeof value === "string" ? value : null;
}
