"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authAPI, setAccessToken } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex items-center justify-center px-4">
      {/* Rich Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Large Orb */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[30%] -right-[20%] w-[700px] h-[700px]"
        >
          <div className="w-full h-full rounded-full border border-[#ff6b35]/5" />
          <div className="w-[500px] h-[500px] rounded-full border border-[#ff6b35]/3 absolute top-1/4 left-1/4" />
          <div className="w-[300px] h-[300px] rounded-full border border-[#ff6b35]/2 absolute top-2/4 left-2/4" />
        </motion.div>

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] left-[10%] w-[400px] h-[400px]"
        >
          <div className="w-full h-full bg-gradient-radial from-[#ff6b35]/25 via-[#e63946]/15 to-transparent rounded-full blur-[80px]" />
        </motion.div>

        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px]"
        >
          <div className="w-full h-full bg-gradient-radial from-[#e63946]/20 via-[#ff6b35]/10 to-transparent rounded-full blur-[100px]" />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 rounded-full bg-[#ff6b35]/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Main Card Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-[460px] z-10"
      >
        {/* Glow Effect Behind */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 80px rgba(255,107,53,0.15), 0 0 120px rgba(230,57,70,0.1)",
              "0 0 100px rgba(255,107,53,0.25), 0 0 150px rgba(230,57,70,0.15)",
              "0 0 80px rgba(255,107,53,0.15), 0 0 120px rgba(230,57,70,0.1)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-[2.5rem]"
        />

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-[#0a0a1a]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 sm:p-12 border border-white/[0.08] shadow-2xl overflow-hidden"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-30">
            <div className="absolute top-8 right-8 w-px h-20 bg-gradient-to-b from-[#ff6b35] to-transparent" />
            <div className="absolute top-8 right-8 w-20 h-px bg-gradient-to-r from-[#ff6b35] to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 w-40 h-40 opacity-30">
            <div className="absolute bottom-8 left-8 w-px h-20 bg-gradient-to-t from-[#e63946] to-transparent" />
            <div className="absolute bottom-8 left-8 w-20 h-px bg-gradient-to-l from-[#e63946] to-transparent" />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute top-[-50%] right-[-30%] w-[400px] h-[400px] bg-gradient-radial from-[#ff6b35]/8 to-transparent rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-20%] w-[300px] h-[300px] bg-gradient-radial from-[#e63946]/6 to-transparent rounded-full blur-[50px] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              {/* Logo Badge */}
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-2xl border border-dashed border-[#ff6b35]/30"
                />
                <div className="relative w-22 h-22 mx-auto rounded-2xl bg-gradient-to-br from-[#ff6b35]/20 to-[#e63946]/10 flex items-center justify-center border border-[#ff6b35]/30 shadow-lg shadow-[#ff6b35]/20">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-5xl filter drop-shadow-lg"
                  >
                    🔐
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-black tracking-tight mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              অ্যাডমিন প্যানেল
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-500 font-medium"
            >
              Pohela Boishakh — Admin Access
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide flex items-center gap-2">
                <span className="text-base">📧</span> ইমেইল ঠিকানা
              </label>
              <div className="relative group">
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pohelaboishakh.com"
                  className="w-full px-5 py-4 rounded-2xl bg-[#111118]/80 border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/60 focus:bg-[#111118] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] transition-all duration-300 backdrop-blur-sm"
                  required
                />
                {/* Focus glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff6b35]/0 via-[#ff6b35]/5 to-[#ff6b35]/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-xl" />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide flex items-center gap-2">
                <span className="text-base">🔑</span> পাসওয়ার্ড
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-[#111118]/80 border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/60 focus:bg-[#111118] focus:shadow-[0_0_20px_rgba(255,107,53,0.15)] transition-all duration-300 backdrop-blur-sm pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ff6b35] transition-colors text-xl"
                >
                  {showPassword ? "���️" : "👁️‍🗨️"}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 backdrop-blur-sm"
              >
                <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              disabled={loading}
              id="admin-login-btn"
              className="w-full relative mt-8 py-5 rounded-2xl font-bold text-lg tracking-wide overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* Button glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] via-[#e63946] to-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              
              {/* Button background */}
              <div className="relative bg-gradient-to-r from-[#ff6b35] to-[#e63946] rounded-2xl px-6 py-5 flex items-center justify-center gap-3 shadow-lg shadow-[#ff6b35]/30 group-hover:shadow-[#ff6b35]/50 transition-all duration-300">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full"
                    />
                    <span className="text-white font-bold">যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🚀</span>
                    <span className="text-white font-bold">লগইন করুন</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 relative z-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-[0.2em]">অথবা</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center relative z-10">
            <p className="text-xs text-gray-500 mb-3">প্রথমবার ভিজিট করছেন?</p>
            <motion.a
              href="/"
              whileHover={{ x: -5 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              মূল পেজে ফিরে যান
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-36 h-36 bg-[#ff6b35]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-20 -right-20 w-44 h-44 bg-[#e63946]/8 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 font-medium"
      >
        💡 টিপস: দ্রুত লগইন করতে এন্টার চাপুন
      </motion.div>
    </div>
  );
}