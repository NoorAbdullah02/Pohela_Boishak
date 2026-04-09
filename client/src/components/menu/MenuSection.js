"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "./FoodCard";
import { foodAPI } from "@/lib/api";

const categories = ["সব", "খাবার", "জুস", "কম্বো", "অন্যান্য"];

const categoryIcons = {
  সব: "🎪",
  খাবার: "🍰",
  জুস: "🧃",
  কম্বো: "🎁",
  অন্যান্য: "🎭",
};

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data } = await foodAPI.getAll();
      setItems(data.items);
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
    <section id="menu" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12"
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs sm:text-sm text-amber-400/60 tracking-[0.2em] uppercase"
        >
          আমাদের বিশেষ
        </motion.span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gradient-gold mt-2 mb-3 sm:mb-4">
          খাবারের তালিকা
        </h2>
        <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
          <span className="text-gray-500 text-xs sm:text-sm">
            মোট {items.length}টি আইটেম
          </span>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex overflow-x-auto hide-scrollbar items-center sm:justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 pb-4 sm:pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            id={`category-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`category-chip flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm md:text-base whitespace-nowrap px-4 py-2 sm:px-6 sm:py-2.5 ${activeCategory === cat ? "active" : ""
              }`}
          >
            <span className="text-sm sm:text-base">{categoryIcons[cat]}</span>
            <span>{cat}</span>
            {activeCategory !== cat && (
              <span className="text-xs text-gray-500 ml-0.5">
                (
                {cat === "সব"
                  ? items.length
                  : items.filter((i) => i.category === cat).length}
                )
              </span>
            )}
          </button>
        ))}
      </motion.div>

      <div className="pt-12 sm:pt-20 md:pt-28 border-t border-white/10 mt-8 sm:mt-12">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
              >
                <div className="h-40 sm:h-48 bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-10 bg-white/10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
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
            className="text-center py-12 sm:py-16"
          >
            <span className="text-4xl sm:text-5xl mb-4 block">😔</span>
            <p className="text-gray-400 text-base sm:text-lg">
              এই ক্যাটাগরিতে কোনো আইটেম নেই
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
