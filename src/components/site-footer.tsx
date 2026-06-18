import { Shield, Github, Mail, Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(255,215,0,0.15)] mt-24 bg-[rgba(10,10,10,0.6)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md grid place-items-center bg-gradient-to-br from-[#FFB300] to-[#FFEA00] text-black">
              <Shield className="h-5 w-5" />
            </div>
            <div className="font-display font-bold gold-text">CYBERSENTINEL GOLD</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Enterprise-grade cybersecurity intelligence — built for SOC teams, analysts, and researchers.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#FFD700] mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-[#FFD700]">Dashboard</Link></li>
            <li><Link to="/scanner" className="hover:text-[#FFD700]">Vulnerability Scanner</Link></li>
            <li><Link to="/logs" className="hover:text-[#FFD700]">Log Analyzer</Link></li>
            <li><Link to="/crypto" className="hover:text-[#FFD700]">Cryptography Toolkit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#FFD700] mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/advisor" className="hover:text-[#FFD700]">AI Security Advisor</Link></li>
            <li><Link to="/reports" className="hover:text-[#FFD700]">Security Reports</Link></li>
            <li><Link to="/password" className="hover:text-[#FFD700]">Password Center</Link></li>
            <li><a href="#" className="hover:text-[#FFD700]">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#FFD700] mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> soc@cybersentinel.io</li>
            <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> cybersentinel.io</li>
            <li className="flex items-center gap-2"><Github className="h-4 w-4" /> github.com/cybersentinel</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[rgba(255,215,0,0.1)]">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} CyberSentinel Gold. All rights reserved.</div>
          <div className="font-mono text-[#FFD700]/70">v1.0.0 · SOC-GRADE · ISO 27001 ALIGNED</div>
        </div>
      </div>
    </footer>
  );
}
