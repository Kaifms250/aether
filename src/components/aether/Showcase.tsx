import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// Royalty-free imagery from Unsplash. `unsplash.com/photos/<id>` resolves via
// the images.unsplash.com CDN with on-the-fly resize + format negotiation.
const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const products = [
  {
    name: "Vision Pro Studio",
    brand: "Apple",
    price: "$3,499",
    tag: "Spatial",
    glyph: "◐",
    color: "#8ab4ff",
    image: img("1622979135225-d2ba269cf1ac"), // headset / tech
  },
  {
    name: "Air Max Scorpion",
    brand: "Nike",
    price: "$219",
    tag: "Footwear",
    glyph: "◇",
    color: "#ff7a59",
    image: img("1542291026-7eec264c27ff"), // red nike sneaker
  },
  {
    name: "Sonos Era 300",
    brand: "Sonos",
    price: "$449",
    tag: "Audio",
    glyph: "◉",
    color: "#c0c5ce",
    image: img("1608043152269-423dbba4e7e1"), // speaker
  },
  {
    name: "MX Master 4S",
    brand: "Logitech",
    price: "$129",
    tag: "Precision",
    glyph: "◑",
    color: "#6d6cff",
    image: img("1527864550417-7fd91fc51a46"), // mouse
  },
  {
    name: "Galaxy Z Fold 7",
    brand: "Samsung",
    price: "$1,899",
    tag: "Flagship",
    glyph: "▤",
    color: "#90e0c0",
    image: img("1511707171634-5f897ff02aa9"), // phone
  },
  {
    name: "Charge 6 Speaker",
    brand: "JBL",
    price: "$199",
    tag: "Portable",
    glyph: "◍",
    color: "#ffb347",
    image: img("1545454675-3531b543be5d"), // portable speaker
  },
];

export function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

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
            <ProductCard key={p.name} p={p} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({
  p,
  i,
}: {
  p: (typeof products)[number];
  i: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden glass shadow-elevated cursor-pointer"
    >
      {/* visual bg */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 60% at 30% 30%, ${p.color}55, oklch(0.13 0.02 270) 70%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-[12rem] opacity-90 transition-transform duration-700 group-hover:scale-110">
        {p.glyph}
      </div>

      {/* badge */}
      <div className="absolute top-5 left-5 glass-strong rounded-full px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.2em]">
        {p.tag}
      </div>
      <div className="absolute top-5 right-5 glass-strong rounded-full px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.2em]">
        {p.brand}
      </div>

      {/* footer info, expands on hover */}
      <div className="absolute inset-x-4 bottom-4 glass-strong rounded-2xl p-5 transition-all duration-500 group-hover:bg-[oklch(1_0_0/0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-aether">
              {p.brand}
            </div>
            <h3 className="font-display text-2xl mt-1 truncate">{p.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
              From
            </div>
            <div className="font-display text-xl text-platinum-gradient">
              {p.price}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
          <button className="rounded-full bg-platinum text-background py-2 text-[0.7rem] uppercase tracking-[0.22em] font-medium">
            Add to bag
          </button>
          <button
            aria-label="Save"
            className="rounded-full glass px-3 py-2 text-sm"
          >
            ♡
          </button>
        </div>
      </div>
    </motion.article>
  );
}
