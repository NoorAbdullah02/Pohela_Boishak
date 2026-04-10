"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "./FoodCard";
import { foodAPI } from "@/lib/api";

export default function MenuSection({ activeCategory = "সব", onItemsLoad }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data } = await foodAPI.getAll();
      setItems(data.items);
      if (onItemsLoad) onItemsLoad(data.items);
    } catch (error) {
      console.error("আইটেম লোড সমস্যা:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    activeCategory === "সব"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section
      id="menu"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-500/8 via-orange-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-gradient-to-l from-orange-500/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs sm:text-sm text-amber-400/60 tracking-[0.3em] uppercase mb-3 sm:mb-4"
          >
            আমাদের বিশেষ
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gradient-gold mb-4 sm:mb-5 leading-tight">
            খাবারের তালিকা
          </h2>
          <div className="flex items-center justify-center gap-4 sm:gap-5">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-amber-500/40" />
            <span className="text-gray-400 text-sm sm:text-base font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              মোট {items.length}টি আইটেম
            </span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
        </motion.div>

        {/* Decorative separator between tabs and cards */}
        <div className="flex items-center justify-center gap-3 mb-10 sm:mb-14">
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-white/10" />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
          </div>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Items Grid */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
                >
                  <div className="h-44 sm:h-52 bg-white/5" />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-12 bg-white/10 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 md:gap-10"
              >
                {filteredItems.map((item, index) => (
                  <FoodCard key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 sm:py-24"
            >
              <span className="text-5xl sm:text-6xl mb-6 block">😔</span>
              <p className="text-gray-400 text-lg sm:text-xl font-medium">
                এই ক্যাটাগরিতে কোনো আইটেম নেই
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom spacer for separation from footer */}
      <div className="mt-16 sm:mt-24 md:mt-32" />
    </section>
  );
}
