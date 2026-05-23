
"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const generateRef = () =>
  "LP-" +
  Math.random().toString(36).substring(2, 6).toUpperCase() +
  "-" +
  Date.now().toString().slice(-4);

const formatPrice = (p) => `₦${Number(p).toLocaleString()}`;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All", icon: "🦋" },
  { id: "summer", label: "Summer Breeze", icon: "☀️" },
  { id: "autumn", label: "Autumn Whisper", icon: "🍂" },
  { id: "winter", label: "Winter Elegance", icon: "❄️" },
  { id: "evening", label: "Evening Glow", icon: "🌙" },
  { id: "casual", label: "Casual Wing", icon: "🕊️" },
];

const PRODUCTS = [
  {
    id: 1, name: "Butterfly Silk Maxi Dress", category: "summer",
    price: 28500, oldPrice: 42000, rating: 4.8, reviews: 312, orders: 1240,
    badge: "⚡ Flash Deal", sizes: ["XS","S","M","L","XL"],
    colors: ["#6c63ff","#48c6ef","#ff6b9d"],
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    desc: "Flowing silk maxi inspired by butterfly wings. Light, elegant, free-spirited.",
    tags: ["bestseller","new"],
  },
  {
    id: 2, name: "Velvet Cocoon Coat", category: "winter",
    price: 54900, oldPrice: 78000, rating: 4.9, reviews: 198, orders: 876,
    badge: "🔥 Hot Pick", sizes: ["S","M","L","XL","XXL"],
    colors: ["#2d1b69","#1a1a2e","#8b4513"],
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    desc: "Luxurious velvet cocoon wrap — warmth meets sculptural elegance.",
    tags: ["trending"],
  },
  {
    id: 3, name: "Ethereal Chiffon Blouse", category: "casual",
    price: 12800, oldPrice: 19500, rating: 4.7, reviews: 445, orders: 2300,
    badge: "💜 Fan Fave", sizes: ["XS","S","M","L"],
    colors: ["#f0e6ff","#ffd6e7","#e6f3ff"],
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    desc: "Dreamy chiffon with flutter sleeves. Effortlessly feminine.",
    tags: ["bestseller"],
  },
  {
    id: 4, name: "Aurora Gradient Jumpsuit", category: "evening",
    price: 37200, oldPrice: 52000, rating: 4.6, reviews: 156, orders: 634,
    badge: "✨ New Arrival", sizes: ["XS","S","M","L","XL"],
    colors: ["#6c63ff","#ff6b9d","#ffd700"],
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    desc: "Iridescent gradient jumpsuit that shifts like a northern light.",
    tags: ["new"],
  },
  {
    id: 5, name: "Russet Wrap Midi Skirt", category: "autumn",
    price: 16400, oldPrice: 24000, rating: 4.8, reviews: 289, orders: 1100,
    badge: "🍂 Season Pick", sizes: ["XS","S","M","L","XL"],
    colors: ["#8b4513","#d2691e","#a0522d"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    desc: "Earthy tones with a flattering wrap silhouette for golden days.",
    tags: ["trending"],
  },
  {
    id: 6, name: "Crystal Pleat Gown", category: "evening",
    price: 68000, oldPrice: 95000, rating: 5.0, reviews: 87, orders: 320,
    badge: "👑 Luxury", sizes: ["XS","S","M","L"],
    colors: ["#e8d5f5","#b8a9c9","#d4af37"],
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    desc: "Floor-length crystal-pleated gown. The room will remember you.",
    tags: ["new","bestseller"],
  },
  {
    id: 7, name: "Linen Breeze Co-ord Set", category: "summer",
    price: 22100, oldPrice: 31000, rating: 4.5, reviews: 367, orders: 1580,
    badge: "☀️ Summer Sale", sizes: ["S","M","L","XL"],
    colors: ["#f5f5dc","#e6ddd0","#87ceeb"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
    desc: "Breathable linen co-ord for effortless summer dressing.",
    tags: ["trending"],
  },
  {
    id: 8, name: "Midnight Satin Blazer", category: "casual",
    price: 41500, oldPrice: 60000, rating: 4.7, reviews: 203, orders: 890,
    badge: "🌙 Night Mode", sizes: ["XS","S","M","L","XL","XXL"],
    colors: ["#0a0a1a","#1a1a3e","#2d2d5e"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b7ed1?auto=format&fit=crop&w=600&q=80",
    desc: "Power satin blazer for day-to-night transitions.",
    tags: ["new"],
  },
];

const FLASH_DEALS = PRODUCTS.filter((_, i) => i < 4);

// ─── BUTTERFLY SVG LOGO ────────────────────────────────────────────────────────
const ButterflyLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ animation: "flutter 2s infinite alternate ease-in-out" }}>
    <path d="M32 32C44 12 62 12 54 32C62 52 44 52 32 32Z" fill="#6c63ff" />
    <path d="M32 32C20 12 2 12 10 32C2 52 20 52 32 32Z" fill="#48c6ef" />
    <circle cx="32" cy="32" r="3" fill="#fff" opacity="0.8" />
  </svg>
);

// ─── ANIMATED 3D HERO ──────────────────────────────────────────────────────────
const HeroSection = ({ onShop }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w; canvas.height = h;

    // "Floating product" particles — orbs in brand colors
    const orbs = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 18 + Math.random() * 48,
      dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5,
      color: ["#6c63ff","#48c6ef","#ff6b9d","#b39ddb","#80deea"][i % 5],
      phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.012,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((orb) => {
        const pulse = 1 + 0.12 * Math.sin(t * orb.speed + orb.phase);
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * pulse);
        grad.addColorStop(0, orb.color + "55");
        grad.addColorStop(0.5, orb.color + "22");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        orb.x += orb.dx; orb.y += orb.dy;
        if (orb.x < -orb.r) orb.x = w + orb.r;
        if (orb.x > w + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = h + orb.r;
        if (orb.y > h + orb.r) orb.y = -orb.r;
      });
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: "92vh", display: "flex",
      alignItems: "center", justifyContent: "center", overflow: "hidden",
      background: "linear-gradient(135deg, #0d0e1a 0%, #1a1b2e 50%, #0d1a2e 100%)",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem", maxWidth: 760 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <ButterflyLogo size={80} />
        </div>
        <div style={{
          display: "inline-block", background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.4)",
          borderRadius: 24, padding: "0.35rem 1.2rem", marginBottom: "1.5rem",
          fontSize: "0.85rem", color: "#a89fff", letterSpacing: "0.15em", textTransform: "uppercase",
        }}>✦ New Season Arrivals 2026 ✦</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          color: "#fff", margin: "0 0 1rem", lineHeight: 1.1,
          textShadow: "0 0 60px rgba(108,99,255,0.4)",
        }}>
          Unfold Your<br />
          <span style={{ background: "linear-gradient(90deg, #6c63ff, #48c6ef, #ff6b9d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            True Style
          </span>
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#9ba8d4", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Premium clothing inspired by the butterfly's elegance. Each piece crafted to let your personality soar.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onShop} style={{
            background: "linear-gradient(90deg, #6c63ff, #48c6ef)",
            color: "#fff", border: "none", borderRadius: 32, padding: "1rem 2.4rem",
            fontSize: "1.05rem", fontFamily: "inherit", cursor: "pointer", fontWeight: 700,
            boxShadow: "0 8px 32px rgba(108,99,255,0.4)", transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.06)"; e.target.style.boxShadow = "0 12px 40px rgba(108,99,255,0.55)"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 8px 32px rgba(108,99,255,0.4)"; }}
          >
            🦋 Shop Collection
          </button>
          <button style={{
            background: "transparent", color: "#48c6ef", border: "2px solid rgba(72,198,239,0.5)",
            borderRadius: 32, padding: "1rem 2.4rem", fontSize: "1.05rem", fontFamily: "inherit",
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(72,198,239,0.1)"; e.target.style.borderColor = "#48c6ef"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(72,198,239,0.5)"; }}
          >
            View Lookbook
          </button>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", marginTop: "3.5rem", flexWrap: "wrap" }}>
          {[["10K+","Happy Clients"],["200+","Styles"],["4.9★","Avg Rating"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#fff", fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: "0.8rem", color: "#6b7db3", textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite" }}>
        <div style={{ width: 24, height: 40, border: "2px solid rgba(108,99,255,0.5)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
          <div style={{ width: 4, height: 8, background: "#6c63ff", borderRadius: 2, animation: "scrollDot 2s infinite" }} />
        </div>
      </div>
    </section>
  );
};

// ─── FLASH DEALS TIMER ─────────────────────────────────────────────────────────
const FlashDeals = ({ onAddToCart }) => {
  const [time, setTime] = useState(4 * 3600 + 23 * 60 + 45);
  useEffect(() => {
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <section style={{ padding: "3rem 1.5rem", background: "rgba(10,10,26,0.9)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#fff", margin: 0 }}>
            ⚡ Flash Deals
          </h2>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#9ba8d4" }}>Ends in:</span>
            {[h, m, s].map((v, i) => (
              <span key={i} style={{
                background: "linear-gradient(135deg, #6c63ff, #48c6ef)",
                color: "#fff", padding: "0.3rem 0.6rem", borderRadius: 8,
                fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700,
              }}>{v}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {FLASH_DEALS.map(p => (
            <div key={p.id} style={{
              background: "rgba(30,32,50,0.8)", border: "1px solid rgba(108,99,255,0.2)",
              borderRadius: 16, overflow: "hidden", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(108,99,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "relative", height: 180 }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: 10, left: 10, background: "linear-gradient(90deg,#ff3366,#ff6b9d)",
                  color: "#fff", borderRadius: 20, padding: "0.2rem 0.8rem", fontSize: "0.75rem", fontWeight: 700,
                }}>{p.badge}</div>
                <div style={{
                  position: "absolute", top: 10, right: 10, background: "rgba(255,51,102,0.9)",
                  color: "#fff", borderRadius: 20, padding: "0.2rem 0.7rem", fontSize: "0.75rem", fontWeight: 700,
                }}>-{Math.round((1 - p.price / p.oldPrice) * 100)}%</div>
              </div>
              <div style={{ padding: "0.9rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#cfd8ff", marginBottom: "0.4rem", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{formatPrice(p.price)}</span>
                  <span style={{ fontSize: "0.8rem", color: "#6b7db3", textDecoration: "line-through" }}>{formatPrice(p.oldPrice)}</span>
                </div>
                <button onClick={() => onAddToCart(p)} style={{
                  width: "100%", background: "linear-gradient(90deg,#6c63ff,#48c6ef)",
                  color: "#fff", border: "none", borderRadius: 24, padding: "0.55rem",
                  fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                }}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CATEGORY FILTER ───────────────────────────────────────────────────────────
const CategoryBar = ({ active, onChange }) => (
  <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", padding: "1rem 1.5rem", scrollbarWidth: "none" }}>
    {CATEGORIES.map(c => (
      <button key={c.id} onClick={() => onChange(c.id)} style={{
        whiteSpace: "nowrap", background: active === c.id ? "linear-gradient(90deg,#6c63ff,#48c6ef)" : "rgba(30,32,50,0.8)",
        color: active === c.id ? "#fff" : "#9ba8d4", border: `1px solid ${active === c.id ? "transparent" : "rgba(108,99,255,0.2)"}`,
        borderRadius: 24, padding: "0.55rem 1.2rem", fontSize: "0.9rem", cursor: "pointer",
        transition: "all 0.2s", fontFamily: "inherit",
      }}>{c.icon} {c.label}</button>
    ))}
  </div>
);

// ─── PRODUCT CARD ──────────────────────────────────────────────────────────────
const ProductCard = ({ p, onAddToCart, onView }) => {
  const [hovered, setHovered] = useState(false);
  const disc = Math.round((1 - p.price / p.oldPrice) * 100);

  return (
    <div style={{
      background: "rgba(22,24,40,0.85)", border: `1px solid ${hovered ? "rgba(108,99,255,0.45)" : "rgba(108,99,255,0.15)"}`,
      borderRadius: 20, overflow: "hidden", transition: "all 0.3s", cursor: "pointer",
      transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
      boxShadow: hovered ? "0 20px 50px rgba(108,99,255,0.3)" : "0 4px 16px rgba(0,0,0,0.3)",
    }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: "relative", paddingBottom: "110%" }}>
        <img src={p.image} alt={p.name} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transition: "transform 0.4s", transform: hovered ? "scale(1.06)" : "scale(1)",
        }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ background: "linear-gradient(90deg,#ff3366,#ff6b9d)", color: "#fff", borderRadius: 20, padding: "0.2rem 0.75rem", fontSize: "0.72rem", fontWeight: 700 }}>
            -{disc}%
          </span>
          {p.tags?.includes("new") && <span style={{ background: "rgba(72,198,239,0.9)", color: "#fff", borderRadius: 20, padding: "0.2rem 0.75rem", fontSize: "0.72rem", fontWeight: 700 }}>NEW</span>}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,10,26,0.7)", borderRadius: 20, padding: "0.3rem 0.7rem", fontSize: "0.75rem", color: "#ffd700" }}>
          ★ {p.rating}
        </div>
        {hovered && (
          <button onClick={() => onView(p)} style={{
            position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
            background: "rgba(10,10,26,0.85)", color: "#fff", border: "1px solid rgba(108,99,255,0.5)",
            borderRadius: 20, padding: "0.4rem 1.2rem", fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap",
          }}>👁 Quick View</button>
        )}
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ fontSize: "0.85rem", color: "#48c6ef", marginBottom: "0.3rem" }}>{p.badge}</div>
        <div style={{ fontSize: "0.95rem", color: "#e0e6ff", marginBottom: "0.5rem", lineHeight: 1.4, fontWeight: 500 }}>{p.name}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem" }}>
          <div>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{formatPrice(p.price)}</span>
            <span style={{ fontSize: "0.78rem", color: "#5a6a9a", textDecoration: "line-through", marginLeft: 6 }}>{formatPrice(p.oldPrice)}</span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#6b7db3" }}>{p.orders.toLocaleString()} sold</span>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.8rem" }}>
          {p.colors.map(c => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.2)" }} />
          ))}
        </div>
        <button onClick={() => onAddToCart(p)} style={{
          width: "100%", background: "linear-gradient(90deg,#6c63ff,#48c6ef)",
          color: "#fff", border: "none", borderRadius: 24, padding: "0.65rem",
          fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s",
          fontFamily: "inherit",
        }}>🛒 Add to Cart</button>
      </div>
    </div>
  );
};

// ─── PRODUCT MODAL ─────────────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "1rem",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "linear-gradient(135deg, #12131f, #1a1b30)", border: "1px solid rgba(108,99,255,0.3)",
        borderRadius: 24, maxWidth: 780, width: "100%", maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div style={{ borderRadius: "24px 0 0 24px", overflow: "hidden", minHeight: 380 }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ padding: "2rem" }}>
            <button onClick={onClose} style={{
              float: "right", background: "rgba(255,255,255,0.1)", border: "none",
              borderRadius: "50%", width: 34, height: 34, color: "#fff", fontSize: "1.1rem", cursor: "pointer",
            }}>✕</button>
            <div style={{ fontSize: "0.85rem", color: "#48c6ef", marginBottom: "0.4rem" }}>{product.badge}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", margin: "0 0 0.5rem", fontSize: "1.5rem" }}>{product.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ color: "#ffd700" }}>{"★".repeat(Math.floor(product.rating))}☆</span>
              <span style={{ color: "#6b7db3", fontSize: "0.85rem" }}>{product.reviews} reviews</span>
            </div>
            <p style={{ color: "#9ba8d4", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{product.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff" }}>{formatPrice(product.price)}</span>
              <span style={{ color: "#5a6a9a", textDecoration: "line-through" }}>{formatPrice(product.oldPrice)}</span>
              <span style={{ background: "#ff3366", color: "#fff", borderRadius: 12, padding: "0.2rem 0.6rem", fontSize: "0.8rem", fontWeight: 700 }}>
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            </div>
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#9ba8d4", marginBottom: "0.5rem" }}>Size</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: "0.4rem 0.9rem", border: `1px solid ${selectedSize === s ? "#6c63ff" : "rgba(108,99,255,0.3)"}`,
                    borderRadius: 10, background: selectedSize === s ? "linear-gradient(90deg,#6c63ff,#48c6ef)" : "transparent",
                    color: "#fff", cursor: "pointer", fontSize: "0.85rem",
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#9ba8d4", marginBottom: "0.5rem" }}>Color</div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {product.colors.map(c => (
                  <div key={c} onClick={() => setSelectedColor(c)} style={{
                    width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                    border: selectedColor === c ? "3px solid #fff" : "2px solid transparent",
                    outline: selectedColor === c ? "2px solid #6c63ff" : "none", outlineOffset: 2,
                  }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 24, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "transparent", border: "none", color: "#fff", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "1.1rem" }}>−</button>
                <span style={{ color: "#fff", padding: "0 0.5rem", minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: "transparent", border: "none", color: "#fff", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "1.1rem" }}>+</button>
              </div>
            </div>
            <button onClick={() => { onAddToCart({ ...product, selectedSize, selectedColor, qty }); onClose(); }} style={{
              width: "100%", background: "linear-gradient(90deg,#6c63ff,#48c6ef)",
              color: "#fff", border: "none", borderRadius: 28, padding: "1rem",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(108,99,255,0.4)",
            }}>🛒 Add to Cart — {formatPrice(product.price * qty)}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CART DRAWER ───────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, onClose, onRemove, onUpdateQty, onCheckout }) => {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", width: "min(420px, 100vw)", height: "100%", overflow: "auto",
        background: "linear-gradient(180deg, #12131f, #1a1b30)", borderLeft: "1px solid rgba(108,99,255,0.25)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.5)", padding: "1.5rem", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", margin: 0 }}>🛒 Cart ({cart.length})</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 34, height: 34, color: "#fff", cursor: "pointer" }}>✕</button>
        </div>
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#6b7db3" }}>
            <ButterflyLogo size={60} />
            <p style={{ marginTop: "1rem" }}>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.75rem", background: "rgba(30,32,50,0.6)", borderRadius: 16, padding: "0.75rem", border: "1px solid rgba(108,99,255,0.15)" }}>
                  <img src={item.image} alt={item.name} style={{ width: 70, height: 80, objectFit: "cover", borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", color: "#e0e6ff", fontWeight: 500 }}>{item.name}</div>
                    {item.selectedSize && <div style={{ fontSize: "0.75rem", color: "#6b7db3" }}>Size: {item.selectedSize}</div>}
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: "0.4rem" }}>{formatPrice(item.price)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
                      <button onClick={() => onUpdateQty(idx, -1)} style={{ background: "rgba(108,99,255,0.2)", border: "none", borderRadius: "50%", width: 24, height: 24, color: "#fff", cursor: "pointer" }}>−</button>
                      <span style={{ color: "#fff", fontSize: "0.9rem" }}>{item.qty || 1}</span>
                      <button onClick={() => onUpdateQty(idx, 1)} style={{ background: "rgba(108,99,255,0.2)", border: "none", borderRadius: "50%", width: 24, height: 24, color: "#fff", cursor: "pointer" }}>+</button>
                      <button onClick={() => onRemove(idx)} style={{ background: "rgba(255,51,102,0.15)", border: "none", borderRadius: "50%", width: 24, height: 24, color: "#ff6680", cursor: "pointer", marginLeft: "auto" }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(108,99,255,0.2)", paddingTop: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem" }}>
                <span>Total:</span><span>{formatPrice(total)}</span>
              </div>
              <button onClick={onCheckout} style={{
                width: "100%", background: "linear-gradient(90deg,#6c63ff,#48c6ef)",
                color: "#fff", border: "none", borderRadius: 28, padding: "1rem",
                fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Checkout →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── CHECKOUT MODAL ────────────────────────────────────────────────────────────
const CheckoutModal = ({ cart, onClose, onOrderPlaced }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", card: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const ref = useRef(generateRef());

  const validate = () => {
    const e = {};
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

  const handleNext = () => { if (validate()) setStep(s => s + 1); };
  const handlePlace = () => {
    if (validate()) {
      onOrderPlaced({ ref: ref.current, form, total });
    }
  };

  const Field = ({ label, field, placeholder, type = "text" }) => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.82rem", color: "#9ba8d4", marginBottom: "0.4rem" }}>{label}</label>
      <input type={type} value={form[field]} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        style={{
          width: "100%", background: "rgba(30,32,50,0.8)", border: `1px solid ${errors[field] ? "#ff6680" : "rgba(108,99,255,0.3)"}`,
          borderRadius: 12, padding: "0.7rem 1rem", color: "#fff", fontSize: "0.9rem", outline: "none",
          fontFamily: "inherit", boxSizing: "border-box",
        }} />
      {errors[field] && <div style={{ fontSize: "0.75rem", color: "#ff6680", marginTop: "0.25rem" }}>{errors[field]}</div>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", padding: "1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "linear-gradient(135deg,#12131f,#1a1b30)", border: "1px solid rgba(108,99,255,0.3)",
        borderRadius: 24, maxWidth: 500, width: "100%", maxHeight: "90vh", overflow: "auto", padding: "2rem",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", margin: 0 }}>
            {step === 1 ? "📦 Delivery Details" : step === 2 ? "💳 Payment" : "✅ Confirm"}
          </h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 34, height: 34, color: "#fff", cursor: "pointer" }}>✕</button>
        </div>
        {/* Step indicators */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "linear-gradient(90deg,#6c63ff,#48c6ef)" : "rgba(108,99,255,0.2)" }} />
          ))}
        </div>
        {/* Reference number */}
        <div style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#9ba8d4" }}>📋 Order Reference</span>
          <span style={{ fontFamily: "monospace", color: "#48c6ef", fontWeight: 700, fontSize: "0.95rem" }}>{ref.current}</span>
        </div>
        {step === 1 && (
          <>
            <Field label="Full Name" field="name" placeholder="Jane Doe" />
            <Field label="Email" field="email" placeholder="jane@email.com" type="email" />
            <Field label="Phone" field="phone" placeholder="+234..." type="tel" />
            <Field label="Delivery Address" field="address" placeholder="123 Main Street..." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="City" field="city" placeholder="Lagos" />
              <Field label="State" field="state" placeholder="Lagos State" />
            </div>
            <button onClick={handleNext} style={{ width: "100%", background: "linear-gradient(90deg,#6c63ff,#48c6ef)", color: "#fff", border: "none", borderRadius: 24, padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem", fontFamily: "inherit" }}>
              Continue to Payment →
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <Field label="Card Number" field="card" placeholder="1234 5678 9012 3456" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Expiry (MM/YY)" field="expiry" placeholder="12/27" />
              <Field label="CVV" field="cvv" placeholder="123" />
            </div>
            <div style={{ background: "rgba(72,198,239,0.08)", border: "1px solid rgba(72,198,239,0.2)", borderRadius: 12, padding: "0.75rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#9ba8d4" }}>
              🔒 Secured by 256-bit SSL encryption. Your payment info is safe.
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "rgba(108,99,255,0.15)", color: "#9ba8d4", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 24, padding: "1rem", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
              <button onClick={handleNext} style={{ flex: 2, background: "linear-gradient(90deg,#6c63ff,#48c6ef)", color: "#fff", border: "none", borderRadius: 24, padding: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Review Order →</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid rgba(108,99,255,0.1)", fontSize: "0.88rem" }}>
                  <span style={{ color: "#cfd8ff" }}>{item.name} × {item.qty || 1}</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>{formatPrice(item.price * (item.qty || 1))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0 0", fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}>
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: "rgba(108,99,255,0.15)", color: "#9ba8d4", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 24, padding: "1rem", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
              <button onClick={handlePlace} style={{ flex: 2, background: "linear-gradient(90deg,#ff6b9d,#6c63ff)", color: "#fff", border: "none", borderRadius: 24, padding: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🎉 Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── ORDER SUCCESS MODAL ───────────────────────────────────────────────────────
const OrderSuccess = ({ order, onClose }) => {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", padding: "1rem" }}>
      <div style={{
        background: "linear-gradient(135deg,#12131f,#1a1b30)", border: "1px solid rgba(108,99,255,0.4)",
        borderRadius: 28, maxWidth: 480, width: "100%", padding: "2.5rem", textAlign: "center",
        boxShadow: "0 0 80px rgba(108,99,255,0.3)",
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🦋</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", margin: "0 0 0.5rem", fontSize: "1.8rem" }}>Order Placed!</h2>
        <p style={{ color: "#9ba8d4", marginBottom: "1.5rem" }}>Thank you {order.form.name}! Your Le Papillon order is confirmed.</p>
        <div style={{ background: "linear-gradient(90deg, rgba(108,99,255,0.15), rgba(72,198,239,0.15))", border: "1px solid rgba(108,99,255,0.4)", borderRadius: 16, padding: "1.2rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#9ba8d4", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Tracking Reference</div>
          <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color: "#48c6ef", letterSpacing: "0.1em" }}>{order.ref}</div>
          <div style={{ fontSize: "0.78rem", color: "#6b7db3", marginTop: "0.4rem" }}>Keep this safe — use it in chat to track your order</div>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#9ba8d4", marginBottom: "1.5rem", lineHeight: 1.7 }}>
          📧 Confirmation sent to <strong style={{ color: "#48c6ef" }}>{order.form.email}</strong><br />
          📱 WhatsApp update to <strong style={{ color: "#48c6ef" }}>+2349133194677</strong>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <a href={`https://wa.me/2349133194677?text=${encodeURIComponent(`Hi! I just placed an order on Le Papillon 🦋\nReference: ${order.ref}\nAmount: ₦${Number(order.total).toLocaleString()}\nName: ${order.form.name}\n\nPlease confirm my order and delivery details.`)}`}
            target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", background: "#25D366", color: "#fff", borderRadius: 24,
              padding: "0.8rem 1.5rem", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
            }}>WhatsApp Us</a>
          <button onClick={onClose} style={{ background: "linear-gradient(90deg,#6c63ff,#48c6ef)", color: "#fff", border: "none", borderRadius: 24, padding: "0.8rem 1.5rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" }}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

// ─── CHAT WIDGET ───────────────────────────────────────────────────────────────
const ChatWidget = ({ orderRef }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! Welcome to Le Papillon support. I'm here to help with your order, sizing, or anything else!", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const phoneNumber = "2349133194677";
  const email = "aniuchennajude@gmail.com";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const BOT_RESPONSES = [
    "I'll check on that for you right away! 🦋",
    "Great question! Our team will get back to you shortly.",
    "Your order reference is important — always include it in your messages so we can help faster!",
    "You can also reach us directly on WhatsApp or email at any time.",
    "Thanks for shopping at Le Papillon! Your style matters to us 💜",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    const ref = orderRef || "N/A";
    const userMsg = { from: "user", text: input, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botText = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages(m => [...m, { from: "bot", text: botText, time: new Date() }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const whatsappMsg = `Hi! Le Papillon Customer Support 🦋\nRef: ${orderRef || "No order yet"}\nMessage: ${input || "[my message]"}`;
  const emailSubject = `Le Papillon Order Enquiry - Ref: ${orderRef || "New Customer"}`;
  const emailBody = `Hi Le Papillon Team,\n\nOrder Reference: ${orderRef || "N/A"}\n\n[Your message here]\n\nThank you`;

  return (
    <>
      {/* Chat Bubble */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: "2rem", right: "2rem", zIndex: 800,
        width: 60, height: 60, borderRadius: "50%",
        background: "linear-gradient(135deg, #6c63ff, #48c6ef)",
        border: "none", cursor: "pointer", fontSize: "1.6rem",
        boxShadow: "0 8px 24px rgba(108,99,255,0.5)",
        transition: "transform 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: "6.5rem", right: "2rem", zIndex: 800,
          width: "min(370px, calc(100vw - 2rem))", background: "linear-gradient(135deg, #12131f, #1a1b2e)",
          border: "1px solid rgba(108,99,255,0.35)", borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "75vh",
        }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(90deg,#6c63ff,#48c6ef)", padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ButterflyLogo size={32} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>Le Papillon Support</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#7fff7f", marginRight: 4 }} />
                Online — typically replies in minutes
              </div>
            </div>
          </div>

          {/* Ref badge */}
          {orderRef && (
            <div style={{ background: "rgba(108,99,255,0.15)", borderBottom: "1px solid rgba(108,99,255,0.2)", padding: "0.6rem 1.2rem", fontSize: "0.8rem", color: "#9ba8d4", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📋 Tracking: <strong style={{ color: "#48c6ef", fontFamily: "monospace" }}>{orderRef}</strong>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "0.6rem 0.9rem", borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.from === "user" ? "linear-gradient(90deg,#6c63ff,#48c6ef)" : "rgba(30,32,50,0.9)",
                  color: "#fff", fontSize: "0.88rem", lineHeight: 1.5,
                  border: msg.from === "bot" ? "1px solid rgba(108,99,255,0.2)" : "none",
                }}>
                  {msg.text}
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem", textAlign: "right" }}>
                    {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.6rem 0.9rem", background: "rgba(30,32,50,0.9)", borderRadius: "16px 16px 16px 4px", border: "1px solid rgba(108,99,255,0.2)", maxWidth: "60px" }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6c63ff", animation: `typingDot 1s ${d}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Contact Shortcuts */}
          <div style={{ borderTop: "1px solid rgba(108,99,255,0.15)", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem" }}>
            <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, background: "#25D366", color: "#fff", border: "none", borderRadius: 12,
              padding: "0.5rem 0.5rem", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
              textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
            }}>📱 WhatsApp</a>
            <a href={`mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`} style={{
              flex: 1, background: "rgba(108,99,255,0.2)", color: "#9ba8d4", border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: 12, padding: "0.5rem 0.5rem", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
              textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
            }}>✉️ Email</a>
          </div>

          {/* Input */}
          <div style={{ padding: "0 1rem 1rem", display: "flex", gap: "0.5rem" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={orderRef ? `Message with ref ${orderRef}…` : "Type your message…"}
              style={{
                flex: 1, background: "rgba(30,32,50,0.8)", border: "1px solid rgba(108,99,255,0.3)",
                borderRadius: 20, padding: "0.65rem 1rem", color: "#fff", fontSize: "0.88rem",
                outline: "none", fontFamily: "inherit",
              }} />
            <button onClick={sendMessage} style={{
              background: "linear-gradient(90deg,#6c63ff,#48c6ef)", border: "none",
              borderRadius: "50%", width: 40, height: 40, color: "#fff", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

// ─── HEADER ────────────────────────────────────────────────────────────────────
const Header = ({ cartCount, onCartOpen, searchTerm, onSearch, onHome }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 500,
      background: scrolled ? "rgba(13,14,26,0.96)" : "rgba(13,14,26,0.8)",
      backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(108,99,255,0.15)",
      transition: "background 0.3s", padding: "0.75rem 1.5rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <ButterflyLogo size={36} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#fff", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>Le Papillon</span>
        </button>
        <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
          <input value={searchTerm} onChange={e => onSearch(e.target.value)} placeholder="Search styles, collections…"
            style={{
              width: "100%", background: "rgba(30,32,50,0.7)", border: "1px solid rgba(108,99,255,0.25)",
              borderRadius: 24, padding: "0.6rem 1rem 0.6rem 2.8rem", color: "#fff", fontSize: "0.9rem",
              outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            }} />
          <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", color: "#6b7db3" }}>🔍</span>
        </div>
        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {["Collections", "About", "Deals"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={{ color: "#9ba8d4", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#9ba8d4"}>{n}</a>
          ))}
        </nav>
        <button onClick={onCartOpen} style={{
          position: "relative", background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.3)",
          borderRadius: 24, padding: "0.55rem 1.1rem", color: "#fff", cursor: "pointer",
          fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit",
        }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{ background: "linear-gradient(90deg,#ff3366,#ff6b9d)", color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};

// ─── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: "rgba(10,10,20,0.95)", borderTop: "1px solid rgba(108,99,255,0.15)", padding: "3rem 1.5rem 2rem" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <ButterflyLogo size={30} />
            <span style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.1rem" }}>Le Papillon</span>
          </div>
          <p style={{ color: "#6b7db3", fontSize: "0.88rem", lineHeight: 1.7 }}>Premium clothing inspired by the butterfly's elegance and grace.</p>
        </div>
        {[
          { title: "Collections", links: ["Summer Breeze", "Autumn Whisper", "Winter Elegance", "Evening Glow"] },
          { title: "Support", links: ["Track Order", "Returns", "Size Guide", "Contact Us"] },
          { title: "Company", links: ["About Us", "Sustainability", "Press", "Careers"] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>{col.title}</div>
            {col.links.map(l => (
              <div key={l} style={{ color: "#6b7db3", fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#48c6ef"} onMouseLeave={e => e.target.style.color = "#6b7db3"}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(108,99,255,0.15)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ color: "#6b7db3", fontSize: "0.85rem" }}>© 2026 Le Papillon. All rights reserved.</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href={`https://wa.me/2349133194677`} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontSize: "1.4rem", textDecoration: "none" }}>📱</a>
          <a href="mailto:aniuchennajude@gmail.com" style={{ color: "#48c6ef", fontSize: "1.4rem", textDecoration: "none" }}>✉️</a>
          {["github", "linkedin", "twitter"].map(s => (
            <a key={s} href="#" style={{ color: "#6b7db3", fontSize: "1.4rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#6c63ff"} onMouseLeave={e => e.target.style.color = "#6b7db3"}>
              {s === "github" ? "⌨️" : s === "linkedin" ? "💼" : "🐦"}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function LePapillon() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewProduct, setViewProduct] = useState(null);
  const [currentView, setCurrentView] = useState("home"); // home | shop
  const [orderRef, setOrderRef] = useState(null);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = useCallback((product) => {
    setCart(c => {
      const idx = c.findIndex(i => i.id === product.id && i.selectedSize === product.selectedSize);
      if (idx >= 0) {
        const updated = [...c];
        updated[idx] = { ...updated[idx], qty: (updated[idx].qty || 1) + (product.qty || 1) };
        return updated;
      }
      return [...c, { ...product, qty: product.qty || 1 }];
    });
  }, []);

  const removeFromCart = (idx) => setCart(c => c.filter((_, i) => i !== idx));
  const updateQty = (idx, delta) => setCart(c => c.map((item, i) => i === idx ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item));

  const handleOrderPlaced = (order) => {
    setOrderRef(order.ref);
    setSuccessOrder(order);
    setCheckoutOpen(false);
    setCart([]);
  };

  // Inject global styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      @keyframes flutter { 0% { transform: rotate(-10deg) scale(1); } 100% { transform: rotate(10deg) scale(1.08); } }
      @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }
      @keyframes scrollDot { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
      @keyframes typingDot { 0%,100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-4px); } }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: rgba(30,32,50,0.5); }
      ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.5); border-radius: 3px; }
      input::placeholder { color: #4a5a7a !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "linear-gradient(135deg,#0d0e1a 0%,#13152a 50%,#0d1020 100%)", minHeight: "100vh", color: "#e0e6ff" }}>
      <Header
        cartCount={cart.reduce((s, i) => s + (i.qty || 1), 0)}
        onCartOpen={() => setCartOpen(true)}
        searchTerm={searchTerm}
        onSearch={s => { setSearchTerm(s); setCurrentView("shop"); }}
        onHome={() => setCurrentView("home")}
      />

      {currentView === "home" && (
        <HeroSection onShop={() => setCurrentView("shop")} />
      )}

      {/* Flash deals — always visible */}
      <FlashDeals onAddToCart={addToCart} />

      {/* Product Grid Section */}
      <section id="collections" style={{ padding: "2rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#fff", margin: 0 }}>
              🦋 All Collections
              {searchTerm && <span style={{ fontSize: "1rem", color: "#6b7db3", marginLeft: "0.75rem" }}>"{searchTerm}"</span>}
            </h2>
            <span style={{ color: "#6b7db3", fontSize: "0.85rem" }}>{filteredProducts.length} styles</span>
          </div>
        </div>
        <CategoryBar active={activeCategory} onChange={setActiveCategory} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem 3rem" }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#6b7db3" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🦋</div>
              <p>No styles found. Try a different search or category.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} p={p} onAddToCart={addToCart} onView={setViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", background: "rgba(30,32,50,0.6)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 28, padding: "3rem", textAlign: "center", backdropFilter: "blur(12px)" }}>
          <ButterflyLogo size={64} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "#fff", margin: "1rem 0 0.75rem" }}>About Le Papillon</h2>
          <p style={{ fontSize: "1.05rem", color: "#9ba8d4", lineHeight: 1.8 }}>
            Le Papillon is a boutique clothing brand inspired by the beauty and transformation of butterflies. Our collections blend elegance, comfort, and creativity — empowering you to express your unique style. Each piece is crafted with care, using premium materials and sustainable practices.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {[["🌍", "Sustainable"], ["✂️", "Premium Craft"], ["🦋", "Original Design"], ["📦", "Fast Delivery"]].map(([ic, lb]) => (
              <div key={lb} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem" }}>{ic}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7db3", marginTop: "0.3rem" }}>{lb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Overlays */}
      {viewProduct && (
        <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} onAddToCart={p => { addToCart(p); setViewProduct(null); }} />
      )}
      {cartOpen && (
        <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      )}
      {checkoutOpen && cart.length > 0 && (
        <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onOrderPlaced={handleOrderPlaced} />
      )}
      {successOrder && (
        <OrderSuccess order={successOrder} onClose={() => setSuccessOrder(null)} />
      )}

      {/* Chat Widget — always present */}
      <ChatWidget orderRef={orderRef} />
    </div>
  );
}
