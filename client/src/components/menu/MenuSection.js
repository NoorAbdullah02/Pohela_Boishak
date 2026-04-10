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
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[600px] h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-500/8 via-orange-500/5 to-transparent rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] sm:w-[400px] h-[200px] sm:h-[300px] bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-gradient-to-l from-orange-500/5 to-transparent rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-14"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] sm:text-xs md:text-sm text-amber-400/60 tracking-[0.3em] uppercase mb-2 sm:mb-3 md:mb-4"
          >
            আমাদের বিশেষ
          </motion.span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gradient-gold mb-3 sm:mb-4 md:mb-5 leading-tight">
            খাবারের তালিকা
          </h2>
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <div className="h-px w-12 sm:w-16 md:w-24 bg-gradient-to-r from-transparent to-amber-500/40" />
            <span className="text-gray-400 text-xs sm:text-sm md:text-base font-medium px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              মোট {items.length}টি আইটেম
            </span>
            <div className="h-px w-12 sm:w-16 md:w-24 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
        </motion.div>

        {/* Decorative separator between tabs and cards */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-14">
          <div className="h-px flex-1 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] bg-gradient-to-r from-transparent to-white/10" />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
          </div>
          <div className="h-px flex-1 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Items Grid */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
                >
                  <div className="h-40 sm:h-48 md:h-52 bg-white/5" />
                  <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-3 sm:h-4 bg-white/5 rounded w-full" />
                    <div className="h-10 sm:h-12 bg-white/10 rounded-xl mt-3 sm:mt-4" />
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
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
              className="text-center py-12 sm:py-16 md:py-24"
            >
              <span className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 block">😔</span>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium">
                এই ক্যাটাগরিতে কোনো আইটেম নেই
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom spacer for separation from footer */}
      <div className="mt-12 sm:mt-16 md:mt-24 lg:mt-32" />
    </section>
  );
}
