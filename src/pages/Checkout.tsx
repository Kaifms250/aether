import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type CheckoutState = {
  rows: any[];
  totals: { subtotal: number; shipping: number; tax: number; total: number; currency: string };
};

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const state = location.state as CheckoutState | null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("United States");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!state) navigate("/cart");
    if (user?.email) setEmail(user.email);
  }, [user, loading, state, navigate]);

  if (!state) return null;
  const { rows, totals } = state;

  const proceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !line1 || !city || !postal || !phone) {
      toast.error("Please complete the shipping details");
      return;
    }
    navigate("/payment", {
      state: {
        rows,
        totals,
        shipping_address: {
          full_name: fullName,
          email,
          phone,
          line1,
          line2,
          city,
          state: region,
          postal_code: postal,
          country,
        },
      },
    });
  };

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">Step 1 of 2</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-10">Shipping</h1>

        <form onSubmit={proceed} className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="glass rounded-[2rem] p-8 grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name" value={fullName} onChange={setFullName} required />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
            </div>
            <Field label="Phone" value={phone} onChange={setPhone} required />
            <Field label="Address line 1" value={line1} onChange={setLine1} required />
            <Field label="Address line 2 (optional)" value={line2} onChange={setLine2} />
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="City" value={city} onChange={setCity} required />
              <Field label="State / Region" value={region} onChange={setRegion} />
              <Field label="Postal code" value={postal} onChange={setPostal} required />
            </div>
            <Field label="Country" value={country} onChange={setCountry} required />
          </div>

          <aside className="glass-strong rounded-[2rem] p-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-display text-2xl mb-4">Order summary</h2>
            <div className="grid gap-3 mb-5 max-h-72 overflow-auto pr-1">
              {rows.map((r) => (
                <div key={r.id} className="flex gap-3 items-center text-sm">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-platinum/5 shrink-0">
                    {r.product?.image_url && (
                      <img src={r.product.image_url} alt={r.product.name} className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{r.product?.name}</div>
                    <div className="text-platinum/50 text-xs">Qty {r.quantity}</div>
                  </div>
                  <div className="text-platinum/80">
                    {fmt(Number(r.product?.price ?? 0) * r.quantity, totals.currency)}
                  </div>
                </div>
              ))}
            </div>
            <dl className="grid gap-2 text-sm">
              <Row label="Subtotal" value={fmt(totals.subtotal, totals.currency)} />
              <Row label="Shipping" value={totals.shipping === 0 ? "Free" : fmt(totals.shipping, totals.currency)} />
              <Row label="Tax" value={fmt(totals.tax, totals.currency)} />
              <div className="h-px bg-platinum/10 my-1" />
              <Row label="Total" value={fmt(totals.total, totals.currency)} bold />
            </dl>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-platinum text-background py-4 text-[0.72rem] uppercase tracking-[0.28em] font-medium"
            >
              Continue to payment
            </button>
          </aside>
        </form>
      </div>
      <Footer />
    </main>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.65rem] uppercase tracking-[0.24em] text-platinum/60">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="glass rounded-xl px-4 py-3 bg-transparent outline-none focus:ring-1 focus:ring-platinum/40"
      />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-platinum/60">{label}</dt>
      <dd className={bold ? "font-display text-lg text-platinum-gradient" : "text-platinum"}>{value}</dd>
    </div>
  );
}
