"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { DownloadSimple } from "@phosphor-icons/react";

type InputType = "url" | "text" | "wifi" | "email" | "phone" | "contact";
type ECC = "L" | "M" | "Q" | "H";

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
  { id: "L", label: "L", desc: "7%" },
  { id: "M", label: "M", desc: "15%" },
  { id: "Q", label: "Q", desc: "25%" },
  { id: "H", label: "H", desc: "30%" },
];

function buildQrData(type: InputType, fields: Record<string, string>): string {
  switch (type) {
    case "url":    return fields.url || "https://pixgarage.com";
    case "text":   return fields.text || "Hello";
    case "email":  return `mailto:${fields.email || ""}${fields.subject ? `?subject=${encodeURIComponent(fields.subject)}` : ""}`;
    case "phone":  return `tel:${fields.phone || ""}`;
    case "wifi":   return `WIFI:T:${fields.auth || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
    case "contact":
      return [
        "BEGIN:VCARD", "VERSION:3.0",
        fields.name  ? `FN:${fields.name}`    : "",
        fields.phone2 ? `TEL:${fields.phone2}` : "",
        fields.email2 ? `EMAIL:${fields.email2}` : "",
        fields.org   ? `ORG:${fields.org}`    : "",
        fields.url2  ? `URL:${fields.url2}`   : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    default: return "";
  }
}

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 outline-none focus:border-neutral-400 transition-colors dark:border-neutral-600 dark:bg-white dark:text-neutral-900 dark:focus:border-neutral-400";
const labelCls = "text-[11px] font-medium text-neutral-500 uppercase tracking-wide";

export function QrCodeGeneratorClient() {
  const [type, setType]   = useState<InputType>("url");
  const [fields, setFields] = useState<Record<string, string>>({
    url: "", text: "", email: "", subject: "", phone: "",
    ssid: "", password: "", auth: "WPA",
    name: "", phone2: "", email2: "", org: "", url2: "",
  });
  const [size, setSize]   = useState(512);
  const [ecc, setEcc]     = useState<ECC>("M");
  const [fg, setFg]       = useState("#000000");
  const [bg, setBg]       = useState("#ffffff");
  const [preview, setPreview] = useState<string>("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  const regenerate = useCallback(async () => {
    const data = buildQrData(type, fields);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(data, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg },
        type: "image/png",
      });
      setPreview(url);
    } catch { setPreview(""); }
  }, [type, fields, ecc, fg, bg]);

  useEffect(() => { regenerate(); }, [regenerate]);

  const downloadPng = async () => {
    const data = buildQrData(type, fields);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(data, {
        width: size, margin: 2, errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg }, type: "image/png",
      });
      const a = document.createElement("a");
      a.href = url; a.download = "qr-code.png"; a.click();
    } catch {}
  };

  const downloadSvg = async () => {
    const data = buildQrData(type, fields);
    try {
      const QRCode = (await import("qrcode")).default;
      const svg = await QRCode.toString(data, {
        type: "svg", width: size, margin: 2,
        errorCorrectionLevel: ecc, color: { dark: fg, light: bg },
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "qr-code.svg"; a.click();
      URL.revokeObjectURL(a.href);
    } catch {}
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left: inputs + settings */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Type tabs */}
        <div className="flex flex-wrap gap-1.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              className={cn("rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                type === t.id
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
              )}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-3 dark:bg-white dark:ring-black/8">
          {type === "url" && (
            <div className="space-y-1"><label className={labelCls}>URL</label>
              <input className={inputCls} placeholder="https://example.com" value={fields.url} onChange={set("url")} />
            </div>
          )}
          {type === "text" && (
            <div className="space-y-1"><label className={labelCls}>Text</label>
              <textarea className={cn(inputCls, "resize-none h-24")} placeholder="Enter any text…" value={fields.text} onChange={set("text")} />
            </div>
          )}
          {type === "wifi" && (
            <div className="space-y-3">
              <div className="space-y-1"><label className={labelCls}>Network name (SSID)</label>
                <input className={inputCls} placeholder="My WiFi Network" value={fields.ssid} onChange={set("ssid")} /></div>
              <div className="space-y-1"><label className={labelCls}>Password</label>
                <input className={inputCls} type="password" placeholder="WiFi password" value={fields.password} onChange={set("password")} /></div>
              <div className="space-y-1"><label className={labelCls}>Security</label>
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
              <div className="space-y-1"><label className={labelCls}>Email address</label>
                <input className={inputCls} type="email" placeholder="hello@example.com" value={fields.email} onChange={set("email")} /></div>
              <div className="space-y-1"><label className={labelCls}>Subject (optional)</label>
                <input className={inputCls} placeholder="Subject line" value={fields.subject} onChange={set("subject")} /></div>
            </div>
          )}
          {type === "phone" && (
            <div className="space-y-1"><label className={labelCls}>Phone number</label>
              <input className={inputCls} type="tel" placeholder="+1 555 000 0000" value={fields.phone} onChange={set("phone")} />
            </div>
          )}
          {type === "contact" && (
            <div className="space-y-3">
              {[
                { k: "name",   label: "Full name",            ph: "Jane Smith" },
                { k: "phone2", label: "Phone",                ph: "+1 555 000 0000" },
                { k: "email2", label: "Email",                ph: "jane@example.com" },
                { k: "org",    label: "Organisation (opt.)", ph: "Acme Inc." },
                { k: "url2",   label: "Website (opt.)",      ph: "https://example.com" },
              ].map(({ k, label, ph }) => (
                <div key={k} className="space-y-1"><label className={labelCls}>{label}</label>
                  <input className={inputCls} placeholder={ph} value={fields[k]} onChange={set(k)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <div className="space-y-1.5">
            <label className={labelCls}>Download size</label>
            <div className="flex gap-1.5">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    size === s ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
                  )}>{s}px</button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Error correction</label>
            <div className="flex gap-1.5">
              {ECC_LEVELS.map(e => (
                <button key={e.id} onClick={() => setEcc(e.id)}
                  className={cn("flex-1 flex flex-col items-center rounded-lg py-1.5 transition-colors",
                    ecc === e.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
                  )}>
                  <span className="text-[11px] font-semibold">{e.id}</span>
                  <span className={cn("text-[9px] mt-0.5", ecc === e.id ? "text-white/70" : "text-neutral-400")}>{e.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {[{ label: "Foreground", val: fg, set: setFg }, { label: "Background", val: bg, set: setBg }].map(c => (
              <div key={c.label} className="space-y-1">
                <label className={labelCls}>{c.label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={c.val} onChange={e => c.set(e.target.value)} className="size-8 rounded-lg border border-neutral-200 cursor-pointer" />
                  <span className="text-[12px] text-neutral-600 font-mono">{c.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: preview */}
      <div className="flex flex-col items-center gap-4 w-full lg:w-[200px] shrink-0">
        <div className="w-full max-w-[200px] rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-3 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          {preview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={preview} alt="QR code preview" className="w-full rounded-xl" />
            : <div className="aspect-square w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          }
        </div>
        <div className="w-full max-w-[200px] space-y-2">
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
