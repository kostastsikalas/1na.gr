"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Loader2,
  BookOpen,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import localExams from "@/data/examArchive.json";

/* ─── Types ─── */
type ExamType = "ΓΕΛ" | "ΕΠΑΛ";
type Kind = "Θέματα" | "Λύσεις";

type ExamEntry = {
  id: string;
  source: "local" | "db";
  year: string;
  type: ExamType;
  subject: string;
  directions: string[];
  kind: Kind;
  file_url: string;
};

/* ─── Direction taxonomy (drives the cascade + ordering) ─── */
const DIRECTION_ORDER: Record<ExamType, string[]> = {
  ΓΕΛ: [
    "Γενικής Παιδείας",
    "Ανθρωπιστικών Σπουδών",
    "Θετικών Σπουδών",
    "Σπουδών Υγείας",
    "Σπουδών Οικονομίας & Πληροφορικής",
  ],
  ΕΠΑΛ: [
    "Κοινά Μαθήματα",
    "Τομέας Υγείας - Πρόνοιας",
    "Τομέας Πληροφορικής",
    "Τομέας Διοίκησης & Οικονομίας",
    "Τομέας Μηχανολογίας",
    "Τομέας Ηλεκτρολογίας",
  ],
};

const directionColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  "Γενικής Παιδείας": { text: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" },
  "Ανθρωπιστικών Σπουδών": { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-400" },
  "Θετικών Σπουδών": { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
  "Σπουδών Υγείας": { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-400" },
  "Σπουδών Οικονομίας & Πληροφορικής": { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-400" },
  "Κοινά Μαθήματα": { text: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" },
  "Τομέας Υγείας - Πρόνοιας": { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-400" },
  "Τομέας Πληροφορικής": { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-400" },
  "Τομέας Διοίκησης & Οικονομίας": { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
  "Τομέας Μηχανολογίας": { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
  "Τομέας Ηλεκτρολογίας": { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
};

const defaultColor = { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" };
const colorOf = (dir: string) => directionColors[dir] || defaultColor;

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.03 },
  }),
};

/* ─── Page Component ─── */
export default function ArchiveClient() {
  const [examType, setExamType] = useState<ExamType>("ΓΕΛ");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const [dbExams, setDbExams] = useState<ExamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchExams() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("exam_archives")
        .select("*")
        .order("year", { ascending: false });

      if (!error && data) {
        setDbExams(
          data.map((row): ExamEntry => ({
            id: `db-${row.id}`,
            source: "db",
            year: String(row.year),
            type: "ΓΕΛ",
            subject: row.subject,
            directions: row.category ? [row.category] : [],
            kind: "Θέματα",
            file_url: row.file_url,
          })),
        );
      }
      setIsLoading(false);
    }
    fetchExams();
  }, [supabase]);

  /* All entries (local catalog + uploaded) */
  const allEntries = useMemo(
    () => [...(localExams as ExamEntry[]), ...dbExams],
    [dbExams],
  );

  const typeEntries = useMemo(
    () => allEntries.filter((e) => e.type === examType),
    [allEntries, examType],
  );

  /* Years available for the selected type */
  const years = useMemo(() => {
    const set = new Set(typeEntries.map((e) => e.year));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [typeEntries]);

  /* Directions that actually have entries, in canonical order */
  const directions = useMemo(() => {
    const present = new Set(typeEntries.flatMap((e) => e.directions));
    const ordered = DIRECTION_ORDER[examType].filter((d) => present.has(d));
    const extra = [...present].filter((d) => !DIRECTION_ORDER[examType].includes(d));
    return [...ordered, ...extra];
  }, [typeEntries, examType]);

  /* Subjects of the selected direction */
  const subjects = useMemo(() => {
    if (!selectedDirection) return [];
    const subs = typeEntries
      .filter((e) => e.directions.includes(selectedDirection))
      .map((e) => e.subject);
    return Array.from(new Set(subs)).sort((a, b) => a.localeCompare(b, "el"));
  }, [typeEntries, selectedDirection]);

  /* Final filtered cards */
  const filtered = useMemo(() => {
    return typeEntries.filter((e) => {
      if (selectedYear !== "all" && e.year !== selectedYear) return false;
      if (selectedDirection && !e.directions.includes(selectedDirection)) return false;
      if (selectedSubject && e.subject !== selectedSubject) return false;
      return true;
    });
  }, [typeEntries, selectedYear, selectedDirection, selectedSubject]);

  /* Reset cascade when type changes */
  const switchType = (t: ExamType) => {
    setExamType(t);
    setSelectedDirection(null);
    setSelectedSubject(null);
  };

  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-35" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6"
          >
            <FileText size={15} />
            Πανελλήνιες
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Θέματα & Λύσεις
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Πλήρες αρχείο θεμάτων πανελλαδικών εξετάσεων.
            Επιλέξτε χρονιά, τύπο σχολείου, κατεύθυνση και μάθημα.
          </motion.p>
        </div>
      </section>

      {/* ══════ ΓΕΛ / ΕΠΑΛ toggle ══════ */}
      <section className="relative -mt-6 z-30 max-w-md mx-auto px-4 mb-8">
        <div className="flex bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-1.5">
          {(["ΓΕΛ", "ΕΠΑΛ"] as ExamType[]).map((t) => (
            <button
              key={t}
              onClick={() => switchType(t)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-bold transition-colors ${
                examType === t ? "text-white" : "text-[#002B5B] hover:bg-gray-50"
              }`}
            >
              {examType === t && (
                <motion.span
                  layoutId="typePill"
                  className="absolute inset-0 bg-[#213576] rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <GraduationCap size={17} className="relative z-10" />
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ══════ Filters ══════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Year + direction dropdowns */}
        <div className="bg-[#f8fafe] p-4 md:p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <label className="block mb-1.5 ml-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
              Έτος
            </label>
            <select
              className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#213576]/20 focus:border-[#213576]/30 cursor-pointer text-[14px]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Όλα τα Έτη</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1.5 ml-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
              {examType === "ΕΠΑΛ" ? "Τομέας" : "Κατεύθυνση"}
            </label>
            <select
              className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#213576]/20 focus:border-[#213576]/30 cursor-pointer text-[14px]"
              value={selectedDirection ?? ""}
              onChange={(e) => {
                setSelectedDirection(e.target.value || null);
                setSelectedSubject(null);
              }}
            >
              <option value="">
                {examType === "ΕΠΑΛ" ? "Όλοι οι Τομείς" : "Όλες οι Κατευθύνσεις"}
              </option>
              {directions.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subjects (appear once a direction is picked) */}
        <AnimatePresence>
          {selectedDirection && subjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mb-1.5 ml-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
                Μάθημα
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                    selectedSubject === null
                      ? "bg-[#002B5B] text-white border-[#002B5B]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#213576]/30"
                  }`}
                >
                  Όλα τα μαθήματα
                </button>
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                      selectedSubject === s
                        ? "bg-[#002B5B] text-white border-[#002B5B]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#213576]/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && (
          <p className="text-[13px] text-gray-400 mt-5 ml-1">
            {filtered.length} αρχεί{filtered.length !== 1 ? "α" : "ο"}
          </p>
        )}
      </section>

      {/* ══════ Results Grid ══════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#213576] mb-4" />
            <p className="text-gray-400 text-sm">Φόρτωση θεμάτων...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((exam, i) => {
              const dir = exam.directions[0] || "";
              const c = colorOf(dir);
              const isSolution = exam.kind === "Λύσεις";
              return (
                <motion.div
                  key={exam.id}
                  custom={i % 16}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-[#213576]/15 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${c.bg} ${c.text}`}>
                        {exam.year}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          isSolution
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[#213576]/8 text-[#213576]"
                        }`}
                      >
                        {isSolution ? <CheckCircle2 size={12} /> : <FileText size={12} />}
                        {exam.kind}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-[#213576]/5 flex items-center justify-center group-hover:bg-[#213576] transition-colors duration-300 shrink-0">
                      <BookOpen size={16} className="text-[#213576] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  <h3 className="text-[15px] font-bold text-[#002B5B] mb-1.5 leading-tight">
                    {exam.subject}
                  </h3>
                  <span className={`text-[12px] font-medium ${c.text} mb-5`}>
                    {dir || exam.type}
                  </span>

                  <a
                    href={exam.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-[#213576]/5 hover:bg-[#213576] text-[#213576] hover:text-white rounded-xl transition-all duration-200 font-semibold text-[13px]"
                  >
                    <Download size={15} />
                    Λήψη PDF
                  </a>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#f8fafe] rounded-2xl border border-dashed border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Δεν βρέθηκαν θέματα
            </h3>
            <p className="text-gray-500 text-[14px]">
              Δοκιμάστε άλλη χρονιά, τύπο σχολείου, κατεύθυνση ή όρους αναζήτησης.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
