"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

type Student = {
  id: string;
  name: string;
  school: string;
  year?: string;
};

export default function SuccessStories() {
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredStudents = students.filter((student) =>
    student.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.year && student.year.includes(searchQuery))
  );

  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
          <div className="text-[70px] md:text-[90px] font-extrabold text-[#df6060] leading-none tracking-tighter">
            2500+
          </div>
          <div className="text-2xl md:text-[32px] font-black text-[#213576] leading-tight text-center lg:text-left">
            ΕΠΙΤΥΧΟΝΤΕΣ ΣΤΙΣ<br />ΑΝΩΤΑΤΕΣ ΣΧΟΛΕΣ
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <input
            type="text"
            className="w-full bg-white border-2 border-[#213576] rounded-full py-3 pl-8 pr-16 text-lg text-gray-800 placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-[#df6060]/20 shadow-sm transition-all font-medium"
            placeholder="Αναζήτηση Ονόματος ή Σχολής..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <Search className="w-6 h-6 text-[#213576]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#213576]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 10) * 0.1 }}
                  className="bg-white rounded-xl border-2 border-[#213576] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow flex flex-col items-center p-8 pt-10"
                >
                  {/* Profile Avatar Placeholder */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 shadow-inner flex flex-col items-center justify-end mb-6 overflow-hidden relative border-[6px] border-white ring-1 ring-gray-100">
                     {/* CSS Silhouette */}
                     <div className="absolute top-5 w-12 h-12 bg-[#8c9bab] rounded-full"></div>
                     <div className="absolute -bottom-2 w-24 h-14 bg-[#8c9bab] rounded-t-[3rem]"></div>
                  </div>
                  
                  {/* Student Info */}
                  <h3 className="text-xl font-bold text-[#213576] text-center mb-1 leading-snug">
                    {student.name.split(' ').map((n, i) => <span key={i} className="block">{n}</span>)}
                  </h3>
                  <p className="text-lg font-semibold text-[#df6060] text-center mt-2">
                    {student.school.split(' ').map((n, i) => <span key={i} className={i === 0 ? "block" : ""}>{n}{i !== 0 && " "}</span>)}
                  </p>
                  {student.year && (
                    <p className="text-sm font-medium text-gray-400 mt-2">Έτος: {student.year}</p>
                  )}
                </motion.div>
              ))}
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-medium text-lg">
                Δεν βρέθηκαν επιτυχόντες με αυτά τα κριτήρια.
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
