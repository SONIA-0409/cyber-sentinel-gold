import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield, Activity, Lock, KeyRound, Brain, FileBarChart2, Radar, ScanLine,
  ArrowRight, CheckCircle2, AlertTriangle, Zap, Eye, Terminal, Server, Database,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberSentinel Gold — SOC-grade Cybersecurity Platform" },
      { name: "description", content: "Protect. Detect. Analyze. Secure. Enterprise vulnerability assessment, threat intelligence and cryptography in one platform." },
      { property: "og:title", content: "CyberSentinel Gold" },
      { property: "og:description", content: "Enterprise SOC-grade cybersecurity intelligence platform." },
    ],
  }),
  component: Home,
});

const modules = [
  { to: "/scanner", icon: Radar, title: "Vulnerability Scanner", desc: "URL, port, header & TLS analysis with security scoring." },
  { to: "/logs", icon: Activity, title: "Log Analyzer", desc: "Brute-force detection, suspicious IPs & attack timelines." },
  { to: "/password", icon: KeyRound, title: "Password Security", desc: "Generator, entropy & crack-time estimator." },
  { to: "/crypto", icon: Lock, title: "Cryptography Toolkit", desc: "MD5/SHA hashing, AES encrypt/decrypt, integrity check." },
  { to: "/advisor", icon: Brain, title: "AI Security Advisor", desc: "Contextual mitigation guidance & threat explanations." },
  { to: "/reports", icon: FileBarChart2, title: "Security Reports", desc: "Professional PDF / printable executive reports." },
];

const stats = [
  { v: "12,847", l: "Vulnerabilities Scanned" },
  { v: "3,902", l: "Threats Detected" },
  { v: "5,610", l: "Assessments Completed" },
  { v: "87 / 100", l: "Avg Security Score" },
];

const steps = [
  { n: "01", t: "Scan Assets", d: "Provide URLs, IPs or logs. Sentinel maps your attack surface." },
  { n: "02", t: "Analyze Vulnerabilities", d: "Inspect TLS, headers, ports and misconfigurations." },
  { n: "03", t: "Detect Threats", d: "AI correlates logs to find brute-force & suspicious activity." },
  { n: "04", t: "AI Recommendations", d: "Contextual remediation steps tuned to your risk profile." },
  { n: "05", t: "Export Reports", d: "Generate SOC-grade PDF reports for stakeholders." },
];

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#FFD700] opacity-[0.08] blur-[160px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#FFD700] font-mono mb-5 px-3 py-1.5 rounded-full border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)]">
              <Shield className="h-3 w-3" />
              SOC · THREAT INTEL · CRYPTOGRAPHY
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight">
              <span className="gold-text">Protect.</span>{" "}
              <span className="gold-text">Detect.</span>{" "}
              <span className="gold-text">Analyze.</span>{" "}
              <span className="text-foreground">Secure.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              An enterprise-grade cybersecurity intelligence platform for vulnerability assessment,
              threat detection, cryptography, and security analytics — engineered for modern SOC teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/scanner" className="btn-gold rounded-md px-6 py-3 text-sm inline-flex items-center gap-2">
                <ScanLine className="h-4 w-4" />
                Start Security Assessment
              </Link>
              <Link to="/dashboard" className="btn-ghost-gold rounded-md px-6 py-3 text-sm inline-flex items-center gap-2">
                Explore Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FFD700]" /> ISO 27001 Aligned</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FFD700]" /> OWASP Top-10 Aware</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FFD700]" /> AI-Driven Insights</span>
            </div>
          </div>

          {/* Hero Visual */}
          <HeroDashboard />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[rgba(255,215,0,0.12)] bg-[rgba(255,215,0,0.02)]">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gold-text">{s.v}</div>
              <div className="text-xs mt-1 tracking-wider uppercase text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#FFD700] font-mono mb-4 px-3 py-1 rounded-full border border-[rgba(255,215,0,0.3)]">
            <Zap className="h-3 w-3" /> MODULES
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold gold-text">Unified Security Operations</h2>
          <p className="mt-3 text-muted-foreground">Seven integrated modules covering assessment, detection, cryptography, intelligence and reporting.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Link key={m.to} to={m.to} className="glass-card glass-card-hover p-6 group block">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-lg grid place-items-center bg-gradient-to-br from-[rgba(255,215,0,0.18)] to-[rgba(255,215,0,0.04)] border border-[rgba(255,215,0,0.25)] text-[#FFD700]">
                  <m.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-[#FFD700]/60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold gold-text">How It Works</h2>
          <p className="mt-3 text-muted-foreground">From discovery to executive reporting in five clean stages.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="glass-card p-5 relative overflow-hidden">
              <div className="text-5xl font-display font-bold text-[rgba(255,215,0,0.18)] absolute -top-2 right-3">{s.n}</div>
              <div className="relative">
                <div className="text-xs font-mono text-[#FFD700] tracking-widest">STEP {i + 1}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl gold-border-glow p-10 md:p-14 text-center bg-[linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.01))]">
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-display font-bold gold-text">Ready to harden your perimeter?</h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Run your first assessment in under 30 seconds. No setup required.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/scanner" className="btn-gold rounded-md px-6 py-3 text-sm inline-flex items-center gap-2">
                <Radar className="h-4 w-4" /> Launch Scanner
              </Link>
              <Link to="/dashboard" className="btn-ghost-gold rounded-md px-6 py-3 text-sm inline-flex items-center gap-2">
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="relative fade-up">
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#FFB300]/20 via-transparent to-[#FFEA00]/20 blur-3xl rounded-3xl" />
      <div className="relative glass-card gold-border-glow p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#FFD700]">
            <Terminal className="h-3.5 w-3.5" />
            sentinel://soc/overview
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FFEA00] pulse-gold" />
            <span className="text-muted-foreground">LIVE</span>
          </div>
        </div>

        {/* Security Score Gauge */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative glass-card p-4 scan-line">
            <div className="text-[10px] tracking-widest text-muted-foreground font-mono">SECURITY SCORE</div>
            <Gauge value={87} />
            <div className="text-center text-xs text-[#FFD700] font-mono mt-1">RISK: LOW</div>
          </div>
          <div className="space-y-3">
            <MiniStat icon={AlertTriangle} label="Active Threats" value="14" tone="critical" />
            <MiniStat icon={Eye} label="Monitored Assets" value="248" />
            <MiniStat icon={Server} label="Open Ports" value="6" tone="warning" />
            <MiniStat icon={Database} label="Logs Parsed" value="92K" />
          </div>
        </div>

        {/* Mini chart */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-[10px] tracking-widest font-mono text-muted-foreground">
            <span>THREAT TIMELINE · 24H</span>
            <span className="text-[#FFD700]">+12.4%</span>
          </div>
          <SparkBars />
        </div>
      </div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-28 grid place-items-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="rgba(255,215,0,0.12)" strokeWidth="8" fill="none" />
        <circle
          cx="50" cy="50" r={r}
          stroke="url(#g)" strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ filter: "drop-shadow(0 0 6px rgba(255,215,0,0.6))" }}
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#FFB300" />
            <stop offset="1" stopColor="#FFEA00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-display font-bold gold-text leading-none">{value}</div>
          <div className="text-[9px] text-muted-foreground font-mono">/ 100</div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone?: "warning" | "critical" }) {
  const toneClass =
    tone === "critical" ? "text-[oklch(0.7_0.22_25)]" :
    tone === "warning" ? "text-[#FFC107]" :
    "text-[#FFD700]";
  return (
    <div className="flex items-center justify-between glass-card px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${toneClass}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-mono font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

function SparkBars() {
  const bars = [22, 41, 30, 55, 38, 70, 48, 62, 35, 80, 58, 45, 66, 72, 50, 88, 60, 42, 75, 58, 90, 65, 48, 70];
  return (
    <div className="mt-3 h-20 flex items-end gap-1">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: `linear-gradient(180deg, #FFEA00, #FFB300)`,
            opacity: 0.4 + (h / 200),
            boxShadow: "0 0 8px rgba(255,215,0,0.3)",
          }}
        />
      ))}
    </div>
  );
}
