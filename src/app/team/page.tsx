"use client";

import { motion } from "framer-motion";
import {
  Users,
  Award,
  BookOpen,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
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
const qualities = [
  "την ειδίκευση ανά τομέα και επιστημονικό αντικείμενο",
  "τη συμμετοχή στη συγγραφή, έκδοση και επικαιροποίηση επιμελημένων πρωτότυπων φροντιστηριακών εγχειριδίων",
  "τη διδακτική ικανότητα, τη μεθοδικότητα και τις επικοινωνιακές δεξιότητες",
  "την ικανότητα προσέγγισης του μαθητή, την έγκαιρη επισήμανση και διόρθωση των αδυναμιών του, την επιστημονική αλλά και ψυχολογική στήριξη στον απαιτητικό δρόμο για την επίτευξη των στόχων του",
];

const values = [
  {
    icon: Users,
    title: "Ομαδικότητα",
    desc: "Δουλεύουμε ως μία ομάδα με κοινό στόχο — την επιτυχία κάθε μαθητή.",
  },
  {
    icon: HeartHandshake,
    title: "Αφοσίωση",
    desc: "Κάθε καθηγητής επενδύει χρόνο και ενέργεια πέρα από τη διδασκαλία.",
  },
  {
    icon: ShieldCheck,
    title: "Εμπιστοσύνη",
    desc: "Χτίζουμε σχέσεις αμοιβαίας εμπιστοσύνης με μαθητές και γονείς.",
  },
];

/* ─── Page Component ─── */
export default function TeamPage() {
  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <Users size={15} />
              Ανθρώπινο Δυναμικό
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Η Ομάδα μας
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Πίσω από κάθε επιτυχία υπάρχει ένας εξαιρετικός δάσκαλος.
            Γνωρίστε τους ανθρώπους που κάνουν τη διαφορά.
          </motion.p>
        </div>
      </section>

      {/* ══════ Team Description ══════ */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#f8f9fa] to-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm"
        >
          {/* Intro */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#213576]/8 flex items-center justify-center text-[#213576] shrink-0 mt-1">
              <Award size={24} />
            </div>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Οι εκπαιδευτικοί του φροντιστηριακού ομίλου ΕΝΑ, μόνιμοι και αποκλειστικοί
              συνεργάτες του εκπαιδευτηρίου, έχουν επιλεγεί από τη διεύθυνση βάσει απαιτητικών
              κριτηρίων που περιλαμβάνουν όχι μόνο την επάρκεια τυπικών προσόντων που
              ορίζεται από την κείμενη νομοθεσία αλλά ταυτόχρονα τη μακρόχρονη εμπειρία τους
              και διακρίνονται για:
            </p>
          </div>

          {/* Qualities list */}
          <div className="space-y-3 mb-10 ml-4 md:ml-16">
            {qualities.map((q, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={18} className="text-[#213576] shrink-0 mt-0.5" />
                <span className="text-[14px] text-gray-600 leading-relaxed">{q}</span>
              </motion.div>
            ))}
          </div>

          {/* Continuing education paragraph */}
          <div className="space-y-5 ml-0 md:ml-16">
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Ταυτόχρονα το εκπαιδευτικό προσωπικό συμμετέχει ανά τακτά χρονικά διαστήματα
              σε προγράμματα επιμόρφωσης και εξειδικευμένων διδακτικών πρακτικών, σε μια
              προσπάθεια δυναμικής και άμεσης προσαρμογής στο απαιτητικό και διαρκώς
              μεταβαλλόμενο εκπαιδευτικό τοπίο. Τα προγράμματα αυτά συντελούνται τόσο από
              τον ίδιο τον εκπαιδευτικό οργανισμό όσο και από πιστοποιημένους εκπαιδευτικούς
              φορείς και ινστιτούτα κατάρτισης.
            </p>

            <p className="text-[15px] text-gray-600 leading-relaxed">
              Στόχος του φροντιστηριακού οργανισμού είναι η παροχή ποιοτικών εκπαιδευτικών
              υπηρεσιών μέσα από την επένδυση στη συνεχή εξέλιξη και αναβάθμιση των
              ικανοτήτων του διδακτικού δυναμικού, με αίσθημα ευθύνης απέναντι στο μαθητή,
              τους γονείς αλλά και την Παιδεία.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ══════ Our Values ══════ */}
      <section className="py-16 md:py-24 bg-[#f8fafe]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002B5B] mb-4">
              Οι Αξίες μας
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Αυτό που μας ενώνει — πέρα από τα βιβλία.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-7 border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#213576]/8 flex items-center justify-center text-[#213576] mx-auto mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#002B5B] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ Join CTA ══════ */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#213576] to-[#1a2d66] rounded-3xl p-10 md:p-14 text-center text-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Θέλεις να γίνεις μέρος της ομάδας;
            </h2>
            <p className="text-blue-100/70 max-w-xl mx-auto mb-8 text-[15px]">
              Ψάχνουμε πάντα ταλαντούχους εκπαιδευτικούς που μοιράζονται το πάθος μας
              για τη διδασκαλία. Στείλε μας το βιογραφικό σου.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#213576] text-[15px] font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Επικοινωνήστε μαζί μας
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
