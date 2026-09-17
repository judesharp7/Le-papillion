import { useEffect, useState } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { ButterflyLogo } from "./ButterflyLogo";
import { motion, AnimatePresence } from "motion/react";

export const Header = ({
  cartCount,
  onCartOpen,
  onSearch,
  searchTerm,
}: {
  cartCount: number;
  onCartOpen: () => void;
  onSearch: (s: string) => void;
  searchTerm: string;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = ["Collections", "New In", "Lookbook", "About", "Contact"];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-deep py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
            <ButterflyLogo size={scrolled ? 32 : 40} />
          </motion.div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
              Le <span className="text-gradient italic">Papillon</span>
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Boutique
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase().replace(" ", "-")}`}
              className="group relative text-sm text-muted-foreground transition hover:text-foreground"
            >
              {n}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 backdrop-blur md:flex">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search styles…"
              className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            onClick={onCartOpen}
            className="relative rounded-full border border-border bg-card/40 p-3 backdrop-blur transition hover:border-primary hover:bg-primary/10"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-butterfly px-1.5 text-[10px] font-bold text-primary-foreground shadow-glow"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full border border-border bg-card/40 p-3 backdrop-blur lg:hidden"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-strong fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-6 top-6 rounded-full border border-border p-3"
            >
              <X size={20} />
            </button>
            {nav.map((n, i) => (
              <motion.a
                key={n}
                href={`#${n.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="font-display text-3xl text-foreground"
              >
                {n}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
