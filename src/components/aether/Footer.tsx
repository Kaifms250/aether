import { AetherLogo } from "./Logo";
import { Link } from "react-router-dom";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "Electronics", to: "/shop?category=electronics" },
      { label: "Fashion", to: "/shop?category=fashion" },
      { label: "Footwear", to: "/shop?category=footwear" },
      { label: "Fitness", to: "/shop?category=fitness" },
      { label: "Home Decor", to: "/shop?category=home" },
      { label: "Accessories", to: "/shop?category=accessories" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Our story", to: "/#story" },
      { label: "All categories", to: "/#categories" },
      { label: "Brands", to: "/#brands" },
      { label: "Contact", to: "/#contact" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Shipping", to: "/#contact" },
      { label: "Returns", to: "/#contact" },
      { label: "Warranty", to: "/#contact" },
      { label: "Concierge", to: "mailto:concierge@aether.store" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-24 border-t border-white/5 pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12">
          <div className="col-span-2 md:col-span-3">
            <AetherLogo />
            <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
              A small house of curated commerce. Fewer, better things — assembled with the precision
              of a watchmaker and the patience of a librarian.
            </p>
            <div className="mt-8">
              <a
                href="mailto:concierge@aether.store"
                className="link-underline text-xs uppercase tracking-[0.2em]"
              >
                concierge@aether.store
              </a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[0.65rem] uppercase tracking-[0.28em] text-aether mb-5">
                {c.title}
              </div>
              <ul className="space-y-3 text-sm text-platinum/85">
                {c.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith("mailto:") ? (
                      <a href={link.to} className="link-underline hover:text-platinum">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="link-underline hover:text-platinum">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          <div>© 2026 Aether House — All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="mailto:concierge@aether.store?subject=Privacy" className="hover:text-platinum">
              Privacy
            </a>
            <a href="mailto:concierge@aether.store?subject=Terms" className="hover:text-platinum">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
