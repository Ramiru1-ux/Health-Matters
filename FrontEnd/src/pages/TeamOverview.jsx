// MGR-009: Aggregated team health overview (anonymised, GDPR compliant)
// MGR-010: Count of team members with open referrals
// Place this file at: FrontEnd/src/pages/TeamOverview.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Anonymised aggregate data only — no individual health records (GDPR)
const TEAM_MEMBERS = [
  { id: "EMP-01", name: "Sarah Johnson",  dept: "Operations", hasActiveReferral: false },
  { id: "EMP-02", name: "James Patel",    dept: "Operations", hasActiveReferral: true  },
  { id: "EMP-03", name: "Emily Clarke",   dept: "Operations", hasActiveReferral: true  },
  { id: "EMP-04", name: "Michael Brown",  dept: "Operations", hasActiveReferral: true  },
  { id: "EMP-05", name: "Priya Nair",     dept: "Operations", hasActiveReferral: true  },
  { id: "EMP-06", name: "Daniel Osei",    dept: "Operations", hasActiveReferral: false },
];

// MGR-009: Anonymised aggregate stats by service type
const SERVICE_STATS = [
  { service: "Mental Health",       count: 8,  avgResolution: 4.2, pct: 40 },
  { service: "Physiotherapy",       count: 6,  avgResolution: 3.1, pct: 30 },
  { service: "Occupational Health", count: 4,  avgResolution: 5.8, pct: 20 },
  { service: "Nutrition & Wellbeing", count: 2, avgResolution: 2.5, pct: 10 },
];

const DATE_FILTERS = ["Last 30 days", "Last 3 months", "Last 6 months", "Last 12 months"];

const SERVICE_COLORS = ["#C8102E", "#1565c0", "#2e7d32", "#f57f17"];

function StatCard({ icon, label, value, sub, onClick, highlight }) {
  return (
    <div onClick={onClick} style={{
      background: highlight ? "#C8102E" : "white",
      color: highlight ? "white" : "#111",
      borderRadius: 12, border: `1px solid ${highlight ? "#C8102E" : "#e4e6eb"}`,
      padding: 22, boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.13s, box-shadow 0.13s",
      position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { if (onClick) e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", opacity: highlight ? 0.8 : 1, color: highlight ? "white" : "#9098a9", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: highlight ? 0.85 : 1, color: highlight ? "white" : "#5a5f6e" }}>{sub}</div>
      {onClick && <div style={{ position: "absolute", bottom: 14, right: 16, fontSize: 11, fontWeight: 700, opacity: 0.7 }}>→</div>}
    </div>
  );
}

export default function TeamOverview() {
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [showActiveList, setShowActiveList] = useState(false);
  const navigate = useNavigate();

  // MGR-010: count of members with open referrals
  const activeCount = TEAM_MEMBERS.filter(m => m.hasActiveReferral).length;
  const totalCount  = TEAM_MEMBERS.length;
  const referralRate = Math.round((activeCount / totalCount) * 100);

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>Team Overview</h1>
          <p style={{ fontSize: 13, color: "#5a5f6e", marginTop: 4 }}>
            Aggregated health engagement data. No individual health records are shown in compliance with GDPR.
          </p>
        </div>
        {/* Date filter — MGR-009 */}
        <div style={{ display: "flex", gap: 6 }}>
          {DATE_FILTERS.map(f => (
            <button key={f} onClick={() => setDateFilter(f)} style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${dateFilter === f ? "#C8102E" : "#e4e6eb"}`,
              background: dateFilter === f ? "#C8102E" : "white", color: dateFilter === f ? "white" : "#5a5f6e",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* MGR-010: Top stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Team Size" value={totalCount} sub="direct reports" />
        {/* MGR-010: Click to see who has active referrals */}
        <StatCard
          icon="📋" label="Active Referrals" value={activeCount}
          sub={`${activeCount} of ${totalCount} members`}
          onClick={() => setShowActiveList(!showActiveList)}
          highlight={true}
        />
        <StatCard icon="📊" label="Referral Rate" value={`${referralRate}%`} sub="of team referred" />
        <StatCard icon="✅" label="Completed" value="07" sub="this period" />
      </div>

      {/* MGR-010: Active referrals count panel — names shown but NOT conditions */}
      {showActiveList && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", marginBottom: 24, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e4e6eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Members with Active Referrals</span>
              <span style={{ fontSize: 11, color: "#9098a9", marginLeft: 10, background: "#f5f5f5", padding: "2px 8px", borderRadius: 10 }}>{activeCount} active</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* MGR-010: Quick link to submit new referral */}
              <button onClick={() => navigate("/submit-referral")} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#C8102E", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                + Submit Referral
              </button>
              <button onClick={() => setShowActiveList(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9098a9" }}>✕</button>
            </div>
          </div>
          <div style={{ padding: "8px 0" }}>
            <div style={{ padding: "8px 20px 6px", fontSize: 11, color: "#9098a9", fontWeight: 600, background: "#fafbfc", borderBottom: "1px solid #f0f0f0" }}>
              ℹ️ Health conditions and clinical details are not shown here — visible to practitioners only.
            </div>
            {TEAM_MEMBERS.filter(m => m.hasActiveReferral).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f9e8eb", color: "#C8102E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "#9098a9" }}>{m.dept}</div>
                </div>
                <span style={{ background: "#e3f2fd", color: "#0d47a1", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Active Referral</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MGR-009: Referrals by service type — anonymised aggregate */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb" }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Referrals by Service Type</div>
            <div style={{ fontSize: 11, color: "#9098a9", marginTop: 2 }}>Anonymised · {dateFilter}</div>
          </div>
          <div style={{ padding: "16px 22px" }}>
            {SERVICE_STATS.map((s, i) => (
              <div key={s.service} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.service}</span>
                  <span style={{ fontSize: 12, color: "#9098a9", fontWeight: 700 }}>{s.count} referrals</span>
                </div>
                <div style={{ background: "#f5f5f5", borderRadius: 4, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: SERVICE_COLORS[i], borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MGR-009: Average resolution time */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb" }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Avg. Resolution Time (Days)</div>
            <div style={{ fontSize: 11, color: "#9098a9", marginTop: 2 }}>Time from submission to completion · {dateFilter}</div>
          </div>
          <div style={{ padding: "16px 22px" }}>
            {SERVICE_STATS.map((s, i) => (
              <div key={s.service} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: SERVICE_COLORS[i], flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.service}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111", fontVariantNumeric: "tabular-nums" }}>{s.avgResolution}</div>
                <div style={{ fontSize: 11, color: "#9098a9" }}>days</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MGR-009: Team members table — referral status only, no health data */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Team Members</div>
          <div style={{ fontSize: 11, color: "#9098a9", background: "#f5f5f5", padding: "3px 10px", borderRadius: 10 }}>{totalCount} members</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafbfc" }}>
              {["Employee", "Department", "Referral Status", "Action"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#9098a9", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #e4e6eb" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEAM_MEMBERS.map(m => (
              <tr key={m.id}>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f9e8eb", color: "#C8102E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#5a5f6e", borderBottom: "1px solid #f5f5f5" }}>{m.dept}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                  {m.hasActiveReferral
                    ? <span style={{ background: "#e3f2fd", color: "#0d47a1", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Active Referral</span>
                    : <span style={{ fontSize: 12, color: "#9098a9" }}>No active referral</span>
                  }
                </td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                  <button onClick={() => navigate("/submit-referral")} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#f9e8eb", color: "#C8102E", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    Refer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
