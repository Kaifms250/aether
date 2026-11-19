import { useMemo } from "react";
import { useCategories, useProducts } from "@/lib/store";
import { CategoryStory, type CategoryWithProducts } from "./CategoryStory";

export function Categories() {
  const categoriesQuery = useCategories();
  const productsQuery = useProducts();
  const categories = useMemo(() => {
    if (!categoriesQuery.data || !productsQuery.data) return [];
    return categoriesQuery.data.map((category) => ({
      ...category,
      products: productsQuery.data
        .filter((product) => product.category_id === category.id)
        .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || b.rating - a.rating),
    }));
  }, [categoriesQuery.data, productsQuery.data]);

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return (
      <section id="categories" className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-center text-platinum/60">Loading the collection…</p>
      </section>
    );
  }

  if (categoriesQuery.isError || productsQuery.isError) {
    return (
      <section id="categories" className="mx-auto max-w-7xl px-6 py-24">
        <p role="alert" className="text-center text-rose-200">
          Categories are temporarily unavailable.
        </p>
      </section>
    );
  }

  return (
    <div id="categories" className="relative">
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.32em] text-aether">
            {categories.length} chapters
          </p>
          <h2 className="max-w-3xl font-display text-5xl leading-[0.88] md:text-7xl">
            Each category, a <span className="text-aether-gradient">room of its own.</span>
          </h2>
        </div>
      </section>
      {categories.map((category, index) => (
        <CategoryStory key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}
