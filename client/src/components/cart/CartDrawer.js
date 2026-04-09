"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import CheckoutModal from "@/components/checkout/CheckoutModal";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Cart Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[92%] xs:w-full max-w-sm sm:max-w-md md:max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-white/10 z-[70] flex flex-col shadow-2xl overflow-hidden will-change-transform"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <pattern id="cart-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M0 0h40v40H0z" stroke="white" strokeWidth="0.5" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cart-pattern)" />
                </svg>
              </div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative z-20 border-b border-white/10 p-4 sm:p-6 md:p-8 bg-white/[0.02] backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0"
                    >
                      <span className="text-xl sm:text-2xl">🛒</span>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 tracking-tight truncate">
                        আপনার কার্ট
                      </h2>
                      <motion.p
                        key={items.length}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[10px] xs:text-xs sm:text-sm text-gray-400 font-medium mt-0.5 sm:mt-1"
                      >
                        {items.length === 0 ? "খালি" : `${items.length}টি আইটেম`}
                      </motion.p>
                    </div>
                  </div>
                  <motion.button
                    id="close-cart-btn"
                    onClick={closeCart}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center flex-shrink-0 min-w-[44px] min-h-[44px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              {/* Items Container */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-4 sm:space-y-5 relative z-10">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center h-80 sm:h-96 text-center space-y-4 sm:space-y-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl rounded-full w-32 sm:w-40 h-32 sm:h-40 mx-auto" />
                        <span className="text-5xl sm:text-7xl relative z-10 drop-shadow-2xl block">🛒</span>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-lg sm:text-2xl font-bold text-white">কার্ট খালি!</h3>
                        <p className="text-gray-400 text-xs sm:text-base max-w-xs leading-relaxed px-2">
                          আপনার পছন্দের খাবার যোগ করুন এবং উৎসব উদযাপন করুন।
                        </p>
                      </div>
                      <motion.button
                        onClick={closeCart}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 mt-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                      >
                        মেনু দেখুন →
                      </motion.button>
                    </motion.div>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={item.id}
                        className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                        <div className="relative z-10 p-4 sm:p-5 flex gap-4">
                          {/* Image */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg flex items-center justify-center text-2xl xs:text-3xl sm:text-4xl"
                          >
                            {item.image_url ? (
                              <img
                                src={item.image_url.startsWith('http') ? item.image_url : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '')}${item.image_url}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="drop-shadow-lg">🍽️</span>
                            )}
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            {/* Name and Price */}
                            <div className="space-y-1">
                              <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-xs group-hover:text-amber-300 transition-colors pl-1">
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-[11px] sm:text-xs text-gray-400 font-medium italic line-clamp-1 pl-1">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-amber-400 font-bold text-base sm:text-lg pt-1">
                                ৳{Math.round(item.price)}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center gap-2 bg-white/5 w-fit rounded-xl border border-white/10 p-1.5 mt-3"
                            >
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors font-bold text-base xs:text-lg"
                              >
                                −
                              </motion.button>
                              <span className="text-white font-bold text-xs xs:text-sm sm:text-base min-w-8 text-center tabular-nums">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors font-bold text-base xs:text-lg"
                              >
                                +
                              </motion.button>
                            </motion.div>
                          </div>

                          {/* Delete & Total */}
                          <div className="flex flex-col items-end justify-between gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="w-10 h-10 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center flex-shrink-0"
                              title="মুছে ফেলুন"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 font-medium mb-1">সর্বমোট</p>
                              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                                ৳{Math.round(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-20 border-t border-white/10 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 bg-slate-950/80 backdrop-blur-lg"
                >
                  {/* Price Breakdown */}
                  <div className="space-y-2 sm:space-y-3 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium text-xs sm:text-base">পণ্য মূল্য</span>
                      <span className="text-white font-bold text-sm sm:text-base">৳{Math.round(getTotal())}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 sm:pt-3">
                      <div className="flex justify-between items-end gap-2">
                        <span className="text-white font-bold text-base sm:text-lg md:text-2xl">সর্বমোট</span>
                        <motion.span
                          key={Math.round(getTotal())}
                          initial={{ scale: 1.2, color: "#fbbf24" }}
                          animate={{ scale: 1, color: "currentColor" }}
                          className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-sm"
                        >
                          ৳{Math.round(getTotal())}
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(217, 119, 6, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeCart();
                      setShowCheckout(true);
                    }}
                    id="checkout-btn"
                    className="group relative w-full py-4 sm:py-5 md:py-6 text-center rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-bold text-white overflow-hidden shadow-xl transition-all border border-amber-500/50 min-h-[44px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                    <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                      <motion.span
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🛍️
                      </motion.span>
                      চেকআউট সম্পূর্ণ করুন
                      <motion.svg
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </motion.svg>
                    </span>
                  </motion.button>

                  {/* Security Badge */}
                  <div className="text-center pt-1 sm:pt-2">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      নিরাপদ পেমেন্ট নিশ্চিত
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div >
          </>
        )
        }
      </AnimatePresence >

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}