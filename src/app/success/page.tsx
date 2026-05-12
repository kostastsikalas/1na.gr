"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  Trophy,
  GraduationCap,
  Filter,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ─── Types ─── */
type Student = {
  id: string;
  name: string;
  school: string;
  year?: string;
};

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06 },
  }),
};


/* ─── Page Component ─── */
export default function SuccessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStudents() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setStudents(data);
      }
      setIsLoading(false);
    }

    fetchStudents();
  }, [supabase]);

  const uniqueYears = useMemo(() => {
    const years = new Set(students.map((s) => s.year).filter(Boolean));
    return Array.from(years).sort((a, b) => parseInt(b!) - parseInt(a!));
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "all" || student.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <Trophy size={15} />
              Πανελλήνιες
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Οι Επιτυχόντες μας
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Χιλιάδες μαθητές εμπιστεύτηκαν το ΕΝΑ και πέτυχαν. 
            Αναζητήστε ονόματα, σχολές, ή χρονιές.
          </motion.p>
        </div>
      </section>

      {/* ══════ Search & Filter Bar ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 mt-8">
        <div className="bg-[#f8fafe] p-4 md:p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#213576]/20 focus:border-[#213576]/30 transition-all text-[14px]"
              placeholder="Αναζήτηση ονόματος ή σχολής..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
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

        {/* Results count */}
        {!isLoading && (
          <p className="text-[13px] text-gray-400 mt-3 ml-1">
            {filteredStudents.length} αποτελέσμα{filteredStudents.length !== 1 ? "τα" : ""}
          </p>
        )}
      </section>

      {/* ══════ Students Grid ══════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#213576] mb-4" />
            <p className="text-gray-400 text-sm">Φόρτωση επιτυχόντων...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                custom={index % 12}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-[#213576]/15 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex items-start gap-4"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#213576]/10 to-[#213576]/5 flex items-center justify-center shrink-0 group-hover:from-[#213576] group-hover:to-[#1a2d66] transition-all duration-300">
                  <GraduationCap
                    size={24}
                    className="text-[#213576] group-hover:text-white transition-colors duration-300"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-[#002B5B] leading-tight mb-1 truncate">
                    {student.name}
                  </h3>
                  <p className="text-[13px] font-medium text-[#c0392b] mb-1.5 truncate">
                    {student.school}
                  </p>
                  {student.year && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#213576]/6 text-[#213576]">
                      Έτος {student.year}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#f8fafe] rounded-2xl border border-dashed border-gray-200">
            <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Δεν βρέθηκαν επιτυχόντες
            </h3>
            <p className="text-gray-500 text-[14px]">
              Δοκιμάστε να αλλάξετε τους όρους αναζήτησης ή το φίλτρο έτους.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
