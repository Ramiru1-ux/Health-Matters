// MGR-011: SLA Compliance Stats with RAG indicators + CSV export
// MGR-012: Advanced wellbeing analytics — trend charts, service breakdown, org comparison
// Place this file at: FrontEnd/src/pages/DashBoards/ManagerDashboard/test-insights.jsx

import { useState } from "react";

// MGR-011: SLA data
const SLA_DATA = {
  withinSLA: 68,
  breached: 7,
  avgDaysToAssignment: 2.4,
  total: 75,
};

const SLA_BREACHED_LIST = [
  { id: "REF-008", employee: "T. Williams",  service: "Mental Health",       daysOver: 3, submitted: "20 Feb 2026" },
  { id: "REF-011", employee: "K. Singh",     service: "Physiotherapy",       daysOver: 1, submitted: "22 Feb 2026" },
  { id: "REF-015", employee: "M. Adams",     service: "Occupational Health", daysOver: 5, submitted: "18 Feb 2026" },
  { id: "REF-019", employee: "D. Thompson",  service: "Mental Health",       daysOver: 2, submitted: "25 Feb 2026" },
];

// MGR-012: Trend data for 3/6/12 months
const TREND_DATA = {
  "3 months": [
    { month: "Jan", referrals: 4 },
    { month: "Feb", referrals: 6 },
    { month: "Mar", referrals: 5 },
  ],
  "6 months": [
    { month: "Oct", referrals: 3 },
    { month: "Nov", referrals: 5 },
    { month: "Dec", referrals: 4 },
    { month: "Jan", referrals: 4 },
    { month: "Feb", referrals: 6 },
    { month: "Mar", referrals: 5 },
  ],
  "12 months": [
    { month: "Apr", referrals: 2 },
    { month: "May", referrals: 3 },
    { month: "Jun", referrals: 4 },
    { month: "Jul", referrals: 3 },
    { month: "Aug", referrals: 5 },
    { month: "Sep", referrals: 4 },
    { month: "Oct", referrals: 3 },
    { month: "Nov", referrals: 5 },
    { month: "Dec", referrals: 4 },
    { month: "Jan", referrals: 4 },
    { month: "Feb", referrals: 6 },
    { month: "Mar", referrals: 5 },
  ],
};

// MGR-012: Service breakdown (anonymised)
const SERVICE_BREAKDOWN = [
  { service: "Mental Health",         team: 40, org: 35 },
  { service: "Physiotherapy",         team: 30, org: 28 },
  { service: "Occupational Health",   team: 20, org: 25 },
  { service: "Nutrition & Wellbeing", team: 10, org: 12 },
];

// RAG indicator logic — MGR-011
function getRag(pct) {
  if (pct >= 80) return { color: "#2e7d32", bg: "#e8f5e9", label: "GREEN", icon: "🟢" };
  if (pct >= 60) return { color: "#f57f17", bg: "#fff8e1", label: "AMBER", icon: "🟡" };
  return { color: "#c62828", bg: "#fce4ec", label: "RED", icon: "🔴" };
}

// Simple bar chart component
function BarChart({ data, height = 180 }) {
  const max = Math.max(...data.map(d => d.referrals));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, paddingBottom: 28, position: "relative" }}>
      {/* Y-axis guide lines */}
      {[0, 25, 50, 75, 100].map(pct => (
        <div key={pct} style={{ position: "absolute", left: 0, right: 0, bottom: 28 + (pct / 100) * (height - 28), borderTop: "1px dashed #f0f0f0", zIndex: 0 }} />
      ))}
      {data.map((d, i) => {
        const barH = max > 0 ? ((d.referrals / max) * (height - 44)) : 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", marginBottom: 4 }}>{d.referrals}</div>
            <div style={{
              width: "100%", maxWidth: 36, height: barH,
              background: "linear-gradient(180deg, #C8102E 0%, #e53935 100%)",
              borderRadius: "4px 4px 0 0", minHeight: d.referrals > 0 ? 4 : 0,
              transition: "height 0.5s ease",
            }} />
            <div style={{ position: "absolute", bottom: -22, fontSize: 10, color: "#9098a9", fontWeight: 600, whiteSpace: "nowrap" }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}

// MGR-011: CSV export
function exportCSV(data) {
  const headers = ["Ref ID", "Employee", "Service", "Days Over SLA", "Submitted"];
  const rows = data.map(r => [r.id, r.employee, r.service, r.daysOver, r.submitted]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "sla-breached-referrals.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function Insights() {
  const [showBreached, setShowBreached] = useState(false);
  const [trendPeriod, setTrendPeriod] = useState("6 months");
  const [printMode, setPrintMode] = useState(false);

  const rag = getRag(Math.round((SLA_DATA.withinSLA / SLA_DATA.total) * 100));
  const slaPct = Math.round((SLA_DATA.withinSLA / SLA_DATA.total) * 100);
  const trendData = TREND_DATA[trendPeriod];

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>Insights & Analytics</h1>
          <p style={{ fontSize: 13, color: "#5a5f6e", marginTop: 4 }}>SLA compliance and wellbeing trends for your team. All data is anonymised.</p>
        </div>
        {/* MGR-012: Print/export */}
        <button className="no-print" onClick={() => window.print()} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #e4e6eb", background: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#5a5f6e" }}>
          🖨️ Print Report
        </button>
      </div>

      {/* ── MGR-011: SLA COMPLIANCE ── */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", marginBottom: 24, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>SLA Compliance</div>
            <div style={{ fontSize: 11, color: "#9098a9", marginTop: 2 }}>Based on referral assignment SLA targets</div>
          </div>
          {/* RAG badge */}
          <span style={{ background: rag.bg, color: rag.color, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
            {rag.icon} {rag.label}
          </span>
        </div>

        {/* MGR-011: Three KPI boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {[
            { label: "Within SLA", value: `${slaPct}%`, sub: `${SLA_DATA.withinSLA} of ${SLA_DATA.total} referrals`, color: "#2e7d32", bg: "#e8f5e9" },
            { label: "SLA Breached", value: SLA_DATA.breached, sub: "referrals exceeded target", color: "#c62828", bg: "#fce4ec" },
            { label: "Avg Days to Assignment", value: `${SLA_DATA.avgDaysToAssignment}`, sub: "days from submission", color: "#0d47a1", bg: "#e3f2fd" },
          ].map((k, i) => (
            <div key={i} style={{ padding: 22, borderRight: i < 2 ? "1px solid #e4e6eb" : "none", textAlign: "center" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "#9098a9", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#5a5f6e" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* SLA progress bar */}
        <div style={{ padding: "16px 22px", borderTop: "1px solid #e4e6eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5a5f6e" }}>SLA Compliance Rate</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: rag.color }}>{slaPct}%</span>
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: 6, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${slaPct}%`, background: rag.color, borderRadius: 6, transition: "width 0.8s ease" }} />
          </div>
        </div>

        {/* MGR-011: Drilldown to breached referrals */}
        <div style={{ padding: "12px 22px", borderTop: "1px solid #e4e6eb", display: "flex", gap: 10, justifyContent: "flex-end" }} className="no-print">
          <button onClick={() => setShowBreached(!showBreached)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fce4ec", color: "#c62828", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {showBreached ? "Hide" : "View"} Breached Referrals ({SLA_DATA.breached})
          </button>
          <button onClick={() => exportCSV(SLA_BREACHED_LIST)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e4e6eb", background: "white", color: "#5a5f6e", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ⬇️ Export CSV
          </button>
        </div>

        {/* Breached referrals drilldown */}
        {showBreached && (
          <div style={{ borderTop: "1px solid #e4e6eb" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fff5f5" }}>
                  {["Ref ID", "Employee", "Service", "Days Over SLA", "Submitted"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#c62828", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #fce4ec" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLA_BREACHED_LIST.map(r => (
                  <tr key={r.id}>
                    <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: 12, color: "#9098a9", borderBottom: "1px solid #f5f5f5" }}>{r.id}</td>
                    <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #f5f5f5" }}>{r.employee}</td>
                    <td style={{ padding: "11px 16px", fontSize: 13, color: "#5a5f6e", borderBottom: "1px solid #f5f5f5" }}>{r.service}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #f5f5f5" }}>
                      <span style={{ background: "#fce4ec", color: "#c62828", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>+{r.daysOver} days</span>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#9098a9", borderBottom: "1px solid #f5f5f5" }}>{r.submitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MGR-012: ADVANCED ANALYTICS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* Referral volume trend chart */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Referral Volume Trend</div>
              <div style={{ fontSize: 11, color: "#9098a9", marginTop: 2 }}>Anonymised — no individual data</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["3 months", "6 months", "12 months"].map(p => (
                <button key={p} onClick={() => setTrendPeriod(p)} style={{
                  padding: "4px 10px", borderRadius: 6, border: `1px solid ${trendPeriod === p ? "#C8102E" : "#e4e6eb"}`,
                  background: trendPeriod === p ? "#C8102E" : "white", color: trendPeriod === p ? "white" : "#5a5f6e",
                  fontSize: 10, fontWeight: 700, cursor: "pointer",
                }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "20px 22px 8px" }}>
            <BarChart data={trendData} height={200} />
          </div>
        </div>

        {/* MGR-012: Service breakdown vs org average */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #e4e6eb" }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Service Breakdown vs Org Average</div>
            <div style={{ fontSize: 11, color: "#9098a9", marginTop: 2 }}>Your team compared to organisational average</div>
          </div>
          <div style={{ padding: "16px 22px" }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              {[["Your Team", "#C8102E"], ["Org Average", "#e4e6eb"]].map(([label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#5a5f6e" }}>{label}</span>
                </div>
              ))}
            </div>
            {SERVICE_BREAKDOWN.map(s => (
              <div key={s.service} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#111" }}>{s.service}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#9098a9", width: 70 }}>Your team</span>
                    <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 4, height: 7, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.team}%`, background: "#C8102E", borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", width: 32 }}>{s.team}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#9098a9", width: 70 }}>Org avg</span>
                    <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 4, height: 7, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.org}%`, background: "#bdbdbd", borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#9098a9", width: 32 }}>{s.org}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MGR-012: Summary stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Referrals (12mo)", value: "48", icon: "📋" },
          { label: "Avg Monthly Referrals",  value: "4.0", icon: "📈" },
          { label: "Most Common Service",    value: "Mental Health", icon: "🧠" },
          { label: "Completion Rate",         value: "87%", icon: "✅" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #e4e6eb", padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "#9098a9", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
