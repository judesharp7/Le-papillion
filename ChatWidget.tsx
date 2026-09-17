import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import { ButterflyLogo } from "./ButterflyLogo";

type Msg = { from: "bot" | "user"; text: string; time: Date };

const BOT_RESPONSES = [
  "I'll check on that for you right away! 🦋",
  "Great question! Our team will get back to you shortly.",
  "Your order reference helps us help you faster — keep it handy!",
  "You can also reach us on WhatsApp or email anytime.",
  "Thanks for shopping at Le Papillon. Your style matters to us 💜",
];

export const ChatWidget = ({ orderRef }: { orderRef?: string | null }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "👋 Hello! Welcome to Le Papillon. I'm here to help with your order, sizing, or anything else!", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const phone = "2349133194677";
  const email = "aniuchennajude@gmail.com";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "user", text: input, time: new Date() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, {
        from: "bot",
        text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
        time: new Date(),
      }]);
      setTyping(false);
    }, 1100 + Math.random() * 700);
  };

  const waMsg = encodeURIComponent(`Hi! Le Papillon 🦋\nRef: ${orderRef || "No order yet"}`);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-butterfly text-primary-foreground shadow-glow"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-strong shadow-deep fixed bottom-24 right-6 z-[80] flex h-[480px] w-[min(360px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/15 to-accent/15 p-4">
              <ButterflyLogo size={28} />
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">Le Papillon Support</div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                  Online — replies in minutes
                </div>
              </div>
            </div>

            {orderRef && (
              <div className="border-b border-border bg-accent/5 px-4 py-2 text-[11px]">
                📋 Tracking: <span className="font-mono text-gradient">{orderRef}</span>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-butterfly text-primary-foreground"
                      : "glass text-foreground"
                  }`}>
                    {m.text}
                    <div className="mt-0.5 text-[9px] opacity-60">
                      {m.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="glass flex w-fit gap-1 rounded-2xl px-3 py-2">
                  {[0, 0.2, 0.4].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="flex gap-2 border-t border-border px-4 py-2">
              <a href={`https://wa.me/${phone}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 rounded-full bg-green-500/20 py-1.5 text-center text-[11px] font-bold text-green-300">
                📱 WhatsApp
              </a>
              <a href={`mailto:${email}?subject=${encodeURIComponent("Le Papillon - " + (orderRef || "Enquiry"))}`}
                className="flex-1 rounded-full bg-primary/20 py-1.5 text-center text-[11px] font-bold text-primary">
                ✉️ Email
              </a>
            </div>

            <div className="flex gap-2 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={orderRef ? `Ref ${orderRef}…` : "Type a message…"}
                className="flex-1 rounded-full border border-border bg-card/60 px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button onClick={send} className="rounded-full bg-butterfly p-2.5 text-primary-foreground shadow-glow">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
