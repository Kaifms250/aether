import { CategoryStory, type Category } from "./CategoryStory";

const categories: Category[] = [
  {
    index: "03",
    name: "Electronics",
    tagline: "Computing, audio, and spatial — at the bleeding edge.",
    blurb:
      "From the first Vision Pro Studio to the quietest noise-cancelling we've ever stocked. Tested by engineers, vouched for by composers.",
    glyph: "◐",
    accent: "#8ab4ff",
    items: [
      { brand: "Apple", label: "Vision Pro Studio" },
      { brand: "Sony", label: "WH-1000XM6" },
      { brand: "Samsung", label: "Galaxy S26 Ultra" },
      { brand: "Logitech", label: "MX Master 4S" },
    ],
  },
  {
    index: "04",
    name: "Fashion",
    tagline: "Cut, cloth, and considered tailoring.",
    blurb:
      "A tight rotation of investment pieces from houses who still own their factories. Heritage cotton, certified wool, the occasional cashmere.",
    glyph: "◇",
    accent: "#c08aff",
    items: [
      { brand: "Aimé Leon Dore", label: "Wool Topcoat" },
      { brand: "Acne Studios", label: "Denim 1996" },
      { brand: "Stüssy", label: "8 Ball Knit" },
      { brand: "Carhartt WIP", label: "Detroit Jacket" },
    ],
  },
  {
    index: "05",
    name: "Footwear",
    tagline: "Performance and craft, in one shelf.",
    blurb:
      "Carbon-plated racers next to hand-welted leathers. The full spectrum — from Saturday's long run to Friday's late dinner.",
    glyph: "▲",
    accent: "#ff7a59",
    items: [
      { brand: "Nike", label: "Alphafly 3" },
      { brand: "Adidas", label: "Samba OG" },
      { brand: "Puma", label: "Speedcat" },
      { brand: "New Balance", label: "1906R" },
    ],
  },
  {
    index: "06",
    name: "Fitness",
    tagline: "Tools that disappear in your hand.",
    blurb:
      "Equipment for people who train every day and never want to think about gear. Powder-coated steel, machined aluminium, perfect knurl.",
    glyph: "◍",
    accent: "#90e0c0",
    items: [
      { brand: "Hyperice", label: "Hypervolt 3" },
      { brand: "Garmin", label: "Fenix 8 Pro" },
      { brand: "Whoop", label: "5.0 Strap" },
      { brand: "Rogue", label: "Ohio Bar" },
    ],
  },
  {
    index: "07",
    name: "Home Decor",
    tagline: "Architecture, miniaturised.",
    blurb:
      "Lighting, ceramics, and small furniture from independents in Kyoto, Milan, and Mexico City. Every piece arrives crated, not boxed.",
    glyph: "◰",
    accent: "#e8c07a",
    items: [
      { brand: "HAY", label: "Pao Steel Lamp" },
      { brand: "Muuto", label: "Fiber Chair" },
      { brand: "Vitra", label: "Eames LCW" },
      { brand: "Menu", label: "JWDA Lamp" },
    ],
  },
  {
    index: "08",
    name: "Accessories",
    tagline: "The small things you carry every day.",
    blurb:
      "Wallets, eyewear, watches, and travel — built to outlast the season they were bought in. Patina earned, never manufactured.",
    glyph: "◈",
    accent: "#6d6cff",
    items: [
      { brand: "Bellroy", label: "Note Sleeve" },
      { brand: "Persol", label: "714 Folding" },
      { brand: "Tudor", label: "Black Bay 58" },
      { brand: "Bose", label: "QC Ultra" },
    ],
  },
];

export function Categories() {
  return (
    <div id="categories" className="relative">
      {/* Anchor heading band */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">
            Six chapters
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.88] max-w-3xl">
            Each category, a <span className="text-aether-gradient">room of its own.</span>
          </h2>
        </div>
      </section>

      {categories.map((c, i) => (
        <CategoryStory key={c.name} category={c} i={i} />
      ))}
    </div>
  );
}
