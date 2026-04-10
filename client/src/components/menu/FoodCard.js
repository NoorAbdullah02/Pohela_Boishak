"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

/* ─── Category config ─── */
const categoryEmojis = {
  খাবার: {
    কেক: "🎂", "ফ্লেভার্ড রসগোল্লা": "🍡", "মালাই পাটিসাপটা": "🥞",
    "ফুলঝুরি পিঠা": "🌸", টিরামিসু: "🍰", "ওভেন বেক পাস্তা": "🍝",
    ভেলপুরি: "🥗", "পাঁপড় ভাজা": "🫓", "নকশী পিঠা": "🎨",
    নিমকি: "🔶", "ফ্রেঞ্চ ফ্রাই": "🍟", "সুজির বরফি": "🍮",
    "মুড়ির মোয়া ও নাড়ু": "🍬",
  },
  জুস: { "কোল্ড কফি": "☕", "ব্লু মোহিত": "🧊", ফালুদা: "🥤", "লেমন মিন্ট": "🍋" },
  কম্বো: { "বৈশাখী কম্বো প্লেট": "🎁" },
  অন্যান্য: {
    লটারি: "🎯", "হ্যান্ডমেড জুয়েলারী": "💎", বায়োস্কোপ: "🎬",
    ক্যানভাস: "🖼️", "বার্মিস আচার": "🫙", "মাটির জিনিসপত্র": "🏺",
    "কি রিং": "🔑", মুখোশ: "🎭", "নববর্ষের আলপনা (হাতে বা গালে)": "✨",
  },
};

const getEmoji = (name, cat) => categoryEmojis[cat]?.[name] ?? "🍽️";

/* Per-category colour palette */
const palette = {
  খাবার:    { grad: "#ff6b35, #e63946", badge: "#ff6b35", glow: "rgba(255,107,53,0.35)", overlay: "rgba(255,107,53,0.12)" },
  জুস:     { grad: "#3b82f6, #06b6d4", badge: "#3b82f6", glow: "rgba(59,130,246,0.35)",  overlay: "rgba(59,130,246,0.12)" },
  কম্বো:   { grad: "#a855f7, #ec4899", badge: "#a855f7", glow: "rgba(168,85,247,0.35)",  overlay: "rgba(168,85,247,0.12)" },
  অন্যান্য:{ grad: "#10b981, #14b8a6", badge: "#10b981", glow: "rgba(16,185,129,0.35)",  overlay: "rgba(16,185,129,0.12)" },
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace("/api", "");

const imgSrc = (url) => (url?.startsWith("http") ? url : `${API_BASE}${url}`);

export default function FoodCard({ item, index }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const clr = palette[item.category] ?? palette["খাবার"];

  const handleAdd = () => {
    if (!item.in_stock || added) return;
    addItem(item);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.04 }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      className="food-card"
      style={{ "--card-glow": clr.glow, "--card-overlay": clr.overlay }}
    >
      {/* ── Ambient glow layer ── */}
      <div className="food-card__glow" aria-hidden="true" />

      {/* ── Out-of-stock overlay ── */}
      <AnimatePresence>
        {!item.in_stock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="food-card__oos"
          >
            <span className="food-card__oos-badge">স্টক শেষ</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ IMAGE ══════════ */}
      <div className="food-card__img-wrap">
        {/* Gradient tint overlay on image */}
        <div
          className="food-card__img-tint"
          style={{ background: `linear-gradient(135deg, ${clr.overlay} 0%, transparent 60%)` }}
          aria-hidden="true"
        />

        {item.image_url && !imgError ? (
          <motion.img
            src={imgSrc(item.image_url)}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="food-card__img"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.45 }}
          />
        ) : (
          <motion.div
            className="food-card__emoji-wrap"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
          >
            <span className="food-card__emoji">{getEmoji(item.name, item.category)}</span>
          </motion.div>
        )}

        {/* Bottom fade into card body */}
        <div className="food-card__img-fade" aria-hidden="true" />

        {/* Category badge */}
        <div
          className="food-card__cat-badge"
          style={{ background: `linear-gradient(135deg, ${clr.grad})` }}
        >
          {item.category}
        </div>

        {/* Price badge — floats over image bottom-right */}
        <div className="food-card__price-badge">
          <span className="food-card__price-dot" style={{ background: clr.badge }} />
          <span className="food-card__price-text">৳{Math.round(item.price)}</span>
        </div>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div className="food-card__body">
        {/* Name */}
        <h3 className="food-card__name">{item.name}</h3>

        {/* Description */}
        {item.description && (
          <p className="food-card__desc">{item.description}</p>
        )}

        {/* Combo tags */}
        {item.combo_items?.length > 0 && (
          <div className="food-card__combo-tags">
            {item.combo_items.map((ci, i) => (
              <span key={i} className="food-card__combo-tag">{ci}</span>
            ))}
          </div>
        )}

        {/* ── Add to Cart Button ── */}
        <motion.button
          id={`add-to-cart-${item.id}`}
          onClick={handleAdd}
          disabled={!item.in_stock}
          whileHover={item.in_stock ? { scale: 1.03 } : {}}
          whileTap={item.in_stock ? { scale: 0.96 } : {}}
          className={`food-card__btn ${added ? "food-card__btn--added" : ""} ${!item.in_stock ? "food-card__btn--oos" : ""}`}
          style={item.in_stock ? { "--btn-grad": `linear-gradient(135deg, ${clr.grad})`, "--btn-glow": clr.glow } : {}}
        >
          {/* Shine sweep */}
          {item.in_stock && !added && (
            <span className="food-card__btn-shine" aria-hidden="true" />
          )}

          <AnimatePresence mode="wait">
            {!item.in_stock ? (
              <motion.span key="oos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="food-card__btn-label">
                স্টক শেষ
              </motion.span>
            ) : added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="food-card__btn-added-label"
              >
                ✓ কার্টে যোগ হয়েছে!
              </motion.span>
            ) : (
              <motion.span key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="food-card__btn-label">
                <svg xmlns="http://www.w3.org/2000/svg" className="food-card__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                কার্টে যোগ করুন
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
