"use client";

import { motion } from "framer-motion";
import { Trophy, FileText, Download } from "lucide-react";

/* ─── PDF Files ─── */
const pdfFiles = [
  { year: "2024", filename: "epit2024.pdf" },
  { year: "2021", filename: "epit2021.pdf" },
  { year: "2018", filename: "2018.pdf" },
  { year: "2012", filename: "2012.pdf" },
  { year: "2010", filename: "2010.pdf" },
  { year: "2009", filename: "2009.pdf" },
];

/* ─── Page Component ─── */
export default function SuccessClient() {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {pdfFiles.map((pdf) => (
            <a
              key={pdf.year}
              href={`/epitixontes/${pdf.filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#213576]/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#213576]/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#213576]/10 transition-colors">
                <Download className="text-[#213576] w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[15px] font-bold text-gray-800">
                Έτος {pdf.year}
              </span>
              <span className="text-[12px] text-gray-500 mt-1">
                Προβολή PDF
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
