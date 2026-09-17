import { motion } from "motion/react";
import { ButterflyLogo } from "./ButterflyLogo";

export const Footer = () => (
  <footer className="relative mt-20 border-t border-border bg-card/20 px-6 py-16 backdrop-blur">
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-4">
      <div>
        <div className="flex items-center gap-3">
          <ButterflyLogo size={40} />
          <div>
            <div className="font-display text-2xl text-foreground">
              Le <span className="text-gradient italic">Papillon</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Boutique</div>
          </div>
        </div>
        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
          Premium clothing inspired by the butterfly's elegance. Lagos · Worldwide shipping.
        </p>
      </div>

      {[
        { title: "Shop", links: ["Collections", "New Arrivals", "Flash Deals", "Lookbook"] },
        { title: "Support", links: ["Contact", "Sizing Guide", "Shipping", "Returns"] },
        { title: "Company", links: ["About", "Sustainability", "Press", "Careers"] },
      ].map((col) => (
        <div key={col.title}>
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">{col.title}</div>
          <ul className="space-y-2">
            {col.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-muted-foreground transition hover:text-foreground">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row"
    >
      <div>© 2026 Le Papillon Boutique. Crafted with 🦋 in Lagos.</div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-foreground">Privacy</a>
        <a href="#" className="hover:text-foreground">Terms</a>
        <a href="#" className="hover:text-foreground">Cookies</a>
      </div>
    </motion.div>
  </footer>
);
