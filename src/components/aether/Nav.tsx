import { useEffect, useState } from "react";
import { AetherLogo } from "./Logo";

type Link = { label: string; href: string; children?: { label: string; href: string }[] };

const links: Link[] = [
  { label: "Home", href: "#top" },
  { label: "Shop", href: "#shop" },
  {
    label: "Categories",
    href: "#categories",
    children: [
      { label: "Electronics", href: "#categories" },
      { label: "Fashion", href: "#categories" },
      { label: "Footwear", href: "#categories" },
      { label: "Beauty", href: "#categories" },
      { label: "Home & Living", href: "#categories" },
      { label: "Accessories", href: "#categories" },
      { label: "Books", href: "#categories" },
      { label: "Fitness", href: "#categories" },
    ],
  },
  { label: "New Arrivals", href: "#shop" },
  { label: "Best Sellers", href: "#shop" },
  { label: "Deals", href: "#shop" },
  { label: "Brands", href: "#brands" },
  { label: "About", href: "#story" },
  { label: "Contact", href: "#newsletter" },
];

function IconBtn({
  label,
  children,
  badge,
}: {
  label: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-[oklch(1_0_0/0.08)] transition-colors"
    >
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-aether text-[10px] leading-4 text-background font-semibold text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-all duration-500 ${
          scrolled ? "glass-strong rounded-full py-2 pl-4 pr-2 mx-4 md:mx-auto" : ""
        }`}
      >
        <a href="#top" aria-label="Aether home" className="flex items-center shrink-0">
          <AetherLogo />
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-[0.72rem] uppercase tracking-[0.2em] text-platinum/80">
          {links.map((l) => (
            <div key={l.label} className="relative group">
              <a
                href={l.href}
                className="link-underline hover:text-platinum transition-colors inline-flex items-center gap-1"
              >
                {l.label}
                {l.children && <span className="text-[0.6rem] opacity-60">▾</span>}
              </a>
              {l.children && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="glass-strong rounded-2xl p-3 min-w-[200px] grid gap-1">
                    {l.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        className="block rounded-xl px-3 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-platinum/80 hover:bg-[oklch(1_0_0/0.06)] hover:text-platinum"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <IconBtn label="Search">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Toggle search"
              className="absolute inset-0 rounded-full"
            />
            <SearchIcon />
          </IconBtn>
          <IconBtn label="Wishlist" badge={3}>
            <HeartIcon />
          </IconBtn>
          <IconBtn label="Cart" badge={2}>
            <BagIcon />
          </IconBtn>
          <IconBtn label="Account">
            <UserIcon />
          </IconBtn>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block h-px w-5 bg-platinum transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-platinum transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Inline search */}
      {searchOpen && (
        <div className="mx-auto mt-3 max-w-3xl px-4 animate-reveal">
          <div className="glass-strong rounded-full flex items-center gap-3 px-5 py-3">
            <SearchIcon />
            <input
              autoFocus
              type="search"
              placeholder="Search products, brands, categories…"
              className="flex-1 bg-transparent outline-none text-sm text-platinum placeholder:text-platinum/40"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-[0.65rem] uppercase tracking-[0.22em] text-platinum/60 hover:text-platinum"
              aria-label="Close search"
            >
              Esc
            </button>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden mt-3 mx-4 rounded-3xl glass-strong p-6 animate-reveal max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-1 text-sm uppercase tracking-[0.2em]">
            {links.map((l) => (
              <div key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-platinum"
                >
                  {l.label}
                </a>
                {l.children && (
                  <div className="pl-4 grid gap-1 pb-2">
                    {l.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 text-[0.7rem] tracking-[0.18em] text-platinum/60"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---- icons ---- */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
