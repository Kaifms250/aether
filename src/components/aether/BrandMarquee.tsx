const brands = [
  { name: "Apple", src: "https://cdn.simpleicons.org/apple/E8E6E3" },
  { name: "Nike", src: "https://cdn.simpleicons.org/nike/E8E6E3" },
  { name: "Adidas", src: "https://cdn.simpleicons.org/adidas/E8E6E3" },
  { name: "Samsung", src: "https://cdn.simpleicons.org/samsung/E8E6E3" },
  { name: "Sony", src: "https://cdn.simpleicons.org/sony/E8E6E3" },
  { name: "Puma", src: "https://cdn.simpleicons.org/puma/E8E6E3" },
  { name: "JBL", src: "https://cdn.simpleicons.org/jbl/E8E6E3" },
  { name: "Logitech", src: "https://www.google.com/s2/favicons?domain=logitech.com&sz=128" },
  { name: "HP", src: "https://cdn.simpleicons.org/hp/E8E6E3" },
  { name: "Dell", src: "https://cdn.simpleicons.org/dell/E8E6E3" },
  { name: "Bose", src: "https://cdn.simpleicons.org/bose/E8E6E3" },
  { name: "Canon", src: "https://www.google.com/s2/favicons?domain=canon.com&sz=128" },
];

export function BrandMarquee() {
  // duplicate list for seamless loop
  const loop = [...brands, ...brands];

  return (
    <section id="brands" className="relative py-24 overflow-hidden border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 mb-12 flex items-end justify-between gap-8">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-3">
            01 / Trusted house
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.9]">
            The world's most
            <br />
            <span className="text-aether-gradient">obsessive</span> brands.
          </h2>
        </div>
        <p className="hidden md:block max-w-sm text-sm text-muted-foreground">
          Curated from a hand-picked roster of category leaders. We don't list everything —
          only what holds up under a magnifying glass.
        </p>
      </div>

      {/* fade edges */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-marquee gap-16 will-change-transform">
          {loop.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className="flex h-20 w-40 shrink-0 items-center justify-center grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              title={b.name}
            >
              <img
                src={b.src}
                alt={`${b.name} logo`}
                loading="lazy"
                decoding="async"
                width={120}
                height={48}
                className="max-h-12 max-w-[120px] object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.dataset.fallback === "text") return;
                  img.dataset.fallback = "text";
                  const parent = img.parentElement;
                  if (!parent) return;
                  img.remove();
                  const span = document.createElement("span");
                  span.textContent = b.name;
                  span.className = "font-display text-xl tracking-wide text-platinum/80";
                  parent.appendChild(span);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
