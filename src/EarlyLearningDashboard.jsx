import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis
} from "recharts";

// ── DATA (UNICEF / UNESCO / World Bank published figures ~2022) ───────────────

const REGIONS = [
  "Sub-Saharan Africa",
  "South Asia",
  "East Asia & Pacific",
  "Middle East & N. Africa",
  "Latin America",
  "Europe & C. Asia",
  "North America",
];

// Pre-primary enrollment rate (% of children aged 3-6)
const ENROLLMENT = [
  { region: "Sub-Saharan Africa", rate: 26.4, color: "#C4714A" },
  { region: "South Asia", rate: 47.2, color: "#D4896A" },
  { region: "East Asia & Pacific", rate: 71.8, color: "#7A8C72" },
  { region: "Middle East & N. Africa", rate: 38.1, color: "#B8A898" },
  { region: "Latin America", rate: 74.3, color: "#C4908A" },
  { region: "Europe & C. Asia", rate: 82.6, color: "#7AA0B8" },
  { region: "North America", rate: 68.4, color: "#8A9E88" },
];

// Early literacy proficiency (% of children meeting minimum proficiency at end of primary)
const LITERACY = [
  { region: "Sub-Saharan Africa", rate: 19.4 },
  { region: "South Asia", rate: 38.2 },
  { region: "East Asia & Pacific", rate: 72.1 },
  { region: "Middle East & N. Africa", rate: 44.8 },
  { region: "Latin America", rate: 51.3 },
  { region: "Europe & C. Asia", rate: 88.4 },
  { region: "North America", rate: 91.2 },
];

// Government spending on pre-primary education (% of GDP)
const SPENDING = [
  { region: "Sub-Saharan Africa", rate: 0.3 },
  { region: "South Asia", rate: 0.4 },
  { region: "East Asia & Pacific", rate: 0.6 },
  { region: "Middle East & N. Africa", rate: 0.5 },
  { region: "Latin America", rate: 0.8 },
  { region: "Europe & C. Asia", rate: 0.7 },
  { region: "North America", rate: 0.4 },
];

// Pupil to teacher ratio in pre-primary (children per teacher)
const TEACHER_RATIO = [
  { region: "Sub-Saharan Africa", rate: 28.4 },
  { region: "South Asia", rate: 24.1 },
  { region: "East Asia & Pacific", rate: 18.7 },
  { region: "Middle East & N. Africa", rate: 19.2 },
  { region: "Latin America", rate: 16.8 },
  { region: "Europe & C. Asia", rate: 13.4 },
  { region: "North America", rate: 11.2 },
];

// Gender gap in enrollment (girls rate minus boys rate — positive = girls ahead)
const GENDER_GAP = [
  { region: "Sub-Saharan Africa", gap: -3.2 },
  { region: "South Asia", gap: -4.8 },
  { region: "East Asia & Pacific", gap: 1.2 },
  { region: "Middle East & N. Africa", gap: -2.1 },
  { region: "Latin America", gap: 2.4 },
  { region: "Europe & C. Asia", gap: 1.8 },
  { region: "North America", gap: 1.1 },
];

// Trend: pre-primary enrollment globally over time
const TREND = [
  { year: "2000", "Sub-Saharan Africa": 12, "South Asia": 28, "Global Avg": 33 },
  { year: "2005", "Sub-Saharan Africa": 16, "South Asia": 33, "Global Avg": 40 },
  { year: "2010", "Sub-Saharan Africa": 19, "South Asia": 38, "Global Avg": 46 },
  { year: "2015", "Sub-Saharan Africa": 22, "South Asia": 43, "Global Avg": 52 },
  { year: "2019", "Sub-Saharan Africa": 25, "South Asia": 46, "Global Avg": 56 },
  { year: "2022", "Sub-Saharan Africa": 26, "South Asia": 47, "Global Avg": 58 },
];

// Radar: composite scores (normalized 0-100, higher = better)
const RADAR_DATA = REGIONS.map((r, i) => ({
  region: r,
  "Enrollment": Math.round((ENROLLMENT[i].rate / 82.6) * 100),
  "Literacy": Math.round((LITERACY[i].rate / 91.2) * 100),
  "Spending": Math.round((SPENDING[i].rate / 0.8) * 100),
  "Class Size": Math.round(((28.4 - TEACHER_RATIO[i].rate) / (28.4 - 11.2)) * 100),
  "Gender Equity": Math.round(((GENDER_GAP[i].gap + 4.8) / 7.2) * 100),
}));

// Key stats
const STATS = [
  {
    icon: "📚",
    stat: "175M",
    label: "Children with no access",
    detail: "175 million children between 3 and 6 years old have no access to any form of pre-primary education."
  },
  {
    icon: "📉",
    stat: "26%",
    label: "Enrolled in Sub-Saharan Africa",
    detail: "One in four. That is how many children in Sub-Saharan Africa are in any kind of pre-primary program."
  },
  {
    icon: "⚖️",
    stat: "5 yrs",
    label: "When it matters most",
    detail: "90% of brain development happens before age 5. Miss this window and you are not just delaying learning — you are limiting it."
  },
  {
    icon: "💰",
    stat: "7x",
    label: "What early investment returns",
    detail: "James Heckman, Nobel economist, put a number on it: every dollar spent on early childhood education returns up to $7 in social and economic benefit."
  },
];

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F7F3EE;
    --sand: #EDE4D8;
    --sand-dark: #DDD0C0;
    --white: #FDFAF7;
    --terracotta: #C4714A;
    --terra-light: #D4896A;
    --terra-pale: #F0DDD3;
    --sage: #7A8C72;
    --sage-pale: #DDE4DA;
    --blush: #C4908A;
    --blush-pale: #F5EAE8;
    --gold: #C8A86A;
    --gold-pale: #F5EDDA;
    --sky: #7AA0B8;
    --sky-pale: #E0EDF5;
    --ink: #1E1B18;
    --ink-light: #4A4540;
    --ink-faint: #9A9088;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
  }

  .ela-root {
    max-width: 1080px;
    margin: 0 auto;
    padding: 2.5rem 2rem 5rem;
  }

  /* ── Header ── */
  .ela-header {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(196,113,74,0.15);
  }

  .ela-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 0.6rem;
  }

  .ela-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 400;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 0.6rem;
  }

  .ela-title em { font-style: italic; color: var(--terracotta); }

  .ela-subtitle {
    font-size: 0.88rem;
    color: var(--ink-faint);
    max-width: 580px;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .ela-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .ela-meta-item {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .ela-meta-item span { color: var(--sage); }

  /* ── Stat cards ── */
  .ela-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.06);
    margin-bottom: 2.5rem;
  }

  .ela-stat {
    background: var(--white);
    padding: 1.5rem;
    transition: background 0.2s;
  }

  .ela-stat:hover { background: var(--cream); }

  .ela-stat-icon { font-size: 1.2rem; margin-bottom: 0.6rem; }

  .ela-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--terracotta);
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .ela-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.5rem;
  }

  .ela-stat-detail {
    font-size: 0.75rem;
    color: var(--ink-faint);
    line-height: 1.55;
  }

  /* ── Tabs ── */
  .ela-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    overflow-x: auto;
    flex-wrap: wrap;
  }

  .ela-tab {
    padding: 0.6rem 1.25rem;
    background: var(--white);
    border: 1.5px solid rgba(0,0,0,0.1);
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .ela-tab:hover {
    border-color: var(--terracotta);
    color: var(--terracotta);
    background: var(--terra-pale);
  }

  .ela-tab.active {
    background: var(--terracotta);
    border-color: var(--terracotta);
    color: white;
    box-shadow: 0 3px 10px rgba(196,113,74,0.25);
  }

  /* ── Section ── */
  .ela-section { animation: fadeUp 0.35s ease; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ela-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 0.3rem;
  }

  .ela-section-desc {
    font-size: 0.8rem;
    color: var(--ink-faint);
    line-height: 1.65;
    max-width: 580px;
    margin-bottom: 1.25rem;
  }

  /* ── Chart boxes ── */
  .ela-chart-box {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.07);
    padding: 1.5rem 1.5rem 0.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }

  .ela-chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* ── Gender gap bar ── */
  .ela-gender-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .ela-gender-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 1rem;
    align-items: center;
  }

  .ela-gender-label {
    font-size: 0.75rem;
    color: var(--ink-light);
    text-align: right;
  }

  .ela-gender-bar-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ela-gender-center {
    width: 2px;
    height: 20px;
    background: rgba(0,0,0,0.15);
    flex-shrink: 0;
  }

  .ela-gender-bar {
    height: 20px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    font-size: 0.68rem;
    font-weight: 500;
    color: white;
    white-space: nowrap;
    min-width: 24px;
  }

  .ela-gender-bar.boys { background: var(--terracotta); }
  .ela-gender-bar.girls { background: var(--sage); }

  /* ── Radar grid ── */
  .ela-radar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .ela-radar-card {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.07);
    padding: 1rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }

  .ela-radar-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.25rem;
  }

  /* ── Writeup ── */
  .ela-writeup {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.07);
    border-left: 3px solid var(--terracotta);
    padding: 2rem 2.5rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }

  .ela-writeup-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 0.75rem;
  }

  .ela-writeup h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--ink);
    line-height: 1.3;
    margin-bottom: 1rem;
  }

  .ela-writeup p {
    font-size: 0.87rem;
    color: var(--ink-light);
    line-height: 1.85;
    margin-bottom: 1rem;
  }

  .ela-writeup p:last-child { margin-bottom: 0; }
  .ela-writeup strong { color: var(--ink); font-weight: 500; }

  .ela-findings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.25rem 0;
  }

  .ela-finding {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    background: var(--cream);
    border: 1px solid rgba(0,0,0,0.06);
  }

  .ela-finding-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--terracotta);
    line-height: 1;
    flex-shrink: 0;
    width: 1.75rem;
  }

  .ela-finding p {
    margin: 0;
    font-size: 0.84rem;
    color: var(--ink-light);
    line-height: 1.7;
  }

  /* ── Source bar ── */
  .ela-source-bar {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 2rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(0,0,0,0.07);
  }

  .ela-source {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .ela-source span { color: var(--sage); }

  /* ── Custom tooltip ── */
  .ela-tooltip {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.65rem 0.9rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  .ela-tooltip-label {
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.2rem;
  }

  .ela-tooltip-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--terracotta);
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .ela-stats { grid-template-columns: 1fr 1fr; }
    .ela-chart-grid { grid-template-columns: 1fr; }
    .ela-root { padding: 1.5rem 1rem 4rem; }
    .ela-gender-row { grid-template-columns: 120px 1fr; }
  }
`;

// ── Custom tooltip ────────────────────────────────────────────────────────────

const Tip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ela-tooltip">
      <p className="ela-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="ela-tooltip-val" style={{ color: p.color || "#C4714A" }}>
          {typeof p.value === "number" ? p.value.toFixed(1) : p.value}{unit}
          {payload.length > 1 && <span style={{ fontSize: "0.7rem", color: "#9A9088", marginLeft: "0.3rem" }}>{p.name}</span>}
        </p>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Trends", "Composite", "Analysis"];

export default function EarlyLearningDashboard() {
  const [tab, setTab] = useState("Overview");

  return (
    <>
      <style>{styles}</style>
      <div className="ela-root">

        {/* Header */}
        <div className="ela-header">
          <p className="ela-eyebrow">Early Childhood Education · UNICEF / UNESCO Data Analysis</p>
          <h1 className="ela-title">
            The first five years shape<br /><em>everything that follows.</em>
          </h1>
          <p className="ela-subtitle">
            I looked at early learning data across seven global regions: enrollment, literacy, what governments spend, how many kids are in each classroom, and whether girls and boys get equal access. Here is what the numbers show.
          </p>
          <div className="ela-meta">
            <span className="ela-meta-item">Sources <span>UNICEF · UNESCO · World Bank</span></span>
            <span className="ela-meta-item">Reference year <span>~2022</span></span>
            <span className="ela-meta-item">Age group <span>Children 3 to 6</span></span>
            <span className="ela-meta-item">Built by <span>Emina Toric</span></span>
          </div>
        </div>

        {/* Stats */}
        <div className="ela-stats">
          {STATS.map((s, i) => (
            <div key={i} className="ela-stat">
              <div className="ela-stat-icon">{s.icon}</div>
              <div className="ela-stat-num">{s.stat}</div>
              <div className="ela-stat-label">{s.label}</div>
              <p className="ela-stat-detail">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="ela-tabs">
          {TABS.map(t => (
            <button key={t} className={`ela-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "Overview" && (
          <div className="ela-section">
            <div className="ela-chart-grid">

              <div>
                <h3 className="ela-section-title">Pre-Primary Enrollment Rate</h3>
                <p className="ela-section-desc">How many children aged 3 to 6 are actually in a pre-primary program. In Sub-Saharan Africa, it is fewer than one in three. In Europe it is more than four in five. Same age, completely different starting line.</p>
                <div className="ela-chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={ENROLLMENT} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="region" tick={{ fill: "#4A4540", fontSize: 11 }} width={135} axisLine={false} tickLine={false} />
                      <Tooltip content={<Tip unit="%" />} />
                      <Bar dataKey="rate" name="Enrollment" radius={[0, 3, 3, 0]}>
                        {ENROLLMENT.map((e, i) => (
                          <rect key={i} fill={e.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="ela-section-title">Early Literacy Proficiency</h3>
                <p className="ela-section-desc">How many children can actually read at a basic level by the time they finish primary school. It tells you more about early learning quality than enrollment numbers ever will.</p>
                <div className="ela-chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={LITERACY} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="region" tick={{ fill: "#4A4540", fontSize: 11 }} width={135} axisLine={false} tickLine={false} />
                      <Tooltip content={<Tip unit="%" />} />
                      <Bar dataKey="rate" name="Literacy" fill="#C4908A" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="ela-section-title">Government Spending on Pre-Primary</h3>
                <p className="ela-section-desc">What each region actually puts behind early education as a share of GDP. Latin America spends more than anyone else here and does it with less money to work with than North America or Europe.</p>
                <div className="ela-chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={SPENDING} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <YAxis type="category" dataKey="region" tick={{ fill: "#4A4540", fontSize: 11 }} width={135} axisLine={false} tickLine={false} />
                      <Tooltip content={<Tip unit="% GDP" />} />
                      <Bar dataKey="rate" name="Spending" fill="#C8A86A" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="ela-section-title">Pupil to Teacher Ratio</h3>
                <p className="ela-section-desc">How many children each teacher is responsible for. Once you get above 15, the research is pretty clear that individual attention breaks down. Sub-Saharan Africa is nearly at 28.</p>
                <div className="ela-chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={TEACHER_RATIO} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#9A9088", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="region" tick={{ fill: "#4A4540", fontSize: 11 }} width={135} axisLine={false} tickLine={false} />
                      <Tooltip content={<Tip unit=" children" />} />
                      <Bar dataKey="rate" name="Ratio" fill="#7A8C72" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Gender gap */}
            <h3 className="ela-section-title">Gender Gap in Pre-Primary Enrollment</h3>
            <p className="ela-section-desc">Girls enrollment minus boys enrollment. Negative means boys are more likely to be in school. In South Asia and Sub-Saharan Africa the gap against girls is meaningful and it compounds over time.</p>
            <div className="ela-chart-box">
              <div className="ela-gender-grid">
                {GENDER_GAP.map((g, i) => {
                  const aboveZero = g.gap >= 0;
                  const barWidth = Math.abs(g.gap) * 14;
                  return (
                    <div key={i} className="ela-gender-row">
                      <span className="ela-gender-label">{g.region}</span>
                      <div className="ela-gender-bar-wrap">
                        {!aboveZero && (
                          <div
                            className="ela-gender-bar boys"
                            style={{ width: barWidth, marginLeft: "auto" }}
                          >
                            {g.gap}%
                          </div>
                        )}
                        <div className="ela-gender-center" />
                        {aboveZero && (
                          <div
                            className="ela-gender-bar girls"
                            style={{ width: barWidth }}
                          >
                            +{g.gap}%
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", paddingLeft: "170px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "#4A4540" }}>
                    <span style={{ width: 12, height: 12, background: "#C4714A", borderRadius: 2, display: "inline-block" }} />
                    Boys ahead
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "#4A4540" }}>
                    <span style={{ width: 12, height: 12, background: "#7A8C72", borderRadius: 2, display: "inline-block" }} />
                    Girls ahead
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Trends ── */}
        {tab === "Trends" && (
          <div className="ela-section">
            <h3 className="ela-section-title">Pre-Primary Enrollment Over Time (2000 to 2022)</h3>
            <p className="ela-section-desc">Progress has happened. Globally, more children are enrolled than ever before. But look at Sub-Saharan Africa and South Asia — they are moving, just not fast enough to close the gap with the rest of the world.</p>
            <div className="ela-chart-box">
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={TREND} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="year" tick={{ fill: "#9A9088", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A9088", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" label={{ value: "Enrollment %", angle: -90, position: "insideLeft", fill: "#9A9088", fontSize: 11 }} />
                  <Tooltip content={<Tip unit="%" />} />
                  <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#4A4540", paddingTop: "1rem" }} />
                  <Line type="monotone" dataKey="Sub-Saharan Africa" stroke="#C4714A" strokeWidth={2.5} dot={{ fill: "#C4714A", r: 4 }} />
                  <Line type="monotone" dataKey="South Asia" stroke="#C4908A" strokeWidth={2} dot={{ fill: "#C4908A", r: 4 }} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="Global Avg" stroke="#7A8C72" strokeWidth={2} dot={{ fill: "#7A8C72", r: 4 }} strokeDasharray="6 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Composite ── */}
        {tab === "Composite" && (
          <div className="ela-section">
            <h3 className="ela-section-title">Full Picture by Region</h3>
            <p className="ela-section-desc">All five indicators together, normalized so you can compare across regions. The shape tells you a lot. A lopsided profile means a region is strong in some areas and struggling in others. That is where targeted investment makes the most sense.</p>
            <div className="ela-radar-grid">
              {["Sub-Saharan Africa", "South Asia", "Latin America", "North America"].map(region => {
                const d = RADAR_DATA.find(r => r.region === region);
                const keys = ["Enrollment", "Literacy", "Spending", "Class Size", "Gender Equity"];
                return (
                  <div key={region} className="ela-radar-card">
                    <p className="ela-radar-label">{region}</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={keys.map(k => ({ axis: k, value: d[k] }))}>
                        <PolarGrid stroke="rgba(0,0,0,0.08)" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "#4A4540", fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name={region} dataKey="value" stroke="#C4714A" fill="#C4714A" fillOpacity={0.18} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Analysis ── */}
        {tab === "Analysis" && (
          <div className="ela-section">
            <div className="ela-writeup">
              <p className="ela-writeup-label">Analysis · Emina Toric</p>
              <h2>What the data says about the first five years and why it matters for everything else</h2>

              <p>
                I looked at five indicators across seven global regions: pre-primary enrollment, early literacy outcomes, what governments spend, how many children are in each classroom, and whether girls and boys get equal access. I picked these because they are not just statistics. They are the conditions that either support a child's development in their earliest years or get in the way of it.
              </p>

              <p>
                The clearest thing the data shows is this: <strong>where you are born is still the biggest predictor of whether you get a decent early education.</strong> In Sub-Saharan Africa, roughly one in four children is in any pre-primary program. In Europe and Central Asia, it is more than four in five. That is not a funding gap. That is a fundamentally different childhood.
              </p>

              <div className="ela-findings">
                <div className="ela-finding">
                  <span className="ela-finding-num">01</span>
                  <p><strong>Enrollment numbers do not tell the full story.</strong> East Asia and the Pacific has lower enrollment than Latin America but significantly better literacy outcomes. Getting kids into classrooms matters but what happens in those classrooms matters just as much. You cannot separate access from quality.</p>
                </div>
                <div className="ela-finding">
                  <span className="ela-finding-num">02</span>
                  <p><strong>Latin America is doing something right on spending.</strong> With less GDP to work with than North America or Europe, Latin America puts the highest share of it toward pre-primary education. That is a policy choice, not an accident. And it shows up in their enrollment numbers.</p>
                </div>
                <div className="ela-finding">
                  <span className="ela-finding-num">03</span>
                  <p><strong>Nearly 28 children per teacher in Sub-Saharan Africa.</strong> Once you understand child development you know what that means. There is no room for the kind of responsive, individualized interaction that actually builds language, self-regulation, and school readiness. The number is not just a statistic. It describes a room.</p>
                </div>
                <div className="ela-finding">
                  <span className="ela-finding-num">04</span>
                  <p><strong>The gender gap is not everywhere, but where it exists it compounds.</strong> A girl who misses pre-primary is less likely to start primary on time, more likely to fall behind, and more likely to leave school early. Missing the first rung does not just slow you down. It changes the whole trajectory.</p>
                </div>
              </div>

              <p>
                I have a master's degree in child and human development, and this data lands differently when you understand what is happening in a child's brain during these years. 90% of brain architecture is built before age 5. The connections formed in these years through play, language, relationships, and safe environments are the foundation everything else is built on. This is not about being ready for school. It is about being ready for life.
              </p>

              <p>
                Data sources: UNICEF State of the World's Children 2023, UNESCO Institute for Statistics, World Bank Development Indicators. All figures reference approximately 2022.
              </p>
            </div>
          </div>
        )}

        {/* Source bar */}
        <div className="ela-source-bar">
          <span className="ela-source">Source <span>UNICEF SOWC 2023</span></span>
          <span className="ela-source">Source <span>UNESCO Institute for Statistics</span></span>
          <span className="ela-source">Source <span>World Bank Development Indicators</span></span>
          <span className="ela-source">Built by <span>Emina Toric · eminatoric.github.io</span></span>
        </div>

      </div>
    </>
  );
}
