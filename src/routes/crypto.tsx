import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useState, useEffect } from "react";
import { Hash, Lock, Unlock, Copy, FileCheck, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/crypto")({
  head: () => ({
    meta: [
      { title: "Cryptography Toolkit — CyberSentinel Gold" },
      { name: "description", content: "Hash generator (MD5, SHA-1, SHA-256), file integrity verification and AES encryption." },
    ],
  }),
  component: CryptoPage,
});

// Pure-JS implementations for offline use

async function sha(algo: "SHA-1" | "SHA-256", text: string) {
  const buf = new TextEncoder().encode(text);
  const h = await crypto.subtle.digest(algo, buf);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Simple MD5 implementation
function md5(str: string) {
  function L(k: number, b: number) { return (k << b) | (k >>> (32 - b)); }
  function K(G: number, k: number) {
    const I = (G & 0x80000000), C = (k & 0x80000000);
    const F = (G & 0x40000000), B = (k & 0x40000000);
    const x = (G & 0x3fffffff) + (k & 0x3fffffff);
    if (F & B) return (x ^ 0x80000000 ^ I ^ C);
    if (F | B) {
      if (x & 0x40000000) return (x ^ 0xc0000000 ^ I ^ C);
      return (x ^ 0x40000000 ^ I ^ C);
    }
    return (x ^ I ^ C);
  }
  function r(a: number, b: number, c: number) { return (a & b) | ((~a) & c); }
  function q(a: number, b: number, c: number) { return (a & c) | (b & (~c)); }
  function p(a: number, b: number, c: number) { return a ^ b ^ c; }
  function n(a: number, b: number, c: number) { return b ^ (a | (~c)); }
  function u(G: number, k: number, aa: number, s: number, F: number, B: number, x: number) { G = K(G, K(K(r(k, aa, s), F), x)); return K(L(G, B), k); }
  function f(G: number, k: number, aa: number, s: number, F: number, B: number, x: number) { G = K(G, K(K(q(k, aa, s), F), x)); return K(L(G, B), k); }
  function D(G: number, k: number, aa: number, s: number, F: number, B: number, x: number) { G = K(G, K(K(p(k, aa, s), F), x)); return K(L(G, B), k); }
  function t(G: number, k: number, aa: number, s: number, F: number, B: number, x: number) { G = K(G, K(K(n(k, aa, s), F), x)); return K(L(G, B), k); }
  function e(G: number) { let k = ""; for (let B = 0; B <= 3; B++) { const n = (G >>> (B * 8)) & 255; const s = "0" + n.toString(16); k = k + s.substring(s.length - 2); } return k; }
  function U(k: string) {
    k = k.replace(/\r\n/g, "\n");
    let aa = ""; for (let s = 0; s < k.length; s++) {
      const F = k.charCodeAt(s);
      if (F < 128) aa += String.fromCharCode(F);
      else if (F > 127 && F < 2048) { aa += String.fromCharCode((F >> 6) | 192); aa += String.fromCharCode((F & 63) | 128); }
      else { aa += String.fromCharCode((F >> 12) | 224); aa += String.fromCharCode(((F >> 6) & 63) | 128); aa += String.fromCharCode((F & 63) | 128); }
    } return aa;
  }
  function P(k: string) {
    const a = (((k.length + 8) - ((k.length + 8) % 64)) / 64 + 1) * 16;
    const G = new Array(a - 1).fill(0);
    let s = 0, F = 0;
    while (F < k.length) { s = (F - (F % 4)) / 4; B(s); G[s] |= (k.charCodeAt(F) << (((F % 4) * 8))); F++; }
    s = (F - (F % 4)) / 4; B(s); G[s] |= 0x80 << (((F % 4) * 8));
    G[a - 2] = k.length << 3; G[a - 1] = k.length >>> 29;
    function B(_idx: number) { /* noop */ }
    return G;
  }
  const m = U(str), Y = P(m);
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  for (let k = 0; k < Y.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = u(a, b, c, d, Y[k + 0], 7, 0xd76aa478); d = u(d, a, b, c, Y[k + 1], 12, 0xe8c7b756); c = u(c, d, a, b, Y[k + 2], 17, 0x242070db); b = u(b, c, d, a, Y[k + 3], 22, 0xc1bdceee);
    a = u(a, b, c, d, Y[k + 4], 7, 0xf57c0faf); d = u(d, a, b, c, Y[k + 5], 12, 0x4787c62a); c = u(c, d, a, b, Y[k + 6], 17, 0xa8304613); b = u(b, c, d, a, Y[k + 7], 22, 0xfd469501);
    a = u(a, b, c, d, Y[k + 8], 7, 0x698098d8); d = u(d, a, b, c, Y[k + 9], 12, 0x8b44f7af); c = u(c, d, a, b, Y[k + 10], 17, 0xffff5bb1); b = u(b, c, d, a, Y[k + 11], 22, 0x895cd7be);
    a = u(a, b, c, d, Y[k + 12], 7, 0x6b901122); d = u(d, a, b, c, Y[k + 13], 12, 0xfd987193); c = u(c, d, a, b, Y[k + 14], 17, 0xa679438e); b = u(b, c, d, a, Y[k + 15], 22, 0x49b40821);
    a = f(a, b, c, d, Y[k + 1], 5, 0xf61e2562); d = f(d, a, b, c, Y[k + 6], 9, 0xc040b340); c = f(c, d, a, b, Y[k + 11], 14, 0x265e5a51); b = f(b, c, d, a, Y[k + 0], 20, 0xe9b6c7aa);
    a = f(a, b, c, d, Y[k + 5], 5, 0xd62f105d); d = f(d, a, b, c, Y[k + 10], 9, 0x2441453); c = f(c, d, a, b, Y[k + 15], 14, 0xd8a1e681); b = f(b, c, d, a, Y[k + 4], 20, 0xe7d3fbc8);
    a = f(a, b, c, d, Y[k + 9], 5, 0x21e1cde6); d = f(d, a, b, c, Y[k + 14], 9, 0xc33707d6); c = f(c, d, a, b, Y[k + 3], 14, 0xf4d50d87); b = f(b, c, d, a, Y[k + 8], 20, 0x455a14ed);
    a = f(a, b, c, d, Y[k + 13], 5, 0xa9e3e905); d = f(d, a, b, c, Y[k + 2], 9, 0xfcefa3f8); c = f(c, d, a, b, Y[k + 7], 14, 0x676f02d9); b = f(b, c, d, a, Y[k + 12], 20, 0x8d2a4c8a);
    a = D(a, b, c, d, Y[k + 5], 4, 0xfffa3942); d = D(d, a, b, c, Y[k + 8], 11, 0x8771f681); c = D(c, d, a, b, Y[k + 11], 16, 0x6d9d6122); b = D(b, c, d, a, Y[k + 14], 23, 0xfde5380c);
    a = D(a, b, c, d, Y[k + 1], 4, 0xa4beea44); d = D(d, a, b, c, Y[k + 4], 11, 0x4bdecfa9); c = D(c, d, a, b, Y[k + 7], 16, 0xf6bb4b60); b = D(b, c, d, a, Y[k + 10], 23, 0xbebfbc70);
    a = D(a, b, c, d, Y[k + 13], 4, 0x289b7ec6); d = D(d, a, b, c, Y[k + 0], 11, 0xeaa127fa); c = D(c, d, a, b, Y[k + 3], 16, 0xd4ef3085); b = D(b, c, d, a, Y[k + 6], 23, 0x4881d05);
    a = D(a, b, c, d, Y[k + 9], 4, 0xd9d4d039); d = D(d, a, b, c, Y[k + 12], 11, 0xe6db99e5); c = D(c, d, a, b, Y[k + 15], 16, 0x1fa27cf8); b = D(b, c, d, a, Y[k + 2], 23, 0xc4ac5665);
    a = t(a, b, c, d, Y[k + 0], 6, 0xf4292244); d = t(d, a, b, c, Y[k + 7], 10, 0x432aff97); c = t(c, d, a, b, Y[k + 14], 15, 0xab9423a7); b = t(b, c, d, a, Y[k + 5], 21, 0xfc93a039);
    a = t(a, b, c, d, Y[k + 12], 6, 0x655b59c3); d = t(d, a, b, c, Y[k + 3], 10, 0x8f0ccc92); c = t(c, d, a, b, Y[k + 10], 15, 0xffeff47d); b = t(b, c, d, a, Y[k + 1], 21, 0x85845dd1);
    a = t(a, b, c, d, Y[k + 8], 6, 0x6fa87e4f); d = t(d, a, b, c, Y[k + 15], 10, 0xfe2ce6e0); c = t(c, d, a, b, Y[k + 6], 15, 0xa3014314); b = t(b, c, d, a, Y[k + 13], 21, 0x4e0811a1);
    a = t(a, b, c, d, Y[k + 4], 6, 0xf7537e82); d = t(d, a, b, c, Y[k + 11], 10, 0xbd3af235); c = t(c, d, a, b, Y[k + 2], 15, 0x2ad7d2bb); b = t(b, c, d, a, Y[k + 9], 21, 0xeb86d391);
    a = K(a, AA); b = K(b, BB); c = K(c, CC); d = K(d, DD);
  }
  return (e(a) + e(b) + e(c) + e(d)).toLowerCase();
}

async function aesEncrypt(plaintext: string, password: string) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const km = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    km, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
  );
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  const out = new Uint8Array(salt.length + iv.length + ct.byteLength);
  out.set(salt, 0); out.set(iv, salt.length); out.set(new Uint8Array(ct), salt.length + iv.length);
  return btoa(String.fromCharCode(...out));
}

async function aesDecrypt(b64: string, password: string) {
  const enc = new TextEncoder(), dec = new TextDecoder();
  const data = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const salt = data.slice(0, 16), iv = data.slice(16, 28), ct = data.slice(28);
  const km = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    km, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
  );
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return dec.decode(pt);
}

function CryptoPage() {
  const [input, setInput] = useState("Hello CyberSentinel!");
  const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "" });

  useEffect(() => {
    (async () => {
      setHashes({
        md5: md5(input),
        sha1: await sha("SHA-1", input),
        sha256: await sha("SHA-256", input),
      });
    })();
  }, [input]);

  // verify
  const [a, setA] = useState(""), [b, setB] = useState("");
  const match = a && b && a.trim().toLowerCase() === b.trim().toLowerCase();

  // AES
  const [pt, setPt] = useState("Secret message"), [pw, setPw] = useState("strong-passphrase"), [ct, setCt] = useState("");
  const [decIn, setDecIn] = useState(""), [decPw, setDecPw] = useState(""), [decOut, setDecOut] = useState("");

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied"); };

  return (
    <div>
      <PageHeader
        eyebrow="MODULE 04"
        title="Cryptography Toolkit"
        description="Hash, verify and encrypt — all in-browser, nothing leaves your device."
      />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        {/* Hash generator */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono tracking-widest text-muted-foreground">HASH GENERATOR</div>
              <div className="text-lg font-display font-semibold">MD5 · SHA-1 · SHA-256</div>
            </div>
            <Hash className="h-5 w-5 text-[#FFD700]" />
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="mt-4 w-full h-28 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-4 font-mono text-sm outline-none focus:border-[#FFD700]" />
          <div className="mt-4 space-y-2">
            {([["MD5", hashes.md5], ["SHA-1", hashes.sha1], ["SHA-256", hashes.sha256]] as const).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 p-3 rounded-md border border-[rgba(255,215,0,0.15)] hover:border-[rgba(255,215,0,0.4)]">
                <span className="text-xs font-mono text-[#FFD700] w-20">{k}</span>
                <span className="font-mono text-xs break-all flex-1 text-[#FFEA00]">{v}</span>
                <button onClick={() => copy(v)} className="btn-ghost-gold rounded-md p-2"><Copy className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Hash verification */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono tracking-widest text-muted-foreground">HASH VERIFICATION</div>
              <div className="text-lg font-display font-semibold">File integrity checker</div>
            </div>
            <FileCheck className="h-5 w-5 text-[#FFD700]" />
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            <input value={a} onChange={(e) => setA(e.target.value)} placeholder="Hash A"
              className="bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-3 font-mono text-sm outline-none focus:border-[#FFD700]" />
            <input value={b} onChange={(e) => setB(e.target.value)} placeholder="Hash B"
              className="bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-3 font-mono text-sm outline-none focus:border-[#FFD700]" />
          </div>
          {a && b && (
            <div className="mt-4 p-3 rounded-md text-center font-mono text-sm" style={{
              background: match ? "rgba(255,215,0,0.1)" : "rgba(255,0,0,0.1)",
              color: match ? "#FFEA00" : "oklch(0.7 0.22 25)",
              border: `1px solid ${match ? "rgba(255,215,0,0.5)" : "rgba(255,0,0,0.4)"}`,
            }}>
              {match ? "✓ MATCH — integrity verified" : "✗ MISMATCH — files differ or hash invalid"}
            </div>
          )}
        </div>

        {/* AES */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground">AES ENCRYPT</div>
                <div className="text-lg font-display font-semibold">AES-256-GCM</div>
              </div>
              <Lock className="h-5 w-5 text-[#FFD700]" />
            </div>
            <textarea value={pt} onChange={(e) => setPt(e.target.value)} placeholder="Plaintext"
              className="mt-4 w-full h-24 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-3 font-mono text-sm" />
            <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Passphrase"
              className="mt-3 w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-3 font-mono text-sm" />
            <button onClick={async () => { try { setCt(await aesEncrypt(pt, pw)); toast.success("Encrypted"); } catch { toast.error("Failed"); } }}
              className="btn-gold w-full mt-3 rounded-md py-3 text-sm">Encrypt</button>
            {ct && (
              <div className="mt-3 p-3 rounded-md border border-[rgba(255,215,0,0.2)] bg-[rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#FFD700]">CIPHERTEXT (BASE64)</span>
                  <button onClick={() => copy(ct)} className="btn-ghost-gold rounded p-1"><Copy className="h-3.5 w-3.5" /></button>
                </div>
                <div className="font-mono text-xs break-all text-[#FFEA00]">{ct}</div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono tracking-widest text-muted-foreground">AES DECRYPT</div>
                <div className="text-lg font-display font-semibold">Recover plaintext</div>
              </div>
              <Unlock className="h-5 w-5 text-[#FFD700]" />
            </div>
            <textarea value={decIn} onChange={(e) => setDecIn(e.target.value)} placeholder="Ciphertext (base64)"
              className="mt-4 w-full h-24 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-3 font-mono text-sm" />
            <input value={decPw} onChange={(e) => setDecPw(e.target.value)} placeholder="Passphrase"
              className="mt-3 w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,215,0,0.2)] rounded-md p-3 font-mono text-sm" />
            <button onClick={async () => { try { setDecOut(await aesDecrypt(decIn, decPw)); toast.success("Decrypted"); } catch { toast.error("Decryption failed"); } }}
              className="btn-gold w-full mt-3 rounded-md py-3 text-sm">Decrypt</button>
            {decOut && (
              <div className="mt-3 p-3 rounded-md border border-[rgba(255,215,0,0.2)] bg-[rgba(0,0,0,0.4)]">
                <div className="text-xs font-mono text-[#FFD700] mb-2">PLAINTEXT</div>
                <div className="font-mono text-sm break-all text-[#FFEA00]">{decOut}</div>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-[#FFD700]" />
            <div className="text-lg font-display font-semibold">Cryptography 101</div>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-sm">
            <Info t="Hashing">One-way function producing a fixed-size digest. Used for integrity and password storage. Cannot be reversed.</Info>
            <Info t="Encryption">Two-way transformation using a key. Protects confidentiality. AES-256-GCM is the modern standard for symmetric encryption.</Info>
            <Info t="Best Practices">Use strong key-derivation (PBKDF2, Argon2). Never roll your own crypto. Salt every hash. Rotate keys.</Info>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ t, children }: { t: string; children: any }) {
  return (
    <div className="rounded-md border border-[rgba(255,215,0,0.15)] p-4 bg-[rgba(255,215,0,0.02)]">
      <div className="font-semibold text-[#FFD700] mb-1">{t}</div>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}
