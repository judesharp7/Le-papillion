import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/papillon-data";
import type { CartItem } from "./ProductModal";

export const CartDrawer = ({
  open,
  cart,
  onClose,
  onRemove,
  onUpdateQty,
  onCheckout,
}: {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onRemove: (i: number) => void;
  onUpdateQty: (i: number, delta: number) => void;
  onCheckout: () => void;
}) => {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-background/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="glass-strong fixed top-0 right-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-border"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h3 className="font-display text-2xl text-foreground">
                🛒 Cart <span className="text-muted-foreground">({cart.length})</span>
              </h3>
              <button onClick={onClose} className="rounded-full bg-card p-2 transition hover:bg-card/80">
                <X size={18} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <ShoppingBag size={48} className="text-muted-foreground/40" />
                <p className="text-muted-foreground">Your cart is empty.</p>
                <button
                  onClick={onClose}
                  className="rounded-full bg-butterfly px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-6">
                  {cart.map((item, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="glass flex gap-3 rounded-2xl p-3"
                    >
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="text-sm font-medium text-foreground line-clamp-1">{item.name}</div>
                        {item.selectedSize && (
                          <div className="text-[11px] text-muted-foreground">Size: {item.selectedSize}</div>
                        )}
                        <div className="mt-1 font-display text-gradient">{formatPrice(item.price)}</div>
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQty(idx, -1)}
                            className="rounded-full bg-primary/20 p-1 transition hover:bg-primary/30"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs">{item.qty || 1}</span>
                          <button
                            onClick={() => onUpdateQty(idx, 1)}
                            className="rounded-full bg-primary/20 p-1 transition hover:bg-primary/30"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => onRemove(idx)}
                            className="ml-auto rounded-full bg-destructive/20 p-1.5 text-destructive transition hover:bg-destructive/30"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm uppercase tracking-wider text-muted-foreground">Total</span>
                    <span className="font-display text-3xl text-gradient">{formatPrice(total)}</span>
                  </div>
                  <button
                    onClick={onCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-butterfly py-4 font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
                  >
                    Secure Checkout →
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
