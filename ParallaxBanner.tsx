import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import heroImg from "@/assets/hero-model.jpg";

// Parallax editorial banner mid-page
export const ParallaxBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);

  return (
    <section ref={ref} className="relative h-[80vh] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="relative flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-4 text-xs uppercase tracking-[0.4em] text-accent">Manifesto</div>
        <h2 className="font-display text-5xl leading-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
          Every woman is a <br />
          <span className="text-gradient italic">butterfly</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          We craft pieces that don't just dress you — they unfold the version of you that has always been there.
        </p>
      </motion.div>
    </section>
  );
};
