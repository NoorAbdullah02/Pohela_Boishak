"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { orderAPI } from "@/lib/api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("নাম এবং ইমেইল পূরণ করুন।");
      return;
    }

    if (!paymentMethod) {
      setError("পেমেন্ট পদ্ধতি নির্বাচন করুন।");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: paymentMethod,
        notes: notes.trim(),
      };

      const { data } = await orderAPI.create(orderData);
      setOrderNumber(data.order.order_number);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(
        err.response?.data?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      setSuccess(false);
      setName("");
      setEmail("");
      setPhone("");
      setPaymentMethod("");
      setOrderNumber(null);
    }
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 xs:inset-2 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-slate-950 border border-white/10 rounded-none xs:rounded-2xl sm:rounded-3xl z-[90] overflow-hidden shadow-2xl flex flex-col"
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-12 text-center min-h-[500px] flex flex-col items-center justify-center h-full overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 100 }}
                  className="text-8xl mb-6"
                >
                  ✅
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-3 px-4">
                  অর্ডার সম্পন্ন!
                </h2>
                <p className="text-gray-400 mb-4 text-sm sm:text-lg">
                  আপনার অর্ডার সফলভাবে গৃহীত হয়েছে
                </p>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex flex-col items-center gap-4 w-full max-w-xs mb-6"
                >
                  <div className="w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-2xl px-4 sm:px-8 py-4 sm:py-6 backdrop-blur-sm">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-2 uppercase tracking-widest font-bold">অর্ডার নম্বর</p>
                    <p className="text-4xl xs:text-5xl font-black text-amber-400 font-mono">
                      {orderNumber}
                    </p>
                  </div>
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      এই নম্বরটি নোট করে রাখুন। স্টল ম্যানেজার এই নম্বর দিয়ে আপনার অর্ডার চেক করবেন।
                    </p>
                  </div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all text-sm sm:text-base"
                >
                  ঠিক আছে, মেনুতে ফিরি
                </motion.button>
              </motion.div>
            ) : (
              <>
                <div className="sticky top-0 flex items-center justify-between px-6 py-5 sm:px-8 border-b border-white/10 bg-slate-950/80 backdrop-blur-md z-30">
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                      <span className="text-3xl">🏮</span> চেকআউট
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Pohela Boishakh • Checkout</p>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row h-full">
                    
                    {/* Left: Customer Info & Payment */}
                    <div className="flex-1 p-5 sm:p-8 space-y-8 lg:max-h-full lg:overflow-y-auto custom-scrollbar">
                      {(error) && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-red-400 text-sm flex items-center gap-3">
                          <span>⚠️</span> {error}
                        </motion.div>
                      )}

                      {/* Customer Details */}
                      <section className="space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">👤</span>
                          <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">আপনার তথ্য</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase ml-1 block text-center sm:text-left">নাম *</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="আপনার পূর্ণ নাম"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-medium text-center sm:text-left"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase ml-1 block text-center sm:text-left">ফোন (ঐচ্ছিক)</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="০১৭... (ঐচ্ছিক)"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-medium text-center sm:text-left"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-gray-500 uppercase ml-1 block text-center sm:text-left">ইমেইল *</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="আপনার প্রাতিষ্ঠানিক বা পার্সোনাল ইমেইল"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-medium text-center sm:text-left"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-gray-500 uppercase ml-1 block text-center sm:text-left">অতিরিক্ত তথ্য</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="ব্যাচ, রোল, বিভাগ বা বিশেষ কোনো অনুরোধ..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-medium resize-none h-24 text-center sm:text-left"
                          />
                        </div>
                      </section>

                      {/* Payment Method */}
                      <section className="space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">💳</span>
                          <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">পেমেন্ট পদ্ধতি</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                          {[
                            { id: "cash", label: "ক্যাশ", emoji: "💵", desc: "স্টলে সরাসরি পেমেন্ট" },
                            { id: "online", label: "অনলাইন", emoji: "📱", desc: "বিকাশ বা নগদ" },
                          ].map((method) => (
                            <motion.button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id === "cash" ? "ক্যাশ" : "অনলাইন")}
                              whileHover={{ y: -2, border: '1px solid rgba(245, 158, 11, 0.4)' }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative p-4 sm:p-5 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all duration-300 ${(method.id === "cash" && paymentMethod === "ক্যাশ") || (method.id === "online" && paymentMethod === "অনলাইন")
                                ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                }`}
                            >
                              <span className="text-2xl sm:text-3xl mb-1">{method.emoji}</span>
                              <span className={`font-black text-xs sm:text-sm ${paymentMethod === (method.id === "cash" ? "ক্যাশ" : "অনলাইন") ? "text-amber-400" : "text-gray-400"}`}>{method.label}</span>
                              <span className="text-[9px] xs:text-[10px] text-gray-500 font-medium text-center">{method.desc}</span>
                              {paymentMethod === (method.id === "cash" ? "ক্যাশ" : "অনলাইন") && (
                                <span className="absolute top-2 right-2 text-amber-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* Right: Summary */}
                    <aside className="w-full lg:w-96 bg-white/[0.03] lg:bg-white/[0.02] p-6 sm:p-8 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10">
                      <div className="space-y-8 flex-1">
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.15em] flex items-center gap-2">
                               <span className="w-1.5 h-6 bg-amber-500 rounded-full" /> আপনার অর্ডার
                            </h3>
                            <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-gray-400">{items.length} আইটেম</span>
                          </div>
                          
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                              <div key={item.id} className="flex justify-between items-start gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-200 font-bold leading-tight">{item.name}</p>
                                  <p className="text-[11px] text-gray-500 font-black tracking-widest mt-1">পরিমাণ: {item.quantity} × ৳{Math.round(item.price)}</p>
                                </div>
                                <p className="text-sm font-black text-white">৳{Math.round(item.price * item.quantity)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                          <div className="flex justify-between items-center text-gray-500 text-[10px] xs:text-xs font-black uppercase tracking-widest">
                            <span>সাবটোটাল</span>
                            <span className="font-mono">৳{Math.round(getTotal())}</span>
                          </div>
                          <div className="pt-4 flex justify-between items-end border-t border-white/10">
                            <div>
                              <p className="text-[9px] xs:text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">মোট পরিমাণ</p>
                              <p className="text-3xl xs:text-4xl font-black text-white tracking-tight">৳{Math.round(getTotal())}</p>
                            </div>
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.1em] mb-1">BDT</span>
                          </div>
                        </div>

                        {/* Payment Info Contextual */}
                        <AnimatePresence mode="wait">
                          {paymentMethod === "অনলাইন" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pt-8 pb-4">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">দ্রুত পেমেন্ট করুন (Send Money)</p>
                              <div className="space-y-3">
                                {[
                                  { label: "bKash", number: "01789456123", icon: "💎" },
                                  { label: "Nagad", number: "01987654321", icon: "💥" }
                                ].map((p) => (
                                  <div key={p.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <span className="text-lg">{p.icon}</span>
                                      <div className="leading-tight">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{p.label}</p>
                                        <p className="text-sm font-black text-white font-mono">{p.number}</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(p.number);
                                        setCopiedType(p.label);
                                        setTimeout(() => setCopiedType(null), 2000);
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${copiedType === p.label ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                      {copiedType === p.label ? 'কপি হয়েছে' : 'কপি'}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="mt-8 sm:mt-12 space-y-4">
                        <motion.button
                          type="submit"
                          disabled={loading || !paymentMethod}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black py-5 rounded-2xl text-base shadow-xl hover:shadow-orange-500/20 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 group"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>অর্ডার প্লেস করুন <span className="group-hover:translate-x-1 transition-transform">→</span></>
                          )}
                        </motion.button>
                        <p className="text-[9px] text-gray-600 text-center font-bold tracking-tight px-4 leading-relaxed uppercase">অর্ডার প্লেস করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন।</p>
                      </div>
                    </aside>
                  </form>
                </div>

              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
