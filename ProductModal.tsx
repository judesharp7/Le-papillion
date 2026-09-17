import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/papillon-data";
import { formatPrice } from "@/lib/papillon-data";

export type CartItem = Product & { qty?: number; selectedSize?: string; selectedColor?: string };

export const ProductModal = ({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: CartItem) => void;
}) => {
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="glass-strong shadow-deep relative grid max-h-[90vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-2"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-background/70 p-2 backdrop-blur transition hover:bg-background"
          >
            <X size={18} />
          </button>

          <div className="relative aspect-square md:aspect-auto">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent md:bg-gradient-to-r" />
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{product.badge}</div>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">{product.name}</h2>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground"}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">{product.reviews} reviews</span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{product.desc}</p>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-gradient">{formatPrice(product.price)}</span>
              <span className="text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
              <span className="rounded-full bg-rose/20 px-2 py-0.5 text-xs font-bold text-rose">
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                      size === s
                        ? "border-transparent bg-butterfly text-primary-foreground shadow-glow"
                        : "border-border bg-card/40 text-foreground hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Color</div>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      color === c ? "border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-white/20"
                    }`}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-border bg-card/40 p-1 w-fit">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-full p-2 hover:bg-card">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="rounded-full p-2 hover:bg-card">
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => {
                onAddToCart({ ...product, selectedSize: size, selectedColor: color, qty });
                onClose();
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-butterfly py-4 font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
            >
              <ShoppingBag size={16} />
              Add to Cart — {formatPrice(product.price * qty)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
