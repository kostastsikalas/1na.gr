"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, FileText, Download, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ─── Type ─── */
type SuccessStory = {
  id: string;
  name: string; // π.χ. "Λίστα Επιτυχόντων 2026"
  school: string; // PDF URL
  year?: string;
};

/* ─── Page Component ─── */
export default function SuccessClient() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function fetchStories() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("success_stories")
        .select("*");

      if (!error && data) {
        // Ταξινόμηση κατά χρονολογία, νεότερο έτος πρώτο
        const sorted = [...data].sort(
          (a, b) => Number(b.year ?? 0) - Number(a.year ?? 0)
        );
        setStories(sorted);
      }
      setIsLoading(false);
    }
    fetchStories();
  }, []);

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
            Δείτε τα επίσημα αρχεία επιτυχόντων ανά χρονιά.
          </motion.p>
        </div>
      </section>

      {/* ══════ PDF Downloads ══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
        <h2 className="text-2xl font-bold text-[#002B5B] mb-6 flex items-center gap-2">
          <FileText className="text-[#e74c3c]" />
          Επίσημα Αρχεία Επιτυχόντων
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#213576]" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-medium">
            Δεν υπάρχουν διαθέσιμα αρχεία επιτυχόντων αυτή τη στιγμή.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stories.map((story) => (
              <a
                key={story.id}
                href={story.school}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#213576]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#213576]/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#213576]/10 transition-colors">
                  <Download className="text-[#213576] w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[15px] font-bold text-gray-800">
                  Έτος {story.year || ""}
                </span>
                <span className="text-[12px] text-gray-500 mt-1">
                  Προβολή PDF
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
