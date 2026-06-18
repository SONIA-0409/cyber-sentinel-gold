import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/scanner", label: "Scanner" },
  { to: "/logs", label: "Log Analyzer" },
  { to: "/password", label: "Password" },
  { to: "/crypto", label: "Cryptography" },
  { to: "/advisor", label: "AI Advisor" },
  { to: "/reports", label: "Reports" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,215,0,0.15)] backdrop-blur-xl bg-[rgba(10,10,10,0.7)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-md bg-[#FFD700] blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative h-9 w-9 rounded-md grid place-items-center bg-gradient-to-br from-[#FFB300] to-[#FFEA00] text-black shadow-[0_0_24px_rgba(255,215,0,0.4)]">
              <Shield className="h-5 w-5" strokeWidth={2.4} />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-sm tracking-wider gold-text">CYBERSENTINEL</div>
            <div className="text-[10px] tracking-[0.25em] text-[#FFD700]/70 -mt-0.5">GOLD · SOC</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  active
                    ? "text-[#FFD700] bg-[rgba(255,215,0,0.08)] shadow-[inset_0_0_0_1px_rgba(255,215,0,0.3)]"
                    : "text-foreground/70 hover:text-[#FFD700] hover:bg-[rgba(255,215,0,0.05)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFD700]/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#FFEA00] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]" />
            </span>
            SOC ONLINE
          </div>
        </div>

        <button className="lg:hidden text-[#FFD700]" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[rgba(255,215,0,0.15)] bg-[rgba(10,10,10,0.95)]">
          <div className="px-4 py-3 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-md text-foreground/80 hover:text-[#FFD700] hover:bg-[rgba(255,215,0,0.06)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
