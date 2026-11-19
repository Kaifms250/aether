import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import type { Category, Product } from "@/lib/store";
import { ProductArtwork } from "./ProductArtwork";

export type CategoryWithProducts = Category & { products: Product[] };

const accents: Record<string, string> = {
  electronics: "#8ab4ff",
  fashion: "#c08aff",
  footwear: "#ff7a59",
  beauty: "#ffb6c1",
  home: "#e8c07a",
  accessories: "#6d6cff",
  books: "#90b890",
  fitness: "#90e0c0",
};

const glyphs: Record<string, string> = {
  electronics: "◐",
  fashion: "◇",
  footwear: "▲",
  beauty: "✦",
  home: "◰",
  accessories: "◈",
  books: "▤",
  fitness: "◍",
};

export function CategoryStory({
  category,
  index,
}: {
  category: CategoryWithProducts;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const accent = accents[category.slug] ?? category.accent_color ?? "#8ab4ff";
  const product = category.products[0];
  const flip = index % 2 === 1;

  return (
    <section
      id={`category-${category.slug}`}
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden scroll-mt-24"
      style={{
        background: `radial-gradient(80% 60% at ${flip ? "80%" : "20%"} 40%, ${accent}26, transparent 60%), var(--background)`,
      }}
    >
      <motion.div
        style={{ y: numberY }}
        className={`pointer-events-none absolute ${flip ? "right-[-3vw]" : "left-[-3vw]"} top-1/2 -translate-y-1/2 select-none`}
      >
        <span
          className="font-display leading-none"
          style={{
            fontSize: "clamp(18rem, 38vw, 42rem)",
            color: "transparent",
            WebkitTextStroke: "1px oklch(1 0 0 / 0.06)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>

      <div
        className={`relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-12 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <motion.div style={{ y }} className="relative aspect-[5/4] lg:col-span-7 lg:aspect-[7/6]">
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] glass-strong shadow-elevated">
            {product ? (
              <>
                <ProductArtwork
                  src={product.image_url ?? category.image_url}
                  alt={product.name}
                  brand={product.brand}
                  className="absolute inset-0 h-full w-full opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </>
            ) : (
              <div
                className="absolute inset-0 grid place-items-center"
                style={{ background: `${accent}22` }}
              >
                <span className="text-[12rem] opacity-70" aria-hidden>
                  {glyphs[category.slug] ?? "◇"}
                </span>
              </div>
            )}
            <div className="absolute left-5 top-5 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.2em]">
              {category.products.length} pieces
            </div>
            {product && (
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl glass-strong p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-aether">
                  {product.brand}
                </p>
                <p className="font-display text-xl">{product.name}</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col justify-center lg:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="mb-4 text-[0.7rem] uppercase tracking-[0.32em] text-aether"
          >
            {String(index + 1).padStart(2, "0")} / Chapter
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl leading-[0.85] md:text-7xl xl:text-8xl"
          >
            {category.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-4 text-xl font-light tracking-wide text-platinum/90"
          >
            {category.tagline ?? "A considered collection for everyday life."}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.18, duration: 0.7 }}
            className="mt-6 max-w-md leading-relaxed text-muted-foreground"
          >
            {category.description ?? "Explore a considered edit from the Aether collection."}
          </motion.p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="magnetic inline-flex items-center gap-3 rounded-full bg-platinum px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-background hover:shadow-glow"
            >
              Explore {category.name.toLowerCase()} <span className="text-base">→</span>
            </Link>
            <span className="rounded-full glass px-6 py-3.5 text-xs uppercase tracking-[0.22em]">
              {category.products.length} pieces
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
