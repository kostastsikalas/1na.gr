"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardList,
  Download,
  Clock,
  FileText,
  BookOpen,
  Calculator,
  Atom,
  PenTool,
  Languages,
  Brain,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06 },
  }),
};

/* ─── Data ─── */
type MockExam = {
  id: string;
  subject: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  field: string;
  duration: string;
  difficulty: "Βασικό" | "Μέτριο" | "Προχωρημένο";
  description: string;
  topics: string[];
  downloadUrl: string;
};

const mockExams: MockExam[] = [
  {
    id: "math-1",
    subject: "Μαθηματικά (Άλγεβρα)",
    icon: Calculator,
    color: "text-blue-600",
    bg: "bg-blue-50",
    field: "Θετικών Σπουδών",
    duration: "3 ώρες",
    difficulty: "Προχωρημένο",
    description: "Πλήρες διαγώνισμα σε Πολυώνυμα, Εξισώσεις, Ανισώσεις, Ακολουθίες & Όρια.",
    topics: ["Πολυώνυμα", "Εξισώσεις 2ου βαθμού", "Ακολουθίες", "Όρια"],
    downloadUrl: "#",
  },
  {
    id: "math-2",
    subject: "Μαθηματικά (Ανάλυση)",
    icon: Calculator,
    color: "text-blue-600",
    bg: "bg-blue-50",
    field: "Θετικών Σπουδών",
    duration: "3 ώρες",
    difficulty: "Προχωρημένο",
    description: "Παράγωγοι, Ολοκληρώματα, Μελέτη Συνάρτησης, Εφαρμογές.",
    topics: ["Παράγωγοι", "Ολοκληρώματα", "Μελέτη Συνάρτησης", "Θεωρήματα"],
    downloadUrl: "#",
  },
  {
    id: "physics-1",
    subject: "Φυσική",
    icon: Atom,
    color: "text-violet-600",
    bg: "bg-violet-50",
    field: "Θετικών Σπουδών",
    duration: "3 ώρες",
    difficulty: "Μέτριο",
    description: "Κινηματική, Δυναμική, Ταλαντώσεις, Κύματα, Ηλεκτρομαγνητισμός.",
    topics: ["Κινηματική", "Δυναμική", "Ταλαντώσεις", "Ηλεκτρομαγνητισμός"],
    downloadUrl: "#",
  },
  {
    id: "chemistry-1",
    subject: "Χημεία",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    field: "Θετικών Σπουδών",
    duration: "3 ώρες",
    difficulty: "Μέτριο",
    description: "Οξέα-Βάσεις, Οξειδοαναγωγή, Οργανική Χημεία, Θερμοχημεία.",
    topics: ["Οξέα-Βάσεις", "Οξειδοαναγωγή", "Οργανική Χημεία", "Θερμοχημεία"],
    downloadUrl: "#",
  },
  {
    id: "biology-1",
    subject: "Βιολογία",
    icon: Brain,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    field: "Σπουδών Υγείας",
    duration: "3 ώρες",
    difficulty: "Μέτριο",
    description: "Γενετική, Μοριακή Βιολογία, Εξέλιξη, Βιοτεχνολογία.",
    topics: ["Γενετική", "DNA & RNA", "Εξέλιξη", "Βιοτεχνολογία"],
    downloadUrl: "#",
  },
  {
    id: "literature-1",
    subject: "Αρχαία Ελληνικά",
    icon: PenTool,
    color: "text-rose-600",
    bg: "bg-rose-50",
    field: "Ανθρωπιστικών Σπουδών",
    duration: "3 ώρες",
    difficulty: "Προχωρημένο",
    description: "Αδίδακτο κείμενο, Διδαγμένο κείμενο, Γραμματική & Συντακτικό.",
    topics: ["Αδίδακτο", "Διδαγμένο", "Γραμματική", "Συντακτικό"],
    downloadUrl: "#",
  },
  {
    id: "essay-1",
    subject: "Νεοελληνική Γλώσσα & Λογοτεχνία",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    field: "Γενικής Παιδείας",
    duration: "3 ώρες",
    difficulty: "Βασικό",
    description: "Κατανόηση κειμένου, Σύνοψη, Ερωτήσεις Κρίσεως, Παραγωγή Λόγου.",
    topics: ["Κατανόηση κειμένου", "Σύνοψη", "Παραγωγή Λόγου", "Λογοτεχνία"],
    downloadUrl: "#",
  },
  {
    id: "english-1",
    subject: "Αγγλικά",
    icon: Languages,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    field: "Γενικής Παιδείας",
    duration: "2.5 ώρες",
    difficulty: "Βασικό",
    description: "Reading Comprehension, Grammar, Vocabulary, Writing.",
    topics: ["Reading", "Grammar", "Vocabulary", "Writing"],
    downloadUrl: "#",
  },
];

const fields = ["Όλα", ...new Set(mockExams.map((e) => e.field))];

const difficultyColors: Record<string, string> = {
  "Βασικό": "bg-emerald-50 text-emerald-600",
  "Μέτριο": "bg-amber-50 text-amber-600",
  "Προχωρημένο": "bg-rose-50 text-rose-600",
};

/* ─── Page Component ─── */
export default function MockExamsPage() {
  const [selectedField, setSelectedField] = useState("Όλα");

  const filtered =
    selectedField === "Όλα"
      ? mockExams
      : mockExams.filter((e) => e.field === selectedField);

  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <ClipboardList size={15} />
              Πανελλήνιες
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Προτεινόμενα Διαγωνίσματα
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Εξασκηθείτε με τα διαγωνίσματα του ΕΝΑ — σχεδιασμένα 
            από τους καθηγητές μας ειδικά για τις Πανελλαδικές.
          </motion.p>
        </div>
      </section>

      {/* ══════ Field Filter ══════ */}
      <section className="relative -mt-8 z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100/80 p-3"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {fields.map((field) => (
              <button
                key={field}
                onClick={() => setSelectedField(field)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  selectedField === field
                    ? "bg-[#213576] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════ Mock Exams Grid ══════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((exam, i) => {
            const Icon = exam.icon;
            return (
              <motion.div
                key={exam.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-[#213576]/15 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Top Row */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${exam.bg} flex items-center justify-center ${exam.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-[#002B5B] mb-1 leading-tight">
                      {exam.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${difficultyColors[exam.difficulty]}`}
                      >
                        {exam.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[12px] text-gray-400">
                        <Clock size={12} />
                        {exam.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                  {exam.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {exam.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-[12px] font-medium text-gray-500"
                    >
                      <CheckCircle2 size={11} className={exam.color} />
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Download */}
                <a
                  href={exam.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#213576]/5 hover:bg-[#213576] text-[#213576] hover:text-white rounded-xl transition-all duration-200 font-semibold text-[14px]"
                >
                  <Download size={16} />
                  Κατέβασε το Διαγώνισμα
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
