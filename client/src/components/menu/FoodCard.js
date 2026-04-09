"use client";

import { motion } from "framer-motion";
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

const categoryGradients = {
  খাবার: "from-orange-500/20 to-red-500/10",
  জুস: "from-blue-500/20 to-cyan-500/10",
  কম্বো: "from-purple-500/20 to-pink-500/10",
  অন্যান্য: "from-emerald-500/20 to-teal-500/10",
};

const categoryBorders = {
  খাবার: "border-orange-500/20 hover:border-orange-500/50",
  জুস: "border-blue-500/20 hover:border-blue-500/50",
  কম্বো: "border-purple-500/20 hover:border-purple-500/50",
  অন্যান্য: "border-emerald-500/20 hover:border-emerald-500/50",
};

const categoryAccent = {
  খাবার: "from-orange-500 to-red-500",
  জুস: "from-blue-500 to-cyan-500",
  কম্বো: "from-purple-500 to-pink-500",
  অন্যান্য: "from-emerald-500 to-teal-500",
};

const imgGradients = {
  খাবার: "from-orange-900/60 via-red-900/40 to-amber-900/60",
  জুস: "from-blue-900/60 via-cyan-900/40 to-indigo-900/60",
  কম্বো: "from-purple-900/60 via-pink-900/40 to-violet-900/60",
  অন্যান্য: "from-emerald-900/60 via-teal-900/40 to-green-900/60",
};

export default function FoodCard({ item, index }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleAdd = () => {
    addItem(item);
    openCart();
  };

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace("/api", "");
  const getImageUrl = (url) => url.startsWith('http') ? url : `${API_URL}${url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border ${categoryBorders[item.category]
        } bg-[#0b0b1a]/90 backdrop-blur-sm group flex flex-col`}
      style={{
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[item.category]} opacity-40 rounded-2xl sm:rounded-3xl pointer-events-none group-hover:opacity-60 transition-opacity duration-500`} />

      <div className="relative z-10 h-full flex flex-col">
        {!item.in_stock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl sm:rounded-3xl z-30">
            <motion.span
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="text-red-300 font-bold text-sm sm:text-lg bg-red-900/80 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              স্টক শেষ
            </motion.span>
          </div>
        )}

        <div
          className={`relative h-40 sm:h-48 overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br ${imgGradients[item.category]
            }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />

          {item.image_url ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-full h-full flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group-hover:bg-black/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.name}
                  loading="lazy"
                  className="relative w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 z-10 drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]"
                />
              </motion.div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-[2] group-hover:scale-[2.2] transition-all duration-500" />
                <span className="relative text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 block">
                  {getEmoji(item.name, item.category)}
                </span>
              </motion.div>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${categoryAccent[item.category]
                } text-white shadow-lg`}
            >
              {item.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between relative z-10 bg-[#0a0a16]/90">
          <div>
            <div className="flex justify-between items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:to-orange-500 transition-all duration-300 drop-shadow-md pr-2 pl-1.5 min-h-[40px] flex items-center">
                {item.name}
              </h3>
              <div className="relative group/price flex-shrink-0 mt-1">
                <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-lg group-hover/price:bg-amber-500/30 transition-colors" />
                <div className="relative bg-[#1a1a2e]/90 border border-amber-500/30 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span className="text-amber-400 font-extrabold text-sm sm:text-base md:text-lg tracking-wide whitespace-nowrap">
                    ৳{Math.round(item.price)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-400/90 text-[10px] xs:text-xs sm:text-sm line-clamp-2 leading-relaxed min-h-[36px] sm:min-h-[40px] font-medium tracking-wide pr-2 pl-1.5 mt-1 sm:mt-2">
              {item.description}
            </p>

            {item.combo_items && item.combo_items.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                {item.combo_items.map((ci, i) => (
                  <span
                    key={i}
                    className="text-[10px] sm:text-xs bg-white/5 text-gray-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 backdrop-blur-md"
                  >
                    {ci}
                  </span>
                ))}
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={!item.in_stock}
            onClick={handleAdd}
            id={`add-to-cart-${item.id}`}
            className={`w-full mt-4 sm:mt-6 mb-1 relative overflow-hidden group/btn rounded-xl sm:rounded-2xl p-[1px] transition-all duration-300 min-h-[48px] sm:min-h-[56px] ${item.in_stock
              ? "shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
              : "opacity-60 cursor-not-allowed"
              }`}
          >
            {item.in_stock && (
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-70 group-hover/btn:opacity-100 group-hover/btn:animate-gradient rotate-180 transition-opacity" />
            )}
            <div className={`relative h-full w-full px-3 sm:px-4 py-2 sm:py-3.5 rounded-[10px] sm:rounded-[15px] flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 ${item.in_stock ? 'bg-[#151525] group-hover/btn:bg-transparent' : 'bg-gray-800'}`}>
              <span className={`font-bold text-xs sm:text-sm md:text-base tracking-wide transition-colors`}>
                {item.in_stock ? "কার্টে যোগ করুন" : "স্টক শেষ"}
              </span>
              {item.in_stock && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500 group-hover/btn:text-white transition-colors group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
