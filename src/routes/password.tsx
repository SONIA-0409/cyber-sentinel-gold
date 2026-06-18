import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useMemo, useState } from "react";
import { Copy, RefreshCw, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/password")({
  head: () => ({
    meta: [
      { title: "Password Security Center — CyberSentinel Gold" },
      { name: "description", content: "Generate strong passwords, analyze entropy and estimate crack time." },
    ],
  }),
  component: PasswordPage,
});

function generate(len: number, upper: boolean, lower: boolean, num: boolean, sym: boolean) {
  const sets = [
    upper && "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower && "abcdefghijklmnopqrstuvwxyz",
    num && "0123456789",
    sym && "!@#$%^&*()-_=+[]{}<>?/|~",
  ].filter(Boolean) as string[];
  if (sets.length === 0) return "";
  const all = sets.join("");
  let out = sets.map((s) => s[Math.floor(Math.random() * s.length)]).join("");
  for (let i = out.length; i < len; i++) out += all[Math.floor(Math.random() * all.length)];
  return out.split("").sort(() => Math.random() - 0.5).join("");
}

function analyzePassword(p: string) {
  if (!p) return { entropy: 0, strength: "None", crack: "—", score: 0 };
  let pool = 0;
  if (/[a-z]/.test(p)) pool += 26;
  if (/[A-Z]/.test(p)) pool += 26;
  if (/[0-9]/.test(p)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(p)) pool += 32;
  const entropy = p.length * Math.log2(pool || 1);
  let strength = "Weak", score = 25;
  if (entropy >= 100) { strength = "Very Strong"; score = 100; }
  else if (entropy >= 70) { strength = "Strong"; score = 80; }
  else if (entropy >= 50) { strength = "Moderate"; score = 55; }
  const guesses = Math.pow(2, entropy);
  const secs = guesses / 1e10; // 10B guesses/s
  return { entropy: Math.round(entropy), strength, score, crack: humanTime(secs) };
}

function humanTime(s: number) {
  if (s < 1) return "instant";
  const units: [string, number][] = [["sec", 60], ["min", 60], ["hr", 24], ["day", 365], ["yr", 1000], ["millennia", 1000000]];
  let v = s, lbl = "sec";
  for (const [u, k] of units) {
    if (v < k) { lbl = u; break; }
    v /= k; lbl = u;
  }
  if (v > 1e9) return ">1B yrs";
  return `${v.toFixed(v < 10 ? 1 : 0)} ${lbl}`;
}

function PasswordPage() {
  const [len, setLen] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [password, setPassword] = useState(() => generate(20, true, true, true, true));
  const [check, setCheck] = useState("");

  const a = useMemo(() => analyzePassword(password), [password]);
  const a2 = useMemo(() => analyzePassword(check), [check]);

  const regen = () => setPassword(generate(len, upper, lower, num, sym));

  const copy = (s: string) => {
    navigator.clipboard.writeText(s);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
      <PageHeader
        eyebrow="MODULE 03"
        title="Password Security Center"
        description="Generate cryptographically strong passwords and analyze the strength of any credential."
      />

      <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-2 gap-6">
        {/* Generator */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono tracking-widest text-muted-foreground">GENERATOR</div>
              <div className="text-lg font-display font-semibold">Strong password</div>
            </div>
            <KeyRound className="h-5 w-5 text-[#FFD700]" />
          </div>

          <div className="relative">
            <div className="break-all font-mono text-lg md:text-xl bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.3)] rounded-md p-4 pr-24 text-[#FFEA00]" style={{ textShadow: "0 0 8px rgba(255,234,0,0.5)" }}>
              {password || "—"}
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={regen} className="btn-ghost-gold rounded-md p-2"><RefreshCw className="h-4 w-4" /></button>
              <button onClick={() => copy(password)} className="btn-gold rounded-md p-2"><Copy className="h-4 w-4" /></button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Length</span>
              <span className="font-mono text-[#FFD700]">{len}</span>
            </div>
            <input type="range" min={6} max={64} value={len} onChange={(e) => setLen(+e.target.value)}
              className="w-full accent-[#FFD700]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Uppercase (A–Z)", upper, setUpper],
              ["Lowercase (a–z)", lower, setLower],
              ["Numbers (0–9)", num, setNum],
              ["Symbols (!@#)", sym, setSym],
            ].map(([l, v, s]: any) => (
              <label key={l} className="flex items-center gap-3 p-3 rounded-md border border-[rgba(255,215,0,0.15)] cursor-pointer hover:border-[rgba(255,215,0,0.4)]">
                <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} className="accent-[#FFD700]" />
                <span className="text-sm">{l}</span>
              </label>
            ))}
          </div>

          <button onClick={regen} className="btn-gold w-full rounded-md py-3 text-sm">Generate New Password</button>

          <StrengthCard a={a} />
        </div>

        {/* Analyzer */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono tracking-widest text-muted-foreground">ANALYZER</div>
              <div className="text-lg font-display font-semibold">Test any password</div>
            </div>
            <ShieldCheck className="h-5 w-5 text-[#FFD700]" />
          </div>
          <input
            value={check}
            onChange={(e) => setCheck(e.target.value)}
            placeholder="Type or paste a password to analyze…"
            className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.25)] rounded-md p-4 font-mono outline-none focus:border-[#FFD700]"
          />
          <StrengthCard a={a2} />

          <div className="space-y-2 text-sm">
            <div className="text-xs font-mono tracking-widest text-muted-foreground">RECOMMENDATIONS</div>
            <Tip ok={check.length >= 12}>At least 12 characters</Tip>
            <Tip ok={/[A-Z]/.test(check) && /[a-z]/.test(check)}>Mix upper and lower case</Tip>
            <Tip ok={/\d/.test(check)}>Include numbers</Tip>
            <Tip ok={/[^a-zA-Z0-9]/.test(check)}>Include special characters</Tip>
            <Tip ok={!/password|1234|qwerty/i.test(check)}>Avoid common patterns</Tip>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrengthCard({ a }: { a: ReturnType<typeof analyzePassword> }) {
  const color = a.strength === "Very Strong" ? "#FFEA00"
    : a.strength === "Strong" ? "#FFD700"
    : a.strength === "Moderate" ? "#FFC107"
    : a.strength === "Weak" ? "oklch(0.7 0.22 25)"
    : "rgba(255,255,255,0.3)";
  return (
    <div className="rounded-md border border-[rgba(255,215,0,0.2)] p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Strength</span>
        <span className="font-mono font-semibold" style={{ color }}>{a.strength}</span>
      </div>
      <div className="mt-2 h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${a.score}%`, background: `linear-gradient(90deg, ${color}, #FFEA00)`, boxShadow: `0 0 10px ${color}` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Entropy</div>
          <div className="font-mono font-bold gold-text text-lg">{a.entropy} bits</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Est. crack time</div>
          <div className="font-mono font-bold gold-text text-lg">{a.crack}</div>
        </div>
      </div>
    </div>
  );
}

function Tip({ ok, children }: { ok: boolean; children: any }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="h-2 w-2 rounded-full" style={{ background: ok ? "#FFEA00" : "rgba(255,255,255,0.2)", boxShadow: ok ? "0 0 8px #FFEA00" : "none" }} />
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{children}</span>
    </div>
  );
}
