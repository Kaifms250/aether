import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const s = location.state as { orderNumber?: string; paymentId?: string; total?: number; currency?: string } | null;

  useEffect(() => { if (!s) navigate("/"); }, [s, navigate]);
  if (!s) return null;

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-24">
        <div className="glass-strong rounded-[2rem] p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 grid place-items-center mb-6">
            <CheckCircle2 className="h-9 w-9 text-emerald-400" />
          </div>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-2">Payment successful</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">Thank you for your order</h1>
          <p className="text-platinum/60 mb-8">A confirmation has been sent to your email. You can track this order in your account.</p>

          <div className="grid sm:grid-cols-3 gap-3 text-left mb-8">
            <Stat label="Order" value={s.orderNumber ?? "—"} />
            <Stat label="Payment ID" value={s.paymentId ?? "—"} mono />
            <Stat label="Amount" value={fmt(Number(s.total ?? 0), s.currency ?? "USD")} />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/orders"
              className="rounded-full bg-platinum text-background px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em]"
            >
              View orders
            </Link>
            <Link
              to="/"
              className="rounded-full glass px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-platinum"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[0.55rem] uppercase tracking-[0.24em] text-platinum/50 mb-1">{label}</div>
      <div className={`text-sm truncate ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
