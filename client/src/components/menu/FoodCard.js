"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const categoryEmojis = {
  খাবার: {
    কেক: "🎂",
    "ফ্লেভার্ড রসগোল্লা": "🍡",
    "মালাই পাটিসাপটা": "🥞",
    "ফুলঝুরি পিঠা": "🌸",
    টিরামিসু: "🍰",
    "ওভেন বেক পাস্তা": "🍝",
    ভেলপুরি: "🥗",
    "পাঁপড় ভাজা": "🫓",
    "নকশী পিঠা": "🎨",
    নিমকি: "🔶",
    "ফ্রেঞ্চ ফ্রাই": "🍟",
    "সুজির বরফি": "🍮",
    "মুড়ির মোয়া ও নাড়ু": "🍬",
  },
  জুস: {
    "কোল্ড কফি": "☕",
    "ব্লু মোহিত": "🧊",
    ফালুদা: "🥤",
    "লেমন মিন্ট": "🍋",
  },
  কম্বো: { "বৈশাখী কম্বো প্লেট": "🎁" },
  অন্যান্য: {
    লটারি: "🎯",
    "হ্যান্ডমেড জুয়েলারী": "💎",
    বায়োস্কোপ: "🎬",
    ক্যানভাস: "🖼️",
    "বার্মিস আচার": "🫙",
    "মাটির জিনিসপত্র": "🏺",
    "কি রিং": "🔑",
    মুখোশ: "🎭",
    "নববর্ষের আলপনা (হাতে বা গালে)": "✨",
  },
};

const getEmoji = (name, category) => {
  return categoryEmojis[category]?.[name] || "🍽️";
};

const categoryColors = {
  খাবার: {
    gradient: "from-orange-500/25 to-red-500/15",
    border: "border-orange-500/25",
    hoverBorder: "hover:border-orange-400/50",
    accent: "from-orange-500 to-red-500",
    glow: "rgba(249, 115, 22, 0.15)",
    text: "text-orange-400",
    imgBg: "from-orange-900/50 via-red-900/30 to-amber-900/50",
  },
  জুস: {
    gradient: "from-blue-500/25 to-cyan-500/15",
    border: "border-blue-500/25",
    hoverBorder: "hover:border-blue-400/50",
    accent: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.15)",
    text: "text-blue-400",
    imgBg: "from-blue-900/50 via-cyan-900/30 to-indigo-900/50",
  },
  কম্বো: {
    gradient: "from-purple-500/25 to-pink-500/15",
    border: "border-purple-500/25",
    hoverBorder: "hover:border-purple-400/50",
    accent: "from-purple-500 to-pink-500",
    glow: "rgba(168, 85, 247, 0.15)",
    text: "text-purple-400",
    imgBg: "from-purple-900/50 via-pink-900/30 to-violet-900/50",
  },
  অন্যান্য: {
    gradient: "from-emerald-500/25 to-teal-500/15",
    border: "border-emerald-500/25",
    hoverBorder: "hover:border-emerald-400/50",
    accent: "from-emerald-500 to-teal-500",
    glow: "rgba(16, 185, 129, 0.15)",
    text: "text-emerald-400",
    imgBg: "from-emerald-900/50 via-teal-900/30 to-green-900/50",
  },
};

export default function FoodCard({ item, index }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [showGlow, setShowGlow] = useState(false);

  const handleAdd = () => {
    setShowGlow(true);
    addItem(item);
    openCart();
    setTimeout(() => setShowGlow(false), 600);
  };

  const colors = categoryColors[item.category] || categoryColors["খাবার"];

  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
  ).replace("/api", "");
  const getImageUrl = (url) =>
    url.startsWith("http") ? url : `${API_URL}${url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border ${colors.border} ${colors.hoverBorder} group flex flex-col transition-all duration-300`}
      style={{
        background:
          "linear-gradient(145deg, rgba(15,15,30,0.95) 0%, rgba(10,10,25,0.98) 100%)",
        boxShadow: `0 4px 20px -5px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)`,
      }}
    >
      {/* Subtle ambient background glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Corner accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl ${colors.gradient} opacity-40 blur-2xl pointer-events-none`}
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Out of Stock Overlay */}
        {!item.in_stock && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] flex items-center justify-center rounded-2xl sm:rounded-3xl z-30">
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-red-300 font-bold text-xs sm:text-base bg-red-900/80 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.35)]"
            >
              স্টক শেষ
            </motion.span>
          </div>
        )}

        {/* Image Section */}
        <div
          className={`relative h-40 sm:h-48 md:h-52 overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br ${colors.imgBg}`}
        >
          {/* Light shimmer on hover */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />

          {item.image_url ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-4 md:p-5">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="relative w-full h-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.45)] overflow-hidden group-hover:bg-black/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.name}
                  loading="lazy"
                  className="relative w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 z-10 drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
                />
              </motion.div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/15 blur-xl rounded-full scale-[2] group-hover:scale-[2.3] transition-all duration-500" />
                <span className="relative text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 block">
                  {getEmoji(item.name, item.category)}
                </span>
              </motion.div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
            <span
              className={`text-[9px] sm:text-[10px] md:text-xs font-bold px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full bg-gradient-to-r ${colors.accent} text-white shadow-lg backdrop-blur-sm`}
            >
              {item.category}
            </span>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-[#0a0a19] via-[#0a0a19]/60 to-transparent z-10" />
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between relative z-10 overflow-hidden">
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            {/* Name and Price Row */}
            <div className="flex justify-between items-start gap-2 sm:gap-3">
              <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-snug line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:to-orange-400 transition-all duration-300 flex-1 min-w-0 break-words">
                {item.name}
              </h3>
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-amber-500/15 blur-md rounded-lg sm:rounded-xl" />
                <div className="relative bg-[#12122a]/95 border border-amber-500/30 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span className="text-amber-400 font-extrabold text-sm sm:text-base md:text-lg tracking-wide whitespace-nowrap">
                    ৳{Math.round(item.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300/90 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium break-words">
              {item.description}
            </p>

            {/* Combo Items */}
            {item.combo_items && item.combo_items.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 pt-0.5">
                {item.combo_items.map((ci, i) => (
                  <span
                    key={i}
                    className="text-[9px] sm:text-[10px] md:text-xs bg-white/[0.06] text-gray-300 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full border border-white/10 backdrop-blur-md font-medium"
                  >
                    {ci}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            disabled={!item.in_stock}
            onClick={handleAdd}
            id={`add-to-cart-${item.id}`}
            className={`w-full mt-4 sm:mt-5 relative overflow-hidden group/btn rounded-xl sm:rounded-2xl p-[1px] sm:p-[1.5px] transition-all duration-300 ${
              item.in_stock
                ? "shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)]"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {/* Click glow effect */}
            <AnimatePresence>
              {showGlow && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 bg-gradient-to-r ${colors.accent} opacity-60 blur-xl pointer-events-none`}
                />
              )}
            </AnimatePresence>
            {item.in_stock && (
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-80 group-hover/btn:opacity-100 group-active/btn:opacity-100 group-hover/btn:animate-gradient group-active/btn:animate-gradient transition-opacity" />
            )}
            <div
              className={`relative h-full w-full px-4 sm:px-5 py-3 sm:py-3.5 md:py-4 rounded-[8px] sm:rounded-[12px] flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-300 ${
                item.in_stock
                  ? "bg-[#0d0d20] group-hover/btn:bg-transparent group-active/btn:bg-transparent"
                  : "bg-gray-800"
              }`}
            >
              <span className="font-bold text-sm sm:text-base md:text-lg tracking-wide transition-colors whitespace-nowrap group-hover/btn:text-white group-active/btn:text-white">
                {item.in_stock ? "কার্টে যোগ করুন" : "স্টক শেষ"}
              </span>
              {item.in_stock && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500 group-hover/btn:text-white group-active/btn:text-white transition-all duration-300 group-hover/btn:translate-x-1 group-active/btn:translate-x-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
