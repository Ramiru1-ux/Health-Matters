// MGR-005, MGR-006, MGR-007, MGR-008
// Place this file at: FrontEnd/src/pages/Referrals.jsx

import { useState, useEffect } from "react";

const MOCK_REFERRALS = [
  { id: "REF-001", employee: "Sarah Johnson",  service: "Mental Health",       priority: "High",     status: "Completed", submitted: "01 Mar 2026", notes: "Workplace stress support needed." },
  { id: "REF-002", employee: "James Patel",    service: "Physiotherapy",       priority: "Standard", status: "Appointed", submitted: "03 Mar 2026", notes: "Back pain affecting productivity." },
  { id: "REF-003", employee: "Emily Clarke",   service: "Occupational Health", priority: "Standard", status: "Pending",   submitted: "04 Mar 2026", notes: "Return to work assessment." },
  { id: "REF-004", employee: "Michael Brown",  service: "Mental Health",       priority: "Urgent",   status: "Pending",   submitted: "05 Mar 2026", notes: "Wellbeing conversation flagged." },
  { id: "REF-005", employee: "Priya Nair",     service: "Physiotherapy",       priority: "High",     status: "Appointed", submitted: "06 Mar 2026", notes: "Repetitive strain injury." },
];

const STATUS_COLORS = {
  Pending:    { bg: "#fff8e1", color: "#f57f17" },
  Appointed:  { bg: "#e3f2fd", color: "#0d47a1" },
  Completed:  { bg: "#e8f5e9", color: "#1b5e20" },
  Cancelled:  { bg: "#fce4ec", color: "#880e4f" },
  Submitted:  { bg: "#ede7f6", color: "#512da8" },
};

const PRIORITY_COLORS = {
  Urgent:   { bg: "#fbe9e7", color: "#bf360c" },
  High:     { bg: "#fff3e0", color: "#e65100" },
  Standard: { bg: "#e8f5e9", color: "#2e7d32" },
  Low:      { bg: "#f1f8e9", color: "#558b2f" },
};

const Badge = ({ label, map }) => {
  const style = map[label] || { bg: "#f5f5f5", color: "#555" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px",
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: style.color, display: "inline-block" }} />
      {label}
    </span>
  );
};

// MGR-007: In-app notification system
function NotificationToast({ notifications, onDismiss }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 10 }}>
      {notifications.map((n) => (
        <div key={n.id} style={{
          background: "#fff", border: "1px solid #e4e6eb", borderRadius: 10,
          padding: "14px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "flex-start", gap: 12, minWidth: 320, maxWidth: 380,
          animation: "slideIn 0.3s ease",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: n.type === "completed" ? "#e8f5e9" : n.type === "cancelled" ? "#fce4ec" : "#e3f2fd",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>
            {n.type === "completed" ? "✅" : n.type === "cancelled" ? "❌" : "🔔"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 3 }}>{n.title}</div>
            <div style={{ fontSize: 12, color: "#5a5f6e", lineHeight: 1.4 }}>{n.message}</div>
            <button
              onClick={() => n.onView && n.onView()}
              style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "#1a56db", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              View Referral →
            </button>
          </div>
          <button onClick={() => onDismiss(n.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9098a9", padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      ))}
    </div>
  );
}

// MGR-008: Cancel modal with reason
function CancelModal({ referral, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (!reason.trim()) { setError(true); return; }
    onConfirm(referral.id, reason);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 14, width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ background: "#C8102E", padding: "20px 24px", color: "white" }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Cancel Referral</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>{referral.id} — {referral.employee}</div>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#f57f17", marginBottom: 20 }}>
            ⚠️ This action will cancel the referral. Both the employee and admin will be notified.
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#5a5f6e", display: "block", marginBottom: 6 }}>
              Cancellation Reason *
            </label>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setError(false); }}
              placeholder="Please provide a reason for cancelling this referral..."
              style={{
                width: "100%", padding: "10px 14px", border: `1.5px solid ${error ? "#C8102E" : "#e4e6eb"}`,
                borderRadius: 8, fontSize: 13, fontFamily: "inherit", minHeight: 100,
                resize: "vertical", outline: "none", boxSizing: "border-box",
              }}
            />
            {error && <div style={{ fontSize: 11, color: "#C8102E", marginTop: 4 }}>A cancellation reason is required.</div>}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e4e6eb", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              Keep Referral
            </button>
            <button onClick={handleConfirm} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#C8102E", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Referral detail modal (MGR-006)
function DetailModal({ referral, onClose, onCancel }) {
  const steps = [
    { label: "Referral Submitted",     done: true },
    { label: "Admin Triage",           done: ["Pending","Appointed","Completed","Cancelled"].includes(referral.status) },
    { label: "Practitioner Appointed", done: ["Appointed","Completed"].includes(referral.status) },
    { label: "Appointment Completed",  done: referral.status === "Completed" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: "#C8102E", padding: "20px 24px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{referral.id} — {referral.employee}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 3 }}>{referral.service} · {referral.priority} Priority</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          {[["Status", <Badge label={referral.status} map={STATUS_COLORS} />], ["Service", referral.service], ["Priority", <Badge label={referral.priority} map={PRIORITY_COLORS} />], ["Submitted", referral.submitted], ["Notes", referral.notes]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
              <span style={{ color: "#5a5f6e", fontWeight: 600 }}>{k}</span>
              <span style={{ fontWeight: 700, textAlign: "right", maxWidth: 260 }}>{v}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "#9098a9", margin: "18px 0 12px" }}>Referral Journey</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14, position: "relative" }}>
              {i < steps.length - 1 && <div style={{ position: "absolute", left: 10, top: 22, bottom: 0, width: 1, background: "#e4e6eb" }} />}
              <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, background: s.done ? "#C8102E" : "#e4e6eb", color: s.done ? "white" : "#9098a9", marginTop: 2 }}>
                {s.done ? "✓" : "·"}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.done ? "#111" : "#9098a9", paddingTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 24px", background: "#fafbfc", borderTop: "1px solid #e4e6eb", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {referral.status === "Pending" && (
            <button onClick={() => { onCancel(referral); onClose(); }} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#fce4ec", color: "#c62828", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
              Cancel Referral
            </button>
          )}
          <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #e4e6eb", background: "white", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Referrals() {
  const [referrals, setReferrals] = useState(MOCK_REFERRALS);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [notifications, setNotifications] = useState([]); // MGR-007

  // MGR-007: trigger notification when status changes
  const triggerNotification = (type, title, message, refId) => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      id, type, title, message,
      onView: () => {
        const ref = referrals.find(r => r.id === refId);
        if (ref) setSelected(ref);
        dismissNotification(id);
      }
    }]);
    setTimeout(() => dismissNotification(id), 6000);
  };

  const dismissNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // MGR-008: cancel referral with reason
  const handleCancel = (refId, reason) => {
    setReferrals(prev => prev.map(r => r.id === refId ? { ...r, status: "Cancelled", cancelReason: reason } : r));
    // MGR-007: trigger cancellation notification
    triggerNotification("cancelled", "Referral Cancelled", `${refId} has been cancelled. Admin and employee have been notified.`, refId);
  };

  const filters = ["All", "Pending", "Appointed", "Completed", "Cancelled"];
  const filtered = filter === "All" ? referrals : referrals.filter(r => r.status === filter);

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .ref-row:hover td { background: #fafbfc !important; }
        .ref-row td { transition: background 0.12s; }
      `}</style>

      {/* MGR-007: Notification toasts */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />

      {/* MGR-008: Cancel modal */}
      {cancelTarget && (
        <CancelModal referral={cancelTarget} onConfirm={handleCancel} onClose={() => setCancelTarget(null)} />
      )}

      {/* Detail modal */}
      {selected && !cancelTarget && (
        <DetailModal referral={selected} onClose={() => setSelected(null)} onCancel={(ref) => { setSelected(null); setCancelTarget(ref); }} />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>My Referrals</h1>
        <p style={{ fontSize: 13, color: "#5a5f6e", marginTop: 4 }}>Track, view and cancel referrals you have submitted for your team.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 8, border: `1px solid ${filter === f ? "#C8102E" : "#e4e6eb"}`,
            background: filter === f ? "#C8102E" : "white", color: filter === f ? "white" : "#5a5f6e",
            fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.13s",
          }}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>All Referrals</span>
          <span style={{ fontSize: 12, color: "#9098a9" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafbfc" }}>
                {["Ref ID", "Employee", "Service", "Priority", "Status", "Submitted", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#9098a9", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #e4e6eb", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#9098a9", fontSize: 13 }}>No referrals found.</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} className="ref-row">
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "#9098a9", borderBottom: "1px solid #f0f0f0" }}>{r.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #f0f0f0" }}>{r.employee}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#5a5f6e", borderBottom: "1px solid #f0f0f0" }}>{r.service}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}><Badge label={r.priority} map={PRIORITY_COLORS} /></td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}><Badge label={r.status} map={STATUS_COLORS} /></td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#9098a9", borderBottom: "1px solid #f0f0f0" }}>{r.submitted}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelected(r)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#f9e8eb", color: "#C8102E", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>View</button>
                      {/* MGR-008: Cancel only shown for Pending */}
                      {r.status === "Pending" && (
                        <button onClick={() => setCancelTarget(r)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#fce4ec", color: "#c62828", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
