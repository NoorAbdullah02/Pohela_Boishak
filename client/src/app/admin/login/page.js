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
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orbital elements */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
        >
          <div className="w-96 h-96 rounded-full border border-amber-500/10 absolute top-1/4 right-1/4" />
        </motion.div>

        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-amber-600/20 to-orange-600/10 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-red-600/20 to-amber-600/10 rounded-full blur-3xl"
        />

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md z-10"
      >
        {/* Glow effect behind card */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 60px rgba(217, 119, 6, 0.2)",
              "0 0 80px rgba(217, 119, 6, 0.3)",
              "0 0 60px rgba(217, 119, 6, 0.2)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-3xl"
        />

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="relative backdrop-blur-2xl bg-slate-900/50 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Gradient overlay in corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />

          {/* Header Section */}
          <div className="text-center mb-10">
            <motion.div
              variants={itemVariants}
              className="mb-4 relative inline-block"
            >
              {/* Icon with rotating border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border border-transparent bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-4xl"
                >
                  🔐
                </motion.span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              অ্যাডমিন অ্যাক্সেস
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-400 font-medium"
            >
              শুভ নববর্ষ — ICE বিভাগ স্টল
            </motion.p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-300 mb-2.5 tracking-wide">
                📧 ইমেইল ঠিকানা
              </label>
              <div className="relative group">
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yoursite.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-gray-600/30 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-orange-500/0 to-amber-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-xl" />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-300 mb-2.5 tracking-wide">
                🔑 পাসওয়ার্ড
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-gray-600/30 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors text-lg"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 backdrop-blur-sm"
              >
                <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              id="admin-login-btn"
              className="w-full relative mt-8 py-3.5 rounded-xl font-bold text-lg tracking-wide overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-6 py-3.5 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/30 group-hover:shadow-orange-500/40 transition-all duration-300">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span className="text-white">যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span className="text-white">লগইন করুন</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs text-gray-500 px-2 uppercase tracking-widest font-semibold">অথবা</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <p className="text-xs text-gray-400">প্রথমবার ভিজিট করছেন?</p>
            <motion.a
              href="/"
              whileHover={{ x: -8 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              মূল পেজে ফিরে যান
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating elements around card */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute -bottom-16 -right-16 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl"
        />
      </motion.div>

      {/* Keyboard shortcut hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium"
      >
        💡 টিপস: দ্রুত লগইন করতে এন্টার চাপুন
      </motion.div>
    </div>
  );
}