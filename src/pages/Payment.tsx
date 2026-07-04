import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type PayState = {
  rows: any[];
  totals: { subtotal: number; shipping: number; tax: number; total: number; currency: string };
  shipping_address: Record<string, string>;
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

function luhn(num: string) {
  const s = num.replace(/\s+/g, "");
  if (!/^\d{12,19}$/.test(s)) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = parseInt(s[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

function detectBrand(num: string): "visa" | "mastercard" | "amex" | "discover" | "unknown" {
  const s = num.replace(/\s+/g, "");
  if (/^4/.test(s)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(s)) return "mastercard";
  if (/^3[47]/.test(s)) return "amex";
  if (/^6(?:011|5)/.test(s)) return "discover";
  return "unknown";
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const state = location.state as PayState | null;

  const [method, setMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("HDFC");
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState<"idle" | "auth" | "otp" | "confirm">("idle");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!state) navigate("/cart");
  }, [user, loading, state, navigate]);

  const brand = useMemo(() => detectBrand(number), [number]);

  if (!state) return null;
  const { rows, totals, shipping_address } = state;

  const persistOrder = async (paymentStatus: "paid" | "failed", paymentId: string) => {
    if (!user) return null;
    const orderNumber = `AE-${Date.now().toString(36).toUpperCase()}`;
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: paymentStatus === "paid" ? "paid" : "pending",
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        currency: totals.currency,
        shipping_address,
        payment_provider: "aetherpay",
        payment_intent_id: paymentId,
      })
      .select("id, order_number")
      .single();
    if (oErr || !order) return null;
    const items = rows.filter((r) => r.product).map((r) => ({
      order_id: order.id,
      product_id: r.product.id,
      unit_price: Number(r.product.price),
      quantity: r.quantity,
      line_total: Number(r.product.price) * r.quantity,
      product_snapshot: {
        name: r.product.name,
        brand: r.product.brand,
        image_url: r.product.image_url,
        slug: r.product.slug,
      },
    }));
    await supabase.from("order_items").insert(items);
    if (paymentStatus === "paid") {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
    return order;
  };

  const runFakeGateway = async () => {
    // Validate per method
    if (method === "card") {
      if (!luhn(number)) return toast.error("Invalid card number");
      if (!/^\d{2}\/\d{2}$/.test(exp)) return toast.error("Expiry must be MM/YY");
      if (!/^\d{3,4}$/.test(cvv)) return toast.error("Invalid CVV");
      if (!name.trim()) return toast.error("Cardholder name required");
    } else if (method === "upi") {
      if (!/^[\w.\-]+@[\w.\-]+$/.test(upi)) return toast.error("Invalid UPI ID");
    }

    setProcessing(true);
    setStage("auth");
    await sleep(1200);

    if (method === "card") {
      setStage("otp");
      setShowOtp(true);
      setProcessing(false);
      return;
    }
    await sleep(1400);
    await finalize();
  };

  const submitOtp = async () => {
    if (!/^\d{6}$/.test(otp)) return toast.error("OTP must be 6 digits");
    setShowOtp(false);
    setProcessing(true);
    setStage("confirm");
    await sleep(1500);
    await finalize();
  };

  const finalize = async () => {
    // Simulate ~90% success. Failure trigger: card ending 0002 always fails.
    const cardTail = number.replace(/\s+/g, "").slice(-4);
    const forceFail = cardTail === "0002";
    const success = !forceFail && Math.random() < 0.9;
    const paymentId = `aepay_${Math.random().toString(36).slice(2, 14)}`;
    const order = await persistOrder(success ? "paid" : "failed", paymentId);
    setProcessing(false);
    setStage("idle");
    if (success && order) {
      navigate("/payment/success", {
        state: { orderNumber: order.order_number, paymentId, total: totals.total, currency: totals.currency },
        replace: true,
      });
    } else {
      navigate("/payment/failure", {
        state: {
          reason: forceFail ? "Card declined by issuing bank" : "Authorization failed. Please try again.",
          paymentId,
          retryState: state,
        },
        replace: true,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0b10] text-platinum flex flex-col">
      {/* Gateway top bar */}
      <header className="border-b border-white/5 bg-[#0f1017]/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-400 to-fuchsia-500 grid place-items-center text-background text-xs font-bold">Æ</div>
            <span className="font-semibold tracking-tight">AetherPay</span>
            <span className="ml-3 text-[0.6rem] uppercase tracking-[0.22em] text-platinum/40">Secure checkout</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-platinum/50">
            <Lock className="h-3.5 w-3.5" />
            <span>256-bit TLS</span>
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-5xl w-full px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Payment methods */}
        <section>
          <div className="mb-6">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-platinum/50 mb-1">Order · AE-{Date.now().toString(36).toUpperCase().slice(-6)}</p>
            <h1 className="font-display text-3xl">Complete your payment</h1>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#12141c] overflow-hidden">
            <div className="grid grid-cols-3 border-b border-white/5 text-sm">
              {(["card", "upi", "netbanking"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  disabled={processing}
                  className={`py-3.5 text-center capitalize transition-colors ${
                    method === m ? "bg-white/[0.04] text-platinum border-b-2 border-indigo-400" : "text-platinum/50 hover:text-platinum"
                  }`}
                >
                  {m === "netbanking" ? "Net Banking" : m === "upi" ? "UPI" : "Card"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {method === "card" && (
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs text-platinum/60">Card number</label>
                    <div className="relative">
                      <input
                        inputMode="numeric"
                        value={number}
                        onChange={(e) => setNumber(formatCard(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={23}
                        className="w-full h-12 rounded-lg bg-[#0a0b10] border border-white/10 px-4 pr-16 outline-none focus:border-indigo-400/60 tracking-wider"
                      />
                      <BrandBadge brand={brand} />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs text-platinum/60">Cardholder name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      placeholder="AS ON CARD"
                      className="w-full h-12 rounded-lg bg-[#0a0b10] border border-white/10 px-4 outline-none focus:border-indigo-400/60"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <label className="text-xs text-platinum/60">Expiry</label>
                      <input
                        value={exp}
                        onChange={(e) => setExp(formatExp(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full h-12 rounded-lg bg-[#0a0b10] border border-white/10 px-4 outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <label className="text-xs text-platinum/60">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        className="w-full h-12 rounded-lg bg-[#0a0b10] border border-white/10 px-4 outline-none focus:border-indigo-400/60"
                      />
                    </div>
                  </div>
                  <p className="text-[0.65rem] text-platinum/40 mt-1">
                    Demo cards: <span className="text-platinum/70">4242 4242 4242 4242</span> (success) · <span className="text-platinum/70">4000 0000 0000 0002</span> (declined). OTP: any 6 digits.
                  </p>
                </div>
              )}

              {method === "upi" && (
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs text-platinum/60">UPI ID</label>
                    <input
                      value={upi}
                      onChange={(e) => setUpi(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full h-12 rounded-lg bg-[#0a0b10] border border-white/10 px-4 outline-none focus:border-indigo-400/60"
                    />
                  </div>
                  <p className="text-[0.65rem] text-platinum/40">A payment request will be sent to your UPI app (simulated).</p>
                </div>
              )}

              {method === "netbanking" && (
                <div className="grid gap-4">
                  <label className="text-xs text-platinum/60">Select your bank</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full h-12 rounded-lg bg-[#0a0b10] border border-white/10 px-4 outline-none focus:border-indigo-400/60"
                  >
                    {["HDFC", "ICICI", "State Bank of India", "Axis", "Kotak", "Chase", "Bank of America"].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={runFakeGateway}
                disabled={processing}
                className="mt-6 w-full h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {stage === "auth" && "Authorizing…"}
                    {stage === "confirm" && "Confirming payment…"}
                    {stage === "otp" && "Waiting for OTP…"}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay {fmt(totals.total, totals.currency)}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[0.65rem] text-platinum/40">
                <ShieldCheck className="h-3 w-3" />
                PCI-DSS · Your details are encrypted (simulated)
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <aside className="rounded-2xl border border-white/5 bg-[#12141c] p-5 h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Order total</h2>
            <span className="font-display text-2xl">{fmt(totals.total, totals.currency)}</span>
          </div>
          <div className="grid gap-2 text-sm">
            <SumLine label="Subtotal" value={fmt(totals.subtotal, totals.currency)} />
            <SumLine label="Shipping" value={totals.shipping === 0 ? "Free" : fmt(totals.shipping, totals.currency)} />
            <SumLine label="Tax" value={fmt(totals.tax, totals.currency)} />
          </div>
          <div className="mt-5 pt-4 border-t border-white/5 text-xs text-platinum/50">
            <div className="mb-1 uppercase tracking-widest text-[0.6rem] text-platinum/40">Ship to</div>
            <div className="text-platinum/80">{shipping_address.full_name}</div>
            <div>{shipping_address.line1}{shipping_address.line2 ? `, ${shipping_address.line2}` : ""}</div>
            <div>{shipping_address.city}, {shipping_address.state} {shipping_address.postal_code}</div>
            <div>{shipping_address.country}</div>
          </div>
        </aside>
      </div>

      {/* OTP modal */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm grid place-items-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#12141c] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-indigo-400" />
              <span className="text-xs uppercase tracking-widest text-platinum/60">3-D Secure verification</span>
            </div>
            <h3 className="font-display text-2xl mb-2">Enter OTP</h3>
            <p className="text-sm text-platinum/60 mb-5">
              We've sent a 6-digit code to the mobile number registered with your card ending {number.replace(/\s+/g,"").slice(-4)}.
            </p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              inputMode="numeric"
              className="w-full h-14 text-center text-2xl tracking-[0.6em] rounded-lg bg-[#0a0b10] border border-white/10 outline-none focus:border-indigo-400/60"
            />
            <button
              onClick={submitOtp}
              className="mt-5 w-full h-11 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-medium"
            >
              Verify & Pay
            </button>
            <button
              onClick={() => { setShowOtp(false); setStage("idle"); }}
              className="mt-2 w-full h-10 rounded-lg text-platinum/60 hover:text-platinum text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExp(v: string) {
  const s = v.replace(/\D/g, "").slice(0, 4);
  return s.length > 2 ? `${s.slice(0, 2)}/${s.slice(2)}` : s;
}

function SumLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-platinum/70">
      <span>{label}</span>
      <span className="text-platinum">{value}</span>
    </div>
  );
}

function BrandBadge({ brand }: { brand: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    visa: { label: "VISA", cls: "bg-blue-500/20 text-blue-300" },
    mastercard: { label: "MC", cls: "bg-orange-500/20 text-orange-300" },
    amex: { label: "AMEX", cls: "bg-teal-500/20 text-teal-300" },
    discover: { label: "DISC", cls: "bg-yellow-500/20 text-yellow-300" },
    unknown: { label: "CARD", cls: "bg-white/10 text-platinum/50" },
  };
  const b = map[brand];
  return (
    <span className={`absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[0.6rem] font-bold tracking-wider ${b.cls}`}>
      {b.label}
    </span>
  );
}
