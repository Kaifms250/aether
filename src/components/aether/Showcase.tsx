import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Royalty-free imagery from Unsplash. `unsplash.com/photos/<id>` resolves via
// the images.unsplash.com CDN with on-the-fly resize + format negotiation.
const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  currency: string | null;
  tag: string | null;
  image_url: string | null;
};

const GLYPHS = ["◐", "◇", "◉", "◑", "▤", "◍"];
const COLORS = ["#8ab4ff", "#ff7a59", "#c0c5ce", "#6d6cff", "#90e0c0", "#ffb347"];

const FALLBACK: Product[] = [
  { id: "s1", slug: "vision-pro", name: "Vision Pro Studio", brand: "Apple", price: 3499, currency: "USD", tag: "Spatial", image_url: img("1622979135225-d2ba269cf1ac") },
  { id: "s2", slug: "air-max", name: "Air Max Scorpion", brand: "Nike", price: 219, currency: "USD", tag: "Footwear", image_url: img("1542291026-7eec264c27ff") },
  { id: "s3", slug: "era-300", name: "Sonos Era 300", brand: "Sonos", price: 449, currency: "USD", tag: "Audio", image_url: img("1608043152269-423dbba4e7e1") },
  { id: "s4", slug: "mx-master", name: "MX Master 4S", brand: "Logitech", price: 129, currency: "USD", tag: "Precision", image_url: img("1527864550417-7fd91fc51a46") },
  { id: "s5", slug: "z-fold-7", name: "Galaxy Z Fold 7", brand: "Samsung", price: 1899, currency: "USD", tag: "Flagship", image_url: img("1511707171634-5f897ff02aa9") },
  { id: "s6", slug: "charge-6", name: "Charge 6 Speaker", brand: "JBL", price: 199, currency: "USD", tag: "Portable", image_url: img("1545454675-3531b543be5d") },
];

const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

export function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(FALLBACK);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,brand,price,currency,tag,image_url")
        .eq("is_active", true)
        .eq("is_featured", true)
        .limit(6);
      if (!cancel && data && data.length) setProducts(data as Product[]);
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <section id="shop" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-8 mb-16 flex-wrap">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-4">
              09 / Spotlight
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.88]">
              In rotation
              <br />
              <span className="text-aether-gradient">this season.</span>
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] link-underline"
          >
            View full catalogue →
          </a>
        </div>

        <motion.div
          ref={ref}
          style={{ rotate }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  const [imgOk, setImgOk] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const glyph = GLYPHS[i % GLYPHS.length];
  const color = COLORS[i % COLORS.length];

  const addToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: p.id });
    setSaving(false);
    if (error && !error.message.includes("duplicate")) toast.error(error.message);
    else toast.success("Saved to wishlist");
  };

  const addToBag = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    const { error } = await supabase
      .from("cart_items")
      .upsert(
        { user_id: user.id, product_id: p.id, quantity: 1 },
        { onConflict: "user_id,product_id" },
      );
    if (error) toast.error(error.message);
    else toast.success("Added to bag");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/product/${p.slug}`}
        className="group relative block aspect-[4/5] rounded-[2rem] overflow-hidden glass shadow-elevated cursor-pointer"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(80% 60% at 30% 30%, ${color}55, oklch(0.13 0.02 270) 70%)`,
          }}
        />
        {imgOk && p.image_url ? (
          <img
            src={p.image_url}
            alt={`${p.brand ?? ""} ${p.name}`}
            loading="lazy"
            decoding="async"
            width={900}
            height={1125}
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[12rem] opacity-90 transition-transform duration-700 group-hover:scale-110">
            {glyph}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

        {p.tag && (
          <div className="absolute top-5 left-5 glass-strong rounded-full px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.2em]">
            {p.tag}
          </div>
        )}
        {p.brand && (
          <div className="absolute top-5 right-5 glass-strong rounded-full px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.2em]">
            {p.brand}
          </div>
        )}

        <div className="absolute inset-x-4 bottom-4 glass-strong rounded-2xl p-5 transition-all duration-500 group-hover:bg-[oklch(1_0_0/0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-aether">
                {p.brand ?? "Aether"}
              </div>
              <h3 className="font-display text-2xl mt-1 truncate">{p.name}</h3>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
                From
              </div>
              <div className="font-display text-xl text-platinum-gradient">
                {fmt(Number(p.price), p.currency ?? "USD")}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
            <button
              onClick={addToBag}
              className="rounded-full bg-platinum text-background py-2 text-[0.7rem] uppercase tracking-[0.22em] font-medium"
            >
              Add to bag
            </button>
            <button
              onClick={addToWishlist}
              disabled={saving}
              aria-label="Save"
              className="rounded-full glass px-3 py-2 text-sm"
            >
              ♡
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
