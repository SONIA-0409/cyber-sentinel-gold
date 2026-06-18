import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { FileText, Printer, Download, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Security Report Center — CyberSentinel Gold" },
      { name: "description", content: "Generate professional, print-ready executive security reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const print = () => window.print();

  return (
    <div>
      <PageHeader
        eyebrow="MODULE 06"
        title="Security Report Center"
        description="Executive-ready PDF reports combining vulnerability findings, threat analysis and AI recommendations."
        actions={
          <>
            <button onClick={print} className="btn-ghost-gold rounded-md px-5 py-2.5 text-sm inline-flex items-center gap-2">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={print} className="btn-gold rounded-md px-5 py-2.5 text-sm inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="glass-card p-8 md:p-12 print:bg-white print:text-black print:border-none">
          {/* Report Header */}
          <div className="border-b border-[rgba(255,215,0,0.25)] pb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md grid place-items-center bg-gradient-to-br from-[#FFB300] to-[#FFEA00] text-black">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="font-display font-bold text-xl gold-text">CYBERSENTINEL GOLD</div>
                <div className="text-xs font-mono text-muted-foreground">Security Assessment Report</div>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-muted-foreground">
              <div>REPORT #CSG-2026-0418</div>
              <div>{new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</div>
              <div>CLASSIFICATION: CONFIDENTIAL</div>
            </div>
          </div>

          {/* Executive Summary */}
          <Section n="01" title="Executive Summary">
            <p className="text-foreground/90">
              CyberSentinel performed a comprehensive security assessment of the target environment between
              June 14 — June 18, 2026. The assessment encompassed external surface discovery,
              vulnerability scanning, log analysis, and cryptographic posture review. Five findings
              of varying severity were identified, including one <strong className="text-[#FFD700]">critical</strong> issue
              requiring immediate remediation.
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <Box label="Security Score" v="87 / 100" />
              <Box label="Findings" v="5" />
              <Box label="Critical" v="1" tone="critical" />
              <Box label="High" v="2" tone="warning" />
            </div>
          </Section>

          <Section n="02" title="Security Score">
            <div className="flex items-center gap-6">
              <div className="text-6xl font-display font-bold gold-text">87</div>
              <div>
                <div className="text-sm text-muted-foreground">Overall Posture</div>
                <div className="text-lg font-semibold">STRONG · Low Residual Risk</div>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  The environment demonstrates mature controls. Remediation of the critical finding
                  will raise the score above the 90-point benchmark.
                </p>
              </div>
            </div>
          </Section>

          <Section n="03" title="Vulnerability Findings">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-mono tracking-widest text-muted-foreground border-b border-[rgba(255,215,0,0.2)] text-left">
                <tr><th className="py-2">ID</th><th>FINDING</th><th>SEVERITY</th><th>CATEGORY</th></tr>
              </thead>
              <tbody>
                {[
                  ["F-001", "Telnet service exposed (port 23)", "Critical", "Network"],
                  ["F-002", "Missing Content-Security-Policy header", "High", "Web"],
                  ["F-003", "RDP exposed to the internet (3389)", "High", "Network"],
                  ["F-004", "TLS 1.0 / 1.1 enabled", "Medium", "TLS"],
                  ["F-005", "Missing Permissions-Policy", "Low", "Web"],
                ].map(([id, f, s, c]) => (
                  <tr key={id} className="border-b border-[rgba(255,215,0,0.08)]">
                    <td className="py-2.5 font-mono text-[#FFD700]">{id}</td>
                    <td>{f}</td>
                    <td><span className="font-mono text-xs">{s}</span></td>
                    <td className="text-muted-foreground">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section n="04" title="Threat & Log Analysis">
            <p>3 brute-force source IPs were identified, originating predominantly from known TOR exit
              nodes. Probing attempts targeted <code className="font-mono text-[#FFD700]">.env</code> and
              <code className="font-mono text-[#FFD700]"> /admin</code> paths. No successful unauthorized
              authentications were recorded.</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>• <span className="font-mono text-[#FFD700]">185.220.101.42</span> — 7 failed SSH attempts (Brute-force)</li>
              <li>• <span className="font-mono text-[#FFD700]">45.155.205.211</span> — 3 failed SSH attempts (Suspicious)</li>
              <li>• <span className="font-mono text-[#FFD700]">192.168.4.22</span> — 4 probing attempts to sensitive paths</li>
            </ul>
          </Section>

          <Section n="05" title="Cryptography Posture">
            <p>TLS 1.3 is supported with modern AEAD cipher suites. Legacy TLS 1.0/1.1 remains enabled
              and should be disabled. HSTS is configured with a 1-year max-age. Password hashes are
              stored using bcrypt with a work factor of 12, meeting current OWASP guidance.</p>
          </Section>

          <Section n="06" title="AI Recommendations">
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li><strong className="text-[#FFD700]">Immediate:</strong> Disable Telnet service. Replace with SSH (key-based auth, MFA).</li>
              <li><strong className="text-[#FFD700]">High priority:</strong> Deploy strict CSP and remove RDP from public exposure.</li>
              <li><strong className="text-[#FFD700]">30 days:</strong> Disable TLS 1.0/1.1, enable Permissions-Policy header.</li>
              <li><strong className="text-[#FFD700]">90 days:</strong> Roll out central log aggregation with brute-force alerts.</li>
              <li><strong className="text-[#FFD700]">Ongoing:</strong> Continuous monitoring via Sentinel SOC dashboard.</li>
            </ol>
          </Section>

          <Section n="07" title="Final Risk Assessment">
            <div className="rounded-md p-4 border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.04)]">
              <div className="font-display text-lg gold-text">RESIDUAL RISK: LOW (after remediation)</div>
              <p className="text-sm mt-2">Following execution of the recommended controls, the environment is projected
                to achieve a Security Score of <strong>94 / 100</strong> within 30 days, with no critical or high-severity
                findings remaining.</p>
            </div>
          </Section>

          <div className="border-t border-[rgba(255,215,0,0.2)] pt-4 mt-8 text-xs font-mono text-muted-foreground flex justify-between">
            <span>© CyberSentinel Gold · Confidential</span>
            <span>Generated {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: any }) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="font-mono text-xs px-2 py-0.5 rounded border border-[rgba(255,215,0,0.4)] text-[#FFD700]">{n}</div>
        <h2 className="text-xl font-display font-semibold gold-text">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Box({ label, v, tone }: { label: string; v: string; tone?: "warning" | "critical" }) {
  const c = tone === "critical" ? "oklch(0.7 0.22 25)" : tone === "warning" ? "#FFC107" : "#FFD700";
  return (
    <div className="rounded-md border border-[rgba(255,215,0,0.2)] p-3">
      <div className="text-xl font-display font-bold" style={{ color: c }}>{v}</div>
      <div className="text-[10px] tracking-widest uppercase font-mono text-muted-foreground">{label}</div>
    </div>
  );
}
