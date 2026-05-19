"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  Calculator as CalcIcon,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  schools,
  fieldSubjects,
  calcPoints,
  type Field,
} from "@/lib/schools2026";

const FIELDS: Field[] = [
  "Σπουδών Υγείας",
  "Θετικών Σπουδών",
  "Ανθρωπιστικών Σπουδών",
  "Σπουδών Οικονομίας & Πληροφορικής",
  "ΕΠΑΛ",
];

const FIELD_COLOR: Record<Field, string> = {
  "Σπουδών Υγείας": "from-emerald-500 to-teal-600",
  "Θετικών Σπουδών": "from-blue-500 to-indigo-600",
  "Ανθρωπιστικών Σπουδών": "from-violet-500 to-purple-600",
  "Σπουδών Οικονομίας & Πληροφορικής": "from-amber-500 to-orange-600",
  "ΕΠΑΛ": "from-rose-500 to-pink-600",
};

const FIELD_ACCENT: Record<Field, string> = {
  "Σπουδών Υγείας": "text-emerald-600",
  "Θετικών Σπουδών": "text-blue-600",
  "Ανθρωπιστικών Σπουδών": "text-violet-600",
  "Σπουδών Οικονομίας & Πληροφορικής": "text-amber-600",
  "ΕΠΑΛ": "text-rose-600",
};

export default function CalculatorPage() {
  const [field, setField] = useState<Field>("Σπουδών Υγείας");
  const [grades, setGrades] = useState<number[]>([15, 15, 15, 15]);
  const [showInfo, setShowInfo] = useState(false);
  const [filterPassing, setFilterPassing] = useState<"all" | "pass" | "fail">("all");
  const [loadedSchools, setLoadedSchools] = useState(schools);

  useEffect(() => {
    const fetchDynamicSchools = async () => {
      try {
        const supabase = createClient();
        const { data } = supabase.storage.from("uploads").getPublicUrl("calculator_bases.json");
        if (data.publicUrl) {
          const res = await fetch(data.publicUrl + "?t=" + new Date().getTime());
          if (res.ok) {
            const dynamicSchools = await res.json();
            if (Array.isArray(dynamicSchools) && dynamicSchools.length > 0) {
              setLoadedSchools(dynamicSchools);
            }
          }
        }
      } catch (_) {
        console.log("Χρήση στατικών βάσεων.");
      }
    };
    fetchDynamicSchools();
  }, []);

  const subjects = fieldSubjects[field];

  const fieldSchools = useMemo(
    () => loadedSchools.filter((s) => s.field === field),
    [field, loadedSchools]
  );

  /** Κάθε σχολή παίρνει τα δικά της μόρια */
  const schoolResults = useMemo(
    () =>
      fieldSchools
        .map((s) => ({ ...s, points: calcPoints(grades, s.coefficients) }))
        .sort((a, b) => b.base2025 - a.base2025),
    [fieldSchools, grades]
  );

  const passing = schoolResults.filter((s) => s.points >= s.base2025);
  const failing = schoolResults.filter((s) => s.points < s.base2025);

  const displayed = filterPassing === "pass"
    ? passing
    : filterPassing === "fail"
    ? failing
    : schoolResults;

  const maxPoints = 20000;
  const bestPoints = schoolResults[0]?.points ?? 0;
  const gaugeVal = Math.min(bestPoints, maxPoints);
  const radius = 90;
  const circ = Math.PI * radius;
  const offset = circ - (gaugeVal / maxPoints) * circ;

  function handleGrade(idx: number, val: string) {
    let n = parseFloat(val);
    if (isNaN(n)) n = 0;
    n = Math.min(20, Math.max(0, n));
    setGrades((prev) => {
      const next = [...prev];
      next[idx] = n;
      return next;
    });
  }

  function handleFieldChange(f: Field) {
    setField(f);
    setGrades([15, 15, 15, 15]);
    setFilterPassing("all");
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-25" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <CalcIcon size={15} /> Μηχανογραφικό 2026
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-5 tracking-tight"
          >
            Υπολογιστής Μορίων 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Υπολογισμός με τους <strong className="text-[#213576]">πραγματικούς συντελεστές βαρύτητας</strong> κάθε σχολής — βάσει ΦΕΚ 7145/2025.
          </motion.p>
        </div>
      </section>

      {/* ══════ Field Tabs ══════ */}
      <section className="sticky top-[84px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {FIELDS.map((f) => (
              <button
                key={f}
                onClick={() => handleFieldChange(f)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  field === f
                    ? `bg-gradient-to-r ${FIELD_COLOR[f]} text-white shadow-md`
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ Main Card ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          key={field}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* ── Left: Grade Inputs ── */}
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <h2 className="text-lg font-bold text-[#002B5B] mb-1">Βαθμολογία Μαθημάτων</h2>
              <p className="text-[13px] text-gray-400 mb-6">Κλίμακα 0–20</p>
              <div className="space-y-5">
                {subjects.map((subj, idx) => (
                  <div key={subj}>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[14px] font-semibold text-gray-700">{subj}</label>
                      <span className={`text-[13px] font-bold ${FIELD_ACCENT[field]}`}>
                        {grades[idx].toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                        value={grades[idx]}
                        onChange={(e) => handleGrade(idx, e.target.value)}
                        className="w-[72px] px-2 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-center text-[14px] focus:outline-none focus:ring-2 focus:ring-[#213576]/20"
                      />
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={grades[idx]}
                        onChange={(e) => handleGrade(idx, e.target.value)}
                        className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#213576]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Formula info */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="mt-6 flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-[#213576] transition-colors"
              >
                <Info size={13} />
                Πώς υπολογίζονται τα μόρια;
                <ChevronDown size={12} className={`transition-transform ${showInfo ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 bg-[#f8fafe] rounded-xl border border-[#213576]/10 text-[13px] text-gray-600 leading-relaxed">
                      <p className="font-semibold text-[#002B5B] mb-2">Τύπος υπολογισμού (ΦΕΚ 7145/2025):</p>
                      <p className="font-mono text-[12px] bg-white rounded-lg p-2.5 border border-gray-100 text-[#213576]">
                        Μόρια = (Β₁×σ₁ + Β₂×σ₂ + Β₃×σ₃ + Β₄×σ₄) × 1000
                      </p>
                      <p className="mt-2">Κάθε σχολή έχει δικούς της συντελεστές βαρύτητας (σ₁–σ₄) — γι&apos; αυτό τα μόρια διαφέρουν ανά τμήμα.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: Gauge ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
              <p className="text-[13px] text-gray-400 mb-4 text-center">Υψηλότερη βαθμολογία σε αυτό το πεδίο</p>
              <div className="relative w-[240px] h-[130px] flex items-end justify-center mb-3">
                <svg viewBox="0 0 200 110" className="absolute bottom-0 w-full overflow-visible">
                  <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
                  <path
                    d="M 10,100 A 90,90 0 0,1 190,100"
                    fill="none"
                    stroke="#213576"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute -bottom-5 left-1 text-[11px] text-gray-400">0</span>
                <span className="absolute -bottom-5 right-0 text-[11px] text-gray-400">20.000</span>
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="text-[3rem] font-extrabold text-[#213576] leading-none">
                    {gaugeVal.toLocaleString("el-GR")}
                  </span>
                  <span className="text-[15px] font-bold text-[#002B5B] mt-1">Μόρια</span>
                </div>
              </div>

              {/* Pass/Fail summary */}
              <div className="mt-8 w-full max-w-[240px]">
                <div className="flex items-center justify-center gap-6 mb-3">
                  <button
                    onClick={() => setFilterPassing(filterPassing === "pass" ? "all" : "pass")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-[13px] font-semibold ${
                      filterPassing === "pass"
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    {passing.length} Περνάτε
                  </button>
                  <button
                    onClick={() => setFilterPassing(filterPassing === "fail" ? "all" : "fail")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-[13px] font-semibold ${
                      filterPassing === "fail"
                        ? "bg-rose-100 text-rose-700"
                        : "text-rose-500 hover:bg-rose-50"
                    }`}
                  >
                    <XCircle size={15} />
                    {failing.length} Δεν περνάτε
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 text-center">
                  Βάσει βάσεων 2025 · {field}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════ School Results ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-extrabold text-[#002B5B]">
            Σχολές — {field}
            <span className="ml-2 text-[14px] font-normal text-gray-400">({displayed.length} αποτελέσματα)</span>
          </h2>
          {filterPassing !== "all" && (
            <button
              onClick={() => setFilterPassing("all")}
              className="text-[13px] text-[#213576] hover:underline"
            >
              Εμφάνιση όλων
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {displayed.map((s, i) => {
            const passes = s.points >= s.base2025;
            const diff = s.points - s.base2025;
            return (
              <motion.div
                key={`${s.name}-${s.institution}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className={`rounded-xl border p-4 transition-all ${
                  passes
                    ? "bg-emerald-50/50 border-emerald-200/60"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Status icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    passes ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {passes ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </div>

                  {/* School info + coefficients */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-[15px] font-bold ${passes ? "text-[#002B5B]" : "text-gray-500"}`}>
                        {s.name}
                      </h3>
                      <span className="text-[12px] text-gray-400">·</span>
                      <span className="text-[13px] text-gray-400">{s.institution}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{s.city}</span>
                    </div>
                    {/* Coefficients breakdown */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {fieldSubjects[field].map((subj, idx) => (
                        <span key={subj} className="text-[10px] px-2 py-0.5 bg-[#213576]/6 text-[#213576] rounded-full">
                          {subj.split(" ")[0]}: {Math.round(s.coefficients[idx] * 100)}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Points + base + diff */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="text-right">
                      <div className="text-[11px] text-gray-400 mb-0.5">Τα μόριά σας</div>
                      <div className={`text-[15px] font-extrabold ${passes ? "text-emerald-700" : "text-gray-500"}`}>
                        {s.points.toLocaleString("el-GR")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-gray-400 mb-0.5">Βάση 2025</div>
                      <div className="text-[15px] font-bold text-gray-600">
                        {s.base2025.toLocaleString("el-GR")}
                      </div>
                    </div>
                    <div className={`min-w-[64px] text-center px-2.5 py-1.5 rounded-lg text-[13px] font-bold ${
                      passes ? "bg-emerald-100 text-emerald-700" : "bg-rose-50 text-rose-600"
                    }`}>
                      {diff >= 0 ? `+${diff.toLocaleString("el-GR")}` : diff.toLocaleString("el-GR")}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-16 bg-[#f8fafe] rounded-2xl border border-dashed border-gray-200 mt-4">
            <p className="text-gray-400 text-[14px]">Δεν βρέθηκαν αποτελέσματα για αυτό το φίλτρο.</p>
          </div>
        )}

        <p className="text-center text-[12px] text-gray-400 mt-8">
          Οι συντελεστές βαρύτητας βασίζονται στο ΦΕΚ 7145/τ.Β&apos;/30-12-2025 · Βάσεις εισαγωγής 2025 · Ενδεικτικά αποτελέσματα
        </p>
      </section>
    </div>
  );
}
