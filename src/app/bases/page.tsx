"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { schools as fallbackSchools } from "@/lib/schools2026";

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.04 },
  }),
};

/* ─── Data ─── */
type SchoolBase = {
  id: string;
  name: string;
  institution: string;
  field: string;
  year2025: number;
  year2024?: number;
  year2023?: number;
};

/*
 * Πραγματικά δεδομένα βάσεων εισαγωγής (ΓΕΛ — γενική σειρά 90%)
 * Πηγές: aeitei.gr, ertnews.gr, ethnos.gr, zarpanews.gr
 * Ανακοίνωση 2025: 24 Ιουλίου 2025
 */
const schoolBases: SchoolBase[] = [
  // ── Σπουδών Υγείας (3ο Πεδίο) ──
  { id: "1",  name: "Ιατρική",                institution: "ΕΚΠΑ",  field: "Σπουδών Υγείας",             year2025: 18775, year2024: 18775, year2023: 18925 },
  { id: "2",  name: "Ιατρική",                institution: "ΑΠΘ",   field: "Σπουδών Υγείας",             year2025: 18575, year2024: 18575, year2023: 18700 },
  { id: "3",  name: "Ιατρική",                institution: "Παν. Πατρών",  field: "Σπουδών Υγείας",      year2025: 18445, year2024: 18445, year2023: 18580 },
  { id: "4",  name: "Ιατρική",                institution: "Παν. Ιωαννίνων", field: "Σπουδών Υγείας",    year2025: 18200, year2024: 18200, year2023: 18350 },
  { id: "5",  name: "Φαρμακευτική",           institution: "ΕΚΠΑ",  field: "Σπουδών Υγείας",             year2025: 17880, year2024: 17880, year2023: 18090 },
  { id: "6",  name: "Οδοντιατρική",           institution: "ΕΚΠΑ",  field: "Σπουδών Υγείας",             year2025: 18350, year2024: 18350, year2023: 18500 },
  { id: "7",  name: "Κτηνιατρική",            institution: "ΑΠΘ",   field: "Σπουδών Υγείας",             year2025: 16950, year2024: 16950, year2023: 17100 },

  // ── Θετικών Σπουδών (2ο Πεδίο) ──
  { id: "8",  name: "Ηλεκτρολόγων Μηχ. & Μηχ. Υπολογιστών", institution: "ΕΜΠ", field: "Θετικών Σπουδών", year2025: 18390, year2024: 18490, year2023: 18660 },
  { id: "9",  name: "Αρχιτεκτόνων Μηχανικών", institution: "ΕΜΠ",  field: "Θετικών Σπουδών",             year2025: 20380, year2024: 20100, year2023: 19850 },
  { id: "10", name: "Μηχανολόγων Μηχανικών",  institution: "ΕΜΠ",  field: "Θετικών Σπουδών",             year2025: 18128, year2024: 18200, year2023: 18350 },
  { id: "11", name: "Χημικών Μηχανικών",      institution: "ΕΜΠ",  field: "Θετικών Σπουδών",             year2025: 17775, year2024: 17850, year2023: 18000 },
  { id: "12", name: "Πολιτικών Μηχανικών",    institution: "ΕΜΠ",  field: "Θετικών Σπουδών",             year2025: 17265, year2024: 17350, year2023: 17500 },
  { id: "13", name: "Μαθηματικό",             institution: "ΕΚΠΑ", field: "Θετικών Σπουδών",              year2025: 16450, year2024: 16550, year2023: 16700 },
  { id: "14", name: "Φυσικό",                 institution: "ΕΚΠΑ", field: "Θετικών Σπουδών",              year2025: 15900, year2024: 16000, year2023: 16150 },

  // ── Ανθρωπιστικών Σπουδών (1ο Πεδίο) ──
  { id: "15", name: "Νομική",                 institution: "ΕΚΠΑ",  field: "Ανθρωπιστικών Σπουδών",       year2025: 17875, year2024: 18025, year2023: 18200 },
  { id: "16", name: "Ψυχολογίας",             institution: "ΕΚΠΑ",  field: "Ανθρωπιστικών Σπουδών",       year2025: 17475, year2024: 17550, year2023: 17700 },
  { id: "17", name: "Ψυχολογίας",             institution: "Πάντειο", field: "Ανθρωπιστικών Σπουδών",     year2025: 17100, year2024: 17200, year2023: 17350 },
  { id: "18", name: "Φιλολογίας",             institution: "ΕΚΠΑ",  field: "Ανθρωπιστικών Σπουδών",       year2025: 15350, year2024: 15500, year2023: 15650 },
  { id: "19", name: "Παιδαγωγικό Δημοτικής Εκπ.", institution: "ΕΚΠΑ", field: "Ανθρωπιστικών Σπουδών",   year2025: 14850, year2024: 14950, year2023: 15100 },

  // ── Οικονομίας & Πληροφορικής (4ο Πεδίο) ──
  { id: "20", name: "Πληροφορικής",           institution: "ΟΠΑ",   field: "Οικονομίας & Πληροφορικής",   year2025: 17590, year2024: 17400, year2023: 17200 },
  { id: "21", name: "Πληροφορικής & Τηλεπικοινωνιών", institution: "ΕΚΠΑ", field: "Οικονομίας & Πληροφορικής", year2025: 16955, year2024: 16800, year2023: 16600 },
  { id: "22", name: "Οργάνωσης & Διοίκησης Επιχ.", institution: "ΟΠΑ", field: "Οικονομίας & Πληροφορικής", year2025: 17425, year2024: 17300, year2023: 17100 },
  { id: "23", name: "Οικονομικών Επιστημών",  institution: "ΕΚΠΑ",  field: "Οικονομίας & Πληροφορικής",   year2025: 16150, year2024: 16000, year2023: 15850 },
  { id: "24", name: "Λογιστικής & Χρηματοοικονομικής", institution: "ΟΠΑ", field: "Οικονομίας & Πληροφορικής", year2025: 16800, year2024: 16650, year2023: 16500 },
];

const fields = [
  "Όλα τα Πεδία",
  "Θετικών Σπουδών",
  "Σπουδών Υγείας",
  "Ανθρωπιστικών Σπουδών",
  "Σπουδών Οικονομίας & Πληροφορικής",
  "ΕΠΑΛ",
];

const fieldColors: Record<string, { text: string; bg: string }> = {
  "Θετικών Σπουδών": { text: "text-blue-600", bg: "bg-blue-50" },
  "Σπουδών Υγείας": { text: "text-emerald-600", bg: "bg-emerald-50" },
  "Ανθρωπιστικών Σπουδών": { text: "text-rose-600", bg: "bg-rose-50" },
  "Οικονομίας & Πληροφορικής": { text: "text-violet-600", bg: "bg-violet-50" },
  "Σπουδών Οικονομίας & Πληροφορικής": { text: "text-violet-600", bg: "bg-violet-50" },
  "ΕΠΑΛ": { text: "text-pink-600", bg: "bg-pink-50" },
};

/* ─── Page Component ─── */
export default function BasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("Όλα τα Πεδία");
  const [sortBy, setSortBy] = useState<"name" | "points">("points");

  const [loadedSchools, setLoadedSchools] = useState<SchoolBase[]>(() => {
    return fallbackSchools.map((s, i) => {
      const historical = schoolBases.find(h => h.name === s.name && h.institution === s.institution);
      return {
        id: String(i),
        name: s.name,
        institution: s.institution,
        field: s.field,
        year2025: s.base2025,
        year2024: historical?.year2024,
        year2023: historical?.year2023,
      };
    });
  });

  useEffect(() => {
    const fetchDynamicSchools = async () => {
      try {
        const res = await fetch("/calculator_bases.json?t=" + new Date().getTime());
        if (res.ok) {
          const dynamicSchools = await res.json();
          if (Array.isArray(dynamicSchools) && dynamicSchools.length > 0) {
            const mapped = dynamicSchools.map((s: any, i: number) => {
              const historical = schoolBases.find(h => h.name === s.name && h.institution === s.institution);
              return {
                id: String(i),
                name: s.name,
                institution: s.institution,
                field: s.field,
                year2025: s.base2025 || s.year2025,
                year2024: historical?.year2024 || s.year2024,
                year2023: historical?.year2023 || s.year2023,
              };
            });
            setLoadedSchools(mapped);
          }
        }
      } catch (_) {
        console.log("Χρήση στατικών βάσεων.");
      }
    };
    fetchDynamicSchools();
  }, []);

  const filtered = useMemo(() => {
    let result = loadedSchools.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.institution.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesField =
        selectedField === "Όλα τα Πεδία" || s.field === selectedField ||
        (selectedField === "Οικονομίας & Πληροφορικής" && s.field === "Σπουδών Οικονομίας & Πληροφορικής") ||
        (selectedField === "Σπουδών Οικονομίας & Πληροφορικής" && s.field === "Οικονομίας & Πληροφορικής");
      return matchesSearch && matchesField;
    });

    if (sortBy === "points") {
      result = result.sort((a, b) => b.year2025 - a.year2025);
    } else {
      result = result.sort((a, b) => a.name.localeCompare(b.name, "el"));
    }

    return result;
  }, [searchQuery, selectedField, sortBy, loadedSchools]);

  const getTrend = (current: number, previous?: number) => {
    if (previous === undefined || previous === 0) return { icon: Minus, color: "text-gray-300", label: "-" };
    const diff = current - previous;
    if (diff > 0) return { icon: TrendingUp, color: "text-emerald-500", label: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: "text-rose-500", label: `${diff}` };
    return { icon: Minus, color: "text-gray-400", label: "0" };
  };

  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <BarChart3 size={15} />
              Μηχανογραφικό
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight">
            Βάσεις Εισαγωγής
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Συγκριτικός πίνακας βάσεων εισαγωγής ανά σχολή, πεδίο και έτος.
            Δείτε τις τάσεις και σχεδιάστε τη στρατηγική σας.
          </motion.p>
        </div>
      </section>

      {/* ══════ Field Tabs ══════ */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100/80 p-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {fields.map((field) => (
              <button key={field} onClick={() => setSelectedField(field)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  selectedField === field ? "bg-[#213576] text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}>
                {field}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════ Search & Sort ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#f8fafe] p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#213576]/20 text-[14px]"
              placeholder="Αναζήτηση σχολής ή ιδρύματος..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="relative w-full sm:w-52">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#213576]/20 cursor-pointer text-[14px]"
              value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "points")}>
              <option value="points">Ταξινόμηση: Μόρια ↓</option>
              <option value="name">Ταξινόμηση: Αλφαβητικά</option>
            </select>
          </div>
        </div>
        <p className="text-[13px] text-gray-400 mt-3 ml-1">
          {filtered.length} σχολ{filtered.length !== 1 ? "ές" : "ή"}
        </p>
      </section>

      {/* ══════ Table ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafe] border-b border-gray-100">
                <th className="text-left px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Σχολή</th>
                <th className="text-left px-4 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Πεδίο</th>
                <th className="text-center px-4 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">2023</th>
                <th className="text-center px-4 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">2024</th>
                <th className="text-center px-4 py-4 text-[12px] font-semibold text-[#213576] uppercase tracking-wider font-bold">2025</th>
                <th className="text-center px-4 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Τάση</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((school, i) => {
                const trend = getTrend(school.year2025, school.year2024);
                const TrendIcon = trend.icon;
                const color = fieldColors[school.field] || { text: "text-gray-600", bg: "bg-gray-50" };
                return (
                  <motion.tr key={school.id} custom={i % 20} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="border-b border-gray-50 hover:bg-[#f8fafe]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-bold text-[#002B5B]">{school.name}</div>
                      <div className="text-[12px] text-gray-400">{school.institution}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${color.bg} ${color.text}`}>
                        {school.field}
                      </span>
                    </td>
                    <td className="text-center px-4 py-4 text-[13px] text-gray-400 font-medium">{school.year2023 ? school.year2023.toLocaleString("el-GR") : "-"}</td>
                    <td className="text-center px-4 py-4 text-[13px] text-gray-500 font-medium">{school.year2024 ? school.year2024.toLocaleString("el-GR") : "-"}</td>
                    <td className="text-center px-4 py-4 text-[15px] text-[#002B5B] font-bold">{school.year2025 ? school.year2025.toLocaleString("el-GR") : "-"}</td>
                    <td className="text-center px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${trend.color}`}>
                        <TrendIcon size={14} />
                        {trend.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((school, i) => {
            const trend = getTrend(school.year2025, school.year2024);
            const TrendIcon = trend.icon;
            const color = fieldColors[school.field] || { text: "text-gray-600", bg: "bg-gray-50" };
            return (
              <motion.div key={school.id} custom={i % 10} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#002B5B]">{school.name}</h3>
                    <p className="text-[12px] text-gray-400">{school.institution}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${trend.color}`}>
                    <TrendIcon size={14} />
                    {trend.label}
                  </span>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${color.bg} ${color.text} mb-3`}>
                  {school.field}
                </span>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-50">
                  <div className="text-center">
                    <div className="text-[11px] text-gray-400">2023</div>
                    <div className="text-[13px] font-medium text-gray-500">{school.year2023 ? school.year2023.toLocaleString("el-GR") : "-"}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-gray-400">2024</div>
                    <div className="text-[13px] font-medium text-gray-500">{school.year2024 ? school.year2024.toLocaleString("el-GR") : "-"}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-[#213576] font-semibold">2025</div>
                    <div className="text-[15px] font-bold text-[#002B5B]">{school.year2025 ? school.year2025.toLocaleString("el-GR") : "-"}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-[#f8fafe] rounded-2xl border border-dashed border-gray-200">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Δεν βρέθηκαν σχολές</h3>
            <p className="text-gray-500 text-[14px]">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης.</p>
          </div>
        )}
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-[#213576] to-[#1a2d66] rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Υπολογίστε τα μόριά σας</h2>
            <p className="text-blue-100/60 text-[14px]">Δείτε σε ποιες σχολές μπορείτε να εισαχθείτε.</p>
          </div>
          <Link href="/calculator"
            className="relative z-10 flex items-center gap-2 px-7 py-3.5 bg-white text-[#213576] text-[15px] font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Υπολογιστής Μορίων <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
