import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Brain, Sparkles, Shield, AlertOctagon, Lock, Eye, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Security Advisor — CyberSentinel Gold" },
      { name: "description", content: "Contextual AI-driven security recommendations, threat explanations and mitigation guidance." },
    ],
  }),
  component: AdvisorPage,
});

const advisories = [
  {
    icon: AlertOctagon, sev: "critical", title: "Telnet exposed (Port 23)",
    threat: "Telnet transmits authentication and session data in plaintext, allowing any on-path attacker to capture credentials and session content.",
    mitigation: "Disable Telnet on all hosts. Replace with SSH (port 22) using ed25519 key-based authentication. Enforce firewall rules dropping inbound 23/tcp.",
  },
  {
    icon: Shield, sev: "high", title: "Missing Content-Security-Policy",
    threat: "Without a CSP, browsers cannot restrict resource origins — opening the application to stored / reflected XSS and data exfiltration.",
    mitigation: "Deploy a strict CSP: `default-src 'self'; script-src 'self' 'nonce-RANDOM'; object-src 'none'; base-uri 'self'`. Report violations to a monitored endpoint.",
  },
  {
    icon: Lock, sev: "high", title: "Legacy TLS 1.0/1.1 enabled",
    threat: "Legacy TLS suites are susceptible to BEAST, POODLE and downgrade attacks, and fail PCI-DSS compliance.",
    mitigation: "Disable TLS 1.0 and 1.1 at the load balancer. Allow only TLS 1.2+ with PFS cipher suites. Enable HSTS with `max-age=63072000; includeSubDomains; preload`.",
  },
  {
    icon: Eye, sev: "medium", title: "Repeated failed SSH logins from 185.220.101.42",
    threat: "Indicator of an automated brute-force attempt against privileged accounts. Even unsuccessful, it consumes resources and may precede credential stuffing.",
    mitigation: "Block the offending /24 via firewall. Deploy fail2ban with a 10-attempt / 24h ban. Disable root login. Require MFA for all SSH sessions.",
  },
  {
    icon: Zap, sev: "medium", title: "Outdated jQuery 1.12 detected",
    threat: "jQuery <3.0 contains multiple known XSS vulnerabilities (e.g. CVE-2020-11023) exploitable through untrusted HTML.",
    mitigation: "Upgrade to jQuery 3.7+ or migrate to a modern framework. Audit `.html()` and `.append()` calls for untrusted input.",
  },
];

function AdvisorPage() {
  const [q, setQ] = useState("");
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = () => {
    if (!q.trim()) return;
    setThinking(true);
    setAnswer(null);
    setTimeout(() => {
      setThinking(false);
      setAnswer(synthesize(q));
    }, 1100);
  };

  return (
    <div>
      <PageHeader
        eyebrow="MODULE 05"
        title="AI Security Advisor"
        description="Conversational, contextual guidance tuned for SOC analysts and security engineers."
      />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        {/* Ask */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-[#FFD700]" />
            <div className="text-lg font-display font-semibold">Ask Sentinel AI</div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="e.g. How do I mitigate a SQL injection on a legacy PHP app?"
              className="flex-1 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.25)] rounded-md p-3 outline-none focus:border-[#FFD700]" />
            <button onClick={ask} disabled={thinking} className="btn-gold rounded-md px-6 py-3 text-sm inline-flex items-center gap-2 disabled:opacity-60">
              <Sparkles className={`h-4 w-4 ${thinking ? "animate-spin" : ""}`} />
              {thinking ? "Analyzing…" : "Get Recommendation"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Explain CSRF", "Mitigate brute-force", "What is AES-GCM?", "Secure JWT storage", "OWASP Top 10"].map((s) => (
              <button key={s} onClick={() => { setQ(s); }} className="text-xs font-mono px-3 py-1 rounded-full border border-[rgba(255,215,0,0.25)] text-[#FFD700]/80 hover:bg-[rgba(255,215,0,0.05)]">
                {s}
              </button>
            ))}
          </div>

          {answer && (
            <div className="mt-5 p-5 rounded-md border border-[rgba(255,215,0,0.3)] bg-[linear-gradient(135deg,rgba(255,215,0,0.06),rgba(255,215,0,0.01))]">
              <div className="text-xs font-mono tracking-widest text-[#FFD700] mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> SENTINEL AI · RESPONSE
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line">{answer}</div>
            </div>
          )}
        </div>

        {/* Advisories */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs font-mono tracking-widest text-muted-foreground">PRIORITIZED ADVISORIES</div>
              <div className="text-xl font-display font-semibold gold-text">AI-curated for your environment</div>
            </div>
            <span className="text-xs font-mono text-[#FFD700]">{advisories.length} active</span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {advisories.map((a, i) => <AdvisoryCard key={i} a={a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvisoryCard({ a }: { a: any }) {
  const map: any = {
    critical: "oklch(0.7 0.22 25)",
    high: "#FFC107",
    medium: "#FFD700",
    low: "oklch(0.75 0.18 145)",
  };
  const c = map[a.sev];
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-md grid place-items-center shrink-0" style={{ background: `${c}20`, border: `1px solid ${c}55`, color: c }}>
          <a.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded uppercase" style={{ background: `${c}25`, color: c, border: `1px solid ${c}55` }}>{a.sev}</span>
          </div>
          <div className="font-semibold">{a.title}</div>
        </div>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground mb-1">THREAT</div>
          <p className="text-foreground/85">{a.threat}</p>
        </div>
        <div className="rounded-md bg-[rgba(255,215,0,0.05)] border border-[rgba(255,215,0,0.2)] p-3">
          <div className="text-[10px] font-mono tracking-widest text-[#FFD700] mb-1">AI MITIGATION</div>
          <p>{a.mitigation}</p>
        </div>
      </div>
    </div>
  );
}

function synthesize(q: string) {
  const lower = q.toLowerCase();
  if (lower.includes("brute")) {
    return "Brute-force mitigation:\n• Enforce account lockout after 5 failed attempts (10 min cooldown).\n• Deploy fail2ban or WAF rate-limiting on auth endpoints.\n• Require MFA for all privileged accounts.\n• Use exponential backoff and CAPTCHA after 3 failures.\n• Monitor and alert on >10 failures/minute from any single IP.";
  }
  if (lower.includes("csrf")) {
    return "CSRF (Cross-Site Request Forgery) lets an attacker submit requests on behalf of an authenticated victim.\n• Use the SameSite=Strict cookie attribute for session tokens.\n• Implement double-submit cookie or synchronizer tokens for state-changing requests.\n• Verify the Origin / Referer header server-side.\n• Reject requests with unexpected Content-Type for sensitive endpoints.";
  }
  if (lower.includes("jwt")) {
    return "Secure JWT storage:\n• Prefer httpOnly + Secure + SameSite=Strict cookies over localStorage to mitigate XSS theft.\n• Keep access-token TTLs short (5–15 min) and use refresh tokens with rotation.\n• Sign with RS256 or EdDSA. Never trust the `alg` header from the client.\n• Validate `iss`, `aud`, `exp`, `nbf` on every request.";
  }
  if (lower.includes("aes")) {
    return "AES-GCM is an authenticated encryption mode providing confidentiality AND integrity in one operation.\n• Use 256-bit keys derived via PBKDF2/Argon2 from passphrases.\n• Use a UNIQUE 96-bit nonce per encryption (never reuse with the same key).\n• Always verify the authentication tag — failures mean tampering.";
  }
  if (lower.includes("sql")) {
    return "SQL injection mitigation:\n• Use parameterized queries / prepared statements. Never concatenate user input into SQL.\n• Apply least-privilege DB accounts (no DDL, no DROP).\n• Deploy a WAF with SQLi signatures.\n• Validate input types and lengths server-side. Escape only as a last resort.";
  }
  if (lower.includes("owasp")) {
    return "OWASP Top 10 (2021) priorities:\n1. Broken Access Control — enforce server-side checks for every resource.\n2. Cryptographic Failures — disable legacy TLS, store secrets via KMS.\n3. Injection — parameterize all queries.\n4. Insecure Design — threat-model new features.\n5. Security Misconfiguration — harden default builds.\n6. Vulnerable Components — patch dependencies on a schedule.\n7. Identification & Auth Failures — enforce MFA and rate-limit auth.\n8. Software & Data Integrity — sign artifacts and verify supply chain.\n9. Logging & Monitoring Failures — centralize logs and alert.\n10. SSRF — validate URLs and use egress allow-lists.";
  }
  return `Sentinel's recommendation for "${q}":\n• Inventory all systems involved and identify trust boundaries.\n• Apply the principle of least privilege at every layer.\n• Add monitoring with actionable alerts (not noise).\n• Patch and harden affected components on a defined SLA.\n• Document the response in your security runbook.\n\nWant a deeper dive? Try asking about a specific technology, attack class, or compliance standard.`;
}
