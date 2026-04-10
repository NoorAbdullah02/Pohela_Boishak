"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  foodAPI,
  orderAPI,
  authAPI,
  setAccessToken,
  getAccessToken,
} from "@/lib/api";

/* ─── Constants ─────────────────────────────────────── */
const ACTION_STATUSES = ["অপেক্ষমান", "সম্পন্ন", "বাতিল"];
const CATEGORIES = ["খাবার", "জুস", "কম্বো", "অন্যান্য"];

const STATUS_CFG = {
  অপেক্ষমান: {
    label: "অপেক্ষমান",
    emoji: "⏳",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.35)",
    ring: "rgba(245,158,11,0.5)",
    text: "#FCD34D",
  },
  সম্পন্ন: {
    label: "সম্পন্ন",
    emoji: "✅",
    color: "#10B981",
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.35)",
    ring: "rgba(16,185,129,0.5)",
    text: "#6EE7B7",
  },
  বাতিল: {
    label: "বাতিল",
    emoji: "❌",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.15)",
    border: "rgba(220,38,38,0.35)",
    ring: "rgba(220,38,38,0.5)",
    text: "#FCA5A5",
  },
  নিশ্চিত: {
    label: "নিশ্চিত",
    emoji: "✓",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.35)",
    ring: "rgba(59,130,246,0.5)",
    text: "#93C5FD",
  },
};

/* ─── Utility component: Circular action button ───── */
function CircleBtn({ label, emoji, cfg, isActive, onClick, size = 64 }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={!isActive ? { scale: 1.12, y: -2 } : {}}
      whileTap={!isActive ? { scale: 0.92 } : {}}
      disabled={isActive}
      title={label}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${isActive ? cfg.border : "rgba(255,255,255,0.1)"}`,
        background: isActive ? cfg.bg : "rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: isActive ? "default" : "pointer",
        gap: 2,
        position: "relative",
        transition: "all 0.25s ease",
        boxShadow: isActive ? `0 0 20px ${cfg.ring}` : "none",
        flexShrink: 0,
      }}
    >
      {isActive && (
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: `2px solid ${cfg.color}`,
            pointerEvents: "none",
          }}
        />
      )}
      <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontSize: 9, color: isActive ? cfg.text : "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1, textAlign: "center", maxWidth: 52 }}>
        {label}
      </span>
    </motion.button>
  );
}

/* ─── Stat card ──────────────────────────────────── */
function StatCard({ label, value, icon, accentColor, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 22,
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        flex: "1 1 140px",
        minWidth: 130,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px" }}>{label}</p>
          <p style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-1px" }}>{value}</p>
        </div>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `rgba(${accentColor.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')},0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
          border: `1px solid rgba(${accentColor.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')},0.2)`,
        }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Order Card ─────────────────────────────────── */
function OrderCard({ order, onStatusChange }) {
  const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
  const cfg = STATUS_CFG[order.status] || STATUS_CFG["অপেক্ষমান"];
  const [updating, setUpdating] = useState(false);

  const handleAction = async (status) => {
    if (order.status === status || updating) return;
    setUpdating(true);
    await onStatusChange(order.id, status);
    setUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
        backdropFilter: "blur(20px)",
        transition: "border-color 0.3s",
      }}
      whileHover={{ borderColor: "rgba(245,158,11,0.2)" }}
    >
      {/* Top status stripe */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

      <div style={{ padding: "22px 24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 100,
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#F59E0B",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}>
              #{order.order_number}
            </span>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Hind Siliguri', sans-serif" }}>
              {order.customer_name}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              📧 {order.customer_email}
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: 0 }}>
              📞 {order.customer_phone}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: 12 }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#F59E0B", margin: "0 0 4px", lineHeight: 1 }}>
              ৳{Math.round(parseFloat(order.total_amount))}
            </p>
            <span style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 100,
              background: order.payment_method === "অনলাইন" ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)",
              border: `1px solid ${order.payment_method === "অনলাইন" ? "rgba(59,130,246,0.3)" : "rgba(16,185,129,0.3)"}`,
              color: order.payment_method === "অনলাইন" ? "#93C5FD" : "#6EE7B7",
              fontSize: 10,
              fontWeight: 700,
            }}>
              {order.payment_method}
            </span>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, margin: "4px 0 0" }}>
              {new Date(order.created_at).toLocaleString("bn-BD", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 14px" }} />

        {/* Items */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 8px" }}>
            আইটেমস · {items.length} টি
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#F59E0B", flexShrink: 0 }}>
                    {item.quantity}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140, fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: "#F59E0B", fontWeight: 700, flexShrink: 0 }}>
                  ৳{Math.round(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,158,11,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>বিশেষ নোট</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, fontStyle: "italic", fontFamily: "'Hind Siliguri', sans-serif" }}>{order.notes}</p>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 16px" }} />

        {/* ═══ 3 CIRCLE ACTION BUTTONS ═══ */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em", textAlign: "center", margin: "0 0 12px" }}>
            স্ট্যাটাস পরিবর্তন করুন
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {ACTION_STATUSES.map((s) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <CircleBtn
                  label={s}
                  emoji={STATUS_CFG[s].emoji}
                  cfg={STATUS_CFG[s]}
                  isActive={order.status === s}
                  onClick={() => handleAction(s)}
                />
              </div>
            ))}
          </div>
          {updating && (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>
              আপডেট হচ্ছে...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Dashboard ─────────────────────────────── */
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
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "খাবার", combo_items: "", sort_order: "0" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [newOrderCount, setNewOrderCount] = useState(0); // badge dot in nav
  const ordersRef = useRef([]); // track latest fetched orders for diff
  const pollRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    const token = getAccessToken();
    if (!stored && !token) { router.push("/admin/login"); return; }
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
        orderAPI.getAll({ limit: 150 }),
        foodAPI.getAll(),
        orderAPI.getStats(),
      ]);
      setOrders(ordersRes.data.orders);
      ordersRef.current = ordersRes.data.orders;
      setItems(itemsRes.data.items);
      setStats(statsRes.data);
    } catch (err) {
      console.error("ডাটা লোড সমস্যা:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Silent poll — fetch only orders+stats, no loading spinner
  const silentPoll = useCallback(async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        orderAPI.getAll({ limit: 150 }),
        orderAPI.getStats(),
      ]);
      const fresh = ordersRes.data.orders;
      const prev = ordersRef.current;
      const newCount = fresh.length - prev.length;
      if (newCount > 0) {
        // New orders detected!
        showToast(`🔔 ${newCount}টি নতুন অর্ডার এসেছে!`, "new");
        setNewOrderCount((c) => c + newCount);
      }
      ordersRef.current = fresh;
      setOrders(fresh);
      setStats(statsRes.data);
    } catch {
      // silent — don't break UI on poll error
    }
  }, []);

  // Start/stop polling when authenticated
  useEffect(() => {
    const POLL_INTERVAL = 15000; // 15 seconds
    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(() => {
        if (!document.hidden) silentPoll();
      }, POLL_INTERVAL);
    };
    startPolling();
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [silentPoll]);

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    setAccessToken(null);
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      showToast(`অর্ডার "${newStatus}" করা হয়েছে ✓`);
      // refresh stats
      const statsRes = await orderAPI.getStats();
      setStats(statsRes.data);
    } catch {
      showToast("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।", "error");
    }
  };

  const handleStockToggle = async (itemId) => {
    try {
      const { data } = await foodAPI.toggleStock(itemId);
      setItems((prev) => prev.map((i) => (i.id === itemId ? data.item : i)));
    } catch {
      showToast("স্টক আপডেট করতে সমস্যা হয়েছে।", "error");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("আইটেমটি মুছে ফেলবেন?")) return;
    try {
      await foodAPI.delete(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast("আইটেম মুছে ফেলা হয়েছে।");
    } catch {
      showToast("আইটেম মুছতে সমস্যা হয়েছে।", "error");
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({ name: item.name, description: item.description || "", price: String(item.price), category: item.category, combo_items: item.combo_items ? item.combo_items.join(", ") : "", sort_order: String(item.sort_order || 0) });
    setImageFile(null);
    setShowAddForm(true);
  };

  const handleAddNew = () => {
    setEditItem(null);
    setFormData({ name: "", description: "", price: "", category: "খাবার", combo_items: "", sort_order: "0" });
    setImageFile(null);
    setShowAddForm(true);
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
      if (formData.combo_items) fd.append("combo_items", JSON.stringify(formData.combo_items.split(",").map((s) => s.trim())));
      if (imageFile) fd.append("image", imageFile);

      if (editItem) {
        fd.append("in_stock", String(editItem.in_stock));
        const { data } = await foodAPI.update(editItem.id, fd);
        setItems((prev) => prev.map((i) => (i.id === editItem.id ? data.item : i)));
      } else {
        const { data } = await foodAPI.create(fd);
        setItems((prev) => [...prev, data.item]);
      }
      setShowAddForm(false);
      setEditItem(null);
      showToast(editItem ? "আইটেম আপডেট হয়েছে ✓" : "নতুন আইটেম যোগ হয়েছে ✓");
    } catch (err) {
      showToast(err.response?.data?.message || "আইটেম সেভ করতে সমস্যা হয়েছে।", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orderFilter === "সব" ? orders : orders.filter((o) => o.status === orderFilter);
    if (orderSearch) {
      const s = orderSearch.toLowerCase();
      result = result.filter((o) => o.customer_name.toLowerCase().includes(s) || o.customer_email.toLowerCase().includes(s) || o.order_number.toString().includes(s));
    }
    return result;
  }, [orders, orderFilter, orderSearch]);

  const filteredItems = useMemo(() => {
    if (!itemSearch) return items;
    const s = itemSearch.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(s) || item.description?.toLowerCase().includes(s) || item.category.toLowerCase().includes(s));
  }, [items, itemSearch]);

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#070614", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ width: 72, height: 72, border: "3px solid rgba(245,158,11,0.15)", borderTopColor: "#F59E0B", borderRadius: "50%", margin: "0 auto 20px" }}
          />
          <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: "#F59E0B", fontWeight: 700, fontSize: 16, fontFamily: "'Hind Siliguri', sans-serif" }}>
            ডাটা লোড হচ্ছে...
          </motion.p>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "13px 18px",
    borderRadius: 100,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Hind Siliguri', Arial, sans-serif",
    transition: "border-color 0.3s",
  };
  const textareaStyle = {
    ...inputStyle,
    borderRadius: 18,
    resize: "none",
    minHeight: 110,
  };
  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 7,
  };

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "#070614", color: "#f0f0f0", fontFamily: "'Inter', 'Hind Siliguri', sans-serif", position: "relative" }}>

      {/* Ambient background */}
      <div style={{ position: "fixed", top: "-10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,38,38,0.05), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              background:
                toast.type === "error" ? "rgba(220,38,38,0.97)" :
                toast.type === "new"   ? "rgba(245,158,11,0.97)" :
                "rgba(16,185,129,0.97)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${
                toast.type === "error" ? "rgba(220,38,38,0.5)" :
                toast.type === "new"   ? "rgba(245,158,11,0.5)" :
                "rgba(16,185,129,0.5)"
              }`,
              borderRadius: 100,
              padding: "12px 24px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              fontFamily: "'Hind Siliguri', sans-serif",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TOP NAV ─── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(7,6,20,0.85)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <motion.div
              animate={{ boxShadow: ["0 0 0px rgba(245,158,11,0.3)", "0 0 20px rgba(245,158,11,0.5)", "0 0 0px rgba(245,158,11,0.3)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #DC2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}
            >
              <img src="/images/depLogo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
            </motion.div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>অ্যাডমিন প্যানেল</h1>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>Pohela Boishakh · ICE</p>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* New order live badge */}
            {newOrderCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => { setNewOrderCount(0); setActiveTab("orders"); setOrderFilter("সব"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  borderRadius: 100, padding: "7px 14px",
                  cursor: "pointer",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block", flexShrink: 0 }}
                />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", whiteSpace: "nowrap", fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {newOrderCount} নতুন অর্ডার
                </span>
              </motion.div>
            )}

            {/* Refresh circle btn */}
            <motion.button
              onClick={() => { loadData(); setNewOrderCount(0); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, rotate: 180 }}
              title="রিফ্রেশ"
              style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
            >
              🔄
            </motion.button>

            {/* Visit site circle btn */}
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="সাইট ভিজিট"
              style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
            >
              🌐
            </motion.button>

            {/* Logout circle btn */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="লগআউট"
              style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
            >
              🚪
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* ─ Stats Row ─ */}
        {stats && (
          <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
            <StatCard label="মোট অর্ডার"  value={stats.totalOrders}              icon="📦" accentColor="#3B82F6" delay={0.05} />
            <StatCard label="আজকের অর্ডার" value={stats.todayOrders}             icon="📅" accentColor="#10B981" delay={0.1}  />
            <StatCard label="অপেক্ষমান"    value={stats.pendingOrders}           icon="⏳" accentColor="#F59E0B" delay={0.15} />
            <StatCard label="মোট আয়"      value={`৳${Math.round(stats.totalRevenue)}`} icon="💰" accentColor="#A855F7" delay={0.2}  />
          </div>
        )}

        {/* ─ Tab Bar ─ */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { key: "orders", label: "অর্ডার ম্যানেজমেন্ট", icon: "📦" },
            { key: "menu",   label: "মেনু ম্যানেজমেন্ট",   icon: "🍽️" },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "11px 24px",
                borderRadius: 100,
                border: activeTab === tab.key ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.08)",
                background: activeTab === tab.key ? "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(220,38,38,0.15))" : "rgba(255,255,255,0.03)",
                color: activeTab === tab.key ? "#F59E0B" : "rgba(255,255,255,0.4)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: activeTab === tab.key ? "0 4px 20px rgba(245,158,11,0.15)" : "none",
                transition: "all 0.25s",
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </motion.button>
          ))}
        </div>

        {/* ═══════════ ORDERS TAB ═══════════ */}
        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div key="orders-tab" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>

              {/* Filter bar */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "14px 18px" }}>
                {/* Search */}
                <div style={{ flex: "1 1 240px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
                  <input
                    type="text"
                    placeholder="নাম, ইমেইল বা অর্ডার নম্বর..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 44 }}
                  />
                </div>

                {/* Filter pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["সব", ...ACTION_STATUSES].map((s) => {
                    const isActive = orderFilter === s;
                    const count = s === "সব" ? orders.length : orders.filter((o) => o.status === s).length;
                    const c = s !== "সব" ? STATUS_CFG[s] : null;
                    return (
                      <motion.button
                        key={s}
                        onClick={() => setOrderFilter(s)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 100,
                          border: isActive ? `1px solid ${c ? c.border : "rgba(255,255,255,0.3)"}` : "1px solid rgba(255,255,255,0.08)",
                          background: isActive ? (c ? c.bg : "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.03)",
                          color: isActive ? (c ? c.text : "#fff") : "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: "'Hind Siliguri', sans-serif",
                          transition: "all 0.2s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c && <span>{c.emoji}</span>}
                        {s}
                        <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "1px 7px", fontSize: 10 }}>{count}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Order cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
                <AnimatePresence>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                    ))
                  ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.2 }}>📂</div>
                      <p style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", fontWeight: 800, fontFamily: "'Hind Siliguri', sans-serif" }}>কোনো অর্ডার নেই</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ═══════════ MENU TAB ═══════════ */}
          {activeTab === "menu" && (
            <motion.div key="menu-tab" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>

              {/* Search + Add btn */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "14px 18px" }}>
                <div style={{ flex: "1 1 200px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
                  <input
                    type="text"
                    placeholder="মেনু আইটেম খুঁজুন..."
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 44 }}
                  />
                </div>
                <motion.button
                  onClick={handleAddNew}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 100,
                    background: "linear-gradient(135deg, #F59E0B, #DC2626)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 6px 24px rgba(245,158,11,0.3)",
                    whiteSpace: "nowrap",
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  ➕ নতুন আইটেম
                </motion.button>
              </div>

              {/* Add/Edit modal */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 24,
                      padding: "36px 32px",
                      marginBottom: 24,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #F59E0B, #DC2626)" }} />
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 28px", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Hind Siliguri', sans-serif" }}>
                      <span style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                        {editItem ? "✏️" : "➕"}
                      </span>
                      {editItem ? "আইটেম সম্পাদন" : "নতুন আইটেম"}
                    </h3>

                    <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                        <div>
                          <label style={labelStyle}>পণ্যের নাম *</label>
                          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="যেমন: ইলিশ পান্তা" required style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>দাম (৳) *</label>
                          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="যেমন: ২৫০" required style={inputStyle} />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>বিবরণ</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="খাবারের আকর্ষণীয় বিবরণ লিখুন..." style={textareaStyle} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
                        <div>
                          <label style={labelStyle}>ক্যাটাগরি *</label>
                          <div style={{ position: "relative" }}>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                              {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0f0d25" }}>{c}</option>)}
                            </select>
                            <span style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.4)" }}>▼</span>
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>সর্ট অর্ডার</label>
                          <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} placeholder="0" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>ছবি</label>
                          <div style={{ position: "relative", height: 48 }}>
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 2 }} />
                            <div style={{ ...inputStyle, height: "100%", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "0 18px" }}>
                              <span>{imageFile ? "✅" : "📸"}</span>
                              <span style={{ fontSize: 13 }}>{imageFile ? "নির্বাচিত" : "আপলোড করুন"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.category === "কম্বো" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <label style={labelStyle}>কম্বো আইটেমস</label>
                          <input type="text" value={formData.combo_items} onChange={(e) => setFormData({ ...formData, combo_items: e.target.value })} placeholder="ভেলপুরি, নিমকি, ফুলঝুরি পিঠা" style={inputStyle} />
                        </motion.div>
                      )}

                      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                        <button
                          type="button"
                          onClick={() => { setShowAddForm(false); setEditItem(null); }}
                          style={{ flex: 1, padding: "13px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          বাতিল
                        </button>
                        <motion.button
                          type="submit"
                          disabled={actionLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{ flex: 2, padding: "13px", borderRadius: 100, background: actionLoading ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #F59E0B, #DC2626)", border: "none", color: "#fff", fontWeight: 800, cursor: actionLoading ? "not-allowed" : "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: actionLoading ? "none" : "0 6px 24px rgba(245,158,11,0.25)", fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          {actionLoading && <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />}
                          {editItem ? "আপডেট সংরক্ষণ" : "আইটেম যুক্ত করুন"}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
                <AnimatePresence>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -4 }}
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.3s" }}
                      >
                        {/* Image */}
                        <div style={{ height: 170, background: "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" }}>
                          {item.image_url ? (
                            <img
                              src={item.image_url.startsWith("http") ? item.image_url : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace("/api", "")}${item.image_url}`}
                              alt={item.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "opacity 0.3s, transform 0.5s" }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, opacity: 0.1 }}>🍽️</div>
                          )}
                          {/* Category pill */}
                          <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: "#F59E0B", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {item.category}
                          </span>
                          {/* Stock toggle — circle btn */}
                          <motion.button
                            onClick={() => handleStockToggle(item.id)}
                            whileTap={{ scale: 0.88 }}
                            title="স্টক টগল"
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 12,
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: item.in_stock ? "rgba(16,185,129,0.85)" : "rgba(220,38,38,0.85)",
                              backdropFilter: "blur(10px)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                            }}
                          >
                            {item.in_stock ? "🟢" : "🔴"}
                          </motion.button>
                        </div>

                        {/* Info */}
                        <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Hind Siliguri', sans-serif" }}>{item.name}</h3>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 14px", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5, fontFamily: "'Hind Siliguri', sans-serif" }}>{item.description}</p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                            <span style={{ fontSize: 22, fontWeight: 900, color: "#F59E0B" }}>৳{Math.round(parseFloat(item.price))}</span>
                            <div style={{ display: "flex", gap: 8 }}>
                              {/* Edit circle btn */}
                              <motion.button
                                onClick={() => handleEditClick(item)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="সম্পাদন"
                                style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93C5FD", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s" }}
                              >
                                ✏️
                              </motion.button>
                              {/* Delete circle btn */}
                              <motion.button
                                onClick={() => handleDeleteItem(item.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="মুছুন"
                                style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#FCA5A5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s" }}
                              >
                                🗑️
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.15 }}>🍽️</div>
                      <p style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", fontWeight: 800, fontFamily: "'Hind Siliguri', sans-serif" }}>মেনু খালি</p>
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