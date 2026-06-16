function buildMap(
  upperStart: number,
  lowerStart: number,
  digitStart?: number,
  overrides: Record<string, string> = {}
): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
    map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
  }
  if (digitStart !== undefined) {
    for (let i = 0; i < 10; i++) {
      map[String.fromCharCode(48 + i)] = String.fromCodePoint(digitStart + i);
    }
  }
  return { ...map, ...overrides };
}

const MAPS = {
  bold: buildMap(0x1d400, 0x1d41a, 0x1d7ce),
  italic: buildMap(0x1d434, 0x1d44e, undefined, { h: "ℎ" }),
  boldItalic: buildMap(0x1d468, 0x1d482),
  script: buildMap(0x1d49c, 0x1d4b6, undefined, {
    B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ",
    L: "ℒ", M: "ℳ", R: "ℛ",
    e: "ℯ", g: "ℊ", o: "ℴ",
  }),
  boldScript: buildMap(0x1d4d0, 0x1d4ea),
  fraktur: buildMap(0x1d504, 0x1d51e, undefined, {
    C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ",
  }),
  boldFraktur: buildMap(0x1d56c, 0x1d586),
  doubleStruck: buildMap(0x1d538, 0x1d552, 0x1d7d8, {
    C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ",
  }),
  sansSerif: buildMap(0x1d5a0, 0x1d5ba, 0x1d7e2),
  sansBold: buildMap(0x1d5d4, 0x1d5ee, 0x1d7ec),
  sansItalic: buildMap(0x1d608, 0x1d622),
  sansBoldItalic: buildMap(0x1d63c, 0x1d656),
  monospace: buildMap(0x1d670, 0x1d68a, 0x1d7f6),
  fullWidth: buildMap(0xff21, 0xff41, 0xff10),
  bubble: {
    ...buildMap(0x24b6, 0x24d0),
    "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④",
    "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
  },
  smallCaps: {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ",
    g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ",
    m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
    s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
    y: "ʏ", z: "ᴢ",
  } as Record<string, string>,
  flip: {
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ",
    h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "ʅ", m: "ɯ",
    n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n",
    v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
    A: "∀", B: "ꓤ", C: "Ɔ", D: "◖", E: "Ǝ", F: "Ⅎ",
    G: "⅁", H: "H", I: "I", J: "ſ", K: "ʞ", L: "Γ", M: "W",
    N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ᴚ", S: "S", T: "⊥",
    U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
    "0": "0", "1": "⇂", "2": "ᴉ̲", "3": "Ɛ", "6": "9", "9": "6",
    ".": "˙", ",": "'", "!": "¡", "?": "¿",
  } as Record<string, string>,
};

export function applyMap(text: string, map: Record<string, string>): string {
  return [...text].map((ch) => map[ch] ?? ch).join("");
}

export function withCombining(text: string, combiner: string): string {
  return [...text].map((ch) => (ch === " " ? ch : ch + combiner)).join("");
}

export type TextStyle = {
  id: string;
  name: string;
  convert: (text: string) => string;
};

export const FANCY_STYLES: TextStyle[] = [
  { id: "bold", name: "Bold", convert: (t) => applyMap(t, MAPS.bold) },
  { id: "italic", name: "Italic", convert: (t) => applyMap(t, MAPS.italic) },
  { id: "boldItalic", name: "Bold Italic", convert: (t) => applyMap(t, MAPS.boldItalic) },
  { id: "script", name: "Script", convert: (t) => applyMap(t, MAPS.script) },
  { id: "boldScript", name: "Bold Script", convert: (t) => applyMap(t, MAPS.boldScript) },
  { id: "fraktur", name: "Fraktur", convert: (t) => applyMap(t, MAPS.fraktur) },
  { id: "boldFraktur", name: "Bold Fraktur", convert: (t) => applyMap(t, MAPS.boldFraktur) },
  { id: "doubleStruck", name: "Double Struck", convert: (t) => applyMap(t, MAPS.doubleStruck) },
  { id: "sansBold", name: "Sans Bold", convert: (t) => applyMap(t, MAPS.sansBold) },
  { id: "sansItalic", name: "Sans Italic", convert: (t) => applyMap(t, MAPS.sansItalic) },
  { id: "sansBoldItalic", name: "Sans Bold Italic", convert: (t) => applyMap(t, MAPS.sansBoldItalic) },
  { id: "sansSerif", name: "Sans Serif", convert: (t) => applyMap(t, MAPS.sansSerif) },
  { id: "monospace", name: "Monospace", convert: (t) => applyMap(t, MAPS.monospace) },
  { id: "smallCaps", name: "Small Caps", convert: (t) => applyMap(t, MAPS.smallCaps) },
  { id: "fullWidth", name: "Full Width", convert: (t) => applyMap(t, MAPS.fullWidth) },
  { id: "bubble", name: "Bubble", convert: (t) => applyMap(t, MAPS.bubble) },
  { id: "strikethrough", name: "Strikethrough", convert: (t) => withCombining(t, "̶") },
  { id: "underline", name: "Underline", convert: (t) => withCombining(t, "̲") },
  { id: "flip", name: "Upside Down", convert: (t) => applyMap([...t].reverse().join(""), MAPS.flip) },
];

export const GAMING_BORDERS: { label: string; wrap: (n: string) => string }[] = [
  { label: "Classic FF", wrap: (n) => `꧁꩜${n}꩜꧂` },
  { label: "Ornate", wrap: (n) => `꧁༒${n}༒꧂` },
  { label: "Khanda", wrap: (n) => `꧁☬${n}☬꧂` },
  { label: "Star", wrap: (n) => `★彡${n}彡★` },
  { label: "Zen", wrap: (n) => `꧁༄${n}༄꧂` },
  { label: "Crown", wrap: (n) => `꧁👑${n}👑꧂` },
  { label: "Fire", wrap: (n) => `🔥${n}🔥` },
  { label: "Skull", wrap: (n) => `💀${n}💀` },
  { label: "Elite Brackets", wrap: (n) => `【${n}】` },
  { label: "Japanese", wrap: (n) => `『${n}』` },
  { label: "Lightning", wrap: (n) => `⚡${n}⚡` },
  { label: "Sword", wrap: (n) => `⚔${n}⚔` },
  { label: "Star Shine", wrap: (n) => `☆彡${n}彡☆` },
  { label: "God", wrap: (n) => `꧁ᴳᵒᵈ${n}꧂` },
  { label: "Angle", wrap: (n) => `≋${n}≋` },
  { label: "Arrows", wrap: (n) => `»${n}«` },
];
