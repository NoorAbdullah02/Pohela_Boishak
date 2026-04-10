"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrolled(window.scrollY > 10);
      }, 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { label: "মেনু", href: "#menu" },
    { label: "আমাদের সম্পর্কে", href: "#about" },
    { label: "অ্যাডমিন", href: "/admin/login" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Animated gradient border */}
      <motion.div
        animate={{
          background: scrolled
            ? "linear-gradient(90deg, #ff6b35 0%, #f77f00 50%, #ff6b35 100%)"
            : "linear-gradient(90deg, #ff6b35 0%, #fcbf49 50%, #ff6b35 100%)",
        }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-[1px]"
      />

      {/* Subtle overlay */}
      <div className="absolute inset-0 opacity-[0.01] bg-white pointer-events-none" />

      <div className="relative w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Section */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35] to-[#fcbf49] rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 p-0.5 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-[#ff6b35]/30 overflow-hidden shadow-inner">
                <img src="/images/depLogo.webp" alt="ICE Department Logo" className="w-full h-full object-contain rounded-full drop-shadow-md" />
              </div>
            </div>
            <div className="flex flex-col leading-none sm:leading-tight">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base xs:text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-[#fcbf49] via-[#ff6b35] to-[#f77f00] bg-clip-text text-transparent"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "-0.01em",
                }}
              >
                শুভ নববর্ষ
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[#fcbf49]/70 uppercase tracking-[0.15em] sm:tracking-widest"
              >
                ICE বিভাগ
              </motion.p>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {links.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ color: "#ff6b35" }}
                className="relative text-sm font-medium text-gray-300 transition-colors group"
              >
                {link.label}
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-[#ff6b35] to-[#fcbf49] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                />
              </motion.a>
            ))}

            {/* Desktop Cart Button */}
            <motion.button
              id="cart-button-desktop"
              onClick={toggleCart}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors border border-white/10 hover:border-[#ff6b35]/30 group"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-300 group-hover:text-[#ff6b35] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                whileHover={{ rotate: -15 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </motion.svg>

              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-[#ff6b35] to-[#f77f00] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-[#ff6b35]/30"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden touch-target">
            {/* Mobile Cart Button */}
            <motion.button
              id="cart-button-mobile"
              onClick={toggleCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 sm:p-3 flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-br from-[#ff6b35] to-[#f77f00] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md shadow-[#ff6b35]/20"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 sm:p-3 flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-white/5 transition-colors"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative md:hidden border-t border-white/10"
          >
            <div className="backdrop-blur-lg bg-slate-950/95 px-4 py-8 space-y-4">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, color: "#ff6b35" }}
                  className="block py-4 px-6 text-center text-lg text-gray-300 hover:text-[#ff6b35] transition-all font-bold rounded-xl bg-white/5 border border-white/5 hover:border-[#ff6b35]/20 min-h-[56px] flex items-center justify-center shadow-lg"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}