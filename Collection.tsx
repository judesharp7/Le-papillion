import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CATEGORIES, PRODUCTS, formatPrice, type Product } from "@/lib/papillon-data";
import { Star, Eye, ShoppingBag } from "lucide-react";

export const Collection = ({
  search,
  onAddToCart,
  onView,
}: {
  search: string;
  onAddToCart: (p: Product) => void;
  onView: (p: Product) => void;
}) => {
  const [active, setActive] = useState("all");

  const items = useMemo(() => {
    return PRODUCTS.filter((p) => (active === "all" ? true : p.category === active)).filter((p) =>
      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true,
    );
  }, [active, search]);

  return (
    <section id="collections" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">The Collection</div>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl lg:text-6xl">
            Designed to <span className="text-gradient italic">Take Flight</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Curated pieces, each chosen for a chapter in your story.
          </p>
        </motion.div>

        {/* Category pills */}
        <div className="scrollbar-hide mb-10 flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition-all ${
                active === c.id
                  ? "border-transparent bg-butterfly text-primary-foreground shadow-glow"
                  : "border-border bg-card/40 text-muted-foreground backdrop-blur hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="mr-1.5">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard
              key={p.id}
              p={p}
              index={i}
              onAddToCart={onAddToCart}
              onView={onView}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No styles match your search.
          </div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({
  p,
  index,
  onAddToCart,
  onView,
}: {
  p: Product;
  index: number;
  onAddToCart: (p: Product) => void;
  onView: (p: Product) => void;
}) => {
  const disc = Math.round((1 - p.price / p.oldPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -10 }}
      className="glass group relative overflow-hidden rounded-3xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="rounded-full bg-butterfly px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-glow">
            -{disc}%
          </span>
          {p.tags.includes("new") && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
              NEW
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] backdrop-blur">
          <Star size={11} className="fill-gold text-gold" />
          {p.rating}
        </div>

        {/* Hover quick view */}
        <button
          onClick={() => onView(p)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-12 rounded-full bg-background/80 px-4 py-2 text-xs backdrop-blur transition-all duration-300 group-hover:translate-y-0"
        >
          <Eye size={12} className="mr-1.5 inline" />
          Quick View
        </button>
      </div>

      <div className="space-y-2 p-4">
        <div className="text-[10px] uppercase tracking-wider text-accent">{p.badge}</div>
        <h3 className="line-clamp-1 font-medium text-foreground">{p.name}</h3>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display text-xl text-gradient">{formatPrice(p.price)}</div>
            <div className="text-xs text-muted-foreground line-through">{formatPrice(p.oldPrice)}</div>
          </div>
          <div className="text-[10px] text-muted-foreground">{p.orders.toLocaleString()} sold</div>
        </div>

        <div className="flex gap-1.5 pt-1">
          {p.colors.map((c) => (
            <span
              key={c}
              style={{ background: c }}
              className="h-3 w-3 rounded-full border border-white/20"
            />
          ))}
        </div>

        <button
          onClick={() => onAddToCart(p)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-butterfly py-2.5 text-xs font-bold text-primary-foreground opacity-90 transition hover:opacity-100"
        >
          <ShoppingBag size={13} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};
