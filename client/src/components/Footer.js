"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        দ্রুত_লিঙ্ক: [
            { label: "মেনু", href: "#menu" },
            { label: "আমাদের সম্পর্কে", href: "#about" },
            { label: "যোগাযোগ করুন", href: "#contact" },
            { label: "অ্যাডমিন প্যানেল", href: "/admin/login" },
        ],
        সোশ্যাল_মিডিয়া: [
            { label: "ফেসবুক", href: "https://facebook.com", icon: "f" },
            { label: "ইনস্টাগ্রাম", href: "https://instagram.com", icon: "📸" },
            { label: "হোয়াটসঅ্যাপ", href: "https://wa.me", icon: "💬" },
        ],
    };

    return (
        <footer className="relative bg-slate-950/90 border-t border-white/10 backdrop-blur-lg mt-20 sm:mt-28 md:mt-36">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -bottom-1/2 -left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-t from-amber-600/10 to-transparent rounded-full blur-2xl"
                />
                <div
                    className="absolute -bottom-1/2 -right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-t from-orange-600/10 to-transparent rounded-full blur-2xl"
                />
            </div>

            <div className="relative z-10 w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
                {/* Main Footer Content */}
                <div className="py-12 sm:py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-3 sm:gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-md opacity-50" />
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-amber-500/40 overflow-hidden bg-[#0d0d20]">
                                    <img src="/images/depLogo.webp" alt="Department Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-gradient-gold leading-tight">
                                    শুভ নববর্ষ
                                </h3>
                                <p className="text-[10px] sm:text-xs text-amber-400/60 font-bold uppercase tracking-wider">ICE Department</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            নববর্ষের আনন্দে সুস্বাদু খাবর এবং পানীয় উপভোগ করুন।
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col gap-3 sm:gap-4"
                    >
                        <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                            দ্রুত লিঙ্ক
                        </h4>
                        <div className="space-y-2">
                            {footerLinks.দ্রুত_লিঙ্ক.map((link, idx) => (
                                <motion.a
                                    key={idx}
                                    href={link.href}
                                    whileHover={{ x: 3 }}
                                    className="text-gray-400 hover:text-amber-400 transition-colors text-xs sm:text-sm flex items-center gap-2"
                                >
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-500/60" />
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-3 sm:gap-4"
                    >
                        <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                            যোগাযোগ করুন
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start gap-2 sm:gap-3 group">
                                <span className="text-amber-400 text-base sm:text-lg flex-shrink-0">📍</span>
                                <div className="flex-1">
                                    <p className="text-gray-400 text-xs sm:text-sm leading-snug">
                                        ICE Department, University Campus
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 group">
                                <span className="text-amber-400 text-base sm:text-lg flex-shrink-0">📧</span>
                                <a
                                    href="mailto:info@pohela-boishak.com"
                                    className="text-gray-400 hover:text-amber-400 transition-colors text-xs sm:text-sm truncate"
                                >
                                    info@pohela-boishak.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 group">
                                <span className="text-amber-400 text-base sm:text-lg flex-shrink-0">📱</span>
                                <a
                                    href="tel:+8801234567890"
                                    className="text-gray-400 hover:text-amber-400 transition-colors text-xs sm:text-sm"
                                >
                                    +880 1234 567 890
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="py-4 sm:py-6 border-t border-white/10"
                >
                    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                        <span className="text-xs sm:text-sm text-gray-500">আমাদের অনুসরণ করুন:</span>
                        <div className="flex items-center gap-3 sm:gap-4">
                            {[
                                { icon: "f", label: "Facebook", href: "https://facebook.com" },
                                { icon: "📸", label: "Instagram", href: "https://instagram.com" },
                                { icon: "💬", label: "WhatsApp", href: "https://wa.me" },
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2, backgroundColor: "rgba(245, 158, 11, 0.15)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-400 hover:text-amber-400 transition-all shadow-lg"
                                    title={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <p className="text-gray-500 text-sm text-center sm:text-left">
                        © {currentYear} শুভ নববর্ষ - ICE Department. সর্বাধিকার সংরক্ষিত।
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-gray-500 hover:text-amber-400 text-sm transition-colors"
                        >
                            গোপনীয়তা নীতি
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-amber-400 text-sm transition-colors"
                        >
                            ব্যবহারের শর্তাবলী
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
