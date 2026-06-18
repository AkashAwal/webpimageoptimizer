"use client";

import { useState, useMemo } from "react";

function base64urlDecode(str: string): string {
  const padded = str + "===".slice((str.length + 3) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return atob(base64);
  }
}

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoderClient() {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2 || parts.length > 3) return { error: "A JWT must have 2 or 3 dot-separated parts. Check that you pasted the full token." };
    try {
      const header = JSON.parse(base64urlDecode(parts[0])) as Record<string, unknown>;
      const payload = JSON.parse(base64urlDecode(parts[1])) as Record<string, unknown>;
      const hasSignature = parts.length === 3 && parts[2].length > 0;

      let expiry: { expired: boolean; date: Date } | null = null;
      if (typeof payload.exp === "number") {
        const d = new Date(payload.exp * 1000);
        expiry = { expired: d.getTime() < Date.now(), date: d };
      }

      return { header, payload, hasSignature, expiry };
    } catch {
      return { error: "Could not decode the token. Make sure you pasted a complete, unmodified JWT." };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setToken(SAMPLE)}
          className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          Load sample
        </button>
      </div>

      <textarea
        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-[12px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/10 resize-none break-all"
        rows={4}
        placeholder="Paste your JWT here…"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        spellCheck={false}
      />

      {result && (
        result.error ? (
          <p className="text-[13px] text-red-600">{result.error}</p>
        ) : (
          <div className="space-y-3">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {result.expiry && (
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${
                  result.expiry.expired
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {result.expiry.expired ? "Expired" : "Valid"} · exp {result.expiry.date.toLocaleString()}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700">
                alg: {result.header ? String(result.header.alg ?? "?") : "?"}
              </span>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700">
                {result.hasSignature ? "Signature present (not verified)" : "No signature"}
              </span>
            </div>

            {/* Header */}
            <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="border-b border-black/6 px-4 py-3">
                <span className="text-[12px] font-semibold text-foreground">Header</span>
              </div>
              <pre className="px-4 py-4 text-[12px] leading-relaxed font-mono text-foreground overflow-auto whitespace-pre-wrap break-all">
                {JSON.stringify(result.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="border-b border-black/6 px-4 py-3">
                <span className="text-[12px] font-semibold text-foreground">Payload</span>
              </div>
              <pre className="px-4 py-4 text-[12px] leading-relaxed font-mono text-foreground overflow-auto whitespace-pre-wrap break-all">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>

            <p className="text-[12px] text-muted-foreground px-1">
              Decoded client-side only. The signature is not cryptographically verified — do not use this to trust token authenticity.
            </p>
          </div>
        )
      )}
    </div>
  );
}
