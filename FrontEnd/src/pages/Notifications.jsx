// MGR-007: Notifications page — in-app notifications with deep links, read/unread state
// Place this file at: FrontEnd/src/pages/Notifications.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_NOTIFICATIONS = [
  { id: 1,  type: "completed",  title: "Referral Completed",       desc: "REF-001 for Sarah Johnson is complete. Outcome report now available.",         time: "Today 09:14",   unread: true,  refId: "REF-001" },
  { id: 2,  type: "appointed",  title: "Referral Appointed",       desc: "REF-002 for James Patel has been appointed to Dr. Ahmed (Physiotherapy).",     time: "Today 08:30",   unread: true,  refId: "REF-002" },
  { id: 3,  type: "appointed",  title: "Referral Appointed",       desc: "REF-005 for Priya Nair has been scheduled for 10 Mar 2026.",                   time: "Yesterday",     unread: false, refId: "REF-005" },
  { id: 4,  type: "submitted",  title: "Referral Submitted",       desc: "REF-004 for Michael Brown received by admin and awaiting triage.",             time: "Yesterday",     unread: false, refId: "REF-004" },
  { id: 5,  type: "submitted",  title: "Referral Submitted",       desc: "REF-003 for Emily Clarke is queued for admin triage.",                         time: "2 days ago",    unread: false, refId: "REF-003" },
  { id: 6,  type: "cancelled",  title: "Referral Cancelled",       desc: "REF-006 for Daniel Osei has been cancelled. Reason logged.",                   time: "3 days ago",    unread: false, refId: "REF-006" },
  { id: 7,  type: "sla",        title: "SLA Warning",              desc: "REF-003 is approaching its SLA deadline. Assignment required within 48 hours.", time: "3 days ago",    unread: false, refId: "REF-003" },
];

const TYPE_CONFIG = {
  completed: { icon: "✅", color: "#2e7d32", bg: "#e8f5e9", dot: "#2e7d32" },
  appointed:  { icon: "📅", color: "#0d47a1", bg: "#e3f2fd", dot: "#0d47a1" },
  submitted:  { icon: "📤", color: "#512da8", bg: "#ede7f6", dot: "#7b1fa2" },
  cancelled:  { icon: "❌", color: "#c62828", bg: "#fce4ec", dot: "#c62828" },
  sla:        { icon: "⚠️", color: "#e65100", bg: "#fff3e0", dot: "#f57f17" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.unread).length;

  // MGR-007: Mark as read on view
  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // MGR-007: Deep link to referral
  const handleClick = (n) => {
    markRead(n.id);
    navigate("/referrals");
  };

  const FILTERS = ["All", "Unread", "completed", "appointed", "submitted", "cancelled", "sla"];

  const filtered = notifications.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    return n.type === filter;
  });

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ background: "#C8102E", color: "white", fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#5a5f6e", marginTop: 4 }}>
            You are notified at every stage of your referrals — submitted, appointed, completed, and cancelled.
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e4e6eb", background: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#5a5f6e" }}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1px solid ${filter === f ? "#C8102E" : "#e4e6eb"}`,
            background: filter === f ? "#C8102E" : "white",
            color: filter === f ? "white" : "#5a5f6e",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid #e4e6eb", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Recent Alerts</span>
          <span style={{ fontSize: 12, color: "#9098a9" }}>{filtered.length} notification{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#9098a9", fontSize: 13 }}>No notifications found.</div>
        )}

        {filtered.map((n, i) => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.submitted;
          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "16px 22px",
                borderBottom: i < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
                background: n.unread ? "#fefafa" : "white",
                cursor: "pointer", transition: "background 0.12s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
              onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#fefafa" : "white"}
            >
              {/* Icon */}
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {cfg.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{n.title}</span>
                  {n.unread && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C8102E", display: "inline-block" }} />
                  )}
                  {n.type === "sla" && (
                    <span style={{ background: "#fff3e0", color: "#e65100", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>SLA WARNING</span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: "#5a5f6e", lineHeight: 1.5 }}>{n.desc}</div>
                {/* MGR-007: Deep link */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1a56db", marginTop: 6 }}>
                  View Referral {n.refId} →
                </div>
              </div>

              {/* Time + read indicator */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "#9098a9", whiteSpace: "nowrap" }}>{n.time}</span>
                {!n.unread && (
                  <span style={{ fontSize: 10, color: "#9098a9" }}>Read</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
