"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { authAPI, setAccessToken } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      setAccessToken(data.accessToken);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "লগইন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-stretch overflow-hidden"
      style={{ background: "#070614", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ─── Bokeh layer ─── */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* large ambient orbs */}
          {[
            { w: 700, h: 700, x: "-15%", y: "-20%", c: "rgba(245,158,11,0.07)", d: 20 },
            { w: 600, h: 600, x: "60%", y: "30%", c: "rgba(220,38,38,0.06)", d: 25 },
            { w: 400, h: 400, x: "20%", y: "60%", c: "rgba(245,158,11,0.05)", d: 18 },
          ].map((o, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: o.d, repeat: Infinity, ease: "easeInOut", delay: i * 3 }}
              style={{
                position: "absolute",
                width: o.w,
                height: o.h,
                left: o.x,
                top: o.y,
                background: `radial-gradient(circle, ${o.c}, transparent 70%)`,
                filter: "blur(40px)",
                borderRadius: "50%",
              }}
            />
          ))}

          {/* floating particles */}
          {mounted && [...Array(14)].map((_, i) => (
            <motion.div
              key={`p${i}`}
              animate={{ y: [0, -120, 0], x: [0, (i % 2 === 0 ? 1 : -1) * 20, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 7 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: i % 3 === 0 ? "#F59E0B" : i % 3 === 1 ? "#DC2626" : "#fff",
                left: `${6 + i * 6.5}%`,
                top: `${15 + (i % 5) * 15}%`,
                opacity: 0.3,
              }}
            />
          ))}

          {/* grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>
      )}

      {/* ─── LEFT hero panel (desktop only) ─── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: "48%", background: "linear-gradient(145deg, #0d0b22 0%, #130f35 60%, #1a0a0a 100%)", borderRight: "1px solid rgba(245,158,11,0.12)" }}
      >
        {/* decorative rings */}
        {[200, 340, 480].map((size, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 40 + i * 15, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px solid rgba(245,158,11,${0.08 - i * 0.02})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* center emblem */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "60px 48px" }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: "center" }}
          >
            {/* logo circle */}
            <motion.div
              animate={{ boxShadow: ["0 0 40px rgba(245,158,11,0.25)", "0 0 80px rgba(245,158,11,0.45)", "0 0 40px rgba(245,158,11,0.25)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(220,38,38,0.15))",
                border: "2px solid rgba(245,158,11,0.4)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                marginBottom: 32,
              }}
            >
              <img src="/images/depLogo.webp" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
            </motion.div>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 12,
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              শুভ নববর্ষ
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 40 }}
            >
              ১৪৩৩ · ICE বিভাগ
            </motion.p>

            {/* feature pills */}
            {["📦 অর্ডার ম্যানেজমেন্ট", "🍽️ মেনু কন্ট্রোল", "📧 ইমেইল নোটিফিকেশন"].map((f, i) => (
              <motion.div
                key={i}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.18)",
                  borderRadius: 100,
                  padding: "8px 20px",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 10,
                  marginRight: 6,
                  fontFamily: "'Hind Siliguri', sans-serif",
                }}
              >
                {f}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* bottom brand */}
        <div style={{ padding: "24px 48px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Pohela Boishakh Admin System · 2026
          </p>
        </div>
      </div>

      {/* ─── RIGHT login panel ─── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          {/* mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <motion.div
              animate={{ boxShadow: ["0 0 30px rgba(245,158,11,0.2)", "0 0 60px rgba(245,158,11,0.4)", "0 0 30px rgba(245,158,11,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.15)",
                border: "2px solid rgba(245,158,11,0.35)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                marginBottom: 16,
              }}
            >
              <img src="/images/depLogo.webp" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
            </motion.div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, letterSpacing: "0.2em" }}>POHELA BOISHAKH · ADMIN</p>
          </div>

          {/* Card */}
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(245,158,11,0)", "0 25px 80px rgba(245,158,11,0.1)", "0 0 0px rgba(245,158,11,0)"] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: 28,
              padding: "48px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* top accent line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: 2,
              background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
              borderRadius: 10,
            }} />

            {/* heading */}
            <div style={{ marginBottom: 36, textAlign: "center" }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                অ্যাডমিন লগইন
              </h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                আপনার শংসাপত্র দিয়ে প্রবেশ করুন
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* email */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                  ইমেইল ঠিকানা
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📧</span>
                  <input
                    type="email"
                    id="admin-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    style={{
                      width: "100%",
                      padding: "15px 18px 15px 48px",
                      borderRadius: 100,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(245,158,11,0.6)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                  পাসওয়ার্ড
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "15px 52px 15px 48px",
                      borderRadius: 100,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(245,158,11,0.6)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    style={{
                      background: "rgba(220,38,38,0.12)",
                      border: "1px solid rgba(220,38,38,0.3)",
                      borderRadius: 16,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <p style={{ color: "#F87171", fontSize: 13, margin: 0, fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif" }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* submit — circle button */}
              <motion.button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  padding: "17px",
                  borderRadius: 100,
                  background: loading
                    ? "rgba(245,158,11,0.4)"
                    : "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #DC2626 100%)",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 8,
                  boxShadow: loading ? "none" : "0 8px 32px rgba(245,158,11,0.35)",
                  transition: "all 0.3s",
                  letterSpacing: "0.04em",
                  fontFamily: "'Hind Siliguri', sans-serif",
                }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      style={{ display: "inline-block", width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                    />
                    যাচাই করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <span>🚀</span> লগইন করুন
                  </>
                )}
              </motion.button>
            </form>

            {/* back link */}
            <div style={{ marginTop: 28, textAlign: "center" }}>
              <motion.a
                href="/"
                whileHover={{ x: -4 }}
                style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                ← মূল পেজে ফিরে যান
              </motion.a>
            </div>
          </motion.div>

          <p style={{ color: "rgba(255,255,255,0.15)", textAlign: "center", fontSize: 11, marginTop: 20, letterSpacing: "0.1em" }}>
            💡 এন্টার চেপে দ্রুত লগইন করুন
          </p>
        </motion.div>
      </div>
    </div>
  );
}