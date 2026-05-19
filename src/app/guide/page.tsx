"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  ClipboardCheck,
  FileEdit,
  CalendarCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Scale,
  Activity,
  Shield,
  Dumbbell
} from "lucide-react";

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
};

/* ─── Types & Data ─── */
type TabId = "machinery" | "system" | "military";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "machinery", label: "Μηχανογραφικό & Οδηγίες", icon: Compass },
  { id: "system", label: "Σύστημα Εισαγωγής", icon: GraduationCap },
  { id: "military", label: "Στρατιωτικές & Αστυνομικές", icon: Shield },
];

const steps = [
  {
    step: 1,
    icon: BookOpen,
    title: "Γνωρίστε τα Πεδία",
    description: "Κατανοήστε τα 4 Επιστημονικά Πεδία και τις σχολές που αντιστοιχούν σε κάθε πεδίο. Αυτό θα σας βοηθήσει να κάνετε στρατηγικές επιλογές.",
    tips: [
      "1ο Πεδίο → Νομική, Φιλολογία, Ψυχολογία",
      "2ο Πεδίο → Πολυτεχνεία, Μαθηματικά, Φυσική",
      "3ο Πεδίο → Ιατρική, Φαρμακευτική, Βιολογία",
      "4ο Πεδίο → Πληροφορική, Οικονομικά",
    ],
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    step: 2,
    icon: ClipboardCheck,
    title: "Ελέγξτε τις Βάσεις",
    description: "Μελετήστε τις βάσεις εισαγωγής των τελευταίων ετών. Παρατηρήστε τις τάσεις — ανεβαίνουν ή πέφτουν; Αυτό θα σας βοηθήσει να θέσετε ρεαλιστικούς στόχους.",
    tips: [
      "Συγκρίνετε βάσεις 3ετίας",
      "Λάβετε υπόψη τον αριθμό εισακτέων",
      "Χρησιμοποιήστε τον Υπολογιστή Μορίων μας",
    ],
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    link: "/calculator",
  },
  {
    step: 3,
    icon: FileEdit,
    title: "Συμπληρώστε το Μηχανογραφικό",
    description: "Η σειρά των σχολών στο μηχανογραφικό είναι κρίσιμη. Βάλτε πρώτα τις σχολές που πραγματικά θέλετε, ακόμα κι αν φαίνονται δύσκολες.",
    tips: [
      "1η-5η θέση: Σχολές-όνειρο",
      "6η-15η θέση: Ρεαλιστικές επιλογές",
      "16η+: Σχολές ασφαλείας",
    ],
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    step: 4,
    icon: CalendarCheck,
    title: "Προθεσμίες & Υποβολή",
    description: "Μην αφήνετε τίποτα για την τελευταία στιγμή. Σημειώστε τις ημερομηνίες και υποβάλετε εγκαίρως μέσω του TaxisNet.",
    tips: [
      "Ηλεκτρονική υποβολή στο exams.it.minedu.gov.gr",
      "Κρατήστε αντίγραφο/εκτύπωση",
      "Ελέγξτε ξανά πριν την τελική οριστικοποίηση",
    ],
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const faqs = [
  {
    question: "Μπορώ να αλλάξω τις επιλογές μου μετά την υποβολή;",
    answer: "Ναι, μπορείτε να τροποποιήσετε το μηχανογραφικό σας όσες φορές θέλετε μέχρι τη λήξη της προθεσμίας. Μετρά ΜΟΝΟ η τελευταία υποβολή.",
  },
  {
    question: "Πόσες σχολές μπορώ να δηλώσω;",
    answer: "Μπορείτε να δηλώσετε απεριόριστο αριθμό σχολών/τμημάτων. Η σύστασή μας είναι να συμπληρώσετε όσο περισσότερες μπορείτε.",
  },
  {
    question: "Τι γίνεται αν δεν περάσω πουθενά;",
    answer: "Αν δεν εισαχθείτε σε καμία σχολή, μπορείτε να ξαναδώσετε πανελλαδικές την επόμενη χρονιά ή να αξιοποιήσετε το 10% των θέσεων (χωρίς νέα εξέταση για τα επόμενα 2 έτη).",
  },
];

/* ─── Page Component ─── */
export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<TabId>("machinery");

  return (
    <div className="bg-white min-h-screen">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <BookOpen size={15} />
              Οδηγός Σπουδών 2026
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight">
            Πλήρης Οδηγός Πανελλαδικών
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Από το σύστημα εισαγωγής και τις βάσεις, μέχρι τις αθλητικές δοκιμασίες και τη σωστή συμπλήρωση του μηχανογραφικού σας.
          </motion.p>
        </div>
      </section>

      {/* ══════ Tabs Navigation ══════ */}
      <section className="sticky top-[84px] z-30 bg-white/80 backdrop-blur-md border-y border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-[#213576] text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ Main Content Area ══════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-[500px]">
        <AnimatePresence mode="wait">
          {/* TAB 1: MACHINERY */}
          {activeTab === "machinery" && (
            <motion.div key="machinery" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              <div className="mb-10">
                <h2 className="text-2xl font-extrabold text-[#002B5B] mb-3">Συμπλήρωση Μηχανογραφικού Δελτίου</h2>
                <p className="text-gray-500 text-[15px]">Οδικός χάρτης 4 βημάτων για να αποφύγετε τα λάθη κατά την τελική επιλογή των σχολών.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {steps.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.step} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                      className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#002B5B] mb-2">{item.step}. {item.title}</h3>
                          <p className="text-[14px] text-gray-500 leading-relaxed mb-4">{item.description}</p>
                          <ul className="space-y-2">
                            {item.tips.map((tip) => (
                              <li key={tip} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                                <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${item.color}`} />
                                {tip}
                              </li>
                            ))}
                          </ul>
                          {item.link && (
                            <Link href={item.link} className={`inline-flex items-center gap-1.5 mt-5 text-[13px] font-bold ${item.color} hover:underline`}>
                              Υπολογιστής Μορίων <ArrowRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* FAQ Section */}
              <div className="mt-16">
                <h3 className="text-xl font-bold text-[#002B5B] mb-6">Συχνές Ερωτήσεις (FAQ)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-[#f8fafe] rounded-xl p-6 border border-gray-100">
                      <div className="flex gap-3 mb-2">
                        <HelpCircle size={18} className="text-[#213576] shrink-0 mt-0.5" />
                        <h4 className="text-[14px] font-bold text-[#002B5B]">{faq.question}</h4>
                      </div>
                      <p className="text-[13px] text-gray-600 ml-[30px] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SYSTEM */}
          {activeTab === "system" && (
            <motion.div key="system" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              <div className="mb-10">
                <h2 className="text-2xl font-extrabold text-[#002B5B] mb-3">Σύστημα Εισαγωγής & Πανελλαδικές</h2>
                <p className="text-gray-500 text-[15px]">Τα 4 Επιστημονικά Πεδία και ο τρόπος υπολογισμού των μορίων.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[
                  {
                    title: "1ο Πεδίο: Ανθρωπιστικών Σπουδών",
                    desc: "Νομικές, Φιλολογικές, Ψυχολογικές και Κοινωνικές Επιστήμες.",
                    subjects: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Αρχαία Ελληνικά", "Ιστορία", "Λατινικά"],
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    borderColor: "border-purple-100"
                  },
                  {
                    title: "2ο Πεδίο: Θετικών Σπουδών",
                    desc: "Πολυτεχνεία, Φυσικομαθηματικές και Τεχνολογικές Επιστήμες.",
                    subjects: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Μαθηματικά", "Φυσική", "Χημεία"],
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    borderColor: "border-blue-100"
                  },
                  {
                    title: "3ο Πεδίο: Σπουδών Υγείας",
                    desc: "Ιατρική, Οδοντιατρική, Φαρμακευτική, Βιολογία & Νοσηλευτική.",
                    subjects: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Βιολογία"],
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    borderColor: "border-emerald-100"
                  },
                  {
                    title: "4ο Πεδίο: Οικονομίας & Πληροφορικής",
                    desc: "Οικονομικές Επιστήμες, Πληροφορική και Διοίκηση Επιχειρήσεων.",
                    subjects: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Μαθηματικά", "Πληροφορική", "Οικονομία (ΑΟΘ)"],
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    borderColor: "border-amber-100"
                  }
                ].map((field, i) => (
                  <div key={i} className={`rounded-2xl border ${field.borderColor} bg-white p-6 shadow-sm`}>
                    <h3 className={`text-[16px] font-bold ${field.color} mb-2`}>{field.title}</h3>
                    <p className="text-[13px] text-gray-500 mb-4">{field.desc}</p>
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Πανελλαδικως Εξεταζομενα:</p>
                      {field.subjects.map(sub => (
                        <div key={sub} className="flex items-center gap-2 text-[13px] text-gray-700 font-medium">
                          <div className={`w-1.5 h-1.5 rounded-full ${field.color.replace('text', 'bg')}`} />
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ΕΒΕ & Συντελεστές */}
              <div className="bg-[#f8fafe] rounded-2xl border border-blue-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Scale className="text-[#213576]" size={24} />
                  <h3 className="text-[18px] font-bold text-[#002B5B]">Υπολογισμός Μορίων & Ε.Β.Ε.</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#213576] mb-2">Ελάχιστη Βάση Εισαγωγής (Ε.Β.Ε.)</h4>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                      Για να είναι υποψήφιος ένας μαθητής σε ένα τμήμα, θα πρέπει ο μέσος όρος της βαθμολογίας του στα 4 πανελλαδικώς εξεταζόμενα μαθήματα να είναι ίσος ή μεγαλύτερος από την Ε.Β.Ε. του συγκεκριμένου τμήματος.
                    </p>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      Η Ε.Β.Ε. προκύπτει πολλαπλασιάζοντας το Μέσο Όρο των βαθμολογιών όλων των υποψηφίων του Πεδίου, με έναν Συντελεστή (από 0,8 έως 1,2) που έχει ορίσει το κάθε τμήμα.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#213576] mb-2">Συντελεστές Βαρύτητας Μαθημάτων</h4>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                      Ο υπολογισμός του συνολικού αριθμού μορίων γίνεται σύμφωνα με τους συντελεστές βαρύτητας που έχει ορίσει το κάθε τμήμα ΑΕΙ για κάθε ένα από τα 4 μαθήματα. Το άθροισμα των συντελεστών είναι πάντα 100%.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-[12px] font-mono text-gray-700 text-center">
                      Μόρια = (Β₁×σ₁ + Β₂×σ₂ + Β₃×σ₃ + Β₄×σ₄) × 1000
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MILITARY */}
          {activeTab === "military" && (
            <motion.div key="military" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              <div className="mb-10">
                <h2 className="text-2xl font-extrabold text-[#002B5B] mb-3">Στρατιωτικές & Αστυνομικές Σχολές</h2>
                <p className="text-gray-500 text-[15px]">Όρια επιδόσεων, Αθλητικές Δοκιμασίες και Δείκτης Μάζας Σώματος (ΔΜΣ).</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* ΔΜΣ & Αναστήματα */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Activity className="text-rose-500" size={22} />
                    <h3 className="text-[16px] font-bold text-[#002B5B]">Προϋποθέσεις & Δ.Μ.Σ.</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-2">Δεικτης Μαζας Σωματος (ΔΜΣ)</h4>
                      <ul className="space-y-2 text-[13px] text-gray-600">
                        <li className="flex justify-between border-b border-gray-50 pb-1"><span>Άνδρες:</span> <span className="font-bold text-[#213576]">19 - 27</span></li>
                        <li className="flex justify-between pb-1"><span>Γυναίκες:</span> <span className="font-bold text-[#213576]">18 - 25</span></li>
                      </ul>
                      <p className="text-[11px] text-gray-400 mt-2">ΔΜΣ = Βάρος (kg) / Ύψος² (m)</p>
                    </div>

                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-2">Ελαχιστο Αναστημα (Αστυνομια)</h4>
                      <ul className="space-y-2 text-[13px] text-gray-600">
                        <li className="flex justify-between border-b border-gray-50 pb-1"><span>Άνδρες:</span> <span className="font-bold text-[#213576]">1.70 m</span></li>
                        <li className="flex justify-between pb-1"><span>Γυναίκες:</span> <span className="font-bold text-[#213576]">1.63 m</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Αθλήματα */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Dumbbell className="text-[#213576]" size={22} />
                    <h3 className="text-[16px] font-bold text-[#002B5B]">Όρια Αθλητικών Δοκιμασιών</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="py-3 px-2 font-bold text-gray-500">Αγώνισμα</th>
                          <th className="py-3 px-2 font-bold text-[#213576]">ΣΣΕ (Όπλα), ΣΝΔ, ΣΙ (Ιπτ)</th>
                          <th className="py-3 px-2 font-bold text-[#213576]">ΣΣΕ (Σώματα), ΣΣΑΣ, Αστυνομία</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        <tr className="border-b border-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-800">Δρόμος 100m</td>
                          <td className="py-3 px-2 font-bold">16&quot;</td>
                          <td className="py-3 px-2 font-bold">17&quot;</td>
                        </tr>
                        <tr className="border-b border-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-800">Δρόμος 1.000m</td>
                          <td className="py-3 px-2 font-bold">4&apos; και 20&quot;</td>
                          <td className="py-3 px-2 font-bold">4&apos; και 30&quot;</td>
                        </tr>
                        <tr className="border-b border-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-800">Άλμα εις ύψος</td>
                          <td className="py-3 px-2 font-bold">1,05m</td>
                          <td className="py-3 px-2 font-bold">1,00m</td>
                        </tr>
                        <tr className="border-b border-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-800">Άλμα εις μήκος</td>
                          <td className="py-3 px-2 font-bold">3,60m</td>
                          <td className="py-3 px-2 font-bold">3,60m</td>
                        </tr>
                        <tr className="border-b border-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-800">Ρίψη Σφαίρας (7,275 kg)</td>
                          <td className="py-3 px-2 font-bold">4,50m (Μ.Ο.)</td>
                          <td className="py-3 px-2 font-bold">4,40m (Μ.Ο.)</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2 font-medium text-gray-800">Ελεύθερη Κολύμβηση 50m</td>
                          <td className="py-3 px-2 font-bold">2&apos; <span className="text-[11px] font-normal text-gray-400">(Μόνο ΣΝΔ/ΣΙ)</span></td>
                          <td className="py-3 px-2 text-gray-400">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-[12px] text-blue-800 flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <p>Στη ρίψη σφαίρας, ως τελική επίδοση υπολογίζεται ο μέσος όρος της καλύτερης ρίψης με το αριστερό και με το δεξί χέρι. Για τους δρόμους δικαιούστε 1 προσπάθεια, ενώ για τα άλματα και τις ρίψεις 3 προσπάθειες.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════ CTA ══════ */}
      <section className="pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#213576] to-[#1a2d66] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Χρειάζεστε καθοδήγηση;</h2>
            <p className="text-blue-100/60 text-[14px]">Είμαστε δίπλα σας για τη σωστή συμπλήρωση του μηχανογραφικού.</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="px-7 py-3.5 bg-white text-[#213576] text-[15px] font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Επικοινωνία
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
