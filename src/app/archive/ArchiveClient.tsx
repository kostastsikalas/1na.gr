"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  FileText,
  Filter,
  Loader2,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ─── Constants ─── */
const categories = [
  "Όλα τα Πεδία",
  "Γενικής Παιδείας",
  "Ανθρωπιστικών Σπουδών",
  "Θετικών Σπουδών",
  "Σπουδών Υγείας",
  "Οικονομίας & Πληροφορικής",
];

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  "Γενικής Παιδείας": { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
  "Ανθρωπιστικών Σπουδών": { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  "Θετικών Σπουδών": { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  "Σπουδών Υγείας": { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  "Οικονομίας & Πληροφορικής": { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
};

/* ─── Types ─── */
type ExamArchiveItem = {
  id: string;
  year: string;
  category: string;
  subject: string;
  file_url: string;
};

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05 },
  }),
};

/* ─── Page Component ─── */
export default function ArchiveClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("Όλα τα Πεδία");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [exams, setExams] = useState<ExamArchiveItem[]>([]);
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
        setExams(data);
      }
      setIsLoading(false);
    }

    fetchExams();
  }, [supabase]);

  const uniqueYears = useMemo(() => {
    const years = new Set(exams.map((e) => e.year));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [exams]);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.subject
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "all" || exam.year.toString() === selectedYear;
    const matchesCategory =
      selectedCategory === "Όλα τα Πεδία" ||
      exam.category === selectedCategory;
    return matchesSearch && matchesYear && matchesCategory;
  });

  const getColor = (cat: string) =>
    categoryColors[cat] || { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };

  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-35" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <FileText size={15} />
              Πανελλήνιες
            </span>
          </motion.div>

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
            Φιλτράρετε ανά πεδίο, μάθημα, ή χρονιά.
          </motion.p>
        </div>
      </section>

      {/* ══════ Category Dropdown ══════ */}
      <section className="relative -mt-8 z-30 max-w-[320px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/80 px-5 py-4 transition-all hover:border-[#213576]/20 focus:outline-none focus:ring-2 focus:ring-[#213576]/20"
          >
            <span className="font-bold text-[#002B5B] text-[14px]">
              {selectedCategory}
            </span>
            <ChevronDown
              size={18}
              className={`text-[#213576] transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-40 py-2"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[13px] font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#213576]/5 text-[#213576] font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#002B5B]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ══════ Search & Filter ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[#f8fafe] p-4 md:p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#213576]/20 focus:border-[#213576]/30 transition-all text-[14px]"
              placeholder="Αναζήτηση μαθήματος..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#213576]/20 focus:border-[#213576]/30 cursor-pointer text-[14px]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Όλα τα Έτη</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!isLoading && (
          <p className="text-[13px] text-gray-400 mt-3 ml-1">
            {filteredExams.length} θέμα{filteredExams.length !== 1 ? "τα" : ""}
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
        ) : filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredExams.map((exam, i) => {
              const color = getColor(exam.category);
              return (
                <motion.div
                  key={exam.id}
                  custom={i % 12}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-[#213576]/15 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${color.bg} ${color.text}`}
                    >
                      {exam.year}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#213576]/5 flex items-center justify-center group-hover:bg-[#213576] transition-colors duration-300">
                      <BookOpen
                        size={16}
                        className="text-[#213576] group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-[15px] font-bold text-[#002B5B] mb-1.5 leading-tight line-clamp-2">
                    {exam.subject}
                  </h3>
                  <span
                    className={`text-[12px] font-medium ${color.text} mb-5`}
                  >
                    {exam.category}
                  </span>

                  {/* Download Button */}
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
              Δοκιμάστε να αλλάξετε την Ομάδα Προσανατολισμού, το Έτος ή τους
              όρους αναζήτησης.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
