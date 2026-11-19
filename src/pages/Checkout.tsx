import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "@/components/aether/Footer";
import { Nav } from "@/components/aether/Nav";
import { ProductArtwork } from "@/components/aether/ProductArtwork";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, parseCheckoutState, useProducts } from "@/lib/store";
import type { ShippingAddress } from "@/lib/store";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const state = useMemo(() => parseCheckoutState(location.state as unknown), [location.state]);
  const { data: products = [], isLoading: productsLoading, isError } = useProducts();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("India");
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!state) navigate("/cart");
    if (user?.email) setEmail(user.email);
  }, [user, loading, state, navigate]);

  const orderProducts = useMemo(
    () =>
      state?.items.map((item) => ({
        item,
        product: products.find((product) => product.id === item.product_id),
      })) ?? [],
    [products, state],
  );
  const productsAvailable =
    orderProducts.length > 0 &&
    orderProducts.every(
      ({ item, product }) => product && product.stock >= item.quantity && product.stock > 0,
    );

  if (!state) return null;

  const proceed = (event: React.FormEvent) => {
    event.preventDefault();
    if (!productsAvailable) {
      toast.error("One or more items are unavailable or exceed current stock");
      return;
    }

    const shipping_address: ShippingAddress = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      line2: line2.trim(),
      city: city.trim(),
      state: region.trim(),
      postal_code: postal.trim(),
      country: country.trim(),
    };
    if (
      !shipping_address.full_name ||
      !shipping_address.line1 ||
      !shipping_address.city ||
      !shipping_address.postal_code ||
      !shipping_address.country
    ) {
      toast.error("Please complete the shipping details");
      return;
    }

    navigate("/payment", {
      state: {
        items: state.items,
        clear_cart: state.clear_cart,
        shipping_address,
        coupon_code: coupon.trim() || null,
        request_id: crypto.randomUUID(),
      },
    });
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">Step 1 of 2</p>
        <h1 className="mb-10 font-display text-5xl leading-[0.9] md:text-6xl">Shipping</h1>

        <form onSubmit={proceed} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid content-start gap-4 rounded-[2rem] glass p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" value={fullName} onChange={setFullName} required />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
            </div>
            <Field label="Phone" value={phone} onChange={setPhone} required />
            <Field label="Address line 1" value={line1} onChange={setLine1} required />
            <Field label="Address line 2 (optional)" value={line2} onChange={setLine2} />
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="City" value={city} onChange={setCity} required />
              <Field label="State / Region" value={region} onChange={setRegion} />
              <Field label="Postal code" value={postal} onChange={setPostal} required />
            </div>
            <Field label="Country" value={country} onChange={setCountry} required />
            <label className="grid gap-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-platinum/60">
                Coupon code (optional)
              </span>
              <input
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                autoComplete="off"
                className="rounded-xl glass bg-transparent px-4 py-3 outline-none focus:ring-1 focus:ring-platinum/40"
              />
            </label>
          </div>

          <aside className="h-fit rounded-[2rem] glass-strong p-6 lg:sticky lg:top-28">
            <h2 className="mb-4 font-display text-2xl">Your pieces</h2>
            {productsLoading ? (
              <p className="py-6 text-sm text-platinum/60">Checking availability…</p>
            ) : isError ? (
              <p role="alert" className="py-6 text-sm text-rose-200">
                Could not verify product availability.
              </p>
            ) : (
              <div className="mb-5 grid max-h-72 gap-3 overflow-auto pr-1">
                {orderProducts.map(({ item, product }) => (
                  <div key={item.product_id} className="flex items-center gap-3 text-sm">
                    <ProductArtwork
                      src={product?.image_url ?? null}
                      alt={product?.name ?? "Unavailable product"}
                      brand={product?.brand}
                      className="h-12 w-12 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{product?.name ?? "Unavailable product"}</div>
                      <div className="text-xs text-platinum/50">Qty {item.quantity}</div>
                    </div>
                    <div className="text-right text-platinum/80">
                      {product
                        ? formatPrice(Number(product.price) * item.quantity, product.currency)
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isError
              ? null
              : !productsLoading &&
                !productsAvailable && (
                  <p role="alert" className="mb-4 text-sm text-rose-200">
                    An item is out of stock or no longer available.
                  </p>
                )}
            <p className="text-xs leading-relaxed text-platinum/50">
              The final INR total, applicable coupon, GST and shipping are calculated by the
              database when you place the demo order.
            </p>
            <button
              type="submit"
              disabled={productsLoading || isError || !productsAvailable}
              className="mt-6 w-full rounded-full bg-platinum py-4 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to order
            </button>
          </aside>
        </form>
      </div>
      <Footer />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.65rem] uppercase tracking-[0.24em] text-platinum/60">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl glass bg-transparent px-4 py-3 outline-none focus:ring-1 focus:ring-platinum/40"
      />
    </label>
  );
}
