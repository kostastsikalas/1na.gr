"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Users,
  Award,
  BookOpen,
  TrendingUp,
} from "lucide-react";

/* ─── Animation Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ─── Data ─── */
const timeline = [
  {
    year: "1999",
    title: "Η Αρχή",
    description:
      "Ίδρυση του πρώτου φροντιστηρίου ΕΝΑ στο κέντρο του Ηρακλείου, με στόχο την ποιοτική εκπαίδευση και την ανθρωποκεντρική προσέγγιση.",
  },
  {
    year: "2002",
    title: "Συνεργασία με την Ελευθεροτυπία",
    description:
      "Εβδομαδιαία συνεργασία με την εφημερίδα Ελευθεροτυπία με το ένθετο «Εξετάσεις».",
  },
  {
    year: "2003",
    title: "Πρώτες Εκδόσεις",
    description:
      "Κυκλοφορία βοηθημάτων για τα εξεταζόμενα πανελλαδικά μαθήματα σε συνεργασία με τον εκδοτικό όμιλο Μιανιατέα.",
  },
  {
    year: "2009",
    title: "Πλατφόρμα Ενημέρωσης Γονέων",
    description:
      "Δημιουργία της πρώτης πανελλαδικά ειδικής πλατφόρμας ενημέρωσης γονέων.",
  },
  {
    year: "2010",
    title: "Συνεργασία με Ράδιο Κρήτη",
    description:
      "Αποκλειστικοί συνεργάτες του Ράδιο Κρήτη σε θέματα εκπαίδευσης και Πανελλαδικών εξετάσεων.",
  },
  {
    year: "2013",
    title: "Δημιουργία Νέου Φροντιστηρίου",
    description:
      "Δημιουργία νέου φροντιστηρίου στην περιοχή Αγίου Ιωάννη Κνωσού, εξυπηρετώντας μαθητές από ευρύτερη περιοχή.",
  },
  {
    year: "2014",
    title: "Συνεργασία με Ένωση Ελλήνων Φυσικών",
    description:
      "Έκδοση των πρώτων Πανελλαδικά βιβλίων με τις λύσεις της Τράπεζας θεμάτων.",
  },
  {
    year: "2015",
    title: "ΟΕΦΕ",
    description:
      "Αποκλειστικοί συγγραφείς του πρώτου Πανελλαδικά βιβλίου ρευστομηχανικής.",
  },
  {
    year: "2019",
    title: "Klett – National Geographic",
    description:
      "Δημιουργία σειράς βιβλίων Γυμνασίου Φυσικής τα οποία βραβεύτηκαν στην διεθνή Έκθεση βιβλίων Φρανκφούρτης 2020.",
  },
  {
    year: "2023",
    title: "Klett – National Geographic",
    description:
      "Συγγραφή βιβλίου Γ΄ Λυκείου κβαντομηχανικής το οποίο βραβεύτηκε στην διεθνή Έκθεση βιβλίων Φρανκφούρτης.",
  },
  {
    year: "Σήμερα",
    title: "25+ Χρόνια Αριστείας",
    description:
      "25+ χρόνια αριστείας, 5.000+ επιτυχόντες, και μια ομάδα που συνεχίζει να εξελίσσεται δίπλα στον κάθε μαθητή.",
  },
];

/* ─── Page Component ─── */
export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ══════ Hero Section ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <GraduationCap size={15} />
              Σχετικά με εμάς
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Η Ιστορία μας
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Από το 1999, ο Φροντιστηριακός Όμιλος ΕΝΑ οδηγεί χιλιάδες μαθητές 
            στις σπουδές που ονειρεύονται. Μάθε πώς ξεκίνησε όλο αυτό.
          </motion.p>
        </div>
      </section>


      {/* ══════ Timeline ══════ */}
      <section className="py-16 md:py-24 bg-[#f8fafe]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002B5B] mb-4">
              Η Πορεία μας
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Κάθε σταθμός μια νέα αρχή — τρεις δεκαετίες αφοσίωσης στην εκπαίδευση.
            </p>
          </motion.div>

          {/* Timeline Items */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#213576]/20 via-[#213576]/10 to-transparent md:-translate-x-px" />

            <div className="space-y-10 md:space-y-0">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } md:mb-12`}
                >
                  {/* Content */}
                  <div
                    className={`ml-16 md:ml-0 md:w-[calc(50%-32px)] ${
                      i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                    }`}
                  >
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-bold text-[#002B5B] mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-[14px] text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white border-[3px] border-[#213576] flex items-center justify-center shadow-md">
                      <span className="text-[11px] font-extrabold text-[#213576]">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden md:block md:w-[calc(50%-32px)]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ Σήμερα / Why ΕΝΑ ══════ */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002B5B] mb-4">
            Γιατί ΕΝΑ;
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Αυτά που μας ξεχωρίζουν — και μας κάνουν την πρώτη σας επιλογή.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Users,
              title: "Μικρές Ομοιογενείς Ομάδες",
              desc: "Μικρές ομοιογενείς ομάδες για εξατομικευμένη προσοχή και μέγιστη αλληλεπίδραση.",
            },
            {
              icon: TrendingUp,
              title: "Αποδεδειγμένα Αποτελέσματα",
              desc: "25+ χρόνια αριστείας, 5.000+ επιτυχόντες, και μια ομάδα που συνεχίζει να εξελίσσεται δίπλα στον κάθε μαθητή.",
            },
            {
              icon: BookOpen,
              title: "Εκπαιδευτικό Υλικό",
              desc: "Βοηθήματα για όλες τις τάξεις Γυμνασίου και Λυκείου για όλες τις κατευθύνσεις.",
            },
            {
              icon: Award,
              title: "Έμπειροι Καθηγητές",
              desc: "Μόνιμο διδακτικό προσωπικό με πάνω από 10 χρόνια εμπειρία και εξειδίκευση στον τομέα του.",
            },
            {
              icon: Target,
              title: "Εξατομικευμένη Φροντίδα",
              desc: "Παρακολούθηση προόδου, σύμβουλοι σταδιοδρομίας, και τακτική ενημέρωση γονέων.",
            },
            {
              icon: GraduationCap,
              title: "Σύγχρονες Εγκαταστάσεις",
              desc: "Κλιματιζόμενες αίθουσες, εξοπλισμένα εργαστήρια, και σύγχρονα μέσα διδασκαλίας.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#213576]/15 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#213576]/8 flex items-center justify-center text-[#213576] mb-4 group-hover:bg-[#213576] group-hover:text-white transition-colors duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="text-[16px] font-bold text-[#002B5B] mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
