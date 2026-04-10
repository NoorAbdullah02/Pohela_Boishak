"use client";

import { motion } from "framer-motion";

const categories = ["সব", "খাবার", "জুস", "কম্বো", "অন্যান্য"];

const categoryIcons = {
  সব: "🎪",
  খাবার: "🍰",
  জুস: "🧃",
  কম্বো: "🎁",
  অন্যান্য: "🎭",
};

export default function CategoryTabs({ activeCategory, setActiveCategory, items = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-20 mb-8 sm:mb-12 md:mb-16"
    >
      <div className="relative mx-auto max-w-3xl px-4">
        {/* Glass container for tabs */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex overflow-x-auto hide-scrollbar items-center justify-start sm:justify-center gap-2 sm:gap-3 w-fit mx-auto px-1">
            {categories.map((cat) => {
              const count =
                cat === "সব"
                  ? items.length
                  : items.filter((i) => i.category === cat).length;
              const isActive = activeCategory === cat;

              return (
                <motion.button
                  key={cat}
                  id={`category-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex flex-col items-center gap-0.5 sm:gap-1 text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 min-w-[72px] sm:min-w-[90px] flex-shrink-0 ${
                    isActive
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] border border-amber-400/30"
                      : "bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-white border border-transparent hover:border-white/10"
                  }`}
                >
                  <span className="text-lg sm:text-xl leading-none">
                    {categoryIcons[cat]}
                  </span>
                  <span className="font-bold text-[11px] sm:text-sm leading-tight">
                    {cat}
                  </span>
                  <span
                    className={`text-[9px] sm:text-xs font-medium leading-none ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    ({count})
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
