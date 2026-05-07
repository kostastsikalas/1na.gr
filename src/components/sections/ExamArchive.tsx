"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Download, FileText, Filter, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Categories (Orientation Groups)
const categories = [
  "Όλα τα Πεδία",
  "Γενικής Παιδείας",
  "Ανθρωπιστικών Σπουδών",
  "Θετικών Σπουδών",
  "Σπουδών Υγείας",
  "Οικονομίας & Πληροφορικής"
];

type ExamArchiveItem = {
  id: string;
  year: string;
  category: string;
  subject: string;
  file_url: string;
};

export default function ExamArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("Όλα τα Πεδία");
  
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
    const years = new Set(exams.map(e => e.year));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [exams]);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === "all" || exam.year.toString() === selectedYear;
    const matchesCategory = selectedCategory === "Όλα τα Πεδία" || exam.category === selectedCategory;
    return matchesSearch && matchesYear && matchesCategory;
  });

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center flex flex-col items-center">
          <h1 className="text-[2.5rem] font-extrabold text-[#002B5B] mb-4">Αρχείο Θεμάτων Πανελλαδικών</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Επιλέξτε την Ομάδα Προσανατολισμού σας και τη χρονιά για να βρείτε και να κατεβάσετε τα αντίστοιχα θέματα.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat 
                  ? "bg-[#213576] text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#f4fbff] p-5 rounded-2xl shadow-sm border border-red-100 flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow"
              placeholder="Αναζήτηση μαθήματος..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-56">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Όλα τα Έτη</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-[#213576]" />
          </div>
        ) : filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExams.map((exam) => (
              <div 
                key={exam.id} 
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-300 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-red-50 text-[#213576] text-xs font-bold px-3 py-1.5 rounded-full">
                    Έτος: {exam.year}
                  </div>
                  <FileText className="text-gray-300 w-7 h-7" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-[1.1rem] font-bold text-[#002B5B] mb-1 line-clamp-2">{exam.subject}</h3>
                <p className="text-xs font-medium text-red-400 mb-6">{exam.category}</p>
                
                <a 
                  href={exam.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full bg-gray-50 border border-gray-200 hover:bg-[#213576] hover:text-white hover:border-[#213576] text-[#213576] py-2.5 rounded-xl transition-colors font-semibold text-sm"
                >
                  <Download size={16} />
                  <span>Λήψη PDF</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Δεν βρέθηκαν θέματα</h3>
            <p className="text-gray-500">Δοκιμάστε να αλλάξετε την Ομάδα Προσανατολισμού, το Έτος ή τους όρους αναζήτησης.</p>
          </div>
        )}

      </div>
    </section>
  );
}
