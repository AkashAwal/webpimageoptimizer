"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { DownloadSimple, Phone, Envelope, Globe, MapPin, LinkedinLogo, XLogo } from "@phosphor-icons/react";

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 outline-none focus:border-neutral-400 transition-colors dark:border-neutral-600 dark:bg-white dark:text-neutral-900";
const labelCls = "text-[11px] font-medium text-neutral-500 uppercase tracking-wide";

type Fields = {
  firstName: string; lastName: string; nickname: string;
  title: string; company: string; department: string;
  mobile: string; workPhone: string; email: string; workEmail: string;
  street: string; city: string; state: string; zip: string; country: string;
  website: string; linkedin: string; twitter: string;
  note: string;
};

const EMPTY: Fields = {
  firstName: "", lastName: "", nickname: "",
  title: "", company: "", department: "",
  mobile: "", workPhone: "", email: "", workEmail: "",
  street: "", city: "", state: "", zip: "", country: "",
  website: "", linkedin: "", twitter: "",
  note: "",
};

const ACCENTS = [
  { id: "ink",     from: "#18181b", to: "#52525b",  ring: "bg-neutral-900" },
  { id: "blue",    from: "#1e40af", to: "#3b82f6",  ring: "bg-blue-600" },
  { id: "violet",  from: "#5b21b6", to: "#8b5cf6",  ring: "bg-violet-700" },
  { id: "emerald", from: "#065f46", to: "#10b981",  ring: "bg-emerald-700" },
  { id: "rose",    from: "#9f1239", to: "#fb7185",  ring: "bg-rose-700" },
];

function buildVCard(f: Fields): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  if (f.firstName || f.lastName) lines.push(`N:${f.lastName};${f.firstName};;;`);
  const full = [f.firstName, f.lastName].filter(Boolean).join(" ") || f.nickname;
  if (full) lines.push(`FN:${full}`);
  if (f.nickname) lines.push(`NICKNAME:${f.nickname}`);
  if (f.company || f.department) lines.push(`ORG:${f.company};${f.department}`);
  if (f.title) lines.push(`TITLE:${f.title}`);
  if (f.mobile) lines.push(`TEL;TYPE=CELL:${f.mobile}`);
  if (f.workPhone) lines.push(`TEL;TYPE=WORK:${f.workPhone}`);
  if (f.email) lines.push(`EMAIL;TYPE=HOME:${f.email}`);
  if (f.workEmail) lines.push(`EMAIL;TYPE=WORK:${f.workEmail}`);
  if ([f.street, f.city, f.state, f.zip, f.country].some(Boolean))
    lines.push(`ADR;TYPE=WORK:;;${f.street};${f.city};${f.state};${f.zip};${f.country}`);
  if (f.website) lines.push(`URL:${f.website}`);
  if (f.linkedin) lines.push(`X-SOCIALPROFILE;type=linkedin:${f.linkedin}`);
  if (f.twitter) lines.push(`X-SOCIALPROFILE;type=twitter:${f.twitter}`);
  if (f.note) lines.push(`NOTE:${f.note}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <div className="h-px flex-1 bg-neutral-100" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function CardPreview({ f, accent }: { f: Fields; accent: typeof ACCENTS[0] }) {
  const fullName = [f.firstName, f.lastName].filter(Boolean).join(" ") || f.nickname;
  const initial = (f.firstName?.[0] || f.nickname?.[0] || "?").toUpperCase();
  const primaryPhone = f.mobile || f.workPhone;
  const primaryEmail = f.email || f.workEmail;
  const addrLine = [f.city, f.state, f.country].filter(Boolean).join(", ");
  const site = f.website ? f.website.replace(/^https?:\/\/(www\.)?/, "") : "";

  return (
    <div className="w-full rounded-2xl overflow-hidden ring-1 ring-black/8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.22)]">
      {/* Gradient header */}
      <div
        className="px-5 pt-5 pb-5 relative overflow-hidden"
        style={{ background: `linear-gradient(140deg, ${accent.from} 0%, ${accent.to} 100%)` }}
      >
        {/* decorative circles */}
        <div className="absolute -top-6 -right-6 size-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -right-2 size-16 rounded-full bg-white/5" />

        {/* Avatar */}
        <div className="size-11 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center mb-3 relative">
          <span className="text-white text-[17px] font-bold select-none leading-none">{initial}</span>
        </div>

        <p className="text-white text-[15px] font-bold leading-snug relative">
          {fullName || <span className="opacity-50">Your Name</span>}
        </p>
        {(f.title || f.company) && (
          <p className="text-white/75 text-[12px] mt-0.5 relative leading-snug">
            {[f.title, f.company].filter(Boolean).join(" · ")}
          </p>
        )}
        {f.department && (
          <p className="text-white/55 text-[11px] mt-0.5 relative">{f.department}</p>
        )}
      </div>

      {/* Contact rows */}
      <div className="bg-white px-4 py-3 space-y-2.5">
        {primaryPhone && (
          <div className="flex items-center gap-2.5 min-w-0">
            <Phone size={12} weight="bold" className="text-neutral-350 shrink-0" style={{ color: accent.from }} />
            <span className="text-[12px] text-neutral-700 truncate">{primaryPhone}</span>
          </div>
        )}
        {primaryEmail && (
          <div className="flex items-center gap-2.5 min-w-0">
            <Envelope size={12} weight="bold" className="shrink-0" style={{ color: accent.from }} />
            <span className="text-[12px] text-neutral-700 truncate">{primaryEmail}</span>
          </div>
        )}
        {site && (
          <div className="flex items-center gap-2.5 min-w-0">
            <Globe size={12} weight="bold" className="shrink-0" style={{ color: accent.from }} />
            <span className="text-[12px] text-neutral-700 truncate">{site}</span>
          </div>
        )}
        {addrLine && (
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin size={12} weight="bold" className="shrink-0" style={{ color: accent.from }} />
            <span className="text-[12px] text-neutral-700 truncate">{addrLine}</span>
          </div>
        )}
        {(f.linkedin || f.twitter) && (
          <div className="flex items-center gap-3 pt-0.5">
            {f.linkedin && <LinkedinLogo size={14} style={{ color: accent.from }} />}
            {f.twitter && <XLogo size={13} style={{ color: accent.from }} />}
          </div>
        )}
        {!primaryPhone && !primaryEmail && !site && !addrLine && !f.linkedin && !f.twitter && (
          <p className="text-[12px] text-neutral-300 italic py-0.5">Fill in fields to preview</p>
        )}
      </div>
    </div>
  );
}

export function VCardQrGeneratorClient() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [size, setSize] = useState(512);
  const [preview, setPreview] = useState<string>("");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const vcard = buildVCard(f);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(vcard, {
        width: 256, margin: 2, errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#ffffff" }, type: "image/png",
      })
    ).then(url => { if (!cancelled) setPreview(url); })
     .catch(() => { if (!cancelled) setPreview(""); });
    return () => { cancelled = true; };
  }, [vcard]);

  const downloadPng = async () => {
    const QRCode = (await import("qrcode")).default;
    const url = await QRCode.toDataURL(vcard, {
      width: size, margin: 2, errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" }, type: "image/png",
    });
    const a = document.createElement("a");
    a.href = url; a.download = "vcard-qr.png"; a.click();
  };

  const downloadSvg = async () => {
    const QRCode = (await import("qrcode")).default;
    const svg = await QRCode.toString(vcard, {
      type: "svg", width: size, margin: 2, errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" },
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "vcard-qr.svg"; a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left: all input fields */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Personal */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <SectionHeader label="Personal" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input className={inputCls} placeholder="Jane" value={f.firstName} onChange={set("firstName")} />
            </Field>
            <Field label="Last name">
              <input className={inputCls} placeholder="Smith" value={f.lastName} onChange={set("lastName")} />
            </Field>
          </div>
          <Field label="Display name / Nickname">
            <input className={inputCls} placeholder="Jane (optional)" value={f.nickname} onChange={set("nickname")} />
          </Field>
        </div>

        {/* Work */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <SectionHeader label="Work" />
          <Field label="Job title">
            <input className={inputCls} placeholder="Senior Designer" value={f.title} onChange={set("title")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <input className={inputCls} placeholder="Acme Inc." value={f.company} onChange={set("company")} />
            </Field>
            <Field label="Department">
              <input className={inputCls} placeholder="Product" value={f.department} onChange={set("department")} />
            </Field>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <SectionHeader label="Contact" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mobile phone">
              <input className={inputCls} type="tel" placeholder="+1 555 000 0000" value={f.mobile} onChange={set("mobile")} />
            </Field>
            <Field label="Work phone">
              <input className={inputCls} type="tel" placeholder="+1 555 000 0001" value={f.workPhone} onChange={set("workPhone")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Personal email">
              <input className={inputCls} type="email" placeholder="jane@gmail.com" value={f.email} onChange={set("email")} />
            </Field>
            <Field label="Work email">
              <input className={inputCls} type="email" placeholder="jane@acme.com" value={f.workEmail} onChange={set("workEmail")} />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <SectionHeader label="Address" />
          <Field label="Street">
            <input className={inputCls} placeholder="123 Main Street" value={f.street} onChange={set("street")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input className={inputCls} placeholder="New York" value={f.city} onChange={set("city")} />
            </Field>
            <Field label="State / Region">
              <input className={inputCls} placeholder="NY" value={f.state} onChange={set("state")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ZIP / Postal code">
              <input className={inputCls} placeholder="10001" value={f.zip} onChange={set("zip")} />
            </Field>
            <Field label="Country">
              <input className={inputCls} placeholder="United States" value={f.country} onChange={set("country")} />
            </Field>
          </div>
        </div>

        {/* Online */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <SectionHeader label="Online" />
          <Field label="Website">
            <input className={inputCls} placeholder="https://example.com" value={f.website} onChange={set("website")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="LinkedIn URL">
              <input className={inputCls} placeholder="linkedin.com/in/janesmith" value={f.linkedin} onChange={set("linkedin")} />
            </Field>
            <Field label="X / Twitter handle">
              <input className={inputCls} placeholder="@janesmith" value={f.twitter} onChange={set("twitter")} />
            </Field>
          </div>
        </div>

        {/* Note */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <SectionHeader label="Note" />
          <textarea
            className={cn(inputCls, "resize-none h-20")}
            placeholder="Any additional note (optional)"
            value={f.note}
            onChange={set("note")}
          />
        </div>
      </div>

      {/* Right: card preview + QR + download */}
      <div className="flex flex-col items-center gap-4 w-full lg:w-[260px] shrink-0">
        {/* Accent color picker */}
        <div className="w-full space-y-1.5">
          <p className={labelCls}>Card colour</p>
          <div className="flex gap-2">
            {ACCENTS.map(a => (
              <button
                key={a.id}
                onClick={() => setAccent(a)}
                title={a.id}
                className={cn(
                  "size-6 rounded-full transition-all",
                  a.ring,
                  accent.id === a.id ? "ring-2 ring-offset-2 ring-neutral-400 scale-110" : "opacity-70 hover:opacity-100"
                )}
              />
            ))}
          </div>
        </div>

        {/* Business card preview */}
        <CardPreview f={f} accent={accent} />

        {/* QR code preview */}
        <div className="w-full rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-3 dark:bg-neutral-900 dark:ring-white/8">
          {preview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={preview} alt="vCard QR code preview" className="w-full rounded-xl" />
            : <div className="aspect-square w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          }
        </div>

        {/* Size selector */}
        <div className="w-full space-y-1.5">
          <p className={labelCls}>Download size</p>
          <div className="flex gap-1.5">
            {[256, 512, 1024].map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                  size === s ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
                )}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Download buttons */}
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
