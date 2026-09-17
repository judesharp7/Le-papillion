import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FLASH_DEALS, formatPrice, type Product } from "@/lib/papillon-data";

export const FlashDeals = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const [time, setTime] = useState(4 * 3600 + 23 * 60 + 45);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Limited Time</div>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              ⚡ <span className="text-gradient italic">Flash Deals</span>
            </h2>
          </div>
          <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ends in</span>
            {[h, m, s].map((v, i) => (
              <span key={i} className="font-mono text-lg font-bold text-gradient">
                {v}
                {i < 2 && <span className="text-muted-foreground">:</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {FLASH_DEALS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="glass group overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 rounded-full bg-butterfly px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground shadow-glow">
                  -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[10px] backdrop-blur">
                  {p.badge}
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-sm font-medium text-foreground">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-lg text-gradient">{formatPrice(p.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span>
                </div>
                <button
                  onClick={() => onAddToCart(p)}
                  className="mt-3 w-full rounded-full bg-butterfly py-2 text-xs font-bold text-primary-foreground opacity-90 transition hover:opacity-100"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
