import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AetherLogo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type NavLink = { label: string; href: string; children?: { label: string; href: string }[] };

const links: NavLink[] = [
  { label: "Home", href: "/#top" },
  { label: "Shop", href: "/shop" },
  {
    label: "Categories",
    href: "/#categories",
    children: [
      { label: "Electronics", href: "/#category-electronics" },
      { label: "Fashion", href: "/#category-fashion" },
      { label: "Footwear", href: "/#category-footwear" },
      { label: "Beauty", href: "/#category-beauty" },
      { label: "Home Decor", href: "/#category-home" },
      { label: "Accessories", href: "/#category-accessories" },
      { label: "Books", href: "/#category-books" },
      { label: "Fitness", href: "/#category-fitness" },
    ],
  },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "Deals", href: "/#deals" },
  { label: "Brands", href: "/#brands" },
  { label: "About", href: "/#story" },
  { label: "Contact", href: "/#contact" },
];

function IconBtn({
  label,
  children,
  badge,
  to,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  badge?: number;
  to?: string;
  onClick?: () => void;
}) {
  const cls =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full glass transition-colors hover:bg-[oklch(1_0_0/0.08)]";
  const inner = (
    <>
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-aether px-1 text-center text-[10px] font-semibold leading-4 text-background">
          {badge}
        </span>
      )}
    </>
  );
  if (to)
    return (
      <RouterLink to={to} aria-label={label} className={cls}>
        {inner}
      </RouterLink>
    );
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [acctOpen, setAcctOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [counts, setCounts] = useState({ wishlist: 0, cart: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setCounts({ wishlist: 0, cart: 0 });
      return;
    }

    const loadCounts = async () => {
      const [wishlist, cart] = await Promise.all([
        supabase
          .from("wishlist_items")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("cart_items")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);
      if (wishlist.error || cart.error) {
        toast.error(wishlist.error?.message ?? cart.error?.message ?? "Could not load bag counts");
        return;
      }
      setCounts({ wishlist: wishlist.count ?? 0, cart: cart.count ?? 0 });
    };

    void loadCounts();
    window.addEventListener("aether-cart-updated", loadCounts);
    window.addEventListener("aether-wishlist-updated", loadCounts);
    return () => {
      window.removeEventListener("aether-cart-updated", loadCounts);
      window.removeEventListener("aether-wishlist-updated", loadCounts);
    };
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchText.trim();
    navigate(`/shop${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-all duration-500 ${
          scrolled ? "mx-4 rounded-full py-2 pl-4 pr-2 glass-strong md:mx-auto" : ""
        }`}
      >
        <RouterLink to="/" aria-label="Aether home" className="flex shrink-0 items-center">
          <AetherLogo />
        </RouterLink>

        <nav className="hidden items-center gap-6 text-[0.68rem] uppercase tracking-[0.16em] text-platinum/80 lg:flex">
          {links.map((link) => (
            <div key={link.label} className="group relative">
              <button
                type="button"
                onClick={() => navigateTo(link.href)}
                className="link-underline inline-flex items-center gap-1 whitespace-nowrap bg-transparent transition-colors hover:text-platinum"
              >
                {link.label}
                {link.children && <span className="text-[0.6rem] opacity-60">▾</span>}
              </button>
              {link.children && (
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="grid min-w-[200px] gap-1 rounded-2xl glass-strong p-3">
                    {link.children.map((child) => (
                      <button
                        key={child.label}
                        type="button"
                        onClick={() => navigateTo(child.href)}
                        className="rounded-xl px-3 py-2 text-left text-[0.68rem] uppercase tracking-[0.16em] text-platinum/80 hover:bg-[oklch(1_0_0/0.06)] hover:text-platinum"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <IconBtn label="Search" onClick={() => setSearchOpen((value) => !value)}>
            <SearchIcon />
          </IconBtn>
          <IconBtn label="Wishlist" badge={counts.wishlist} to="/wishlist">
            <HeartIcon />
          </IconBtn>
          <IconBtn label="Cart" badge={counts.cart} to="/cart">
            <BagIcon />
          </IconBtn>
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAcctOpen((value) => !value)}
                aria-label="Account"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-[0.7rem] uppercase tracking-widest text-platinum transition-colors hover:bg-[oklch(1_0_0/0.08)]"
              >
                {(user.email?.[0] ?? "A").toUpperCase()}
              </button>
              {acctOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 grid min-w-[220px] gap-1 rounded-2xl glass-strong p-3">
                  <div className="truncate px-3 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-platinum/50">
                    {user.email}
                  </div>
                  <RouterLink
                    to="/orders"
                    onClick={() => setAcctOpen(false)}
                    className="rounded-xl px-3 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-platinum/80 hover:bg-[oklch(1_0_0/0.06)]"
                  >
                    Orders
                  </RouterLink>
                  <RouterLink
                    to="/wishlist"
                    onClick={() => setAcctOpen(false)}
                    className="rounded-xl px-3 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-platinum/80 hover:bg-[oklch(1_0_0/0.06)]"
                  >
                    Wishlist
                  </RouterLink>
                  <button
                    type="button"
                    onClick={async () => {
                      const { error } = await signOut();
                      if (error) toast.error(error.message);
                      setAcctOpen(false);
                    }}
                    className="rounded-xl px-3 py-2 text-left text-[0.7rem] uppercase tracking-[0.2em] text-platinum/80 hover:bg-[oklch(1_0_0/0.06)]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <RouterLink
              to="/auth"
              aria-label="Sign in"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full glass transition-colors hover:bg-[oklch(1_0_0/0.08)]"
            >
              <UserIcon />
            </RouterLink>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full glass lg:hidden"
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

      {searchOpen && (
        <form onSubmit={search} className="mx-auto mt-3 max-w-3xl px-4 animate-reveal">
          <div className="flex items-center gap-3 rounded-full glass-strong px-5 py-3">
            <SearchIcon />
            <input
              autoFocus
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search products, brands, categories…"
              aria-label="Search products"
              className="flex-1 bg-transparent text-sm text-platinum outline-none placeholder:text-platinum/40"
            />
            <button
              type="submit"
              className="text-[0.65rem] uppercase tracking-[0.22em] text-platinum/60 hover:text-platinum"
            >
              Search
            </button>
          </div>
        </form>
      )}

      {open && (
        <div className="mx-4 mt-3 max-h-[80vh] overflow-y-auto rounded-3xl glass-strong p-6 animate-reveal lg:hidden">
          <nav className="flex flex-col gap-1 text-sm uppercase tracking-[0.18em]">
            {links.map((link) => (
              <div key={link.label}>
                <button
                  type="button"
                  onClick={() => navigateTo(link.href)}
                  className="block w-full py-2 text-left text-platinum"
                >
                  {link.label}
                </button>
                {link.children && (
                  <div className="grid gap-1 pb-2 pl-4">
                    {link.children.map((child) => (
                      <button
                        key={child.label}
                        type="button"
                        onClick={() => navigateTo(child.href)}
                        className="block py-1.5 text-left text-[0.7rem] tracking-[0.16em] text-platinum/60"
                      >
                        {child.label}
                      </button>
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

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21c.7-4.1 3-6.2 7-6.2s6.3 2.1 7 6.2" />
    </svg>
  );
}
