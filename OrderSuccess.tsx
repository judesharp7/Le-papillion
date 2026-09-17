import { motion } from "motion/react";
import type { Order } from "./CheckoutModal";

export const OrderSuccess = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  const phone = "2349133194677";
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-background/90 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 18 }}
        className="glass-strong shadow-deep max-w-md rounded-3xl p-8 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto mb-4 text-7xl"
        >
          🦋
        </motion.div>
        <h2 className="font-display text-3xl text-foreground">Order Placed!</h2>
        <p className="mt-2 text-muted-foreground">
          Thank you {order.form.name}! Your Le Papillon order is confirmed.
        </p>

        <div className="glass my-6 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Your Tracking Reference</div>
          <div className="font-mono text-xl text-gradient">{order.ref}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Save this — use it in chat to track your order</div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div>📧 Confirmation sent to {order.form.email}</div>
          <div>📱 WhatsApp update to +{phone}</div>
        </div>

        <div className="mt-6 flex gap-2">
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi! Order Ref: ${order.ref}`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-full border border-accent/40 bg-accent/10 py-3 text-sm font-bold text-accent"
          >
            WhatsApp Us
          </a>
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-butterfly py-3 text-sm font-bold text-primary-foreground shadow-glow"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
