"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Monitor,
  Users,
  BarChart3,
  ClipboardList,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

/* ─── Data ─── */
type Service = {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
  bg: string;
  link?: string;
};

const services: Service[] = [
  {
    icon: GraduationCap,
    title: "Τμήματα Λυκείου",
    description:
      "Ολοκληρωμένα προγράμματα Α΄, Β΄ & Γ΄ Λυκείου με εξειδίκευση σε κάθε κατεύθυνση.",
    features: [
      "Θετικές Σπουδές",
      "Ανθρωπιστικές Σπουδές",
      "Σπουδές Οικονομίας & Πληροφορικής",
      "Σπουδές Υγείας",
    ],
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BookOpen,
    title: "Τμήματα Γυμνασίου",
    description:
      "Στέρεο ακαδημαϊκό υπόβαθρο και σωστές βάσεις — η καλύτερη επένδυση για το Λύκειο.",
    features: [
      "Μαθηματικά & Φυσική",
      "Φιλολογικά Μαθήματα",
      "Ξένες Γλώσσες",
      "Πληροφορική",
    ],
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: ClipboardList,
    title: "Πανελλαδικές Εξετάσεις",
    description:
      "Στοχευμένη προετοιμασία για Πανελλαδικές — εντατικά προγράμματα, mock exams, coaching.",
    features: [
      "Εντατικά τμήματα Γ΄ Λυκείου",
      "Διαγωνίσματα ανά 2 εβδομάδες",
      "Προσομοιωτικές εξετάσεις",
      "Ανάλυση αποτελεσμάτων",
    ],
    color: "text-violet-600",
    bg: "bg-violet-50",
    link: "/archive",
  },
  {
    icon: Monitor,
    title: "E-Learning",
    description:
      "Online πλατφόρμα για μάθηση από παντού — video μαθήματα, ασκήσεις, live sessions.",
    features: [
      "Video μαθήματα on-demand",
      "Live online sessions",
      "Ψηφιακές ασκήσεις & tests",
      "Πρόσβαση 24/7",
    ],
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: BarChart3,
    title: "Μηχανογραφικό & Σταδιοδρομία",
    description:
      "Πλήρης καθοδήγηση για τη συμπλήρωση του μηχανογραφικού και τον επαγγελματικό προσανατολισμό.",
    features: [
      "Υπολογιστής μορίων",
      "Ανάλυση βάσεων εισαγωγής",
      "Ατομική συμβουλευτική",
      "Σεμινάρια σταδιοδρομίας",
    ],
    color: "text-amber-600",
    bg: "bg-amber-50",
    link: "/calculator",
  },
  {
    icon: Headphones,
    title: "Υποστήριξη Μαθητών",
    description:
      "Δίπλα σε κάθε μαθητή — ψυχολογική στήριξη, ενίσχυση αυτοπεποίθησης, διαχείριση άγχους.",
    features: [
      "Ενημέρωση γονέων",
      "Coaching εξετάσεων",
      "Διαχείριση στρες",
      "Motivation sessions",
    ],
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

const highlights = [
  "Μικρά τμήματα (max 12 μαθητές)",
  "Ιδιόκτητο εκπαιδευτικό υλικό",
  "Προσομοιωτικές εξετάσεις κάθε μήνα",
  "Τακτική επικοινωνία με γονείς",
  "Σύγχρονες κλιματιζόμενες αίθουσες",
  "E-learning πλατφόρμα",
];

/* ─── Page Component ─── */
export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <Briefcase size={15} />
              Παροχές
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Οι Υπηρεσίες μας
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Ολοκληρωμένες εκπαιδευτικές λύσεις για κάθε μαθητή — 
            από το Γυμνάσιο μέχρι τις Πανελλαδικές και μετά.
          </motion.p>
        </div>
      </section>

      {/* ══════ Services Grid ══════ */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-[#213576]/15 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center ${service.color} mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} />
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-[#002B5B] mb-2">
                  {service.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[13px] text-gray-600"
                    >
                      <CheckCircle2
                        size={15}
                        className={`shrink-0 mt-0.5 ${service.color}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Link */}
                {service.link && (
                  <Link
                    href={service.link}
                    className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${service.color} hover:underline mt-auto`}
                  >
                    Μάθετε περισσότερα
                    <ArrowRight size={14} />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════ Highlights Bar ══════ */}
      <section className="py-16 md:py-24 bg-[#f8fafe]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002B5B] mb-4">
              Τι περιλαμβάνει η εμπειρία ΕΝΑ
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Πέρα από τη διδασκαλία — μια ολοκληρωμένη εκπαιδευτική εμπειρία.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={h}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#213576]/[0.03] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#213576]/8 flex items-center justify-center text-[#213576] shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-[14px] font-medium text-gray-700">{h}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#213576] to-[#1a2d66] rounded-3xl p-10 md:p-14 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Έτοιμοι να ξεκινήσετε;
              </h2>
              <p className="text-blue-100/70 text-[15px] max-w-lg">
                Κλείστε ένα ραντεβού γνωριμίας ή επικοινωνήστε μαζί μας
                για πληροφορίες εγγραφής.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#213576] text-[15px] font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Επικοινωνία
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/calculator"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white border border-white/20 text-[15px] font-semibold rounded-xl hover:bg-white/15 transition-colors"
              >
                Υπολογιστής Μορίων
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
