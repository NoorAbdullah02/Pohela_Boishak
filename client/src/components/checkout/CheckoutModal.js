"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { orderAPI } from "@/lib/api";

/* ─── Floating label input ─────────────────────────── */
function FloatingInput({ id, label, type = "text", value, onChange, placeholder, required, icon, accentColor = "#F59E0B" }) {
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;

  return (
    <div style={{ position: "relative" }}>
      {/* Icon */}
      <span style={{
        position: "absolute",
        left: 16,
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: 17,
        zIndex: 2,
        pointerEvents: "none",
        opacity: active ? 1 : 0.45,
        transition: "opacity 0.2s",
      }}>
        {icon}
      </span>

      {/* Floating label */}
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: 46,
          top: active ? 8 : "50%",
          transform: active ? "translateY(0)" : "translateY(-50%)",
          fontSize: active ? 10 : 14,
          fontWeight: 700,
          color: focused ? accentColor : active ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.3)",
          letterSpacing: active ? "0.12em" : "0",
          textTransform: active ? "uppercase" : "none",
          pointerEvents: "none",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 2,
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {label}{required && <span style={{ color: accentColor }}> *</span>}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder : ""}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: active ? "26px 16px 10px 46px" : "18px 16px 18px 46px",
          borderRadius: 16,
          background: focused
            ? `rgba(${accentColor === "#F59E0B" ? "245,158,11" : "16,185,129"},0.08)`
            : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${focused ? accentColor : "rgba(255,255,255,0.08)"}`,
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          outline: "none",
          boxSizing: "border-box",
          transition: "all 0.22s ease",
          fontFamily: "'Hind Siliguri', sans-serif",
          boxShadow: focused ? `0 0 0 3px ${accentColor}22` : "none",
        }}
      />
    </div>
  );
}

/* ─── Floating label textarea ─────────────────────── */
function FloatingTextarea({ id, label, value, onChange, placeholder, icon, accentColor = "#F59E0B" }) {
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;

  return (
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute",
        left: 16,
        top: active ? 13 : 18,
        fontSize: 17,
        zIndex: 2,
        pointerEvents: "none",
        opacity: active ? 1 : 0.45,
        transition: "all 0.2s",
      }}>
        {icon}
      </span>
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: 46,
          top: active ? 8 : 18,
          fontSize: active ? 10 : 14,
          fontWeight: 700,
          color: focused ? accentColor : active ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.3)",
          letterSpacing: active ? "0.12em" : "0",
          textTransform: active ? "uppercase" : "none",
          pointerEvents: "none",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 2,
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={3}
        style={{
          width: "100%",
          padding: "28px 16px 12px 46px",
          borderRadius: 16,
          background: focused ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${focused ? accentColor : "rgba(255,255,255,0.08)"}`,
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          outline: "none",
          boxSizing: "border-box",
          transition: "all 0.22s ease",
          resize: "none",
          fontFamily: "'Hind Siliguri', sans-serif",
          boxShadow: focused ? `0 0 0 3px ${accentColor}22` : "none",
        }}
      />
    </div>
  );
}

/* ─── Section header ─────────────────────────────── */
function SectionHeader({ icon, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: `${color}22`,
        border: `1px solid ${color}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0, fontFamily: "'Hind Siliguri', sans-serif" }}>
          {label}
        </p>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${color}, transparent)`, marginTop: 3, borderRadius: 10 }} />
      </div>
    </div>
  );
}

/* ─── Main Checkout Modal ────────────────────────── */
export default function CheckoutModal({ isOpen, onClose }) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState("");
  const [copiedType, setCopiedType] = useState(null);
  const [step, setStep] = useState(1); // 1 = info, 2 = payment (mobile flow)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) { setError("নাম এবং ইমেইল পূরণ করুন।"); return; }
    if (!paymentMethod) { setError("পেমেন্ট পদ্ধতি নির্বাচন করুন।"); return; }
    setLoading(true);
    try {
      const { data } = await orderAPI.create({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        payment_method: paymentMethod,
        notes: notes.trim(),
      });
      setOrderNumber(data.order.order_number);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      setSuccess(false);
      setName(""); setEmail(""); setPhone(""); setNotes("");
      setPaymentMethod(""); setOrderNumber(null); setStep(1);
    }
    setError("");
    onClose();
  };

  // Cohesive warm dark palette — saffron + crimson + emerald
  const ACCENT = {
    amber:   "#F59E0B",  // primary — saffron
    crimson: "#E11D48",  // secondary — deep rose
    emerald: "#10B981",  // success / free delivery
    muted:   "rgba(255,255,255,0.5)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 80 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 900,
                maxHeight: "calc(100vh - 24px)",
                background: "linear-gradient(145deg, #0D0B22 0%, #120E2E 60%, #0A0D1A 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                pointerEvents: "all",
                position: "relative",
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 3, background: "linear-gradient(90deg, #F59E0B 0%, #E11D48 50%, #F59E0B 100%)", flexShrink: 0 }} />

              {/* ── SUCCESS STATE ── */}
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 32px",
                    textAlign: "center",
                    overflowY: "auto",
                  }}
                >
                  {/* Confetti rings */}
                  <div style={{ position: "relative", marginBottom: 28 }}>
                    {[120, 90, 60].map((size, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                        style={{
                          position: "absolute",
                          width: size,
                          height: size,
                          borderRadius: "50%",
                          border: `2px solid ${["#F59E0B", "#10B981", "#8B5CF6"][i]}`,
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.15, stiffness: 120 }}
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.1))",
                        border: "2px solid rgba(16,185,129,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 42,
                        position: "relative",
                      }}
                    >
                      ✅
                    </motion.div>
                  </div>

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #F59E0B 0%, #E11D48 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      margin: "0 0 8px",
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    অর্ডার সম্পন্ন! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, margin: "0 0 28px", fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    আপনার অর্ডার সফলভাবে গৃহীত হয়েছে
                  </motion.p>

                  {/* Order number card */}
                  <motion.div
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      width: "100%",
                      maxWidth: 340,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{
                      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(244,63,94,0.1))",
                      border: "1px solid rgba(245,158,11,0.3)",
                      borderRadius: 22,
                      padding: "24px 28px",
                      marginBottom: 12,
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #F59E0B, #F43F5E)" }} />
                      <p style={{ fontSize: 10, fontWeight: 800, color: "rgba(245,158,11,0.7)", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 8px", fontFamily: "'Hind Siliguri', sans-serif" }}>
                        আপনার অর্ডার নম্বর
                      </p>
                      <p style={{ fontSize: 52, fontWeight: 900, color: "#F59E0B", margin: 0, lineHeight: 1, letterSpacing: "-2px", fontVariantNumeric: "tabular-nums" }}>
                        {orderNumber}
                      </p>
                    </div>
                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 16,
                      padding: "14px 18px",
                    }}>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0, fontFamily: "'Hind Siliguri', sans-serif" }}>
                        📧 কনফার্মেশন ইমেইল পাঠানো হয়েছে। এই নম্বরটি মনে রাখুন।
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    style={{
                      padding: "14px 40px",
                      borderRadius: 100,
                      background: "linear-gradient(135deg, #F59E0B, #E11D48)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    ঠিক আছে, মেনুতে ফিরি →
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {/* ── HEADER ── */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    flexShrink: 0,
                    background: "rgba(255,255,255,0.02)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(244,63,94,0.15))",
                        border: "1px solid rgba(245,158,11,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}>
                        🏮
                      </div>
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.3px", fontFamily: "'Hind Siliguri', sans-serif" }}>
                          চেকআউট
                        </h2>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
                          {items.length} আইটেম · ৳{Math.round(getTotal())}
                        </p>
                      </div>
                    </div>

                    {/* Close circle btn */}
                    <motion.button
                      whileHover={{ scale: 1.08, rotate: 90 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleClose}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        transition: "all 0.2s",
                      }}
                    >
                      ✕
                    </motion.button>
                  </div>

                  {/* ── BODY ── */}
                  <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", height: "100%" }}>

                      {/* LEFT — Customer details + payment */}
                      <div
                        style={{
                          flex: "1 1 340px",
                          padding: "28px 24px",
                          overflowY: "auto",
                          display: "flex",
                          flexDirection: "column",
                          gap: 28,
                          minWidth: 0,
                        }}
                      >
                        {/* Error banner */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              style={{
                                background: "rgba(244,63,94,0.1)",
                                border: "1px solid rgba(244,63,94,0.3)",
                                borderRadius: 14,
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                color: "#FB7185",
                                fontSize: 13,
                                fontWeight: 600,
                                fontFamily: "'Hind Siliguri', sans-serif",
                              }}
                            >
                              <span style={{ fontSize: 16 }}>⚠️</span>
                              {error}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Customer info */}
                        <section>
                          <SectionHeader icon="👤" label="আপনার তথ্য" color={ACCENT.amber} />
                          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                              <FloatingInput
                                id="checkout-name"
                                label="পূর্ণ নাম"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="আপনার নাম লিখুন"
                                required
                                icon="👤"
                                accentColor={ACCENT.amber}
                              />
                              <FloatingInput
                                id="checkout-phone"
                                label="ফোন (ঐচ্ছিক)"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="০১৭..."
                                icon="📞"
                                accentColor={ACCENT.amber}
                              />
                            </div>
                            <FloatingInput
                              id="checkout-email"
                              label="ইমেইল"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="আপনার ইমেইল ঠিকানা"
                              required
                              icon="📧"
                              accentColor={ACCENT.amber}
                            />
                            <FloatingTextarea
                              id="checkout-notes"
                              label="বিশেষ নির্দেশনা (ঐচ্ছিক)"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="ব্যাচ, রোল, বিভাগ বা বিশেষ কোনো অনুরোধ..."
                              icon="📝"
                              accentColor={ACCENT.amber}
                            />
                          </div>
                        </section>

                        {/* Payment method */}
                        <section>
                          <SectionHeader icon="💳" label="পেমেন্ট পদ্ধতি" color={ACCENT.crimson} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[
                              { id: "ক্যাশ",   emoji: "💵", label: "ক্যাশ",   sub: "স্টলে সরাসরি",   color: ACCENT.amber   },
                              { id: "অনলাইন", emoji: "📱", label: "অনলাইন", sub: "বিকাশ / নগদ",    color: ACCENT.crimson },
                            ].map((m) => {
                              const isSelected = paymentMethod === m.id;
                              return (
                                <motion.button
                                  key={m.id}
                                  type="button"
                                  onClick={() => setPaymentMethod(m.id)}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.97 }}
                                  style={{
                                    padding: "18px 12px",
                                    borderRadius: 18,
                                    border: `2px solid ${isSelected ? m.color : "rgba(255,255,255,0.07)"}`,
                                    background: isSelected ? `${m.color}18` : "rgba(255,255,255,0.03)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 6,
                                    position: "relative",
                                    transition: "all 0.25s ease",
                                    boxShadow: isSelected ? `0 4px 20px ${m.color}28` : "none",
                                  }}
                                >
                                  {isSelected && (
                                    <span style={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                      width: 18,
                                      height: 18,
                                      borderRadius: "50%",
                                      background: m.color,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 10,
                                    }}>
                                      ✓
                                    </span>
                                  )}
                                  <span style={{ fontSize: 28 }}>{m.emoji}</span>
                                  <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? m.color : "rgba(255,255,255,0.7)", fontFamily: "'Hind Siliguri', sans-serif" }}>
                                    {m.label}
                                  </span>
                                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Hind Siliguri', sans-serif" }}>{m.sub}</span>
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* bKash / Nagad numbers */}
                          <AnimatePresence>
                            {paymentMethod === "অনলাইন" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                style={{ overflow: "hidden" }}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                  {[
                                    { label: "bKash", number: "01748269350", color: "#E2136E", emoji: "💎" },
                                    { label: "Nagad",  number: "01748269350", color: "#F7941D", emoji: "🔥" },
                                  ].map((p) => (
                                    <div
                                      key={p.label}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background: `${p.color}12`,
                                        border: `1px solid ${p.color}30`,
                                        borderRadius: 14,
                                        padding: "12px 16px",
                                      }}
                                    >
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 20 }}>{p.emoji}</span>
                                        <div>
                                          <p style={{ fontSize: 10, fontWeight: 800, color: p.color, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{p.label}</p>
                                          <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "1px", fontVariantNumeric: "tabular-nums" }}>{p.number}</p>
                                        </div>
                                      </div>
                                      <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                          navigator.clipboard.writeText(p.number);
                                          setCopiedType(p.label);
                                          setTimeout(() => setCopiedType(null), 2200);
                                        }}
                                        style={{
                                          padding: "7px 14px",
                                          borderRadius: 100,
                                          border: "none",
                                          background: copiedType === p.label ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.1)",
                                          color: copiedType === p.label ? "#10B981" : "rgba(255,255,255,0.6)",
                                          fontSize: 11,
                                          fontWeight: 800,
                                          cursor: "pointer",
                                          transition: "all 0.2s",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {copiedType === p.label ? "✓ কপি হয়েছে" : "কপি করুন"}
                                      </motion.button>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </section>
                      </div>

                      {/* RIGHT — Order summary */}
                      <div
                        style={{
                          width: 320,
                          flexShrink: 0,
                          borderLeft: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.02)",
                          padding: "28px 22px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 0,
                          overflowY: "auto",
                        }}
                        className="checkout-summary"
                      >
                        <SectionHeader icon="🛒" label="আপনার অর্ডার" color={ACCENT.amber} />

                        {/* Items list */}
                        <div style={{ flex: 1, overflowY: "auto", maxHeight: 300, paddingRight: 4, marginBottom: 20 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {items.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  background: "rgba(255,255,255,0.03)",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                  borderRadius: 13,
                                  padding: "10px 14px",
                                  gap: 10,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                                  <span style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "50%",
                                    background: "rgba(245,158,11,0.15)",
                                    border: "1px solid rgba(245,158,11,0.25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 11,
                                    fontWeight: 900,
                                    color: "#F59E0B",
                                    flexShrink: 0,
                                  }}>
                                    {item.quantity}
                                  </span>
                                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Hind Siliguri', sans-serif" }}>
                                    {item.name}
                                  </p>
                                </div>
                                <p style={{ fontSize: 13, color: "#F59E0B", fontWeight: 800, margin: 0, flexShrink: 0 }}>
                                  ৳{Math.round(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, marginBottom: 20 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>সাবটোটাল</span>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>৳{Math.round(getTotal())}</span>
                          </div>

                          <div
                            style={{
                              marginTop: 14,
                              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(244,63,94,0.1))",
                              border: "1px solid rgba(245,158,11,0.2)",
                              borderRadius: 16,
                              padding: "14px 16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.15em", margin: 0, fontFamily: "'Hind Siliguri', sans-serif" }}>মোট পরিমাণ</p>
                              <p style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-1px" }}>৳{Math.round(getTotal())}</p>
                            </div>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 700, alignSelf: "flex-end", marginBottom: 4 }}>BDT</span>
                          </div>
                        </div>

                        {/* Submit button */}
                        <motion.button
                          type="submit"
                          disabled={loading || !paymentMethod || !name || !email}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: 100,
                            border: "none",
                            background: (loading || !paymentMethod || !name || !email)
                              ? "rgba(255,255,255,0.08)"
                              : "linear-gradient(135deg, #F59E0B 0%, #E11D48 100%)",
                            color: (loading || !paymentMethod || !name || !email) ? "rgba(255,255,255,0.25)" : "#fff",
                            fontWeight: 900,
                            fontSize: 15,
                            cursor: (loading || !paymentMethod || !name || !email) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            boxShadow: (loading || !paymentMethod || !name || !email) ? "none" : "0 8px 28px rgba(225,29,72,0.35)",
                            transition: "all 0.3s",
                            fontFamily: "'Hind Siliguri', sans-serif",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {loading ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                              />
                              অর্ডার প্লেস হচ্ছে...
                            </>
                          ) : (
                            <>🚀 অর্ডার কনফার্ম করুন</>
                          )}
                        </motion.button>

                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 10, lineHeight: 1.5, fontFamily: "'Hind Siliguri', sans-serif" }}>
                          অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন
                        </p>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Responsive style for small screens */}
          <style>{`
            @media (max-width: 700px) {
              .checkout-summary {
                width: 100% !important;
                border-left: none !important;
                border-top: 1px solid rgba(255,255,255,0.06) !important;
                max-height: 320px;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
