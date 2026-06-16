"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Category = "full" | "username" | "fantasy" | "baby";
type Gender = "any" | "male" | "female";

const FIRST_MALE = ["James","John","Robert","Michael","William","David","Richard","Joseph","Thomas","Charles","Daniel","Matthew","Anthony","Mark","Donald","Steven","Paul","Andrew","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob","Gary","Nicholas","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin","Samuel","Raymond","Gregory","Frank","Alexander","Patrick","Jack","Dennis","Jerry","Tyler"];
const FIRST_FEMALE = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Dorothy","Kimberly","Emily","Donna","Michelle","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia","Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen","Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Janet","Catherine","Maria","Heather"];
const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"];
const FANTASY_NAMES = ["Aelindra","Bolverk","Caelindor","Draeven","Elysara","Faendrel","Galadrox","Haelindra","Ixandor","Jaelindra","Kaelthas","Lorandel","Myranth","Naelindra","Orendel","Praelindra","Quelindra","Raelindra","Saelindra","Taelindra","Uelindra","Vaelindra","Waelindra","Xaelindra","Yaelindra","Zaelindra","Aelinor","Brandor","Caelius","Daelindra","Erendor","Faelin","Gaelindra","Haelin","Ixandrel","Jaelin","Kaelin","Lorelin","Myraelin","Naelius","Oraelin","Praelin","Quaelin","Raelin","Saelin","Taelin","Uaelin","Vaelin","Waelin","Xaelin"];
const USERNAMES = ["ShadowNinja","CryptoWolf","NeonPanda","TurboHawk","CosmicFox","StormRider","NightOwl","PixelKnight","ThunderBolt","IronFist","SilverArrow","GhostByte","CyberWolf","StargazerX","QuantumLeap","NeonRider","VortexKing","EchoBlaze","ZeroGravity","NovaStar","TitaniumX","PhantomByte","CrystalEdge","InfinityX","ShadowByte","CyberNova","TurboBlaze","NebulaX","CosmicByte","StarlightX","PixelNova","NeonByte","CrystalNova","ShadowKnight","TurboNova","CosmicKnight","StormByte","NightByte","PixelByte","ThunderNova","IronByte","SilverNova","GhostNova","CyberByte","StargazerNova","QuantumNova","NeonNova","VortexNova","EchoNova","ZeroNova"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(cat: Category, gender: Gender): string {
  if (cat === "full") {
    const pool = gender === "male" ? FIRST_MALE : gender === "female" ? FIRST_FEMALE : [...FIRST_MALE, ...FIRST_FEMALE];
    return `${pick(pool)} ${pick(LAST_NAMES)}`;
  }
  if (cat === "username") return pick(USERNAMES) + Math.floor(Math.random() * 1000);
  if (cat === "fantasy") return pick(FANTASY_NAMES);
  if (cat === "baby") {
    const pool = gender === "male" ? FIRST_MALE : gender === "female" ? FIRST_FEMALE : [...FIRST_MALE, ...FIRST_FEMALE];
    return pick(pool);
  }
  return "";
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "full", label: "Full Name" },
  { id: "username", label: "Username" },
  { id: "fantasy", label: "Fantasy Name" },
  { id: "baby", label: "Baby Name" },
];

const GENDERS: { id: Gender; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
];

export function RandomNameGeneratorClient() {
  const [cat, setCat] = useState<Category>("full");
  const [gender, setGender] = useState<Gender>("any");
  const [count, setCount] = useState(10);
  const [names, setNames] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  function generate() {
    setNames(Array.from({ length: count }, () => generateName(cat, gender)));
  }

  function copyName(name: string, idx: number) {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }

  const showGender = cat === "full" || cat === "baby";

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setCat(id); setNames([]); }}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1",
              cat === id
                ? "bg-foreground text-white ring-foreground"
                : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {showGender && (
        <div className="flex flex-wrap gap-2">
          {GENDERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setGender(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1",
                gender === id
                  ? "bg-foreground text-white ring-foreground"
                  : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-muted-foreground w-24 shrink-0">
          Count: <strong className="text-foreground">{count}</strong>
        </span>
        <input
          type="range"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="flex-1 accent-foreground"
        />
      </div>

      <button
        onClick={generate}
        className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white hover:bg-foreground/90 transition-colors"
      >
        Generate Names
      </button>

      {names.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {names.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-white ring-1 ring-black/6 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <span className="text-[13px] text-foreground">{name}</span>
              <button
                onClick={() => copyName(name, i)}
                className="ml-2 flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors shrink-0"
              >
                {copiedIdx === i ? <Check size={11} weight="bold" /> : <Copy size={11} />}
                {copiedIdx === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
