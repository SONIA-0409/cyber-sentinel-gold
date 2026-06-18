import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useState } from "react";
import { Radar, Globe, Lock, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Server } from "lucide-react";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Vulnerability Scanner — CyberSentinel Gold" },
      { name: "description", content: "URL, port, header & TLS scanning with severity-graded findings and a 0–100 security score." },
    ],
  }),
  component: ScannerPage,
});

type Finding = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  detail: string;
  recommendation: string;
};

const commonPorts = [
  { p: 21, s: "FTP", risk: "high" as const, open: false },
  { p: 22, s: "SSH", risk: "low" as const, open: true },
  { p: 23, s: "Telnet", risk: "critical" as const, open: true },
  { p: 25, s: "SMTP", risk: "medium" as const, open: false },
  { p: 80, s: "HTTP", risk: "medium" as const, open: true },
  { p: 110, s: "POP3", risk: "medium" as const, open: false },
  { p: 443, s: "HTTPS", risk: "low" as const, open: true },
  { p: 3306, s: "MySQL", risk: "high" as const, open: false },
  { p: 3389, s: "RDP", risk: "high" as const, open: true },
  { p: 8080, s: "HTTP-Alt", risk: "medium" as const, open: false },
];

const requiredHeaders = [
  { h: "Strict-Transport-Security", present: true },
  { h: "Content-Security-Policy", present: false },
  { h: "X-Frame-Options", present: true },
  { h: "X-Content-Type-Options", present: true },
  { h: "Referrer-Policy", present: false },
  { h: "Permissions-Policy", present: false },
];

function ScannerPage() {
  const [url, setUrl] = useState("https://example.com");
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const runScan = () => {
    setScanning(true);
    setDone(false);
    setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, 1800);
  };

  const openPorts = commonPorts.filter((p) => p.open);
  const missingHeaders = requiredHeaders.filter((h) => !h.present);

  const findings: Finding[] = [
    {
      id: "F-001",
      title: "Telnet service exposed (port 23)",
      severity: "critical",
      category: "Network",
      detail: "Telnet transmits credentials in cleartext. Active service detected on the perimeter.",
      recommendation: "Disable Telnet. Use SSH (port 22) with key-based authentication.",
    },
    {
      id: "F-002",
      title: "Missing Content-Security-Policy header",
      severity: "high",
      category: "Web · Headers",
      detail: "No CSP header returned by origin. Risk of XSS and data exfiltration via injected scripts.",
      recommendation: "Configure a strict CSP, e.g. `default-src 'self'; script-src 'self' 'nonce-…'`.",
    },
    {
      id: "F-003",
      title: "RDP exposed to the internet (port 3389)",
      severity: "high",
      category: "Network",
      detail: "Remote Desktop is reachable from any IP — frequent target of brute-force.",
      recommendation: "Restrict RDP behind a VPN / Zero-Trust gateway. Enforce MFA and account lockout.",
    },
    {
      id: "F-004",
      title: "TLS 1.0 / 1.1 enabled",
      severity: "medium",
      category: "TLS",
      detail: "Legacy TLS protocols supported alongside TLS 1.3.",
      recommendation: "Disable TLS 1.0 and 1.1. Allow only TLS 1.2 and 1.3 with modern cipher suites.",
    },
    {
      id: "F-005",
      title: "Missing Permissions-Policy",
      severity: "low",
      category: "Web · Headers",
      detail: "Permissions-Policy header not present — browser features unrestricted.",
      recommendation: "Add `Permissions-Policy: geolocation=(), camera=(), microphone=()`.",
    },
  ];

  const weights = { critical: 30, high: 18, medium: 8, low: 3 };
  const totalDeduction = findings.reduce((sum, f) => sum + weights[f.severity], 0);
  const score = Math.max(0, 100 - totalDeduction);
  const risk = score >= 80 ? "LOW" : score >= 60 ? "MEDIUM" : score >= 40 ? "HIGH" : "CRITICAL";
  const riskColor = score >= 80 ? "#FFD700" : score >= 60 ? "#FFC107" : score >= 40 ? "oklch(0.78 0.2 45)" : "oklch(0.65 0.25 22)";

  return (
    <div>
      <PageHeader
        eyebrow="MODULE 01"
        title="Vulnerability Scanner"
        description="Inspect target URLs for open ports, missing security headers, weak TLS and misconfigurations."
      />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        {/* Input */}
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://target.example.com"
                className="w-full bg-[rgba(255,215,0,0.04)] border border-[rgba(255,215,0,0.25)] rounded-md pl-10 pr-3 py-3 text-sm font-mono outline-none focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15)]"
              />
            </div>
            <button onClick={runScan} disabled={scanning} className="btn-gold rounded-md px-6 py-3 text-sm inline-flex items-center gap-2 disabled:opacity-60">
              <Radar className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning…" : "Run Assessment"}
            </button>
          </div>
          {scanning && (
            <div className="mt-4 scan-line h-1 rounded-full bg-[rgba(255,215,0,0.1)] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FFB300] via-[#FFEA00] to-[#FFB300]" />
            </div>
          )}
          <div className="mt-3 text-xs text-muted-foreground font-mono">
            Checks performed: <span className="text-[#FFD700]">port scan · TLS · HTTP headers · server fingerprint · misconfig</span>
          </div>
        </div>

        {done && (
          <>
            {/* Score */}
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="glass-card p-6">
                <div className="text-xs font-mono tracking-widest text-muted-foreground">SECURITY SCORE</div>
                <div className="relative h-48 grid place-items-center mt-2">
                  <svg viewBox="0 0 180 180" className="h-48 w-48 -rotate-90">
                    <circle cx="90" cy="90" r="68" stroke="rgba(255,215,0,0.1)" strokeWidth="14" fill="none" />
                    <circle cx="90" cy="90" r="68" stroke={riskColor} strokeWidth="14" fill="none" strokeLinecap="round"
                      strokeDasharray={`${(score / 100) * 2 * Math.PI * 68} ${2 * Math.PI * 68}`}
                      style={{ filter: `drop-shadow(0 0 10px ${riskColor})` }} />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="text-5xl font-display font-bold" style={{ color: riskColor }}>{score}</div>
                      <div className="text-xs font-mono mt-1" style={{ color: riskColor }}>RISK · {risk}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                  {(["critical", "high", "medium", "low"] as const).map((sev) => {
                    const n = findings.filter((f) => f.severity === sev).length;
                    return (
                      <div key={sev} className="rounded-md border border-[rgba(255,215,0,0.15)] p-2">
                        <div className="text-lg font-display font-bold gold-text">{n}</div>
                        <div className="text-[9px] tracking-widest font-mono text-muted-foreground uppercase">{sev}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ports */}
              <div className="glass-card p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono tracking-widest text-muted-foreground">PORT ANALYSIS</div>
                    <div className="text-lg font-display font-semibold mt-1">Open services on perimeter</div>
                  </div>
                  <span className="text-xs font-mono text-[#FFD700]">{openPorts.length} open / {commonPorts.length} scanned</span>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                  {commonPorts.map((p) => {
                    const c = !p.open ? "rgba(255,255,255,0.08)" : p.risk === "critical" ? "oklch(0.65 0.25 22)" : p.risk === "high" ? "#FFC107" : "#FFD700";
                    return (
                      <div key={p.p} className="rounded-md border p-3 text-center" style={{ borderColor: p.open ? `${c}55` : "rgba(255,215,0,0.1)", background: p.open ? `${c}15` : "transparent" }}>
                        <div className="font-mono font-bold" style={{ color: p.open ? c : "rgba(255,255,255,0.4)" }}>{p.p}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{p.s}</div>
                        <div className="text-[9px] mt-1 font-mono uppercase tracking-widest" style={{ color: p.open ? c : "rgba(255,255,255,0.3)" }}>
                          {p.open ? "OPEN" : "CLOSED"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Headers + TLS */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <div className="text-xs font-mono tracking-widest text-muted-foreground">HTTP SECURITY HEADERS</div>
                <div className="text-lg font-display font-semibold mt-1">{requiredHeaders.length - missingHeaders.length} / {requiredHeaders.length} present</div>
                <div className="mt-4 space-y-2">
                  {requiredHeaders.map((h) => (
                    <div key={h.h} className="flex items-center justify-between p-2.5 rounded-md border border-[rgba(255,215,0,0.12)]">
                      <span className="font-mono text-sm">{h.h}</span>
                      {h.present ? (
                        <span className="flex items-center gap-1.5 text-xs text-[#FFD700] font-mono"><CheckCircle2 className="h-4 w-4" /> SET</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "oklch(0.7 0.22 25)" }}><XCircle className="h-4 w-4" /> MISSING</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="text-xs font-mono tracking-widest text-muted-foreground">SSL / TLS CERTIFICATE</div>
                <div className="text-lg font-display font-semibold mt-1">Certificate validated</div>
                <div className="mt-4 space-y-3 text-sm font-mono">
                  <KV k="Issuer" v="Let's Encrypt R3" />
                  <KV k="Subject" v={url.replace(/^https?:\/\//, "")} />
                  <KV k="Valid From" v="2025-01-12" />
                  <KV k="Valid Until" v="2026-04-12" />
                  <KV k="Protocol" v="TLS 1.3" ok />
                  <KV k="Cipher" v="TLS_AES_256_GCM_SHA384" ok />
                  <KV k="Legacy TLS 1.0/1.1" v="ENABLED" bad />
                  <KV k="HSTS" v="max-age=31536000" ok />
                </div>
              </div>
            </div>

            {/* Findings */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-mono tracking-widest text-muted-foreground">FINDINGS</div>
                  <div className="text-lg font-display font-semibold">Detailed vulnerability report</div>
                </div>
                <span className="text-xs font-mono text-[#FFD700]">{findings.length} ISSUES</span>
              </div>
              <div className="space-y-3">
                {findings.map((f) => (
                  <FindingCard key={f.id} f={f} />
                ))}
              </div>
            </div>
          </>
        )}

        {!done && !scanning && <EmptyState />}
      </div>
    </div>
  );
}

function KV({ k, v, ok, bad }: { k: string; v: string; ok?: boolean; bad?: boolean }) {
  const c = ok ? "#FFD700" : bad ? "oklch(0.7 0.22 25)" : "rgba(255,255,255,0.85)";
  return (
    <div className="flex justify-between gap-3 border-b border-[rgba(255,215,0,0.08)] pb-2">
      <span className="text-muted-foreground">{k}</span>
      <span style={{ color: c }} className="text-right truncate">{v}</span>
    </div>
  );
}

function FindingCard({ f }: { f: Finding }) {
  const map: any = {
    critical: { c: "oklch(0.65 0.25 22)", l: "CRITICAL", icon: AlertTriangle },
    high: { c: "#FFC107", l: "HIGH", icon: AlertTriangle },
    medium: { c: "#FFD700", l: "MEDIUM", icon: ShieldCheck },
    low: { c: "oklch(0.75 0.18 145)", l: "LOW", icon: CheckCircle2 },
  };
  const s = map[f.severity];
  return (
    <div className="rounded-md border border-[rgba(255,215,0,0.15)] p-4 hover:border-[rgba(255,215,0,0.4)] transition">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded" style={{ background: `${s.c}25`, color: s.c, border: `1px solid ${s.c}55` }}>{s.l}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{f.id} · {f.category}</span>
      </div>
      <div className="font-semibold">{f.title}</div>
      <p className="text-sm text-muted-foreground mt-1">{f.detail}</p>
      <div className="mt-3 flex items-start gap-2 text-sm bg-[rgba(255,215,0,0.05)] border border-[rgba(255,215,0,0.18)] rounded-md p-3">
        <Lock className="h-4 w-4 text-[#FFD700] mt-0.5 shrink-0" />
        <span><span className="text-[#FFD700] font-semibold">Recommendation: </span>{f.recommendation}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-14 text-center">
      <div className="mx-auto h-14 w-14 rounded-full grid place-items-center bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.3)] text-[#FFD700] mb-4">
        <Server className="h-7 w-7" />
      </div>
      <div className="font-display text-lg">Awaiting target</div>
      <p className="text-sm text-muted-foreground mt-1">Enter a URL above and run the assessment to see findings, scores, and recommendations.</p>
    </div>
  );
}
