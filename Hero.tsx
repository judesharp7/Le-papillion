import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import heroImg from "@/assets/hero-model.jpg";
import { ButterflyField } from "./ButterflyField";

export const Hero = ({ onShop }: { onShop: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // 3D mouse tilt
  const rX = useSpring(useMotionValue(0), { stiffness: 80, damping: 15 });
  const rY = useSpring(useMotionValue(0), { stiffness: 80, damping: 15 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rY.set(x * 12);
    rX.set(-y * 12);
  };
  const handleLeave = () => { rX.set(0); rY.set(0); };

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Parallax background layers */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 bg-aurora opacity-30"
        aria-hidden
      />
      <ButterflyField density={16} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-32 pb-20 lg:grid-cols-2 lg:pt-40">
        {/* Text column */}
        <motion.div style={{ y: yText, opacity }} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-accent backdrop-blur"
          >
            ✦ New Season Arrivals 2026 ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-5xl font-light leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Unfold Your
            <br />
            <span className="text-gradient italic">True Style</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0"
          >
            Premium clothing inspired by the butterfly's elegance. Each piece crafted to let your personality soar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <button
              onClick={onShop}
              className="group relative overflow-hidden rounded-full bg-butterfly px-8 py-4 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              <span className="relative z-10">🦋 Shop Collection</span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
            </button>
            <button className="rounded-full border border-accent/40 px-8 py-4 font-medium text-foreground backdrop-blur transition-all hover:border-accent hover:bg-accent/10">
              View Lookbook →
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8 lg:max-w-md"
          >
            {[["10K+","Happy Clients"],["200+","Styles"],["4.9★","Avg Rating"]].map(([v,l]) => (
              <div key={l} className="text-center lg:text-left">
                <div className="font-display text-2xl text-gradient sm:text-3xl">{v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Image column */}
        <motion.div
          style={{ y: yImg, scale, opacity }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="perspective-1000 relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div
            style={{ rotateX: rX, rotateY: rY }}
            className="preserve-3d relative aspect-[3/4] w-full"
          >
            {/* Glow */}
            <div className="absolute -inset-10 rounded-full bg-primary/30 blur-3xl" />

            <div className="glass-strong shadow-deep relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/10">
              <img
                src={heroImg}
                alt="Butterfly inspired iridescent gown"
                className="h-full w-full object-cover"
                width={1080}
                height={1920}
              />
              {/* Iridescent overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 mix-blend-overlay" />
            </div>

            {/* Floating chips */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -left-4 top-12 rounded-2xl px-4 py-3 text-xs shadow-glow"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bestseller</div>
              <div className="text-gradient font-display text-lg">Silk Maxi</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -right-4 bottom-20 rounded-2xl px-4 py-3 text-xs shadow-glow"
              style={{ transform: "translateZ(60px)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-gold">★ 4.9</span>
                <span className="text-muted-foreground">2.3K reviews</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <div>Scroll</div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
};
