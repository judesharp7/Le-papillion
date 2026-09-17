import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/papillon/Header";
import { Hero } from "@/components/papillon/Hero";
import { FlashDeals } from "@/components/papillon/FlashDeals";
import { ParallaxBanner } from "@/components/papillon/ParallaxBanner";
import { Collection } from "@/components/papillon/Collection";
import { Footer } from "@/components/papillon/Footer";
import { CartDrawer } from "@/components/papillon/CartDrawer";
import { ProductModal, type CartItem } from "@/components/papillon/ProductModal";
import { CheckoutModal, type Order } from "@/components/papillon/CheckoutModal";
import { OrderSuccess } from "@/components/papillon/OrderSuccess";
import { ChatWidget } from "@/components/papillon/ChatWidget";
import type { Product } from "@/lib/papillon-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Le Papillon Boutique — Unfold Your True Style" },
      { name: "description", content: "Premium clothing inspired by the butterfly's elegance. Shop the 2026 collection at Le Papillon Boutique — Lagos." },
      { property: "og:title", content: "Le Papillon Boutique" },
      { property: "og:description", content: "Premium butterfly-inspired fashion. New season arrivals 2026." },
    ],
  }),
});

function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");

  const addToCart = (p: CartItem | Product) => {
    setCart((c) => [...c, { ...(p as CartItem), qty: (p as CartItem).qty || 1 }]);
    setCartOpen(true);
  };

  const updateQty = (i: number, delta: number) => {
    setCart((c) => c.map((item, idx) => idx === i ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item));
  };

  const removeItem = (i: number) => setCart((c) => c.filter((_, idx) => idx !== i));

  const goCheckout = () => { setCartOpen(false); setCheckoutOpen(true); };

  const onOrderPlaced = (o: Order) => {
    setCheckoutOpen(false);
    setOrder(o);
    setCart([]);
  };

  const scrollToCollection = () => {
    document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Header
        cartCount={cart.length}
        onCartOpen={() => setCartOpen(true)}
        onSearch={setSearch}
        searchTerm={search}
      />

      <main>
        <Hero onShop={scrollToCollection} />
        <FlashDeals onAddToCart={addToCart} />
        <ParallaxBanner />
        <Collection
          search={search}
          onAddToCart={addToCart}
          onView={setViewing}
        />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onUpdateQty={updateQty}
        onCheckout={goCheckout}
      />

      {viewing && (
        <ProductModal
          product={viewing}
          onClose={() => setViewing(null)}
          onAddToCart={addToCart}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onOrderPlaced={onOrderPlaced}
        />
      )}

      {order && <OrderSuccess order={order} onClose={() => setOrder(null)} />}

      <ChatWidget orderRef={order?.ref} />
    </div>
  );
}
