import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";

export default function PaymentFailurePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const s = location.state as { reason?: string; paymentId?: string; retryState?: any } | null;

  useEffect(() => { if (!s) navigate("/cart"); }, [s, navigate]);
  if (!s) return null;

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-24">
        <div className="glass-strong rounded-[2rem] p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-500/15 grid place-items-center mb-6">
            <XCircle className="h-9 w-9 text-rose-400" />
          </div>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-rose-300/80 mb-2">Payment failed</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">We couldn't process your payment</h1>
          <p className="text-platinum/60 mb-6">{s.reason ?? "Something went wrong. No amount has been charged."}</p>

          {s.paymentId && (
            <div className="glass rounded-xl p-4 inline-block mb-8">
              <div className="text-[0.55rem] uppercase tracking-[0.24em] text-platinum/50 mb-1">Reference</div>
              <div className="text-sm font-mono">{s.paymentId}</div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/payment", { state: s.retryState })}
              className="rounded-full bg-platinum text-background px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em]"
            >
              Retry payment
            </button>
            <Link
              to="/cart"
              className="rounded-full glass px-8 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-platinum"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
