"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  ClipboardCheck,
  FileEdit,
  CalendarCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

/* ─── Data ─── */
const steps = [
  {
    step: 1,
    icon: BookOpen,
    title: "Γνωρίστε τα Πεδία",
    description:
      "Κατανοήστε τα 4 Επιστημονικά Πεδία και τις σχολές που αντιστοιχούν σε κάθε πεδίο. Αυτό θα σας βοηθήσει να κάνετε στρατηγικές επιλογές.",
    tips: [
      "Θετικών Σπουδών → Πολυτεχνεία, Μαθηματικά, Φυσική",
      "Σπουδών Υγείας → Ιατρική, Φαρμακευτική, Βιολογία",
      "Ανθρωπιστικών → Νομική, Φιλολογία, Ψυχολογία",
      "Οικονομίας & Πληροφορικής → Πληροφορική, Οικονομικά",
    ],
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    step: 2,
    icon: ClipboardCheck,
    title: "Ελέγξτε τις Βάσεις",
    description:
      "Μελετήστε τις βάσεις εισαγωγής των τελευταίων ετών. Παρατηρήστε τις τάσεις — ανεβαίνουν ή πέφτουν; Αυτό θα σας βοηθήσει να θέσετε ρεαλιστικούς στόχους.",
    tips: [
      "Συγκρίνετε βάσεις 3ετίας",
      "Λάβετε υπόψη τον αριθμό εισακτέων",
      "Ελέγξτε τις βάσεις σε πρόγραμμα & τμήμα",
      "Χρησιμοποιήστε τον πίνακά μας",
    ],
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    link: "/bases",
  },
  {
    step: 3,
    icon: FileEdit,
    title: "Συμπληρώστε το Μηχανογραφικό",
    description:
      "Η σειρά των σχολών στο μηχανογραφικό είναι κρίσιμη. Βάλτε πρώτα τις σχολές που πραγματικά θέλετε, ακόμα κι αν φαίνονται δύσκολες.",
    tips: [
      "1η-5η θέση: Σχολές-όνειρο",
      "6η-15η θέση: Ρεαλιστικές επιλογές",
      "16η+: Σχολές ασφαλείας",
      "Συμπληρώνετε ΟΛΕΣ τις θέσεις",
    ],
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    step: 4,
    icon: CalendarCheck,
    title: "Προθεσμίες & Υποβολή",
    description:
      "Μην αφήνετε τίποτα για την τελευταία στιγμή. Σημειώστε τις ημερομηνίες και υποβάλετε εγκαίρως.",
    tips: [
      "Ηλεκτρονική υποβολή μέσω exams.it.minedu.gov.gr",
      "Χρειάζεστε κωδικούς TaxisNet γονέα",
      "Κρατήστε αντίγραφο/εκτύπωση",
      "Ελέγξτε ξανά πριν την τελική υποβολή",
    ],
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const faqs = [
  {
    question: "Μπορώ να αλλάξω τις επιλογές μου μετά την υποβολή;",
    answer:
      "Ναι, μπορείτε να τροποποιήσετε το μηχανογραφικό σας όσες φορές θέλετε μέχρι τη λήξη της προθεσμίας. Μετρά ΜΟΝΟ η τελευταία υποβολή.",
  },
  {
    question: "Πόσες σχολές μπορώ να δηλώσω;",
    answer:
      "Μπορείτε να δηλώσετε απεριόριστο αριθμό σχολών/τμημάτων. Η σύστασή μας είναι να συμπληρώσετε όσο περισσότερες μπορείτε.",
  },
  {
    question: "Τι γίνεται αν δεν περάσω πουθενά;",
    answer:
      "Αν δεν εισαχθείτε σε καμία σχολή, μπορείτε να ξαναδώσετε πανελλαδικές την επόμενη χρονιά ή να αξιοποιήσετε το 10% των θέσεων.",
  },
  {
    question: "Τα ειδικά μαθήματα μετράνε στα μόρια;",
    answer:
      "Ναι, ορισμένες σχολές (π.χ. Αρχιτεκτονική, ΤΕΦΑΑ, Ξένες Γλώσσες) απαιτούν ειδικό μάθημα που προσμετράται στον υπολογισμό μορίων.",
  },
];

const commonMistakes = [
  "Μην αφήνετε κενές θέσεις στο μηχανογραφικό",
  "Μην βάζετε σχολές που δεν θέλετε πραγματικά πρώτες",
  "Μην αγνοείτε τις σχολές εκτός Αττικής",
  "Μην υποβάλλετε χωρίς να ελέγξετε τους συντελεστές",
];

/* ─── Page Component ─── */
export default function GuidePage() {
  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <Compass size={15} />
              Μηχανογραφικό
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight">
            Οδηγός Σπουδών
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Βήμα-βήμα οδηγός για τη συμπλήρωση του μηχανογραφικού —
            από τα πεδία μέχρι την τελική υποβολή.
          </motion.p>
        </div>
      </section>

      {/* ══════ Steps ══════ */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-[#213576]/15 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Step number + Icon */}
                  <div className="flex items-start gap-4 md:w-64 shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#213576] text-white text-[14px] font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-2`}>
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-[#002B5B]">{item.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <ul className="space-y-2">
                      {item.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                          <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${item.color}`} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                    {item.link && (
                      <Link href={item.link}
                        className={`inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold ${item.color} hover:underline`}>
                        Δείτε τις Βάσεις <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════ Common Mistakes ══════ */}
      <section className="py-16 md:py-20 bg-[#f8fafe]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002B5B] mb-3">Συνηθισμένα Λάθη</h2>
            <p className="text-gray-500 text-[15px]">Αποφύγετε τα πιο κοινά λάθη στη συμπλήρωση.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {commonMistakes.map((mistake, i) => (
              <motion.div key={mistake} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex items-start gap-3 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-amber-500" />
                </div>
                <span className="text-[14px] text-gray-700 font-medium leading-relaxed">{mistake}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#002B5B] mb-3">Συχνές Ερωτήσεις</h2>
          <p className="text-gray-500 text-[15px]">Απαντήσεις στα πιο συνηθισμένα ερωτήματα.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={faq.question} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle size={18} className="text-[#213576] shrink-0 mt-0.5" />
                <h3 className="text-[15px] font-bold text-[#002B5B]">{faq.question}</h3>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed ml-[30px]">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-[#213576] to-[#1a2d66] rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Χρειάζεστε βοήθεια;</h2>
            <p className="text-blue-100/60 text-[14px]">Οι σύμβουλοί μας σας καθοδηγούν σε κάθε βήμα.</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Link href="/calculator"
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-[#213576] text-[15px] font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Υπολογιστής Μορίων <ArrowRight size={16} />
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white border border-white/20 text-[15px] font-semibold rounded-xl hover:bg-white/15 transition-colors">
              Επικοινωνία
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
