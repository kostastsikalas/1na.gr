"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Atom,
  PenTool,
  Languages,
  Monitor,
  Calculator,
  Brain,
  Lightbulb,
  Users,
  HeartHandshake,
  ShieldCheck,
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
type TeamMember = {
  name: string;
  role: string;
  subject: string;
  icon: React.ElementType;
  color: string;
  bg: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Γιάννης Παπαδόπουλος",
    role: "Διευθυντής Σπουδών",
    subject: "Μαθηματικά",
    icon: Calculator,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Μαρία Κωνσταντίνου",
    role: "Καθηγήτρια",
    subject: "Φυσική",
    icon: Atom,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    name: "Νίκος Αλεξίου",
    role: "Καθηγητής",
    subject: "Χημεία",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "Ελένη Δημητρίου",
    role: "Καθηγήτρια",
    subject: "Φιλολογικά",
    icon: PenTool,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    name: "Δημήτρης Αντωνίου",
    role: "Καθηγητής",
    subject: "Αγγλικά",
    icon: Languages,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    name: "Σοφία Μιχαλάκη",
    role: "Καθηγήτρια",
    subject: "Πληροφορική",
    icon: Monitor,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    name: "Κώστας Βλαχάκης",
    role: "Καθηγητής",
    subject: "Βιολογία",
    icon: Brain,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    name: "Αναστασία Γεωργίου",
    role: "Καθηγήτρια",
    subject: "Ιστορία",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
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

      {/* ══════ Team Grid ══════ */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamMembers.map((member, i) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#213576]/15 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Top colored bar */}
                <div className={`h-1.5 w-full ${member.bg}`}>
                  <div
                    className={`h-full w-0 group-hover:w-full transition-all duration-500 ${member.color.replace("text-", "bg-")}`}
                  />
                </div>

                <div className="p-6">
                  {/* Avatar with Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${member.bg} flex items-center justify-center ${member.color} mb-5 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="text-[15px] font-bold text-[#002B5B] mb-1 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-[13px] text-gray-400 mb-3">{member.role}</p>

                  {/* Subject tag */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium ${member.bg} ${member.color}`}
                  >
                    <GraduationCap size={12} />
                    {member.subject}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
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
