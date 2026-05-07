"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calculator as CalcIcon,
  CheckCircle2,
  XCircle,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

/* ─── Orientation Groups ─── */
const orientationGroups = {
  "Θετικών Σπουδών": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Μαθηματικά"],
  "Ανθρωπιστικών Σπουδών": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Αρχαία Ελληνικά", "Ιστορία", "Λατινικά"],
  "Σπουδών Υγείας": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Βιολογία"],
  "Σπουδών Οικονομίας & Πληροφορικής": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Μαθηματικά", "Πληροφορική (ΑΕΠΠ)", "Οικονομία (ΑΟΘ)"],
};

type GroupType = keyof typeof orientationGroups;

/* ─── Field mapping: orientation group → bases field name ─── */
const groupToField: Record<GroupType, string> = {
  "Θετικών Σπουδών": "Θετικών Σπουδών",
  "Ανθρωπιστικών Σπουδών": "Ανθρωπιστικών Σπουδών",
  "Σπουδών Υγείας": "Σπουδών Υγείας",
  "Σπουδών Οικονομίας & Πληροφορικής": "Οικονομίας & Πληροφορικής",
};

/* ─── Bases 2025 (real data) ─── */
type SchoolBase = { name: string; institution: string; field: string; base2025: number };

const schoolBases: SchoolBase[] = [
  // Σπουδών Υγείας
  { name: "Ιατρική", institution: "ΕΚΠΑ", field: "Σπουδών Υγείας", base2025: 18775 },
  { name: "Ιατρική", institution: "ΑΠΘ", field: "Σπουδών Υγείας", base2025: 18575 },
  { name: "Ιατρική", institution: "Παν. Πατρών", field: "Σπουδών Υγείας", base2025: 18445 },
  { name: "Ιατρική", institution: "Παν. Ιωαννίνων", field: "Σπουδών Υγείας", base2025: 18200 },
  { name: "Οδοντιατρική", institution: "ΕΚΠΑ", field: "Σπουδών Υγείας", base2025: 18350 },
  { name: "Φαρμακευτική", institution: "ΕΚΠΑ", field: "Σπουδών Υγείας", base2025: 17880 },
  { name: "Κτηνιατρική", institution: "ΑΠΘ", field: "Σπουδών Υγείας", base2025: 16950 },
  { name: "Βιολογίας", institution: "ΕΚΠΑ", field: "Σπουδών Υγείας", base2025: 15200 },
  // Θετικών Σπουδών
  { name: "Αρχιτεκτόνων Μηχανικών", institution: "ΕΜΠ", field: "Θετικών Σπουδών", base2025: 20380 },
  { name: "Ηλεκτρολόγων Μηχ. & Μηχ. Υπολ.", institution: "ΕΜΠ", field: "Θετικών Σπουδών", base2025: 18390 },
  { name: "Μηχανολόγων Μηχανικών", institution: "ΕΜΠ", field: "Θετικών Σπουδών", base2025: 18128 },
  { name: "Χημικών Μηχανικών", institution: "ΕΜΠ", field: "Θετικών Σπουδών", base2025: 17775 },
  { name: "Πολιτικών Μηχανικών", institution: "ΕΜΠ", field: "Θετικών Σπουδών", base2025: 17265 },
  { name: "Μαθηματικό", institution: "ΕΚΠΑ", field: "Θετικών Σπουδών", base2025: 16450 },
  { name: "Φυσικό", institution: "ΕΚΠΑ", field: "Θετικών Σπουδών", base2025: 15900 },
  // Ανθρωπιστικών Σπουδών
  { name: "Νομική", institution: "ΕΚΠΑ", field: "Ανθρωπιστικών Σπουδών", base2025: 17875 },
  { name: "Ψυχολογίας", institution: "ΕΚΠΑ", field: "Ανθρωπιστικών Σπουδών", base2025: 17475 },
  { name: "Ψυχολογίας", institution: "Πάντειο", field: "Ανθρωπιστικών Σπουδών", base2025: 17100 },
  { name: "Φιλολογίας", institution: "ΕΚΠΑ", field: "Ανθρωπιστικών Σπουδών", base2025: 15350 },
  { name: "Παιδαγωγικό Δημοτικής Εκπ.", institution: "ΕΚΠΑ", field: "Ανθρωπιστικών Σπουδών", base2025: 14850 },
  // Οικονομίας & Πληροφορικής
  { name: "Πληροφορικής", institution: "ΟΠΑ", field: "Οικονομίας & Πληροφορικής", base2025: 17590 },
  { name: "Οργάνωσης & Διοίκησης Επιχ.", institution: "ΟΠΑ", field: "Οικονομίας & Πληροφορικής", base2025: 17425 },
  { name: "Πληροφορικής & Τηλεπικοινωνιών", institution: "ΕΚΠΑ", field: "Οικονομίας & Πληροφορικής", base2025: 16955 },
  { name: "Λογιστικής & Χρηματοοικ.", institution: "ΟΠΑ", field: "Οικονομίας & Πληροφορικής", base2025: 16800 },
  { name: "Οικονομικών Επιστημών", institution: "ΕΚΠΑ", field: "Οικονομίας & Πληροφορικής", base2025: 16150 },
];

/* ─── Page Component ─── */
export default function CalculatorPage() {
  const [selectedGroup, setSelectedGroup] = useState<GroupType>("Θετικών Σπουδών");
  const [grades, setGrades] = useState<Record<string, number>>({
    "Νεοελληνική Γλώσσα & Λογοτεχνία": 18.2,
    "Φυσική": 19.0,
    "Χημεία": 18.8,
    "Μαθηματικά": 17.5,
  });
  const [totalPoints, setTotalPoints] = useState(18375);

  const currentSubjects = orientationGroups[selectedGroup];
  const currentField = groupToField[selectedGroup];

  useEffect(() => {
    let sum = 0;
    currentSubjects.forEach((subject) => { sum += grades[subject] || 0; });
    setTotalPoints(Math.round(sum * 250));
  }, [grades, currentSubjects]);

  /* Schools for this field, sorted by base descending */
  const fieldSchools = useMemo(
    () => schoolBases.filter((s) => s.field === currentField).sort((a, b) => b.base2025 - a.base2025),
    [currentField],
  );

  const passSchools = fieldSchools.filter((s) => totalPoints >= s.base2025);
  const failSchools = fieldSchools.filter((s) => totalPoints < s.base2025);

  const handleGradeChange = (subject: string, value: string) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue > 20) numValue = 20;
    if (numValue < 0) numValue = 0;
    setGrades((prev) => ({ ...prev, [subject]: numValue }));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroup = e.target.value as GroupType;
    setSelectedGroup(newGroup);
    setGrades((prev) => {
      const ng = { ...prev };
      orientationGroups[newGroup].forEach((sub) => { if (ng[sub] === undefined) ng[sub] = 15.0; });
      return ng;
    });
  };

  const radius = 90;
  const circumference = Math.PI * radius;
  const progress = (totalPoints / 20000) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-35" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <CalcIcon size={15} /> Μηχανογραφικό
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight">
            Υπολογιστής Μορίων 2026
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Υπολογίστε τα μόριά σας και δείτε αμέσως σε ποιες σχολές
            μπορείτε να εισαχθείτε βάσει περσινών βάσεων.
          </motion.p>
        </div>
      </section>

      {/* ══════ Calculator Card ══════ */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100/80 p-6 md:p-10 flex flex-col md:flex-row gap-10">

          {/* Left: Inputs */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Ομάδα Προσανατολισμού</label>
                <select value={selectedGroup} onChange={handleGroupChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#213576]/20 appearance-none bg-white text-[14px]">
                  {Object.keys(orientationGroups).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Ειδικά Μαθήματα</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#213576]/20 appearance-none bg-white text-[14px]">
                  <option>Κανένα</option>
                  <option>Αγγλικά</option>
                  <option>Ελεύθερο & Γραμμικό Σχέδιο</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#002B5B] mb-6">Βαθμολογία Μαθημάτων</h3>
            <div className="space-y-5">
              {currentSubjects.map((subject) => (
                <div key={subject} className="space-y-2">
                  <label className="block text-[14px] font-semibold text-gray-700">{subject}</label>
                  <div className="flex items-center gap-4">
                    <input type="number" step="0.1" min="0" max="20" value={grades[subject] || ""}
                      onChange={(e) => handleGradeChange(subject, e.target.value)}
                      className="w-20 px-3 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#213576]/20 text-[14px] text-center" placeholder="0" />
                    <div className="flex-1 px-2">
                      <input type="range" min="0" max="20" step="0.1" value={grades[subject] || 0}
                        onChange={(e) => handleGradeChange(subject, e.target.value)}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#213576]" />
                    </div>
                    <span className="text-[12px] text-gray-400 font-medium w-8 text-right">{(grades[subject] || 0).toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Gauge */}
          <div className="flex-1 flex flex-col items-center justify-center pt-4 md:pt-0">
            <div className="relative w-[280px] h-[150px] flex items-end justify-center mb-6">
              <svg viewBox="0 0 200 110" className="absolute bottom-0 w-full h-full overflow-visible">
                <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
                <path d="M 10,100 A 90,90 0 0,1 190,100" fill="none" stroke="#213576" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700 ease-out" />
              </svg>
              <span className="absolute -bottom-6 left-2 text-[11px] font-medium text-gray-400">0</span>
              <span className="absolute -bottom-6 right-0 text-[11px] font-medium text-gray-400">20.000</span>
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-[3.5rem] font-extrabold text-[#213576] leading-none tracking-tight">
                  {totalPoints.toLocaleString("el-GR")}
                </span>
                <span className="text-lg font-bold text-[#002B5B] mt-1">Μόρια</span>
              </div>
            </div>

            {/* Quick summary */}
            <div className="flex items-center gap-4 mt-10 mb-2">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 size={16} />
                <span className="text-[14px] font-bold">{passSchools.length}</span>
                <span className="text-[13px] text-gray-500">περνάτε</span>
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-rose-500">
                <XCircle size={16} />
                <span className="text-[14px] font-bold">{failSchools.length}</span>
                <span className="text-[13px] text-gray-500">δεν περνάτε</span>
              </div>
            </div>
            <p className="text-[12px] text-gray-400 text-center">Βάσει βάσεων 2025 · {currentField}</p>
          </div>
        </motion.div>
      </section>

      {/* ══════ Schools Results ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#002B5B] mb-2">
            Σχολές — {currentField}
          </h2>
          <p className="text-gray-500 text-[14px]">
            Βάσει των βάσεων εισαγωγής 2025 και των μορίων σας ({totalPoints.toLocaleString("el-GR")})
          </p>
        </motion.div>

        <div className="space-y-3">
          {fieldSchools.map((school, i) => {
            const passes = totalPoints >= school.base2025;
            const diff = totalPoints - school.base2025;
            return (
              <motion.div
                key={`${school.name}-${school.institution}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 rounded-xl border transition-all ${
                  passes
                    ? "bg-emerald-50/50 border-emerald-200/60 hover:border-emerald-300"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Status icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  passes ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {passes ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>

                {/* School info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-[15px] font-bold ${passes ? "text-[#002B5B]" : "text-gray-500"}`}>
                      {school.name}
                    </h3>
                    <span className="text-[12px] text-gray-400">·</span>
                    <span className="text-[13px] text-gray-400">{school.institution}</span>
                  </div>
                </div>

                {/* Base & Diff */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <div className="text-[11px] text-gray-400 mb-0.5">Βάση 2025</div>
                    <div className={`text-[15px] font-bold ${passes ? "text-[#002B5B]" : "text-gray-500"}`}>
                      {school.base2025.toLocaleString("el-GR")}
                    </div>
                  </div>
                  <div className={`min-w-[70px] text-right px-3 py-1.5 rounded-lg text-[13px] font-bold ${
                    passes
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-50 text-rose-600"
                  }`}>
                    {diff >= 0 ? `+${diff.toLocaleString("el-GR")}` : diff.toLocaleString("el-GR")}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {fieldSchools.length === 0 && (
          <div className="text-center py-16 bg-[#f8fafe] rounded-2xl border border-dashed border-gray-200">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Δεν βρέθηκαν σχολές για αυτό το πεδίο.</p>
          </div>
        )}
      </section>
    </div>
  );
}
