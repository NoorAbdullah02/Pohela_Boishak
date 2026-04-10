"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuSection from "@/components/menu/MenuSection";
import CategoryTabs from "@/components/menu/CategoryTabs";
import CartDrawer from "@/components/cart/CartDrawer";
import { motion } from "framer-motion";
import { useState } from "react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#0a0a1a] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full mx-auto mb-4"
        />
        <p className="text-amber-400/60 text-sm">লোড হচ্ছে...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [items, setItems] = useState([]);

  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <HeroScene />
      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        items={items}
      />
      <MenuSection
        activeCategory={activeCategory}
        onItemsLoad={setItems}
      />

      <Footer />

      <CartDrawer />
    </main>
  );
}

