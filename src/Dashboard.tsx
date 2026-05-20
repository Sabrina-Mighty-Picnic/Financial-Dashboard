import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import REV from "./data/revenue.json";
import ARS from "./data/ar.json";
import CUST from "./data/customers.json";
import NEW_CUST from "./data/newCustomers.json";
import NEW_SKU from "./data/newSkus.json";
import NEW_CUST_DETAIL from "./data/newCustomerDetail.json";
import NEW_SKU_DETAIL from "./data/newSkuDetail.json";
import SO_PIPELINE from "./data/salesOrders.json";
import PROFIT from "./data/profit.json";
import INV from "./data/inventory.json";
import QTR_MARGIN from "./data/quarterlyMargin.json";
import AR_AGING from "./data/arAging.json";
import META from "./data/meta.json";
import NEW_ITEM_ESTIMATES from "./data/newItemEstimates.json";
import OPPS from "./data/opportunities.json";

const C = {
  bg: "#faf8f5",
  sf: "#ffffff",
  bd: "#e8e2d9",
  tx: "#2d2a26",
  mt: "#8c857a",
  ac: "#c06014",
  acL: "rgba(192,96,20,0.08)",
  gn: "#3a7d44",
  gnL: "rgba(58,125,68,0.08)",
  rd: "#c0392b",
  rdL: "rgba(192,57,43,0.08)",
  am: "#d4a017",
  pr: "#7b5ea7",
  cy: "#2980b9",
  tl: "#5b4a3f",
};

const fmt = (n: number | undefined): string => {
  if (typeof n !== "number") return "$0";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + n.toFixed(0);
};
const ff = (n: number | undefined) => "$" + Math.round(n || 0).toLocaleString();
const pc = (n: number | undefined) =>
  (typeof n === "number" ? n.toFixed(1) : "0") + "%";
const ml = (m: string) => {
  const p = m.split("-");
  const idx = parseInt(p[1], 10) - 1;
  return (
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][idx] +
    " '" +
    p[0].slice(2)
  );
};

type KPIProps = {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  up?: boolean;
};
function KPI({ label, value, sub, trend, up }: KPIProps) {
  const hasT = trend !== undefined;
  const arrow = hasT && (trend ?? 0) < 0 ? "▼" : "▲";
  const tClr = up ? C.gn : C.rd;
  const tBg = up ? C.gnL : C.rdL;
  return (
    <div
      style={{
        background: C.sf,
        border: "1px solid " + C.bd,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 170,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: C.mt,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.tx, lineHeight: 1.1 }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, color: C.mt, marginTop: 4 }}>{sub}</div> : null}
      {hasT ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
            fontSize: 11,
            fontWeight: 600,
            color: tClr,
            background: tBg,
            padding: "3px 10px",
            borderRadius: 6,
          }}
        >
          {arrow} {Math.abs(trend ?? 0).toFixed(1)}% vs LY
        </div>
      ) : null}
    </div>
  );
}

function Sec({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 16, marginTop: 36 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.tl, margin: 0 }}>{children}</h2>
      {sub ? <p style={{ fontSize: 13, color: C.mt, margin: "4px 0 0" }}>{sub}</p> : null}
    </div>
  );
}

function Cd({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div
      style={{
        background: C.sf,
        border: "1px solid " + C.bd,
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {title ? (
        <div style={{ fontSize: 14, fontWeight: 600, color: C.tl, marginBottom: 16 }}>{title}</div>
      ) : null}
      {children}
    </div>
  );
}

function TT({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: C.sf,
        border: "1px solid " + C.bd,
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: C.tx, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => {
        const isNum = typeof p.value === "number";
        const isCount =
          p.name === "AR Days" ||
          p.name === "New Customers" ||
          p.name === "New SKUs" ||
          p.name === "Invoices";
        const display = isNum && !isCount ? ff(p.value) : p.value;
        const suffix = p.name === "AR Days" ? " days" : "";
        return (
          <div
            key={i}
            style={{
              fontSize: 12,
              color: p.color || C.mt,
              marginBottom: 2,
              display: "flex",
              gap: 8,
              justifyContent: "space-between",
            }}
          >
            <span>{p.name}:</span>
            <span style={{ fontWeight: 600 }}>
              {display}
              {suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TH({ children, left }: { children: React.ReactNode; left?: boolean }) {
  return (
    <th
      style={{
        padding: "10px 12px",
        textAlign: left ? "left" : "right",
        color: C.mt,
        fontWeight: 600,
        fontSize: 10,
        textTransform: "uppercase",
        borderBottom: "2px solid " + C.bd,
      }}
    >
      {children}
    </th>
  );
}

function TD({
  children,
  left,
  bold,
  color,
}: {
  children: React.ReactNode;
  left?: boolean;
  bold?: boolean;
  color?: string;
}) {
  return (
    <td
      style={{
        padding: "10px 12px",
        textAlign: left ? "left" : "right",
        color: color || C.tx,
        fontWeight: bold ? 700 : 400,
        fontSize: 13,
        borderBottom: "1px solid " + C.bd,
      }}
    >
      {children}
    </td>
  );
}

const TABS = [
  "Overview",
  "Sales vs LY",
  "Most Profitable Items",
  "New Item Profitability",
  "Quarterly Review",
  "Inventory",
  "Open Sales Orders",
  "AR Days",
  "Opportunities",
] as const;

function Spark({ data, w = 90, h = 26, color = C.ac }: { data: number[]; w?: number; h?: number; color?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? w / (data.length - 1) : 0;
  const pts = data
    .map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(" ");
  const last = data[data.length - 1];
  const lastX = (data.length - 1) * stepX;
  const lastY = h - ((last - min) / range) * h;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
      {data.map((v, i) => (
        <circle key={i} cx={(i * stepX).toFixed(1)} cy={(h - ((v - min) / range) * h).toFixed(1)} r={v === 0 ? 0 : 1.5} fill={color} opacity={0.6} />
      ))}
      <circle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r={2.2} fill={color} />
    </svg>
  );
}

const normalizeSku = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\bsauce\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

const QTRS = ["Q1'25", "Q2'25", "Q3'25", "Q4'25", "YTD'26"];
const QTR_KEYS = ["q1", "q2", "q3", "q4", "q126"] as const;
const QTR_REV_KEYS = ["r1", "r2", "r3", "r4", "r126"] as const;

export default function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [yr, setYr] = useState<string>(META.defaultYear);
  const lyYr = String(Number(yr) - 1);

  const cyMonths = useMemo(
    () => REV.filter((d) => d.m.startsWith(yr)).map((d) => d.m.split("-")[1]),
    [yr],
  );
  const yd = useMemo(() => REV.filter((d) => d.m.startsWith(yr)), [yr]);
  const lyd = useMemo(
    () => REV.filter((d) => d.m.startsWith(lyYr) && cyMonths.includes(d.m.split("-")[1])),
    [lyYr, cyMonths],
  );

  const tR = yd.reduce((s, d) => s + d.r, 0);
  const tE = yd.reduce((s, d) => s + d.e, 0);
  const lyR = lyd.reduce((s, d) => s + d.r, 0);
  const lyE = lyd.reduce((s, d) => s + d.e, 0);
  const rG = lyR > 0 ? ((tR - lyR) / lyR) * 100 : 0;
  const eG = lyE > 0 ? ((tE - lyE) / lyE) * 100 : 0;
  const profitObjForKpi = (PROFIT as any)[yr] || (PROFIT as any)[META.defaultYear];
  const profitTotalsLY = (PROFIT as any)[lyYr]?.totals ?? null;
  const tC = profitObjForKpi.totals.cst as number;
  const gpFY = profitObjForKpi.totals.pft as number;
  const gmCY = profitObjForKpi.totals.gp as number;
  const gmLY = profitTotalsLY ? (profitTotalsLY.gp as number) : 0;

  const arY = useMemo(() => ARS.filter((d) => d.m.startsWith(yr)), [yr]);
  const arLY = useMemo(
    () => ARS.filter((d) => d.m.startsWith(lyYr) && cyMonths.includes(d.m.split("-")[1])),
    [lyYr, cyMonths],
  );
  const aAR = arY.length > 0 ? Math.round(arY.reduce((s, d) => s + d.d, 0) / arY.length) : 0;
  const lyAAR =
    arLY.length > 0 ? Math.round(arLY.reduce((s, d) => s + d.d, 0) / arLY.length) : 0;

  const custP = useMemo(() => {
    const rk = (yr === "2026" ? "r26" : yr === "2025" ? "r25" : "r24") as
      | "r24"
      | "r25"
      | "r26";
    const lk = (yr === "2026" ? "r25jf" : yr === "2025" ? "r24" : "r24") as
      | "r24"
      | "r25jf";
    return CUST.map((c: any) => ({ customer: c.n, cy: c[rk], ly: c[lk] }))
      .filter((c) => c.cy > 0)
      .sort((a, b) => b.cy - a.cy);
  }, [yr]);

  const sc = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months
      .map((m, i) => {
        const mo = String(i + 1).padStart(2, "0");
        const cyRow = REV.find((d) => d.m === yr + "-" + mo);
        const lyRow = REV.find((d) => d.m === lyYr + "-" + mo);
        if (!cyRow && !lyRow) return null;
        const cyV = cyRow ? cyRow.r : 0;
        const lyV = lyRow ? lyRow.r : 0;
        return {
          month: m,
          cy: cyV,
          ly: lyV,
          variance: lyV > 0 ? ((cyV - lyV) / lyV) * 100 : 0,
        };
      })
      .filter(Boolean) as { month: string; cy: number; ly: number; variance: number }[];
  }, [yr, lyYr]);

  const qc = useMemo(() => {
    const qs = [
      { l: "Q1", ms: ["01", "02", "03"] },
      { l: "Q2", ms: ["04", "05", "06"] },
      { l: "Q3", ms: ["07", "08", "09"] },
      { l: "Q4", ms: ["10", "11", "12"] },
    ];
    return qs
      .map((q) => {
        const cyV = q.ms.reduce((s, m) => {
          const d = REV.find((r) => r.m === yr + "-" + m);
          return s + (d ? d.r : 0);
        }, 0);
        const lyV = q.ms.reduce((s, m) => {
          const d = REV.find((r) => r.m === lyYr + "-" + m);
          return s + (d ? d.r : 0);
        }, 0);
        if (!cyV && !lyV) return null;
        return {
          quarter: q.l,
          cy: cyV,
          ly: lyV,
          variance: lyV > 0 ? ((cyV - lyV) / lyV) * 100 : 0,
        };
      })
      .filter(Boolean) as { quarter: string; cy: number; ly: number; variance: number }[];
  }, [yr, lyYr]);

  const profitObj = (PROFIT as any)[yr] || (PROFIT as any)[META.defaultYear];
  const profitData = profitObj.items;
  const profitTotals = profitObj.totals;

  const newCustYr = useMemo(
    () => NEW_CUST.filter((d) => d.m.startsWith(yr)).reduce((s, d) => s + d.c, 0),
    [yr],
  );
  const newSkuYr = useMemo(
    () => NEW_SKU.filter((d) => d.m.startsWith(yr)).reduce((s, d) => s + d.s, 0),
    [yr],
  );
  const custDetails = useMemo(
    () => NEW_CUST_DETAIL.filter((c) => c.d.startsWith(yr)),
    [yr],
  );
  const skuDetails = useMemo(() => NEW_SKU_DETAIL.filter((s) => s.d.startsWith(yr)), [yr]);

  const growthChart = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months
      .map((m, i) => {
        const mo = String(i + 1).padStart(2, "0");
        if (!REV.find((d) => d.m === yr + "-" + mo)) return null;
        const nc = NEW_CUST.find((d) => d.m === yr + "-" + mo);
        const ns = NEW_SKU.find((d) => d.m === yr + "-" + mo);
        return { month: m, "New Customers": nc ? nc.c : 0, "New SKUs": ns ? ns.s : 0 };
      })
      .filter(Boolean) as { month: string; "New Customers": number; "New SKUs": number }[];
  }, [yr]);

  const catData = useMemo(() => {
    const bv = INV.bulk.filter((i) => i.c === "Bulk").reduce((s, i) => s + i.v, 0);
    const fv = INV.bulk.filter((i) => i.c === "Film").reduce((s, i) => s + i.v, 0);
    const pv = INV.bulk.filter((i) => i.c === "Pkg").reduce((s, i) => s + i.v, 0);
    const gv = INV.fg.reduce((s, i) => s + i.v, 0);
    return [
      { name: "Finished Goods", value: gv, fill: C.ac },
      { name: "Bulk", value: bv, fill: C.gn },
      { name: "Film", value: fv, fill: C.am },
      { name: "Packaging", value: pv, fill: C.pr },
    ];
  }, []);

  const im = useMemo(() => {
    const m = (INV.metrics as any)[yr] || (INV.metrics as any)[META.defaultYear];
    const avgInv = (m.begVal + m.endVal) / 2;
    const turns = avgInv > 0 ? m.cogs / avgInv : 0;
    const dio = turns > 0 ? m.days / turns : 0;
    return { ...m, avgInv, turns, dio };
  }, [yr]);

  const arMonthly = useMemo(() => {
    return ARS.filter((d) => d.m.startsWith(yr)).map((d) => ({
      month: ml(d.m),
      "AR Days": d.d,
      "AR Balance": d.b,
      Invoices: d.inv,
    }));
  }, [yr]);

  const soByCustomer = useMemo(() => {
    const map = new Map<string, number>();
    SO_PIPELINE.forEach((s) => map.set(s.c, (map.get(s.c) || 0) + s.a));
    return Array.from(map.entries())
      .map(([customer, total]) => ({ customer, total }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const soTotal = useMemo(() => SO_PIPELINE.reduce((s, o) => s + o.a, 0), []);
  const soCount = SO_PIPELINE.length;

  const newItemPerf = useMemo(() => {
    const launches = NEW_SKU_DETAIL.filter((s) => s.d.startsWith(yr));
    const profitItems = profitObj.items as {
      s: string;
      rev: number;
      cst: number;
      pft: number;
      gp: number;
    }[];
    return launches.map((l) => {
      const key = normalizeSku(l.n);
      const profit = profitItems.find((p) => normalizeSku(p.s) === key);
      const est = NEW_ITEM_ESTIMATES.find((e) => normalizeSku(e.n) === key);
      const actualCostPerUnit =
        est && profit && est.unitsShipped > 0 ? profit.cst / est.unitsShipped : null;
      const freight = est?.freight ?? null;
      const adjGm =
        profit && profit.rev > 0 && freight !== null
          ? ((profit.rev - profit.cst - freight) / profit.rev) * 100
          : null;
      return {
        name: l.n,
        launchDate: l.d,
        rev: profit?.rev ?? null,
        cst: profit?.cst ?? null,
        pft: profit?.pft ?? null,
        gp: profit?.gp ?? null,
        units: est?.unitsShipped ?? null,
        estCost: est?.estCost ?? null,
        estGm: est?.estGm ?? null,
        actualCost: actualCostPerUnit,
        freight,
        adjGm,
      };
    });
  }, [yr, profitObj]);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "24px 28px 64px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: C.tx, margin: 0 }}>
              {META.company} — Financial Dashboard
            </h1>
            <p style={{ fontSize: 13, color: C.mt, margin: "4px 0 0" }}>
              As of {META.asOf} · Sourced from NetSuite
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.mt,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Fiscal Year
            </span>
            {META.fiscalYears.map((y) => (
              <button
                key={y}
                onClick={() => setYr(y)}
                style={{
                  background: yr === y ? C.ac : C.sf,
                  color: yr === y ? "#fff" : C.tx,
                  border: "1px solid " + (yr === y ? C.ac : C.bd),
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            borderBottom: "1px solid " + C.bd,
            margin: "20px 0 8px",
            flexWrap: "wrap",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "2px solid " + (tab === t ? C.ac : "transparent"),
                color: tab === t ? C.ac : C.mt,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <Overview
            tR={tR}
            tE={tE}
            tC={tC}
            gpFY={gpFY}
            rG={rG}
            eG={eG}
            aAR={aAR}
            lyAAR={lyAAR}
            gmCY={gmCY}
            gmLY={gmLY}
            yr={yr}
            lyYr={lyYr}
            yd={yd}
            newCustYr={newCustYr}
            newSkuYr={newSkuYr}
            growthChart={growthChart}
            custDetails={custDetails}
            skuDetails={skuDetails}
          />
        )}
        {tab === "Sales vs LY" && (
          <SalesVsLY sc={sc} qc={qc} custP={custP} yr={yr} lyYr={lyYr} />
        )}
        {tab === "Most Profitable Items" && (
          <Profitable yr={yr} items={profitData} totals={profitTotals} />
        )}
        {tab === "New Item Profitability" && (
          <NewItems yr={yr} rows={newItemPerf} />
        )}
        {tab === "Quarterly Review" && <Quarterly />}
        {tab === "Inventory" && <Inventory im={im} catData={catData} />}
        {tab === "Open Sales Orders" && (
          <OpenSO total={soTotal} count={soCount} byCustomer={soByCustomer} orders={SO_PIPELINE} />
        )}
        {tab === "AR Days" && <ARDays monthly={arMonthly} aging={AR_AGING} />}
        {tab === "Opportunities" && <Opportunities />}
      </div>
    </div>
  );
}

/* ---------- Tabs ---------- */

function Overview(props: {
  tR: number;
  tE: number;
  tC: number;
  gpFY: number;
  rG: number;
  eG: number;
  aAR: number;
  lyAAR: number;
  gmCY: number;
  gmLY: number;
  yr: string;
  lyYr: string;
  yd: { m: string; r: number; e: number; c?: number }[];
  newCustYr: number;
  newSkuYr: number;
  growthChart: { month: string; "New Customers": number; "New SKUs": number }[];
  custDetails: { n: string; d: string }[];
  skuDetails: { n: string; d: string }[];
}) {
  const {
    tR, tE, tC, gpFY, rG, eG, aAR, lyAAR, gmCY, gmLY, yr, yd, newCustYr, newSkuYr, growthChart, custDetails, skuDetails,
  } = props;
  const opMargin = tR > 0 ? ((tR - tC - tE) / tR) * 100 : 0;
  const opProfit = tR - tC - tE;
  const gmDelta = gmCY - gmLY;
  const chartData = yd.map((d) => ({ month: ml(d.m), Revenue: d.r, Expenses: d.e }));
  return (
    <div>
      <Sec sub={`Year-to-date snapshot for FY${yr} · Gross Margin from Income Statement`}>Key Performance Indicators</Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="Revenue" value={fmt(tR)} sub={`${yd.length} months posted`} trend={rG} up={rG >= 0} />
        <KPI label="COGS" value={fmt(tC)} sub={fmt(gpFY) + " gross profit"} />
        <KPI
          label="Gross Margin"
          value={pc(gmCY)}
          sub={gmLY > 0 ? `LY ${pc(gmLY)}` : "From Income Statement"}
          trend={gmLY > 0 ? gmDelta : undefined}
          up={gmDelta >= 0}
        />
        <KPI label="Total Expenses" value={fmt(tE)} sub="OpEx + Other Expense" trend={eG} up={eG <= 0} />
        <KPI label="Net Margin" value={pc(opMargin)} sub={fmt(opProfit) + " net income"} up={opMargin >= 0} />
        <KPI
          label="AR Days"
          value={aAR + " days"}
          sub={`LY avg ${lyAAR} days`}
          trend={lyAAR > 0 ? ((aAR - lyAAR) / lyAAR) * 100 : 0}
          up={aAR <= lyAAR}
        />
        <KPI label="New Customers" value={newCustYr} sub={`Added in ${yr}`} />
        <KPI label="New SKUs" value={newSkuYr} sub={`Launched in ${yr}`} />
      </div>

      <Sec sub="Monthly revenue and expenses">Revenue vs Expenses</Sec>
      <Cd>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData}>
              <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={C.mt} fontSize={12} />
              <YAxis stroke={C.mt} fontSize={12} tickFormatter={(v) => fmt(v as number)} />
              <Tooltip content={<TT />} />
              <Legend />
              <Bar dataKey="Revenue" fill={C.ac} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill={C.tl} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Cd>

      <Sec sub="Customers and SKUs added each month">Growth Activity</Sec>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <Cd title="New customers & SKUs by month">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={growthChart}>
                <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={C.mt} fontSize={12} />
                <YAxis stroke={C.mt} fontSize={12} allowDecimals={false} />
                <Tooltip content={<TT />} />
                <Legend />
                <Bar dataKey="New Customers" fill={C.cy} radius={[4, 4, 0, 0]} />
                <Bar dataKey="New SKUs" fill={C.am} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Cd>
        <Cd title={`New customers in ${yr}`}>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <TH left>Customer</TH>
                  <TH>Date</TH>
                </tr>
              </thead>
              <tbody>
                {custDetails.map((c, i) => (
                  <tr key={i}>
                    <TD left>{c.n}</TD>
                    <TD>{c.d}</TD>
                  </tr>
                ))}
                {custDetails.length === 0 && (
                  <tr>
                    <TD left>—</TD>
                    <TD>No new customers</TD>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Cd>
      </div>

      <Sec sub={`SKU launches in ${yr}`}>New SKU Detail</Sec>
      <Cd>
        <div style={{ maxHeight: 280, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TH left>SKU</TH>
                <TH>Launch Date</TH>
              </tr>
            </thead>
            <tbody>
              {skuDetails.map((s, i) => (
                <tr key={i}>
                  <TD left>{s.n}</TD>
                  <TD>{s.d}</TD>
                </tr>
              ))}
              {skuDetails.length === 0 && (
                <tr>
                  <TD left>—</TD>
                  <TD>No new SKUs</TD>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Cd>
    </div>
  );
}

function SalesVsLY({
  sc,
  qc,
  custP,
  yr,
  lyYr,
}: {
  sc: { month: string; cy: number; ly: number; variance: number }[];
  qc: { quarter: string; cy: number; ly: number; variance: number }[];
  custP: { customer: string; cy: number; ly: number }[];
  yr: string;
  lyYr: string;
}) {
  return (
    <div>
      <Sec sub={`FY${yr} vs FY${lyYr}`}>Monthly Revenue Comparison</Sec>
      <Cd>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={sc}>
              <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={C.mt} fontSize={12} />
              <YAxis stroke={C.mt} fontSize={12} tickFormatter={(v) => fmt(v as number)} />
              <Tooltip content={<TT />} />
              <Legend />
              <Bar dataKey="ly" name={`FY${lyYr}`} fill={C.tl} radius={[4, 4, 0, 0]} />
              <Bar dataKey="cy" name={`FY${yr}`} fill={C.ac} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Cd>

      <Sec>Quarterly Comparison</Sec>
      <Cd>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH left>Quarter</TH>
              <TH>FY{lyYr}</TH>
              <TH>FY{yr}</TH>
              <TH>Variance</TH>
            </tr>
          </thead>
          <tbody>
            {qc.map((q) => (
              <tr key={q.quarter}>
                <TD left bold>
                  {q.quarter}
                </TD>
                <TD>{ff(q.ly)}</TD>
                <TD>{ff(q.cy)}</TD>
                <TD color={q.variance >= 0 ? C.gn : C.rd}>
                  {q.variance >= 0 ? "▲" : "▼"} {Math.abs(q.variance).toFixed(1)}%
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Cd>

      <Sec sub="Top customers by revenue">Customer Performance</Sec>
      <Cd>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH left>Customer</TH>
              <TH>FY{lyYr}</TH>
              <TH>FY{yr}</TH>
              <TH>Δ</TH>
            </tr>
          </thead>
          <tbody>
            {custP.map((c) => {
              const delta = c.cy - c.ly;
              const pct = c.ly > 0 ? (delta / c.ly) * 100 : null;
              return (
                <tr key={c.customer}>
                  <TD left bold>
                    {c.customer}
                  </TD>
                  <TD>{ff(c.ly)}</TD>
                  <TD>{ff(c.cy)}</TD>
                  <TD color={delta >= 0 ? C.gn : C.rd}>
                    {pct === null ? "new" : (delta >= 0 ? "▲ " : "▼ ") + Math.abs(pct).toFixed(0) + "%"}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Cd>
    </div>
  );
}

function Profitable({
  yr,
  items,
  totals,
}: {
  yr: string;
  items: { s: string; rev: number; cst: number; pft: number; gp: number }[];
  totals: { rev: number; cst: number; pft: number; gp: number };
}) {
  return (
    <div>
      <Sec sub={`Top SKUs by gross profit · FY${yr}`}>Most Profitable Items</Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="Total Revenue" value={fmt(totals.rev)} />
        <KPI label="Total COGS" value={fmt(totals.cst)} />
        <KPI label="Gross Profit" value={fmt(totals.pft)} />
        <KPI label="Gross Margin" value={pc(totals.gp)} />
      </div>
      <Sec>Top SKUs</Sec>
      <Cd>
        <div style={{ width: "100%", height: 360, marginBottom: 16 }}>
          <ResponsiveContainer>
            <BarChart data={items} layout="vertical" margin={{ left: 140 }}>
              <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
              <XAxis type="number" stroke={C.mt} fontSize={12} tickFormatter={(v) => fmt(v as number)} />
              <YAxis type="category" dataKey="s" stroke={C.mt} fontSize={11} width={140} />
              <Tooltip content={<TT />} />
              <Bar dataKey="pft" name="Gross Profit" fill={C.gn} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH left>SKU</TH>
              <TH>Revenue</TH>
              <TH>COGS</TH>
              <TH>Profit</TH>
              <TH>GP %</TH>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.s}>
                <TD left>{it.s}</TD>
                <TD>{ff(it.rev)}</TD>
                <TD>{ff(it.cst)}</TD>
                <TD bold color={C.gn}>
                  {ff(it.pft)}
                </TD>
                <TD>{pc(it.gp)}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Cd>
    </div>
  );
}

type NewItemRow = {
  name: string;
  launchDate: string;
  rev: number | null;
  cst: number | null;
  pft: number | null;
  gp: number | null;
  units: number | null;
  estCost: number | null;
  estGm: number | null;
  actualCost: number | null;
  freight: number | null;
  adjGm: number | null;
};

function NewItems({ yr, rows }: { yr: string; rows: NewItemRow[] }) {
  const withData = rows.filter((r) => r.gp !== null);
  const noData = rows.filter((r) => r.gp === null);
  const totalRev = withData.reduce((s, r) => s + (r.rev || 0), 0);
  const totalPft = withData.reduce((s, r) => s + (r.pft || 0), 0);
  const blendedGM = totalRev > 0 ? (totalPft / totalRev) * 100 : 0;
  const chart = withData
    .slice()
    .sort((a, b) => (b.gp ?? 0) - (a.gp ?? 0))
    .map((r) => ({ name: r.name, "GM %": r.gp ?? 0, Revenue: r.rev ?? 0 }));
  return (
    <div>
      <Sec sub={`Launches in FY${yr} matched to current profitability data`}>
        New Item Profitability
      </Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="New Items Launched" value={rows.length} sub={`In FY${yr}`} />
        <KPI label="With Profit Data" value={withData.length} sub={`${noData.length} pending`} />
        <KPI label="New-Item Revenue" value={fmt(totalRev)} sub={`FY${yr} matched SKUs`} />
        <KPI label="Blended GM %" value={pc(blendedGM)} sub={fmt(totalPft) + " profit"} />
      </div>

      <Sec sub="Sorted by gross margin">Margin by new SKU</Sec>
      <Cd>
        {chart.length === 0 ? (
          <div style={{ color: C.mt, fontSize: 13 }}>
            No matched profitability rows yet. Once a new SKU appears in
            <code style={{ background: C.acL, padding: "1px 6px", margin: "0 4px", borderRadius: 4 }}>
              profit.json
            </code>
            or
            <code style={{ background: C.acL, padding: "1px 6px", margin: "0 4px", borderRadius: 4 }}>
              quarterlyMargin.json
            </code>
            it will appear here automatically.
          </div>
        ) : (
          <div style={{ width: "100%", height: Math.max(280, chart.length * 32) }}>
            <ResponsiveContainer>
              <BarChart data={chart} layout="vertical" margin={{ left: 170 }}>
                <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
                <XAxis type="number" stroke={C.mt} fontSize={12} tickFormatter={(v) => v + "%"} />
                <YAxis type="category" dataKey="name" stroke={C.mt} fontSize={11} width={170} />
                <Tooltip content={<TT />} />
                <Bar dataKey="GM %" fill={C.gn} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Cd>

      <Sec sub="Pre-production cost estimate vs actual COGS per unit, estimated vs actual gross margin, and gross margin after freight-out">
        Estimate vs Actual
      </Sec>
      <Cd>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
            <thead>
              <tr>
                <TH left>SKU</TH>
                <TH left>Launched</TH>
                <TH>Units</TH>
                <TH>Revenue</TH>
                <TH>Est. Cost / u</TH>
                <TH>Actual Cost / u</TH>
                <TH>Δ Cost</TH>
                <TH>Est. GM</TH>
                <TH>Actual GM</TH>
                <TH>Δ GM (pp)</TH>
                <TH>Freight</TH>
                <TH>Adj. GM</TH>
              </tr>
            </thead>
            <tbody>
              {rows
                .slice()
                .sort((a, b) => (b.gp ?? -1) - (a.gp ?? -1))
                .map((r) => {
                  const dCost =
                    r.estCost !== null && r.actualCost !== null
                      ? r.actualCost - r.estCost
                      : null;
                  const dGm =
                    r.estGm !== null && r.gp !== null ? r.gp - r.estGm : null;
                  const dollar = (n: number) => "$" + n.toFixed(2);
                  const dollarSigned = (n: number) =>
                    (n >= 0 ? "+$" : "-$") + Math.abs(n).toFixed(3);
                  return (
                    <tr key={r.name}>
                      <TD left bold>
                        {r.name}
                      </TD>
                      <TD left>{r.launchDate}</TD>
                      <TD>{r.units !== null ? r.units.toLocaleString() : "—"}</TD>
                      <TD>{r.rev !== null ? ff(r.rev) : "—"}</TD>
                      <TD>{r.estCost !== null ? dollar(r.estCost) : "—"}</TD>
                      <TD>{r.actualCost !== null ? dollar(r.actualCost) : "—"}</TD>
                      <TD color={dCost === null ? C.mt : dCost <= 0 ? C.gn : C.rd}>
                        {dCost === null ? "—" : dollarSigned(dCost)}
                      </TD>
                      <TD>{r.estGm !== null ? pc(r.estGm) : "—"}</TD>
                      <TD
                        color={
                          r.gp === null ? C.mt : r.gp >= 30 ? C.gn : r.gp >= 20 ? C.am : C.rd
                        }
                      >
                        {r.gp !== null ? pc(r.gp) : "—"}
                      </TD>
                      <TD color={dGm === null ? C.mt : dGm >= 0 ? C.gn : C.rd} bold={dGm !== null}>
                        {dGm === null
                          ? "—"
                          : (dGm >= 0 ? "+" : "") + dGm.toFixed(2) + " pp"}
                      </TD>
                      <TD color={r.freight && r.freight > 0 ? C.tx : C.mt}>
                        {r.freight && r.freight > 0 ? ff(r.freight) : "—"}
                      </TD>
                      <TD
                        color={
                          r.adjGm === null
                            ? C.mt
                            : r.adjGm >= 30
                              ? C.gn
                              : r.adjGm >= 20
                                ? C.am
                                : C.rd
                        }
                        bold={r.freight !== null && r.freight > 0}
                      >
                        {r.adjGm !== null ? pc(r.adjGm) : "—"}
                      </TD>
                    </tr>
                  );
                })}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    style={{
                      padding: "16px 12px",
                      textAlign: "center",
                      color: C.mt,
                      fontSize: 13,
                      borderBottom: "1px solid " + C.bd,
                    }}
                  >
                    No SKUs launched in FY{yr}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {noData.length > 0 && (
          <div style={{ marginTop: 14, fontSize: 12, color: C.mt }}>
            <strong style={{ color: C.tx }}>{noData.length}</strong> launched SKU
            {noData.length === 1 ? "" : "s"} have no matched profitability data yet — they will
            populate once they appear in <code>profit.json</code> /{" "}
            <code>quarterlyMargin.json</code> (next NetSuite refresh).
          </div>
        )}
      </Cd>
    </div>
  );
}

function Quarterly() {
  const rows = QTR_MARGIN.map((r: any) => ({
    ...r,
    tot: (r.r1 || 0) + (r.r2 || 0) + (r.r3 || 0) + (r.r4 || 0) + (r.r126 || 0),
  })).sort((a, b) => b.tot - a.tot);
  const totalRev = rows.reduce((s, r) => s + r.tot, 0);
  return (
    <div>
      <Sec sub={`All ${rows.length} SKUs with revenue Q1'25 through YTD Apr'26 · sorted by total revenue`}>
        Quarterly Margin Review
      </Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <KPI label="SKUs" value={String(rows.length)} sub="With revenue in window" />
        <KPI label="Total Revenue" value={fmt(totalRev)} sub="5-quarter sum" />
        <KPI label="Top 10 share" value={pc((rows.slice(0, 10).reduce((s, r) => s + r.tot, 0) / totalRev) * 100)} sub="of total revenue" />
      </div>
      <Cd>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1080 }}>
            <thead>
              <tr>
                <TH left>SKU</TH>
                <TH>Total Rev</TH>
                <TH>Trend</TH>
                {QTRS.map((q) => (
                  <TH key={q}>{q} GM%</TH>
                ))}
                {QTRS.map((q) => (
                  <TH key={q + "r"}>{q} Rev</TH>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any) => {
                const series = QTR_REV_KEYS.map((k) => row[k] || 0);
                const first = series.find((v) => v > 0) || 0;
                const last = [...series].reverse().find((v) => v > 0) || 0;
                const trendUp = last >= first;
                return (
                  <tr key={row.s}>
                    <TD left bold>{row.s}</TD>
                    <TD bold>{ff(row.tot)}</TD>
                    <td style={{ padding: "8px 6px", borderBottom: "1px solid " + C.bd, textAlign: "center" }}>
                      <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                        <Spark data={series} color={trendUp ? C.gn : C.rd} />
                      </div>
                    </td>
                    {QTR_KEYS.map((k) => (
                      <TD
                        key={k}
                        color={row[k] === 0 ? C.mt : row[k] >= 30 ? C.gn : row[k] >= 20 ? C.am : C.rd}
                      >
                        {row[k] === 0 ? "—" : pc(row[k])}
                      </TD>
                    ))}
                    {QTR_REV_KEYS.map((k) => (
                      <TD key={k}>{row[k] === 0 ? "—" : ff(row[k])}</TD>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Cd>
    </div>
  );
}

function Inventory({
  im,
  catData,
}: {
  im: { begVal: number; endVal: number; cogs: number; days: number; avgInv: number; turns: number; dio: number };
  catData: { name: string; value: number; fill: string }[];
}) {
  const summary = INV.summary;
  return (
    <div>
      <Sec sub="On-hand value and turn ratios">Inventory Snapshot</Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="Total Value" value={fmt(summary.total)} sub={`As of ${META.asOf}`} />
        <KPI label="Finished Goods" value={fmt(summary.fg)} sub={pc(summary.fgP) + " of total"} />
        <KPI label="Raw Materials" value={fmt(summary.rm)} sub={pc(summary.rmP) + " of total"} />
        <KPI label="Inventory Turns" value={im.turns.toFixed(2) + "x"} sub={`Avg inv ${fmt(im.avgInv)}`} />
        <KPI label="Days Inventory" value={Math.round(im.dio) + " days"} sub={`COGS ${fmt(im.cogs)}`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
        <Cd title="Value by category">
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {catData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<TT />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Cd>
        <Cd title="Inventory by quarter">
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={INV.byQuarter}>
                <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
                <XAxis dataKey="q" stroke={C.mt} fontSize={11} />
                <YAxis stroke={C.mt} fontSize={12} tickFormatter={(v) => fmt(v as number)} />
                <Tooltip content={<TT />} />
                <Legend />
                <Bar dataKey="fg" name="Finished Goods" stackId="a" fill={C.ac} />
                <Bar dataKey="rm" name="Raw Materials" stackId="a" fill={C.gn} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Cd>
      </div>

      <Sec>Top items by value</Sec>
      <Cd>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH left>Item</TH>
              <TH>Value</TH>
              <TH>% of total</TH>
            </tr>
          </thead>
          <tbody>
            {INV.topItems.map((row) => (
              <tr key={row.i}>
                <TD left>{row.i}</TD>
                <TD>{ff(row.v)}</TD>
                <TD>{pc(row.p)}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Cd>
    </div>
  );
}

function OpenSO({
  total,
  count,
  byCustomer,
  orders,
}: {
  total: number;
  count: number;
  byCustomer: { customer: string; total: number }[];
  orders: { so: string; d: string; c: string; a: number; st: string }[];
}) {
  return (
    <div>
      <Sec sub="Pipeline of unfulfilled and unbilled orders">Open Sales Orders</Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="Open Pipeline" value={fmt(total)} sub={`${count} orders`} />
        <KPI label="Top Customer" value={byCustomer[0]?.customer || "—"} sub={fmt(byCustomer[0]?.total || 0)} />
        <KPI label="Customers" value={byCustomer.length} sub="With open orders" />
      </div>

      <Sec>Pipeline by customer</Sec>
      <Cd>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={byCustomer} layout="vertical" margin={{ left: 130 }}>
              <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
              <XAxis type="number" stroke={C.mt} fontSize={12} tickFormatter={(v) => fmt(v as number)} />
              <YAxis type="category" dataKey="customer" stroke={C.mt} fontSize={11} width={130} />
              <Tooltip content={<TT />} />
              <Bar dataKey="total" name="Open Amount" fill={C.ac} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Cd>

      <Sec>Orders</Sec>
      <Cd>
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TH left>SO #</TH>
                <TH left>Date</TH>
                <TH left>Customer</TH>
                <TH>Amount</TH>
                <TH left>Status</TH>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.so}>
                  <TD left bold>
                    {o.so}
                  </TD>
                  <TD left>{o.d}</TD>
                  <TD left>{o.c}</TD>
                  <TD>{ff(o.a)}</TD>
                  <TD left color={o.st === "Pending Fulfillment" ? C.am : C.cy}>
                    {o.st}
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Cd>
    </div>
  );
}

function ARDays({
  monthly,
  aging,
}: {
  monthly: { month: string; "AR Days": number; "AR Balance": number; Invoices: number }[];
  aging: {
    c: string;
    inv: number;
    total: number;
    avg: number;
    o60: number;
    o3060: number;
    cur: number;
  }[];
}) {
  const totalAR = aging.reduce((s, r) => s + r.total, 0);
  const totalOver60 = aging.reduce((s, r) => s + r.o60, 0);
  const totalCur = aging.reduce((s, r) => s + r.cur, 0);
  return (
    <div>
      <Sec sub="Days sales outstanding and aging">Accounts Receivable</Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="Total AR" value={fmt(totalAR)} />
        <KPI label="Current" value={fmt(totalCur)} sub={pc((totalCur / totalAR) * 100) + " of total"} />
        <KPI
          label="Over 60 Days"
          value={fmt(totalOver60)}
          sub={pc((totalOver60 / totalAR) * 100) + " of total"}
        />
      </div>

      <Sec>AR Days trend</Sec>
      <Cd>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={monthly}>
              <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={C.mt} fontSize={12} />
              <YAxis stroke={C.mt} fontSize={12} />
              <Tooltip content={<TT />} />
              <Legend />
              <Line type="monotone" dataKey="AR Days" stroke={C.ac} strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Cd>

      <Sec>Aging by customer</Sec>
      <Cd>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH left>Customer</TH>
              <TH>Invoices</TH>
              <TH>Total</TH>
              <TH>Avg Days</TH>
              <TH>Current</TH>
              <TH>30–60</TH>
              <TH>Over 60</TH>
            </tr>
          </thead>
          <tbody>
            {aging.map((r) => (
              <tr key={r.c}>
                <TD left bold>
                  {r.c}
                </TD>
                <TD>{r.inv}</TD>
                <TD>{ff(r.total)}</TD>
                <TD color={r.avg > 60 ? C.rd : r.avg > 30 ? C.am : C.gn}>{r.avg}</TD>
                <TD>{ff(r.cur)}</TD>
                <TD>{ff(r.o3060)}</TD>
                <TD color={r.o60 > 0 ? C.rd : C.tx}>{ff(r.o60)}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Cd>
    </div>
  );
}

function Opportunities() {
  const all = OPPS as Array<{ id: string; d: string; c: string; a: number; stage: string; p: number; st: string; t: string; ps: number | null }>;
  const open = all.filter((o) => o.st === "In Progress" || o.st === "Issued Estimate");
  const won = all.filter((o) => o.st === "Closed Won");
  const openValue = open.reduce((s, o) => s + o.a, 0);
  const weighted = open.reduce((s, o) => s + (o.a * o.p) / 100, 0);
  const wonValue = won.reduce((s, o) => s + o.a, 0);
  const ytdLinked = all.reduce((s, o) => s + (o.ps || 0), 0);
  const taggedCount = all.filter((o) => o.ps !== null).length;

  const STAGE_ORDER = ["In Discussion", "Identified Decision Makers", "Proposal", "In Negotiation", "Purchasing", "Closed Won"];
  const STAGE_COLOR: Record<string, string> = {
    "In Discussion": C.cy,
    "Identified Decision Makers": C.pr,
    "Proposal": C.am,
    "In Negotiation": C.ac,
    "Purchasing": C.gn,
    "Closed Won": C.gn,
  };
  const openByStage = STAGE_ORDER.filter((s) => s !== "Closed Won")
    .map((stage) => {
      const list = open.filter((o) => o.stage === stage);
      return { stage, count: list.length, value: list.reduce((s, o) => s + o.a, 0) };
    })
    .filter((r) => r.count > 0);

  const openByCust = Object.values(
    open.reduce((acc: Record<string, { c: string; n: number; v: number }>, o) => {
      acc[o.c] = acc[o.c] || { c: o.c, n: 0, v: 0 };
      acc[o.c].n += 1;
      acc[o.c].v += o.a;
      return acc;
    }, {}),
  ).sort((a, b) => b.v - a.v);

  return (
    <div>
      <Sec sub={`${all.length} active opportunities · ${open.length} open · ${won.length} won · Closed Lost hidden`}>
        Sales Pipeline
      </Sec>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPI label="Open Pipeline" value={fmt(openValue)} sub={`${open.length} opportunities`} />
        <KPI label="Weighted Pipeline" value={fmt(weighted)} sub="By stage probability" />
        <KPI label="Closed Won" value={fmt(wonValue)} sub={`${won.length} opportunities`} />
        <KPI label="YTD Sales (linked items)" value={fmt(ytdLinked)} sub={`From ${taggedCount} opps with SKU tagged`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
        <Cd title="Open pipeline by stage">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={openByStage} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid stroke={C.bd} strokeDasharray="3 3" />
                <XAxis type="number" stroke={C.mt} fontSize={11} tickFormatter={(v) => fmt(v)} />
                <YAxis type="category" dataKey="stage" stroke={C.mt} fontSize={11} width={140} />
                <Tooltip content={<TT />} />
                <Bar dataKey="value" name="Pipeline value" radius={[0, 4, 4, 0]}>
                  {openByStage.map((d, i) => (
                    <Cell key={i} fill={STAGE_COLOR[d.stage] || C.ac} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Cd>
        <Cd title="Open pipeline by customer">
          <div style={{ overflowY: "auto", maxHeight: 260 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <TH left>Customer</TH>
                  <TH>#</TH>
                  <TH>Value</TH>
                </tr>
              </thead>
              <tbody>
                {openByCust.map((r) => (
                  <tr key={r.c}>
                    <TD left bold>{r.c}</TD>
                    <TD>{r.n}</TD>
                    <TD>{ff(r.v)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Cd>
      </div>

      <div style={{ marginTop: 24 }}>
        <Cd title="Open & won opportunities (sorted by value)">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1040 }}>
              <thead>
                <tr>
                  <TH left>Opp</TH>
                  <TH left>Customer</TH>
                  <TH left>Title</TH>
                  <TH>Date</TH>
                  <TH>Stage</TH>
                  <TH>Prob</TH>
                  <TH>Amount</TH>
                  <TH>Weighted</TH>
                  <TH>YTD'26 Sales</TH>
                </tr>
              </thead>
              <tbody>
                {all.map((o) => (
                  <tr key={o.id}>
                    <TD left bold>{o.id}</TD>
                    <TD left>{o.c}</TD>
                    <TD left>
                      <span style={{ fontSize: 12, color: C.mt }}>{o.t}</span>
                    </TD>
                    <TD>{o.d}</TD>
                    <TD color={STAGE_COLOR[o.stage] || C.tx}>{o.stage}</TD>
                    <TD>{o.p}%</TD>
                    <TD>{ff(o.a)}</TD>
                    <TD>{ff((o.a * o.p) / 100)}</TD>
                    <TD color={o.ps === null ? C.mt : o.ps > 0 ? C.gn : C.tx}>
                      {o.ps === null ? "—" : o.ps === 0 ? "$0" : ff(o.ps)}
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: C.mt }}>
            "YTD'26 Sales" sums invoiced revenue Jan–Apr 2026 across the SKU(s) linked to each opportunity. <strong style={{ color: C.tx }}>"—"</strong> means the opp was created against the generic <em>Quoted Item</em> / <em>Bulk Procurement</em> placeholder in NetSuite, so there's no real SKU to match against.
          </div>
        </Cd>
      </div>
    </div>
  );
}
