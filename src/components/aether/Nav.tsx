import { useEffect, useState } from "react";
import { AetherLogo } from "./Logo";

const links = [
  { label: "Shop", href: "#shop" },
  { label: "Categories", href: "#categories" },
  { label: "Brands", href: "#brands" },
  { label: "Story", href: "#story" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
          scrolled
            ? "glass-strong rounded-full py-2 pl-4 pr-2 mx-4 md:mx-auto"
            : ""
        }`}
      >
        <a href="#top" aria-label="Aether home" className="flex items-center">
          <AetherLogo />
        </a>

        <nav className="hidden md:flex items-center gap-9 text-[0.78rem] uppercase tracking-[0.22em] text-platinum/80">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-underline hover:text-platinum transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#newsletter"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-platinum text-background px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium magnetic hover:shadow-glow"
          >
            Get Access
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-aether-deep" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
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

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden mt-3 mx-4 rounded-3xl glass-strong p-6 animate-reveal">
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-[0.2em]">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
