"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  foodAPI,
  orderAPI,
  authAPI,
  setAccessToken,
  getAccessToken,
} from "@/lib/api";

const ORDER_STATUSES = ["অপেক্ষমান", "নিশ্চিত", "সম্পন্ন", "বাতিল"];
const CATEGORIES = ["খাবার", "জুস", "কম্বো", "অন্যান্য"];

const statusConfig = {
  অপেক্ষমান: { icon: "⏳", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  নিশ্চিত: { icon: "✓", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  সম্পন্ন: { icon: "✓✓", color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
  বাতিল: { icon: "✕", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState(null);

  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("সব");
  const [orderSearch, setOrderSearch] = useState("");
  const [stats, setStats] = useState(null);

  const [items, setItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "খাবার",
    combo_items: "",
    sort_order: "0",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    const token = getAccessToken();
    if (!stored && !token) {
      router.push("/admin/login");
      return;
    }
    if (stored) setUser(JSON.parse(stored));
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        const { data } = await authAPI.refresh();
        setAccessToken(data.accessToken);
      }
      loadData();
    } catch {
      router.push("/admin/login");
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, itemsRes, statsRes] = await Promise.all([
        orderAPI.getAll({ limit: 100 }),
        foodAPI.getAll(),
        orderAPI.getStats(),
      ]);
      setOrders(ordersRes.data.orders);
      setItems(itemsRes.data.items);
      setStats(statsRes.data);
    } catch (err) {
      console.error("ডাটা লোড সমস্যা:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch { }
    setAccessToken(null);
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  const handleStockToggle = async (itemId) => {
    try {
      const { data } = await foodAPI.toggleStock(itemId);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? data.item : i))
      );
    } catch (err) {
      alert("স্টক আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("আপনি কি নিশ্চিত এই আইটেমটি মুছে ফেলতে চান?")) return;
    try {
      await foodAPI.delete(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      alert("আইটেম মুছতে সমস্যা হয়েছে।");
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category: item.category,
      combo_items: item.combo_items ? item.combo_items.join(", ") : "",
      sort_order: String(item.sort_order || 0),
    });
    setImageFile(null);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setEditItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "খাবার",
      combo_items: "",
      sort_order: "0",
    });
    setImageFile(null);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("category", formData.category);
      fd.append("sort_order", formData.sort_order);

      if (formData.combo_items) {
        fd.append(
          "combo_items",
          JSON.stringify(
            formData.combo_items.split(",").map((s) => s.trim())
          )
        );
      }

      if (imageFile) {
        fd.append("image", imageFile);
      }

      if (editItem) {
        fd.append("in_stock", String(editItem.in_stock));
        const { data } = await foodAPI.update(editItem.id, fd);
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? data.item : i))
        );
      } else {
        const { data } = await foodAPI.create(fd);
        setItems((prev) => [...prev, data.item]);
      }

      setShowAddForm(false);
      setEditItem(null);
    } catch (err) {
      alert(
        err.response?.data?.message || "আইটেম সেভ করতে সমস্যা হয়েছে।"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orderFilter === "সব"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

    if (orderSearch) {
      const search = orderSearch.toLowerCase();
      result = result.filter((o) =>
        o.customer_name.toLowerCase().includes(search) ||
        o.customer_email.toLowerCase().includes(search) ||
        o.order_number.toString().includes(search)
      );
    }
    return result;
  }, [orders, orderFilter, orderSearch]);

  const filteredItems = useMemo(() => {
    if (!itemSearch) return items;
    const search = itemSearch.toLowerCase();
    return items.filter((item) =>
      item.name.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  }, [items, itemSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white/10 border-t-[#ff6b35] rounded-full mx-auto"
          />
          <p className="text-[#ff6b35] font-semibold animate-pulse">ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-200 font-bangla relative max-w-[100vw] overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-[#ff6b35]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-[#e63946]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 glass border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e63946] flex items-center justify-center text-white font-bold shadow-lg shadow-[#ff6b35]/20">
              ⚙️
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">অ্যাডমিন প্যানেল</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Pohela Boishakh Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white glass px-4 py-2 flex-shrink-0 rounded-xl transition-all hover:bg-white/10"
            >
              🌐 সাইট ভিজিট
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex-shrink-0 rounded-xl transition-all"
            >
              লগআউট
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 relative z-10 transition-all duration-300">
        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
          >
            {[
              { label: "মোট অর্ডার", value: stats.totalOrders, icon: "📦", glow: "shadow-blue-500/20" },
              { label: "আজকের", value: stats.todayOrders, icon: "📅", glow: "shadow-green-500/20" },
              { label: "অপেক্ষমান", value: stats.pendingOrders, icon: "⏳", glow: "shadow-amber-500/20" },
              { label: "মোট আয়", value: `৳${Math.round(stats.totalRevenue)}`, icon: "💰", glow: "shadow-purple-500/20" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-strong p-5 sm:p-7 rounded-3xl flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between overflow-hidden relative group gap-4 border border-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <p className="text-xs sm:text-sm font-bold text-gray-200 mb-3 leading-loose tracking-wider uppercase">{stat.label}</p>
                  <p className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-lg">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl glass flex items-center justify-center text-xl sm:text-3xl shadow-xl relative z-10 ${stat.glow}`}>
                  {stat.icon}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-6 mb-12 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {[
            { key: "orders", label: "অর্ডার ম্যানেজমেন্ট", icon: "📦" },
            { key: "menu", label: "মেনু ম্যানেজমেন্ট", icon: "🍽️" },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-4 sm:px-8 sm:py-4 text-sm sm:text-lg font-bold flex items-center gap-3 rounded-t-2xl transition-all whitespace-nowrap snap-center ${
                activeTab === tab.key
                  ? "bg-gradient-to-t from-[#ff6b35]/20 to-transparent text-white border-b-4 border-[#ff6b35]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Orders Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Search & Filters */}
              <div className="flex flex-col xl:flex-row gap-6 justify-between bg-[#11111a]/80 p-5 sm:p-7 rounded-[2rem] glass border border-white/10">
                <div className="w-full xl:max-w-xl">
                  <input
                    type="text"
                    placeholder="🔍 অর্ডার নম্বর, নাম বা ইমেইল খুঁজুন..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="input-dark w-full px-5 py-4 text-base rounded-2xl"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 w-full sm:w-auto">
                    {["সব", ...ORDER_STATUSES].map((s) => (
                      <button
                        key={s}
                        onClick={() => setOrderFilter(s)}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                          orderFilter === s
                            ? "bg-gradient-to-r from-[#ff6b35] to-[#e63946] text-white shadow-xl shadow-orange-500/20"
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {s} <span className="opacity-70 text-[10px] hidden sm:inline ml-1">({s === "সব" ? orders.length : orders.filter((o) => o.status === s).length})</span>
                      </button>
                    ))}
                  </div>
                  <motion.button
                    onClick={loadData}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="h-14 px-6 sm:px-0 sm:w-14 rounded-2xl glass flex items-center justify-center text-gray-300 hover:text-white border border-white/10 ml-auto sm:ml-0 shadow-lg"
                  >
                    🔄
                  </motion.button>
                </div>
              </div>

              {/* Order Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
                <AnimatePresence>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="glass-strong rounded-[2rem] p-6 sm:p-8 hover:border-[#ff6b35]/50 transition-all duration-500 flex flex-col relative overflow-hidden group border border-white/5 will-change-transform shadow-lg"
                      >
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full ${statusConfig[order.status].bg.replace('/10', '/100')}`} />
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
                          <div className="flex-1 min-w-0">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-black bg-[#ff6b35]/20 text-[#ff6b35] mb-3 border border-[#ff6b35]/30">
                              #{order.order_number}
                            </span>
                            <h3 className="font-extrabold text-white text-lg sm:text-xl truncate group-hover:text-[#ff6b35] transition-colors mb-1">{order.customer_name}</h3>
                            <div className="space-y-2 mt-2">
                              <p className="text-xs sm:text-sm text-gray-200 truncate flex items-center gap-2 leading-relaxed">
                                <span className="text-amber-500 text-base">📧</span> {order.customer_email}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-200 truncate flex items-center gap-2 leading-relaxed">
                                <span className="text-amber-500 text-base">📞</span> {order.customer_phone}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-4">
                            <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">৳{Math.round(parseFloat(order.total_amount))}</p>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.payment_method === 'অনলাইন' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {order.payment_method}
                            </span>
                            <p className="text-[10px] text-gray-500 mt-2 font-medium">{new Date(order.created_at).toLocaleString("bn-BD", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</p>
                          </div>
                        </div>

                        <div className="flex-1 mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] sm:text-xs text-gray-300 font-black uppercase tracking-[0.15em] flex items-center gap-2">
                               <span className="w-4 h-px bg-white/30" /> আইটেমস
                            </p>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white font-bold border border-white/20">
                              {(typeof order.items === "string" ? JSON.parse(order.items) : order.items).length} টি আইটেম
                            </span>
                          </div>
                          <div className="space-y-2">
                            {(typeof order.items === "string" ? JSON.parse(order.items) : order.items).map((item, i) => (
                              <div key={i} className="flex justify-between items-center bg-white/10 border border-white/10 px-4 py-3 rounded-xl group/item hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                  <span className="text-[#ff6b35] font-black text-xs bg-[#ff6b35]/20 w-7 h-7 flex items-center justify-center rounded-lg">{item.quantity}</span>
                                  <span className="text-sm text-white font-bold truncate max-w-[150px] sm:max-w-[200px] leading-relaxed">{item.name}</span>
                                </div>
                                <span className="text-xs text-gray-300 font-mono font-bold tracking-wider">৳{Math.round(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          {order.notes && (
                            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <p className="text-[10px] text-amber-500 font-black uppercase tracking-wider mb-2">বিশেষ নোট:</p>
                              <p className="text-xs text-gray-400 italic leading-loose">{order.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/10">
                          <p className="text-[10px] text-gray-300 mb-4 font-black uppercase tracking-[0.15em] text-center">স্ট্যাটাস পরিবর্তন করুন</p>
                          <div className="flex flex-row gap-2 sm:gap-3 justify-between">
                            {ORDER_STATUSES.map((s) => {
                              const conf = statusConfig[s];
                              const isActive = order.status === s;
                              return (
                                <motion.button
                                  key={s}
                                  onClick={() => handleStatusChange(order.id, s)}
                                  whileTap={!isActive ? { scale: 0.95 } : {}}
                                  disabled={isActive}
                                  className={`py-3 px-1 sm:px-4 rounded-2xl text-[10px] sm:text-xs font-black transition-all flex flex-col items-center gap-2 border flex-1 ${
                                    isActive
                                      ? `${conf.bg} ${conf.color} ${conf.border} shadow-lg ring-2 ring-white/5`
                                      : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  <span className="text-xl">{conf.icon}</span>
                                  <span className="hidden md:inline-block leading-none">{s}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center glass-strong rounded-[2.5rem] border border-white/5">
                      <div className="text-7xl mb-6 opacity-20">📂</div>
                      <p className="text-2xl text-gray-500 font-bold uppercase tracking-widest leading-none">কোনো অর্ডার পাওয়া যায়নি</p>
                      <p className="text-gray-600 mt-4 font-medium">নতুন কোনো অর্ডারের অপেক্ষায় থাকুন</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
               <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center justify-between glass p-6 rounded-[2rem] border border-white/10 bg-[#11111a]/80">
                <div className="flex-1 w-full sm:max-w-xl">
                  <input
                    type="text"
                    placeholder="🔍 মেনু আইটেমের নাম খুঁজুন..."
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    className="input-dark w-full text-base py-4 px-6 rounded-2xl"
                  />
                </div>
                <motion.button
                  onClick={handleAddNew}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex items-center justify-center gap-3 px-8 py-4 rounded-2xl min-h-[56px] shadow-2xl shadow-orange-500/20"
                >
                  <span className="text-2xl leading-none">➕</span> <span className="text-base sm:text-lg font-black">নতুন আইটেম</span>
                </motion.button>
              </div>

              {/* Add/Edit Form Overlay */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -20 }}
                    className="glass-strong rounded-[2.5rem] p-6 sm:p-8 md:p-12 border border-[#ff6b35]/40 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden mb-12"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ff6b35] via-[#e63946] to-[#ff6b35] animate-gradient" />
                    <h3 className="text-2xl sm:text-4xl font-black text-white mb-10 flex items-center gap-4">
                       <span className="bg-[#ff6b35]/20 p-3 rounded-2xl">{editItem ? "✏️" : "➕"}</span> {editItem ? "আইটেম সম্পাদন" : "নতুন আইটেম যোগ করুন"}
                    </h3>
                    
                    <form onSubmit={handleSubmitForm} className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-3">
                          <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest">পণ্যের নাম <span className="text-[#ff6b35]">*</span></label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-dark py-4 px-6 rounded-2xl text-lg font-bold"
                            placeholder="যেমন: ইলিশ পান্তা"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest">দাম (৳) <span className="text-[#ff6b35]">*</span></label>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="input-dark py-4 px-6 rounded-2xl text-lg font-bold"
                            placeholder="যেমন: ২৫০"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest">বিবরণ</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="input-dark resize-none min-h-[120px] py-4 px-6 rounded-2xl text-base"
                          placeholder="খাবারের আকর্ষণীয় বিবরণ লিখুন..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="space-y-3">
                          <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest">ক্যাটাগরি <span className="text-[#ff6b35]">*</span></label>
                          <div className="relative">
                            <select
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="input-dark appearance-none py-4 px-6 rounded-2xl w-full font-bold cursor-pointer"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c} value={c} className="bg-[#1a1a2e] text-white py-2">{c}</option>
                              ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest">সর্ট অর্ডার</label>
                          <input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                            className="input-dark py-4 px-6 rounded-2xl font-bold"
                            placeholder="যেমন: ১ (শীর্ষে দেখানোর জন্য)"
                          />
                        </div>
                        <div className="space-y-3 text-white">
                          <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest">আইটেম ছবি</label>
                          <div className="relative group/upload h-[58px]">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImageFile(e.target.files[0])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="input-dark h-full flex items-center justify-center gap-3 cursor-pointer border-dashed border-2 border-white/20 hover:border-[#ff6b35]/50 hover:bg-white/5 transition-all rounded-2xl overflow-hidden">
                              <span className="text-xl">{imageFile ? "✅" : "📸"}</span>
                              <span className="font-bold text-sm truncate px-2">{imageFile ? "ছবি নির্বাচিত" : "আপলোড করুন"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.category === "কম্বো" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-3"
                        >
                          <label className="block text-sm font-black text-gray-300 ml-1 uppercase tracking-widest mt-4">কম্বো আইটেমস (কমা দিয়ে লিখুন)</label>
                          <input
                            type="text"
                            value={formData.combo_items}
                            onChange={(e) => setFormData({ ...formData, combo_items: e.target.value })}
                            placeholder="ভেলপুরি, নিমকি, ফুলঝুরি পিঠা"
                            className="input-dark py-4 px-6 rounded-2xl font-medium"
                          />
                        </motion.div>
                      )}

                      <div className="flex flex-col-reverse sm:flex-row gap-5 pt-8 border-t border-white/10 mt-10">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditItem(null);
                          }}
                          className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 font-black transition-all w-full sm:w-auto text-center tracking-widest"
                        >
                          বাতিল
                        </button>
                        <motion.button
                          type="submit"
                          disabled={actionLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-primary w-full sm:flex-1 py-4 flex justify-center items-center gap-3 rounded-2xl shadow-xl shadow-orange-500/20"
                        >
                          {actionLoading && (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          )}
                          <span className="text-lg font-black tracking-widest">{editItem ? "আপডেট সংরক্ষণ করুন" : "আইটেম যুক্ত করুন"}</span>
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                <AnimatePresence>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="glass-strong rounded-[2.5rem] overflow-hidden group flex flex-col hover:border-[#ff6b35]/50 transition-all duration-500 border border-white/5 shadow-xl will-change-transform"
                      >
                        <div className="relative h-48 sm:h-56 w-full bg-[#11111a] overflow-hidden border-b border-white/5">
                          {item.image_url ? (
                            <img
                              src={item.image_url.startsWith('http') ? item.image_url : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '')}${item.image_url}`}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out opacity-70 group-hover:opacity-100"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-10 bg-gradient-to-br from-white/10 to-transparent">🍽️</div>
                          )}
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-xl border border-white/10 shadow-2xl">
                            <span className="text-[10px] sm:text-xs font-black text-[#ff6b35] tracking-[0.2em] uppercase">{item.category}</span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <motion.button
                              onClick={() => handleStockToggle(item.id)}
                              whileTap={{ scale: 0.9 }}
                              className={`px-3 py-2 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black rounded-xl backdrop-blur-xl border transition-all shadow-2xl ${
                                item.in_stock
                                  ? "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
                              }`}
                            >
                              {item.in_stock ? "🟢 ইন-স্টক" : "🔴 আউট-স্টক"}
                            </motion.button>
                          </div>
                        </div>

                        <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-10">
                          <h3 className="text-lg sm:text-2xl font-black text-white mb-3 line-clamp-1 group-hover:text-[#ff6b35] transition-colors leading-tight">{item.name}</h3>
                          <p className="text-sm text-gray-200 line-clamp-3 mb-8 flex-1 leading-relaxed font-bold tracking-wide">{item.description}</p>
                          
                          <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                            <p className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-[#ff6b35]">৳{Math.round(parseFloat(item.price))}</p>
                            <div className="flex gap-2 sm:gap-3">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center glass-strong rounded-[3rem] border border-white/5 shadow-2xl">
                      <div className="text-7xl mb-6 opacity-10">🍽️</div>
                      <p className="text-2xl text-gray-600 font-black uppercase tracking-widest">খালি মেনু তালিকা</p>
                      <p className="text-gray-700 mt-4 font-bold">নতুন আইটেম যোগ করতে উপরের বাটনে ক্লিক করুন</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}