import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { useProducts, type Product } from "@/lib/store";

export function Showcase() {
  const { data: products = [], isLoading, isError } = useProducts();
  const featured = products.filter((product) => product.is_featured).slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || a.slug.localeCompare(b.slug))
    .slice(0, 4);
  const bestSellers = [...products]
    .sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    .slice(0, 4);
  const deals = [...products]
    .filter((product) => product.discount_pct > 0)
    .sort((a, b) => b.discount_pct - a.discount_pct)
    .slice(0, 4);

  return (
    <div id="shop" className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Shelf
          id="spotlight"
          eyebrow="09 / Spotlight"
          title="In rotation this season."
          products={featured}
          isLoading={isLoading}
          isError={isError}
        />
        <Shelf
          id="new-arrivals"
          eyebrow="10 / Just arrived"
          title="New to the index."
          products={newArrivals}
          isLoading={isLoading}
          isError={isError}
          sort="newest"
        />
        <Shelf
          id="best-sellers"
          eyebrow="11 / House favourites"
          title="The most considered."
          products={bestSellers}
          isLoading={isLoading}
          isError={isError}
          sort="rating"
        />
        <Shelf
          id="deals"
          eyebrow="12 / Private edit"
          title="A rare opportunity."
          products={deals}
          isLoading={isLoading}
          isError={isError}
          sort="discount"
        />
      </div>
    </div>
  );
}

function Shelf({
  id,
  eyebrow,
  title,
  products,
  isLoading,
  isError,
  sort,
}: {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  sort?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">{eyebrow}</p>
          <h2 className="max-w-3xl font-display text-5xl leading-[0.88] md:text-7xl">{title}</h2>
        </div>
        <Link
          to={sort ? `/shop?sort=${sort}` : "/shop"}
          className="link-underline text-xs uppercase tracking-[0.22em]"
        >
          View full catalogue →
        </Link>
      </div>
      {isLoading ? (
        <p className="py-12 text-center text-platinum/60">Loading the collection…</p>
      ) : isError ? (
        <p role="alert" className="py-12 text-center text-rose-200">
          This collection could not be loaded.
        </p>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-platinum/60">No pieces in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
