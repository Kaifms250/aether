import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/aether/Footer";
import { Nav } from "@/components/aether/Nav";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, parseCheckoutState } from "@/lib/store";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type PendingOrder = {
  id: string;
  order_number: string;
  status: "pending";
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
};

function parsePendingOrder(value: Json): PendingOrder | null {
  if (!value || Array.isArray(value) || typeof value !== "object") return null;
  const record = value as Record<string, Json | undefined>;
  const asString = (key: string) => (typeof record[key] === "string" ? record[key] : null);
  const asAmount = (key: string) => {
    const amount = Number(record[key]);
    return Number.isFinite(amount) ? amount : null;
  };
  const id = asString("id");
  const orderNumber = asString("order_number");
  const currency = asString("currency");
  const amounts = ["subtotal", "discount", "tax", "shipping", "total"].map(asAmount);
  if (
    !id ||
    !orderNumber ||
    !currency ||
    record.status !== "pending" ||
    amounts.some((amount) => amount === null)
  ) {
    return null;
  }
  const [subtotal, discount, tax, shipping, total] = amounts;
  if (subtotal === null || discount === null || tax === null || shipping === null || total === null)
    return null;
  return {
    id,
    order_number: orderNumber,
    status: "pending",
    subtotal,
    discount,
    tax,
    shipping,
    total,
    currency,
  };
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const state = useMemo(() => parseCheckoutState(location.state as unknown), [location.state]);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!state?.shipping_address || !state.request_id) navigate("/cart");
  }, [user, loading, state, navigate]);

  const placeDemoOrder = async () => {
    if (!user || !state?.shipping_address || !state.request_id || placing || order) return;
    setPlacing(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.rpc("create_pending_order", {
        p_items: state.items,
        p_shipping_address: state.shipping_address,
        p_coupon_code: state.coupon_code ?? null,
        p_request_id: state.request_id,
        p_clear_cart: state.clear_cart ?? false,
      });
      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        return;
      }
      const createdOrder = parsePendingOrder(data);
      if (!createdOrder) {
        const message =
          "The order response was incomplete. Please check your order history before retrying.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }
      setOrder(createdOrder);
      window.dispatchEvent(new Event("aether-cart-updated"));
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The order could not be placed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  if (!state?.shipping_address) return null;

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0b10] text-platinum">
      <Nav />
      <header className="border-b border-white/5 bg-[#0f1017]/80 pt-24 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-xs font-bold text-background">
            Æ
          </div>
          <span className="font-semibold tracking-tight">Aether checkout</span>
          <span className="text-[0.6rem] uppercase tracking-[0.22em] text-platinum/40">
            Demo mode
          </span>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
        <section>
          {order ? (
            <div className="rounded-2xl border border-white/5 bg-[#12141c] p-7">
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-aether">
                Order created · payment pending
              </p>
              <h1 className="font-display text-4xl">Your demo order is in the archive.</h1>
              <p className="mt-4 leading-relaxed text-platinum/60">
                No payment was taken. A real payment provider is not connected, so this order
                remains pending.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Stat label="Order" value={order.order_number} />
                <Stat
                  label="Amount calculated by database"
                  value={formatPrice(order.total, order.currency)}
                />
                <Stat label="Discount" value={formatPrice(order.discount, order.currency)} />
                <Stat
                  label="Tax · shipping"
                  value={`${formatPrice(order.tax, order.currency)} · ${formatPrice(order.shipping, order.currency)}`}
                />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/orders"
                  className="rounded-full bg-platinum px-7 py-3 text-xs uppercase tracking-[0.2em] text-background"
                >
                  View orders
                </Link>
                <Link
                  to="/shop"
                  className="rounded-full glass px-7 py-3 text-xs uppercase tracking-[0.2em]"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#12141c] p-7">
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-aether">
                Final step · demo order
              </p>
              <h1 className="font-display text-4xl">Payment is not enabled.</h1>
              <p className="mt-4 leading-relaxed text-platinum/60">
                This project has no payment provider or verified webhook configured. Do not enter
                card or UPI details here. You can place a pending demo order; the database will
                recheck prices, stock, tax, shipping and any coupon.
              </p>
              <div className="mt-6 rounded-xl border border-white/5 bg-black/10 p-4 text-sm">
                <div className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-platinum/45">
                  Delivering to
                </div>
                <div>{state.shipping_address.full_name}</div>
                <div className="text-platinum/60">{state.shipping_address.line1}</div>
                <div className="text-platinum/60">
                  {state.shipping_address.city}, {state.shipping_address.state}{" "}
                  {state.shipping_address.postal_code}
                </div>
                <div className="text-platinum/60">{state.shipping_address.country}</div>
              </div>
              {errorMessage && (
                <p role="alert" className="mt-4 text-sm text-rose-200">
                  {errorMessage}
                </p>
              )}
              <button
                type="button"
                onClick={() => void placeDemoOrder()}
                disabled={placing}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-medium text-white disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                {placing ? "Checking stock and totals…" : "Place demo order · no charge"}
              </button>
              <p className="mt-4 text-center text-[0.65rem] text-platinum/40">
                Order records are created as pending. Payment is never marked successful by this
                demo.
              </p>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-white/5 bg-[#12141c] p-5 lg:sticky lg:top-28">
          <h2 className="mb-4 font-semibold">Secure order handling</h2>
          <div className="flex items-start gap-3 text-sm text-platinum/65">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-aether" />
            <p>
              Prices, discounts, GST and shipping are calculated in a single database transaction.
            </p>
          </div>
          <p className="mt-4 border-t border-white/5 pt-4 text-xs leading-relaxed text-platinum/45">
            Items are reserved against current stock when a pending demo order is created. A
            provider and verified webhook are required before production payments can be enabled.
          </p>
        </aside>
      </div>
      <Footer />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-4">
      <div className="mb-1 text-[0.55rem] uppercase tracking-[0.24em] text-platinum/50">
        {label}
      </div>
      <div className="truncate text-sm">{value}</div>
    </div>
  );
}
