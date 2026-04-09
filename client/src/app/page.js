"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuSection from "@/components/menu/MenuSection";
import CartDrawer from "@/components/cart/CartDrawer";
import { motion } from "framer-motion";

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
  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <HeroScene />
      <MenuSection />

      <section id="about" className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl sm:max-w-4xl h-64 sm:h-96 bg-amber-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

        <div className="flex justify-center relative z-10" />
      </section>

      <Footer />

      <CartDrawer />
    </main>
  );
}
