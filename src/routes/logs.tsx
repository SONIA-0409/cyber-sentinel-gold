import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useMemo, useState } from "react";
import { Upload, Activity, AlertTriangle, ShieldAlert, FileText } from "lucide-react";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Log Analyzer — CyberSentinel Gold" },
      { name: "description", content: "Detect brute-force attempts, suspicious IPs and attack patterns from your server logs." },
    ],
  }),
  component: LogsPage,
});

const SAMPLE = `2025-06-12 09:14:01 sshd[2014]: Failed password for root from 185.220.101.42 port 51234
2025-06-12 09:14:03 sshd[2014]: Failed password for root from 185.220.101.42 port 51235
2025-06-12 09:14:05 sshd[2014]: Failed password for admin from 185.220.101.42 port 51236
2025-06-12 09:14:09 sshd[2014]: Failed password for root from 185.220.101.42 port 51237
2025-06-12 09:14:11 sshd[2014]: Failed password for ubuntu from 185.220.101.42 port 51238
2025-06-12 09:14:14 sshd[2014]: Failed password for root from 185.220.101.42 port 51239
2025-06-12 09:14:17 sshd[2014]: Failed password for postgres from 185.220.101.42 port 51240
2025-06-12 09:14:30 sshd[2032]: Accepted password for analyst from 10.0.0.14 port 44120
2025-06-12 09:15:22 sshd[2090]: Failed password for root from 45.155.205.211 port 39201
2025-06-12 09:15:25 sshd[2090]: Failed password for root from 45.155.205.211 port 39202
2025-06-12 09:15:28 sshd[2090]: Failed password for root from 45.155.205.211 port 39203
2025-06-12 09:18:11 nginx: 192.168.4.22 - - "GET /admin HTTP/1.1" 401
2025-06-12 09:18:14 nginx: 192.168.4.22 - - "GET /wp-admin HTTP/1.1" 401
2025-06-12 09:18:17 nginx: 192.168.4.22 - - "GET /.env HTTP/1.1" 404
2025-06-12 09:18:19 nginx: 192.168.4.22 - - "GET /config.php HTTP/1.1" 404
2025-06-12 09:20:01 sshd[2120]: Accepted publickey for analyst from 10.0.0.14 port 44190
2025-06-12 09:22:48 sshd[2240]: Failed password for guest from 91.240.118.172 port 60201
2025-06-12 09:22:51 sshd[2240]: Failed password for test from 91.240.118.172 port 60202
2025-06-12 09:22:54 sshd[2240]: Failed password for root from 91.240.118.172 port 60203
2025-06-12 09:25:11 sshd[2310]: Accepted password for ops from 10.0.0.20 port 50112`;

function LogsPage() {
  const [text, setText] = useState(SAMPLE);
  const analysis = useMemo(() => analyze(text), [text]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setText(await f.text());
  };

  return (
    <div>
      <PageHeader
        eyebrow="MODULE 02"
        title="Log Analyzer"
        description="Parse server logs to identify failed logins, brute-force patterns and suspicious actors."
        actions={
          <>
            <label className="btn-ghost-gold rounded-md px-5 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" /> Upload Log File
              <input type="file" accept=".log,.txt" className="hidden" onChange={onFile} />
            </label>
            <button onClick={() => setText(SAMPLE)} className="btn-gold rounded-md px-5 py-2.5 text-sm">Load Sample</button>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Stat label="Total Events" v={analysis.total} />
          <Stat label="Failed Logins" v={analysis.failed} tone="warning" />
          <Stat label="Brute-Force IPs" v={analysis.bruteIps.length} tone="critical" />
          <Stat label="Successful Logins" v={analysis.success} />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground">EVENT TIMELINE</div>
                <div className="text-lg font-display font-semibold">Failed vs successful per minute</div>
              </div>
              <Activity className="h-4 w-4 text-[#FFD700]" />
            </div>
            <TimelineChart bins={analysis.timeline} />
          </div>

          <div className="glass-card p-6">
            <div className="text-xs font-mono tracking-widest text-muted-foreground">RISK ASSESSMENT</div>
            <div className="text-lg font-display font-semibold mt-1">{analysis.riskLabel}</div>
            <div className="mt-3 text-sm text-muted-foreground">{analysis.riskNote}</div>
            <div className="mt-4 space-y-2">
              {analysis.bruteIps.length > 0 && (
                <Alert color="oklch(0.65 0.25 22)" icon={ShieldAlert}>
                  Brute-force activity from <span className="font-mono">{analysis.bruteIps[0].ip}</span> ({analysis.bruteIps[0].count} attempts)
                </Alert>
              )}
              {analysis.failed > 10 && (
                <Alert color="#FFC107" icon={AlertTriangle}>High volume of failed logins detected.</Alert>
              )}
              {analysis.scanned > 0 && (
                <Alert color="#FFD700" icon={FileText}>{analysis.scanned} probing attempts to sensitive paths (.env, /admin).</Alert>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-mono tracking-widest text-muted-foreground">SUSPICIOUS IP TABLE</div>
              <div className="text-lg font-display font-semibold">Attack source intelligence</div>
            </div>
            <span className="text-xs font-mono text-[#FFD700]">{analysis.ipTable.length} IPs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] font-mono tracking-widest text-muted-foreground border-b border-[rgba(255,215,0,0.15)]">
                <tr>
                  <th className="py-2 pr-4">IP ADDRESS</th>
                  <th className="py-2 pr-4">ATTEMPTS</th>
                  <th className="py-2 pr-4">SUCCESS</th>
                  <th className="py-2 pr-4">CLASSIFICATION</th>
                  <th className="py-2 pr-4">SEVERITY</th>
                </tr>
              </thead>
              <tbody>
                {analysis.ipTable.map((r) => (
                  <tr key={r.ip} className="border-b border-[rgba(255,215,0,0.08)] hover:bg-[rgba(255,215,0,0.03)]">
                    <td className="py-3 pr-4 font-mono text-[#FFD700]">{r.ip}</td>
                    <td className="py-3 pr-4 font-mono">{r.count}</td>
                    <td className="py-3 pr-4 font-mono">{r.success}</td>
                    <td className="py-3 pr-4">{r.label}</td>
                    <td className="py-3 pr-4">
                      <SevBadge sev={r.sev} />
                    </td>
                  </tr>
                ))}
                {analysis.ipTable.length === 0 && (
                  <tr><td className="py-6 text-center text-muted-foreground" colSpan={5}>No suspicious IPs.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="text-xs font-mono tracking-widest text-muted-foreground mb-2">RAW LOG</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            className="w-full h-72 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-4 font-mono text-xs outline-none focus:border-[#FFD700]" />
        </div>
      </div>
    </div>
  );
}

function analyze(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const total = lines.length;
  let failed = 0, success = 0, scanned = 0;
  const ipMap = new Map<string, { count: number; success: number }>();
  const timeBins = new Map<string, { fail: number; ok: number }>();

  for (const line of lines) {
    const ipMatch = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    const ip = ipMatch?.[1];
    const time = line.match(/(\d{2}:\d{2})/)?.[1] || "00:00";
    if (!timeBins.has(time)) timeBins.set(time, { fail: 0, ok: 0 });

    if (/Failed password/i.test(line)) {
      failed++;
      if (ip) {
        const r = ipMap.get(ip) ?? { count: 0, success: 0 };
        r.count++; ipMap.set(ip, r);
      }
      timeBins.get(time)!.fail++;
    } else if (/Accepted (password|publickey)/i.test(line)) {
      success++;
      if (ip) {
        const r = ipMap.get(ip) ?? { count: 0, success: 0 };
        r.success++; ipMap.set(ip, r);
      }
      timeBins.get(time)!.ok++;
    }
    if (/(\.env|wp-admin|\/admin|config\.php)/i.test(line)) {
      scanned++;
      if (ip) {
        const r = ipMap.get(ip) ?? { count: 0, success: 0 };
        r.count++; ipMap.set(ip, r);
      }
    }
  }

  const ipTable = [...ipMap.entries()]
    .map(([ip, { count, success }]) => {
      const sev: "critical" | "high" | "medium" | "low" =
        count >= 6 ? "critical" : count >= 3 ? "high" : count >= 2 ? "medium" : "low";
      const label = success === 0 && count >= 3 ? "Brute-force"
        : count >= 3 ? "Suspicious"
        : success > 0 ? "Authenticated"
        : "Probing";
      return { ip, count, success, sev, label };
    })
    .sort((a, b) => b.count - a.count);

  const bruteIps = ipTable.filter((r) => r.sev === "critical" || r.label === "Brute-force");

  const timeline = [...timeBins.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([t, v]) => ({ t, ...v }));

  const riskScore = bruteIps.length * 30 + scanned * 5 + failed * 2;
  const riskLabel = riskScore >= 100 ? "Critical Risk" : riskScore >= 50 ? "High Risk" : riskScore >= 20 ? "Moderate Risk" : "Low Risk";
  const riskNote = riskScore >= 100 ? "Immediate response required: active brute-force and reconnaissance detected."
    : riskScore >= 50 ? "Elevated activity — block offending IPs and enable account lockout."
    : riskScore >= 20 ? "Some malicious activity. Review failed logins and tighten authentication."
    : "Baseline activity. Continue monitoring.";

  return { total, failed, success, scanned, ipTable, bruteIps, timeline, riskLabel, riskNote };
}

function Stat({ label, v, tone }: { label: string; v: number; tone?: "warning" | "critical" }) {
  const c = tone === "critical" ? "oklch(0.7 0.22 25)" : tone === "warning" ? "#FFC107" : "#FFD700";
  return (
    <div className="glass-card p-5">
      <div className="text-3xl font-display font-bold" style={{ color: c, textShadow: `0 0 14px ${c}50` }}>{v}</div>
      <div className="text-xs tracking-widest uppercase text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function TimelineChart({ bins }: { bins: { t: string; fail: number; ok: number }[] }) {
  if (bins.length === 0) return <div className="text-sm text-muted-foreground py-10 text-center">No data.</div>;
  const max = Math.max(1, ...bins.map((b) => b.fail + b.ok));
  return (
    <div className="mt-4 h-48 flex items-end gap-1">
      {bins.map((b, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group">
          <div className="w-full flex flex-col-reverse" style={{ height: "100%" }}>
            <div className="w-full" style={{ height: `${(b.ok / max) * 100}%`, background: "linear-gradient(180deg, #FFD700, #FFB300)" }} />
            <div className="w-full" style={{ height: `${(b.fail / max) * 100}%`, background: "linear-gradient(180deg, oklch(0.7 0.22 25), oklch(0.55 0.22 25))" }} />
          </div>
          <div className="text-[8px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition">{b.t}</div>
        </div>
      ))}
    </div>
  );
}

function Alert({ children, color, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-md border text-xs" style={{ background: `${color}10`, borderColor: `${color}45`, color }}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <span className="text-foreground">{children}</span>
    </div>
  );
}

function SevBadge({ sev }: { sev: string }) {
  const map: any = {
    critical: { c: "oklch(0.7 0.22 25)", l: "CRITICAL" },
    high: { c: "#FFC107", l: "HIGH" },
    medium: { c: "#FFD700", l: "MEDIUM" },
    low: { c: "oklch(0.75 0.18 145)", l: "LOW" },
  };
  const s = map[sev];
  return (
    <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded" style={{ background: `${s.c}25`, color: s.c, border: `1px solid ${s.c}55` }}>
      {s.l}
    </span>
  );
}
