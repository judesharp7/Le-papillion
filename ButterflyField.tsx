import { useEffect, useRef } from "react";

// Animated canvas: floating butterflies + iridescent orbs.
export const ButterflyField = ({ density = 14 }: { density?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#a78bfa", "#22d3ee", "#f472b6", "#c4b5fd", "#67e8f9"];
    const orbs = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 40 + Math.random() * 100,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      speed: 0.0008 + Math.random() * 0.0012,
    }));

    const butterflies = Array.from({ length: 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 14 + Math.random() * 16,
      angle: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      flap: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const drawButterfly = (b: typeof butterflies[number], t: number) => {
      const flapScale = 0.6 + Math.abs(Math.sin(t * 0.012 + b.flap)) * 0.4;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = b.color;
      // Left wing
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.5 * flapScale, -b.size * 0.3, b.size * flapScale, b.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right wing
      ctx.beginPath();
      ctx.ellipse(b.size * 0.5 * flapScale, -b.size * 0.3, b.size * flapScale, b.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = "rgba(20,10,40,0.9)";
      ctx.beginPath();
      ctx.ellipse(0, 0, b.size * 0.1, b.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      orbs.forEach((o) => {
        const pulse = 1 + 0.15 * Math.sin(t * o.speed + o.phase);
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * pulse);
        grad.addColorStop(0, o.color + "55");
        grad.addColorStop(0.5, o.color + "22");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r * pulse, 0, Math.PI * 2);
        ctx.fill();
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;
      });

      butterflies.forEach((b) => {
        b.angle += (Math.random() - 0.5) * 0.04;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed * 0.6;
        if (b.x < -30) b.x = w + 30;
        if (b.x > w + 30) b.x = -30;
        if (b.y < -30) b.y = h + 30;
        if (b.y > h + 30) b.y = -30;
        drawButterfly(b, t);
      });

      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
};
