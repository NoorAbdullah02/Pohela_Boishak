"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import CheckoutModal from "@/components/checkout/CheckoutModal";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace("/api", "");

const imgSrc = (url) =>
  url?.startsWith("http") ? url : `${API_BASE}${url}`;

export default function CartDrawer() {
  const items       = useCartStore((s) => s.items);
  const isOpen      = useCartStore((s) => s.isOpen);
  const closeCart   = useCartStore((s) => s.closeCart);
  const removeItem  = useCartStore((s) => s.removeItem);
  const updateQty   = useCartStore((s) => s.updateQuantity);
  const getTotal    = useCartStore((s) => s.getTotal);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            
            <motion.div
              key="cart-backdrop"
              className="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeCart}
            />

            
            <motion.div
              key="cart-drawer"
              className="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
             
              <div className="cart-drawer__mesh" aria-hidden="true" />

              <motion.div
                className="cart-header"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                <div className="cart-header__row">
                  <div className="cart-header__left">
                    <div className="cart-header__icon">🛒</div>
                    <div>
                      <h2 className="cart-header__title">আপনার কার্ট</h2>
                      <motion.p
                        key={items.length}
                        initial={{ opacity: 0, scale: 1.15 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="cart-header__count"
                      >
                        {items.length === 0 ? "খালি" : `${items.length}টি আইটেম`}
                      </motion.p>
                    </div>
                  </div>

                  {/* Close */}
                  <motion.button
                    id="close-cart-btn"
                    className="cart-header__close"
                    onClick={closeCart}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    aria-label="কার্ট বন্ধ করুন"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              {/* ── ITEMS ── */}
              <div className="cart-items">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    /* Empty state */
                    <motion.div
                      key="empty"
                      className="cart-empty"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                    >
                      <div className="cart-empty__icon-wrap">
                        <div className="cart-empty__halo" aria-hidden="true" />
                        <span className="cart-empty__emoji">🛒</span>
                      </div>
                      <h3 className="cart-empty__title">কার্ট খালি!</h3>
                      <p className="cart-empty__msg">
                        পছন্দের খাবার বা পণ্য যোগ করুন এবং উৎসব উপভোগ করুন।
                      </p>
                      <motion.button
                        className="cart-empty__btn"
                        onClick={closeCart}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        মেনু দেখুন →
                      </motion.button>
                    </motion.div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, scale: 0.96 }}
                        transition={{ type: "spring", damping: 22, stiffness: 260 }}
                      >
                        <div className="cart-item__inner">
                          {/* Thumbnail */}
                          <motion.div
                            className="cart-item__thumb"
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.image_url ? (
                              <img
                                src={imgSrc(item.image_url)}
                                alt={item.name}
                                loading="lazy"
                              />
                            ) : (
                              <span>🍽️</span>
                            )}
                          </motion.div>

                          {/* Content */}
                          <div className="cart-item__content">
                            <h4 className="cart-item__name">{item.name}</h4>
                            <p className="cart-item__price">৳{Math.round(item.price)}</p>

                            {/* Qty controls */}
                            <div className="cart-item__qty">
                              <motion.button
                                className="cart-item__qty-btn"
                                whileTap={{ scale: 0.82 }}
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                aria-label="পরিমাণ কমান"
                              >
                                −
                              </motion.button>
                              <span className="cart-item__qty-num">{item.quantity}</span>
                              <motion.button
                                className="cart-item__qty-btn"
                                whileTap={{ scale: 0.82 }}
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                aria-label="পরিমাণ বাড়ান"
                              >
                                +
                              </motion.button>
                            </div>
                          </div>

                          {/* Right: delete + subtotal */}
                          <div className="cart-item__right">
                            <motion.button
                              className="cart-item__delete"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              aria-label="আইটেম মুছুন"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>

                            <div className="cart-item__subtotal">
                              <span className="cart-item__subtotal-label">সর্বমোট</span>
                              <motion.span
                                key={item.price * item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="cart-item__subtotal-value"
                              >
                                ৳{Math.round(item.price * item.quantity)}
                              </motion.span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* ── FOOTER ── */}
              {items.length > 0 && (
                <motion.div
                  className="cart-footer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {/* Total breakdown */}
                  <div className="cart-total-box">
                    <div className="cart-total-row">
                      <span className="cart-total-label">পণ্য মূল্য</span>
                      <span className="cart-total-amount">৳{Math.round(getTotal())}</span>
                    </div>
                    <div className="cart-total-divider" />
                    <div className="cart-total-row">
                      <span className="cart-grand-label">সর্বমোট</span>
                      <motion.span
                        key={Math.round(getTotal())}
                        initial={{ scale: 1.18 }}
                        animate={{ scale: 1 }}
                        className="cart-grand-value"
                      >
                        ৳{Math.round(getTotal())}
                      </motion.span>
                    </div>
                  </div>

                  {/* Checkout button */}
                  <motion.button
                    id="checkout-btn"
                    className="cart-checkout-btn"
                    onClick={() => { closeCart(); setShowCheckout(true); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="cart-checkout-btn__bg" />
                    <div className="cart-checkout-btn__shine" aria-hidden="true" />
                    <span className="cart-checkout-btn__content">
                      <motion.span
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      >
                        🛍️
                      </motion.span>
                      চেকআউট সম্পূর্ণ করুন
                      <motion.svg
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </motion.svg>
                    </span>
                  </motion.button>

                  {/* Security badge */}
                  <p className="cart-secure-label">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    নিরাপদ পেমেন্ট নিশ্চিত
                  </p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}