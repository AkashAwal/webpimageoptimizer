"use client";

import { useState } from "react";

const GRADE_MAP: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

const GRADE_OPTIONS = Object.keys(GRADE_MAP);

interface Course {
  name: string;
  grade: string;
  credits: string;
}

function emptyRow(): Course {
  return { name: "", grade: "A", credits: "3" };
}

export function GpaCalculatorClient() {
  const [courses, setCourses] = useState<Course[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [currentGpa, setCurrentGpa] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");

  const update = (i: number, field: keyof Course, val: string) => {
    setCourses((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const addRow = () => setCourses((prev) => [...prev, emptyRow()]);
  const removeRow = (i: number) => setCourses((prev) => prev.filter((_, idx) => idx !== i));

  const validCourses = courses.filter((c) => {
    const cr = parseFloat(c.credits);
    return cr > 0 && GRADE_MAP[c.grade] !== undefined;
  });

  const totalPoints = validCourses.reduce((sum, c) => sum + GRADE_MAP[c.grade] * parseFloat(c.credits), 0);
  const totalCredits = validCourses.reduce((sum, c) => sum + parseFloat(c.credits), 0);
  const semesterGpa = totalCredits > 0 ? totalPoints / totalCredits : null;

  const prevGpa = parseFloat(currentGpa) || 0;
  const prevCredits = parseFloat(currentCredits) || 0;
  let cumulativeGpa: number | null = null;
  if (semesterGpa !== null && prevGpa > 0 && prevCredits > 0) {
    const totalPts = prevGpa * prevCredits + totalPoints;
    cumulativeGpa = totalPts / (prevCredits + totalCredits);
  }

  const gpaColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-emerald-400";
    if (gpa >= 3.0) return "text-blue-400";
    if (gpa >= 2.0) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
        <div className="grid grid-cols-[1fr_100px_70px_auto] gap-2 text-[11px] font-medium text-muted-foreground px-1">
          <span>Course name</span>
          <span>Grade</span>
          <span>Credits</span>
          <span />
        </div>
        {courses.map((course, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_70px_auto] gap-2 items-center">
            <input
              type="text"
              value={course.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder={`Course ${i + 1}`}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
            <select
              value={course.grade}
              onChange={(e) => update(i, "grade", e.target.value)}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            >
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>{g} ({GRADE_MAP[g].toFixed(1)})</option>
              ))}
            </select>
            <input
              type="number"
              value={course.credits}
              onChange={(e) => update(i, "credits", e.target.value)}
              min={0}
              step={0.5}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
            <button
              onClick={() => removeRow(i)}
              disabled={courses.length <= 1}
              className="size-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-foreground transition-colors disabled:opacity-30"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addRow}
          className="text-[13px] font-medium text-neutral-500 hover:text-foreground transition-colors"
        >
          + Add course
        </button>
      </div>

      {semesterGpa !== null && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-neutral-400 mb-1">Semester GPA</p>
              <p className={`text-[36px] font-bold ${gpaColor(semesterGpa)}`}>{semesterGpa.toFixed(2)}</p>
              <p className="text-[12px] text-neutral-400">{totalCredits} credit hours</p>
            </div>
            {cumulativeGpa !== null && (
              <div>
                <p className="text-[11px] text-neutral-400 mb-1">Cumulative GPA</p>
                <p className={`text-[36px] font-bold ${gpaColor(cumulativeGpa)}`}>{cumulativeGpa.toFixed(2)}</p>
                <p className="text-[12px] text-neutral-400">{prevCredits + totalCredits} total credits</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <p className="text-[13px] font-semibold text-foreground mb-3">Include previous GPA (optional)</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] text-muted-foreground">Current cumulative GPA</label>
            <input type="number" value={currentGpa} onChange={(e) => setCurrentGpa(e.target.value)} placeholder="3.20" step={0.01}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] text-muted-foreground">Credit hours completed</label>
            <input type="number" value={currentCredits} onChange={(e) => setCurrentCredits(e.target.value)} placeholder="60"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
