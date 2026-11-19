import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Nav } from "@/components/aether/Nav";
import { Footer } from "@/components/aether/Footer";
import { ProductCard } from "@/components/aether/ProductCard";
import { useCategories, useProducts } from "@/lib/store";

type SortOrder = "newest" | "price-low" | "price-high" | "rating" | "discount";

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const { data: products = [], isLoading, isError } = useProducts();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const category = params.get("category") ?? "";
  const sort = (params.get("sort") as SortOrder | null) ?? "newest";
  const term = (params.get("search") ?? "").trim().toLowerCase();
  const categoryId = categories.find((item) => item.slug === category)?.id;

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = !category || product.category_id === categoryId;
      const matchesSearch =
        !term ||
        [product.name, product.brand, product.description, product.tag].some((value) =>
          value?.toLowerCase().includes(term),
        );
      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "rating") return Number(b.rating) - Number(a.rating);
      if (sort === "discount") return b.discount_pct - a.discount_pct;
      return b.created_at.localeCompare(a.created_at) || a.slug.localeCompare(b.slug);
    });
  }, [products, category, categoryId, term, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">The catalogue</p>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl leading-[0.9] md:text-7xl">Shop Aether</h1>
          <p className="max-w-md text-sm leading-relaxed text-platinum/60">
            Considered objects from independent makers and category leaders.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateParam("search", search.trim());
          }}
          className="mb-6 grid gap-3 md:grid-cols-[1fr_220px_200px_auto]"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, brands, categories…"
            aria-label="Search products"
            className="glass rounded-full px-5 py-3 text-sm outline-none focus:ring-1 focus:ring-aether/50"
          />
          <select
            value={category}
            onChange={(event) => updateParam("category", event.target.value)}
            aria-label="Filter by category"
            className="glass rounded-full bg-background px-5 py-3 text-sm outline-none"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => updateParam("sort", event.target.value)}
            aria-label="Sort products"
            className="glass rounded-full bg-background px-5 py-3 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="discount">Biggest deals</option>
          </select>
          <button className="rounded-full bg-platinum px-6 py-3 text-xs uppercase tracking-[0.18em] text-background">
            Search
          </button>
        </form>

        <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-platinum/50">
          <span>{visibleProducts.length} pieces</span>
          {(category || term) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setParams({});
              }}
              className="hover:text-platinum"
            >
              Clear filters
            </button>
          )}
        </div>

        {isLoading || categoriesLoading ? (
          <p className="py-20 text-center text-platinum/60">Loading the catalogue…</p>
        ) : isError || categoriesError ? (
          <p role="alert" className="py-20 text-center text-rose-200">
            The catalogue could not be loaded. Please try again.
          </p>
        ) : visibleProducts.length === 0 ? (
          <div className="glass rounded-3xl py-20 text-center">
            <p className="text-platinum/60">No pieces match those filters.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
