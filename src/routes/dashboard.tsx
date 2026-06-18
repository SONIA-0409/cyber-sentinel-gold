import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import {
  AlertTriangle, Shield, Activity, Server, Globe, Lock, Eye, TrendingUp,
  ArrowRight, Radar, Cpu, Wifi, Bug,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Risk Intelligence Dashboard — CyberSentinel Gold" },
      { name: "description", content: "Live security posture: risk distribution, threat heatmap, vulnerability stats and performance metrics." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="RISK INTELLIGENCE"
        title="Security Operations Center"
        description="Real-time overview of your security posture, vulnerabilities and active threats."
        actions={
          <>
            <Link to="/scanner" className="btn-gold rounded-md px-5 py-2.5 text-sm inline-flex items-center gap-2"><Radar className="h-4 w-4" /> Run Scan</Link>
            <Link to="/reports" className="btn-ghost-gold rounded-md px-5 py-2.5 text-sm inline-flex items-center gap-2">Export Report</Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        {/* Top KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Kpi icon={Shield} label="Security Score" value="87" suffix="/100" tone="gold" trend="+3.2%" />
          <Kpi icon={Bug} label="Open Vulnerabilities" value="42" tone="warning" trend="-8" />
          <Kpi icon={AlertTriangle} label="Active Threats" value="14" tone="critical" trend="+2" />
          <Kpi icon={Eye} label="Assets Monitored" value="248" tone="gold" trend="+12" />
        </div>

        {/* Score + risk distribution */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass-card p-6 lg:col-span-1">
            <div className="text-xs font-mono tracking-widest text-muted-foreground">OVERALL SECURITY SCORE</div>
            <BigGauge value={87} />
            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">Posture rating</div>
              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] text-[#FFD700] text-xs font-mono">
                STRONG · LOW RISK
              </div>
            </div>
          </div>

          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono tracking-widest text-muted-foreground">RISK DISTRIBUTION</div>
              <div className="text-xs text-[#FFD700] font-mono">LAST 30 DAYS</div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: "Critical", v: 6, max: 50, color: "oklch(0.65 0.25 22)" },
                { label: "High", v: 14, max: 50, color: "oklch(0.78 0.2 45)" },
                { label: "Medium", v: 22, max: 50, color: "#FFC107" },
                { label: "Low", v: 38, max: 50, color: "#FFD700" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-mono text-foreground">{r.v}</span>
                  </div>
                  <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(r.v / r.max) * 100}%`, background: `linear-gradient(90deg, ${r.color}, #FFEA00)`, boxShadow: `0 0 10px ${r.color}` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3 text-center">
              {[
                { l: "Web Apps", v: 18 },
                { l: "APIs", v: 9 },
                { l: "Network", v: 12 },
                { l: "Infra", v: 3 },
              ].map((x) => (
                <div key={x.l} className="rounded-md border border-[rgba(255,215,0,0.15)] py-3">
                  <div className="text-xl font-display font-bold gold-text">{x.v}</div>
                  <div className="text-[10px] tracking-widest font-mono text-muted-foreground">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trends + heatmap */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground">THREAT TREND</div>
                <div className="text-lg font-display font-semibold mt-1">Last 14 days</div>
              </div>
              <div className="text-xs text-[#FFD700] font-mono flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />+12.4% vs prev</div>
            </div>
            <TrendChart />
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
              <Legend color="#FFEA00" label="Detected" />
              <Legend color="#FFC107" label="Blocked" />
              <Legend color="oklch(0.65 0.25 22)" label="Critical" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="text-xs font-mono tracking-widest text-muted-foreground">THREAT HEATMAP</div>
            <div className="text-lg font-display font-semibold mt-1">Activity intensity</div>
            <Heatmap />
            <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-muted-foreground">
              <span>LOW</span>
              <div className="flex gap-0.5">
                {[0.1, 0.25, 0.45, 0.7, 1].map((o, i) => (
                  <div key={i} className="h-3 w-6 rounded-sm" style={{ background: `rgba(255, 215, 0, ${o})` }} />
                ))}
              </div>
              <span>HIGH</span>
            </div>
          </div>
        </div>

        {/* Bottom: alerts + perf */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-mono tracking-widest text-muted-foreground">SECURITY ALERTS</div>
              <span className="text-xs text-[#FFD700] font-mono">14 ACTIVE</span>
            </div>
            <div className="space-y-2">
              {[
                { sev: "critical", msg: "Brute-force attempts on api.corp.local", t: "2m ago" },
                { sev: "high", msg: "Expired TLS certificate on auth.corp.local", t: "18m ago" },
                { sev: "medium", msg: "Missing Strict-Transport-Security header", t: "1h ago" },
                { sev: "high", msg: "Port 23 (Telnet) exposed on edge node", t: "3h ago" },
                { sev: "low", msg: "Outdated jQuery 1.12 detected", t: "5h ago" },
              ].map((a, i) => (
                <AlertRow key={i} {...a} />
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="text-xs font-mono tracking-widest text-muted-foreground">PERFORMANCE METRICS</div>
            <div className="text-lg font-display font-semibold mt-1">SOC Operations</div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Metric icon={Activity} label="MTTD" value="3m 42s" />
              <Metric icon={Cpu} label="MTTR" value="14m" />
              <Metric icon={Wifi} label="Uptime" value="99.98%" />
              <Metric icon={Server} label="Coverage" value="94%" />
              <Metric icon={Lock} label="Encrypted" value="100%" />
              <Metric icon={Globe} label="Geos" value="12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, suffix, tone, trend }: any) {
  const tc = tone === "critical" ? "oklch(0.7 0.22 25)" : tone === "warning" ? "#FFC107" : "#FFD700";
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-md grid place-items-center bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.25)]">
          <Icon className="h-5 w-5" style={{ color: tc }} />
        </div>
        <span className="text-xs font-mono text-muted-foreground">{trend}</span>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-display font-bold" style={{ color: tc, textShadow: `0 0 14px ${tc}50` }}>{value}</span>
        {suffix && <span className="text-sm text-muted-foreground font-mono">{suffix}</span>}
      </div>
      <div className="mt-1 text-xs tracking-widest uppercase text-muted-foreground">{label}</div>
    </div>
  );
}

function BigGauge({ value }: { value: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-52 grid place-items-center mt-4">
      <svg viewBox="0 0 180 180" className="h-52 w-52 -rotate-90">
        <circle cx="90" cy="90" r={r} stroke="rgba(255,215,0,0.1)" strokeWidth="14" fill="none" />
        <circle cx="90" cy="90" r={r} stroke="url(#bg)" strokeWidth="14" fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`} style={{ filter: "drop-shadow(0 0 10px rgba(255,215,0,0.6))" }} />
        <defs>
          <linearGradient id="bg" x1="0" x2="1">
            <stop offset="0" stopColor="#FFB300" /><stop offset="1" stopColor="#FFEA00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-5xl font-display font-bold gold-text">{value}</div>
          <div className="text-xs text-muted-foreground font-mono mt-1">OUT OF 100</div>
        </div>
      </div>
    </div>
  );
}

function TrendChart() {
  const data = Array.from({ length: 14 }, (_, i) => ({ d: i, a: 30 + Math.sin(i / 2) * 18 + i * 2, b: 20 + Math.cos(i / 3) * 12 + i * 1.5 }));
  const max = 80;
  return (
    <div className="mt-5 relative h-48">
      <svg viewBox="0 0 280 120" className="w-full h-full">
        <defs>
          <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FFEA00" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFEA00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" x2="280" y1={i * 30} y2={i * 30} stroke="rgba(255,215,0,0.08)" />
        ))}
        <path d={`M ${data.map((p, i) => `${(i / 13) * 280} ${120 - (p.a / max) * 120}`).join(" L ")} L 280 120 L 0 120 Z`} fill="url(#ga)" />
        <path d={`M ${data.map((p, i) => `${(i / 13) * 280} ${120 - (p.a / max) * 120}`).join(" L ")}`} fill="none" stroke="#FFEA00" strokeWidth="2" style={{ filter: "drop-shadow(0 0 4px #FFEA00)" }} />
        <path d={`M ${data.map((p, i) => `${(i / 13) * 280} ${120 - (p.b / max) * 120}`).join(" L ")}`} fill="none" stroke="#FFC107" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      </svg>
    </div>
  );
}

function Heatmap() {
  return (
    <div className="mt-5 grid grid-cols-12 gap-1">
      {Array.from({ length: 84 }).map((_, i) => {
        const intensity = Math.abs(Math.sin(i * 1.3) * Math.cos(i / 5));
        return (
          <div
            key={i}
            className="aspect-square rounded-sm"
            style={{
              background: `rgba(255, 215, 0, ${intensity * 0.9 + 0.05})`,
              boxShadow: intensity > 0.7 ? `0 0 8px rgba(255, 215, 0, ${intensity})` : "none",
            }}
            title={`Intensity ${(intensity * 100).toFixed(0)}%`}
          />
        );
      })}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </div>
  );
}

function AlertRow({ sev, msg, t }: { sev: string; msg: string; t: string }) {
  const map: any = {
    critical: { c: "oklch(0.7 0.22 25)", l: "CRITICAL" },
    high: { c: "#FFC107", l: "HIGH" },
    medium: { c: "#FFD700", l: "MEDIUM" },
    low: { c: "oklch(0.75 0.18 145)", l: "LOW" },
  };
  const s = map[sev];
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-[rgba(255,215,0,0.1)] hover:bg-[rgba(255,215,0,0.03)] transition">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded shrink-0" style={{ background: `${s.c}20`, color: s.c, border: `1px solid ${s.c}55` }}>
          {s.l}
        </span>
        <span className="text-sm truncate">{msg}</span>
      </div>
      <span className="text-xs text-muted-foreground font-mono shrink-0">{t}</span>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[rgba(255,215,0,0.15)] p-3">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-[#FFD700]" />
        <span className="text-[10px] tracking-widest text-muted-foreground font-mono">{label}</span>
      </div>
      <div className="mt-2 text-xl font-display font-bold gold-text">{value}</div>
    </div>
  );
}
