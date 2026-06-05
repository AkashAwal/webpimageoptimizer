"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { DownloadSimple } from "@phosphor-icons/react";

type InputType = "url" | "text" | "wifi" | "email" | "phone" | "contact";
type ECC = "L" | "M" | "Q" | "H";
type WifiAuth = "WPA" | "WEP" | "nopass";

const TABS: { id: InputType; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "WiFi" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "contact", label: "Contact" },
];

const SIZES = [128, 256, 512, 1024];
const ECC_LEVELS: { id: ECC; label: string; desc: string }[] = [
  { id: "L", label: "L", desc: "7% recovery" },
  { id: "M", label: "M", desc: "15% recovery" },
  { id: "Q", label: "Q", desc: "25% recovery" },
  { id: "H", label: "H", desc: "30% recovery" },
];

function buildQrData(type: InputType, fields: Record<string, string>): string {
  switch (type) {
    case "url":    return fields.url || "https://pixgarage.com";
    case "text":   return fields.text || "";
    case "email":  return `mailto:${fields.email || ""}${fields.subject ? `?subject=${encodeURIComponent(fields.subject)}` : ""}`;
    case "phone":  return `tel:${fields.phone || ""}`;
    case "wifi":   return `WIFI:T:${fields.auth || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
    case "contact":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        fields.name ? `FN:${fields.name}` : "",
        fields.phone2 ? `TEL:${fields.phone2}` : "",
        fields.email2 ? `EMAIL:${fields.email2}` : "",
        fields.org ? `ORG:${fields.org}` : "",
        fields.url2 ? `URL:${fields.url2}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    default: return "";
  }
}

const inputCls = "w-full rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors dark:bg-neutral-800 dark:focus:bg-neutral-700";
const labelCls = "text-[11px] font-medium text-muted-foreground uppercase tracking-wide";

export function QrCodeGeneratorClient() {
  const [type, setType] = useState<InputType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ url: "", text: "", email: "", subject: "", phone: "", ssid: "", password: "", auth: "WPA", name: "", phone2: "", email2: "", org: "", url2: "" });
  const [size, setSize] = useState(512);
  const [ecc, setEcc] = useState<ECC>("M");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  const generate = useCallback(async () => {
    const data = buildQrData(type, fields);
    if (!data || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg },
      });
    } catch {}
  }, [type, fields, size, ecc, fg, bg]);

  useEffect(() => { generate(); }, [generate]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
  };

  const downloadSvg = async () => {
    const data = buildQrData(type, fields);
    if (!data) return;
    try {
      const svg = await QRCode.toString(data, {
        type: "svg",
        width: size,
        margin: 2,
        errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg },
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "qr-code.svg";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
      {/* Left: inputs */}
      <div className="space-y-5">
        {/* Type tabs */}
        <div className="flex flex-wrap gap-1.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              className={cn("rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                type === t.id ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              )}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-3 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          {type === "url" && (
            <div className="space-y-1">
              <label className={labelCls}>URL</label>
              <input className={inputCls} placeholder="https://example.com" value={fields.url} onChange={set("url")} />
            </div>
          )}
          {type === "text" && (
            <div className="space-y-1">
              <label className={labelCls}>Text</label>
              <textarea className={cn(inputCls, "resize-none h-24")} placeholder="Enter any text..." value={fields.text} onChange={set("text")} />
            </div>
          )}
          {type === "wifi" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className={labelCls}>Network name (SSID)</label>
                <input className={inputCls} placeholder="My WiFi Network" value={fields.ssid} onChange={set("ssid")} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Password</label>
                <input className={inputCls} type="password" placeholder="WiFi password" value={fields.password} onChange={set("password")} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Security</label>
                <select className={inputCls} value={fields.auth} onChange={set("auth")}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </div>
          )}
          {type === "email" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className={labelCls}>Email address</label>
                <input className={inputCls} type="email" placeholder="hello@example.com" value={fields.email} onChange={set("email")} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Subject (optional)</label>
                <input className={inputCls} placeholder="Subject line" value={fields.subject} onChange={set("subject")} />
              </div>
            </div>
          )}
          {type === "phone" && (
            <div className="space-y-1">
              <label className={labelCls}>Phone number</label>
              <input className={inputCls} type="tel" placeholder="+1 555 000 0000" value={fields.phone} onChange={set("phone")} />
            </div>
          )}
          {type === "contact" && (
            <div className="space-y-3">
              {[
                { k: "name", label: "Full name", ph: "Jane Smith" },
                { k: "phone2", label: "Phone", ph: "+1 555 000 0000" },
                { k: "email2", label: "Email", ph: "jane@example.com" },
                { k: "org", label: "Organisation (optional)", ph: "Acme Inc." },
                { k: "url2", label: "Website (optional)", ph: "https://example.com" },
              ].map(({ k, label, ph }) => (
                <div key={k} className="space-y-1">
                  <label className={labelCls}>{label}</label>
                  <input className={inputCls} placeholder={ph} value={fields[k]} onChange={set(k)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          {/* Size */}
          <div className="space-y-1.5">
            <label className={labelCls}>Size</label>
            <div className="flex gap-1.5">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    size === s ? "bg-foreground text-white dark:bg-neutral-600" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  )}>
                  {s}px
                </button>
              ))}
            </div>
          </div>

          {/* Error correction */}
          <div className="space-y-1.5">
            <label className={labelCls}>Error correction</label>
            <div className="flex gap-1.5">
              {ECC_LEVELS.map(e => (
                <button key={e.id} onClick={() => setEcc(e.id)}
                  className={cn("flex-1 flex flex-col items-center rounded-lg py-1.5 transition-colors",
                    ecc === e.id ? "bg-foreground text-white dark:bg-neutral-600" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  )}>
                  <span className="text-[11px] font-semibold">{e.id}</span>
                  <span className={cn("text-[9px] mt-0.5", ecc === e.id ? "text-white/70" : "text-neutral-400")}>{e.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="size-8 rounded-lg border border-border cursor-pointer" />
                <span className="text-[12px] text-muted-foreground font-mono">{fg}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="size-8 rounded-lg border border-border cursor-pointer" />
                <span className="text-[12px] text-muted-foreground font-mono">{bg}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: preview + download */}
      <div className="flex flex-col items-center gap-4 sm:w-[220px]">
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-4 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          <canvas ref={canvasRef} className="rounded-xl" style={{ width: 188, height: 188 }} />
        </div>
        <div className="w-full space-y-2">
          <SoftPillButton variant="primary" onClick={downloadPng} className="w-full h-9 text-[12px]">
            <DownloadSimple size={13} /> Download PNG
          </SoftPillButton>
          <SoftPillButton variant="secondary" onClick={downloadSvg} className="w-full h-9 text-[12px]">
            <DownloadSimple size={13} /> Download SVG
          </SoftPillButton>
        </div>
      </div>
    </div>
  );
}
