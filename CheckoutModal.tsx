import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { formatPrice, generateRef } from "@/lib/papillon-data";
import type { CartItem } from "./ProductModal";

export type Order = { ref: string; form: Form; total: number };
type Form = {
  name: string; email: string; phone: string;
  address: string; city: string; state: string;
  card: string; expiry: string; cvv: string;
};

export const CheckoutModal = ({
  cart, onClose, onOrderPlaced,
}: {
  cart: CartItem[];
  onClose: () => void;
  onOrderPlaced: (o: Order) => void;
}) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>({
    name: "", email: "", phone: "", address: "", city: "", state: "",
    card: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const ref = useRef(generateRef());

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.email.includes("@")) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Required";
      if (!form.address.trim()) e.address = "Required";
    }
    if (step === 2) {
      if (form.card.replace(/\s/g, "").length < 16) e.card = "16-digit card number required";
      if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY format";
      if (form.cvv.length < 3) e.cvv = "3-digit CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const Field = ({ label, field, placeholder, type = "text" }: { label: string; field: keyof Form; placeholder?: string; type?: string }) => (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={form[field]}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
        className={`w-full rounded-xl border bg-card/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary ${
          errors[field] ? "border-destructive" : "border-border"
        }`}
      />
      {errors[field] && <div className="mt-1 text-xs text-destructive">{errors[field]}</div>}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass-strong shadow-deep relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl text-foreground">
              {step === 1 ? "📦 Delivery" : step === 2 ? "💳 Payment" : "✅ Confirm"}
            </h3>
            <button onClick={onClose} className="rounded-full bg-card p-2"><X size={16} /></button>
          </div>

          <div className="mb-6 flex gap-2">
            {[1,2,3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-butterfly" : "bg-card"}`} />
            ))}
          </div>

          <div className="glass mb-5 rounded-xl px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">📋 Order Reference</div>
            <div className="font-mono text-sm text-gradient">{ref.current}</div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Full Name" field="name" placeholder="Ada Lovelace" />
              <Field label="Email" field="email" placeholder="you@email.com" type="email" />
              <Field label="Phone" field="phone" placeholder="+234..." />
              <Field label="Address" field="address" placeholder="Street, building" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" field="city" placeholder="Lagos" />
                <Field label="State" field="state" placeholder="Lagos" />
              </div>
              <button
                onClick={() => validate() && setStep(2)}
                className="w-full rounded-full bg-butterfly py-3.5 font-bold text-primary-foreground shadow-glow"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Card Number" field="card" placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry" field="expiry" placeholder="MM/YY" />
                <Field label="CVV" field="cvv" placeholder="123" />
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-xs text-muted-foreground">
                🔒 Secured by 256-bit SSL encryption.
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-border bg-card/40 py-3 text-sm text-muted-foreground">
                  ← Back
                </button>
                <button
                  onClick={() => validate() && setStep(3)}
                  className="flex-1 rounded-full bg-butterfly py-3 font-bold text-primary-foreground shadow-glow"
                >
                  Review →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.qty || 1}</span>
                    <span>{formatPrice(item.price * (item.qty || 1))}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-bold">Total</span>
                  <span className="font-display text-2xl text-gradient">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 rounded-full border border-border bg-card/40 py-3 text-sm text-muted-foreground">
                  ← Back
                </button>
                <button
                  onClick={() => onOrderPlaced({ ref: ref.current, form, total })}
                  className="flex-1 rounded-full bg-butterfly py-3 font-bold text-primary-foreground shadow-glow"
                >
                  🎉 Place Order
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
