import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sigma } from "lucide-react";

export const metadata: Metadata = {
  title: "Μαθηματικά Γ΄ Λυκείου — Διαδραστικό Quiz | 1na.gr",
  description:
    "Διαδραστικό quiz επανάληψης για τα Μαθηματικά Προσανατολισμού Γ΄ Λυκείου: Όριο - Συνέχεια, Διαφορικός και Ολοκληρωτικός Λογισμός. Ερωτήσεις Θεωρίας, Σωστό/Λάθος, Πολλαπλής Επιλογής και Αντιστοίχισης. Φροντιστηριακός Όμιλος ΕΝΑ.",
  keywords: [
    "μαθηματικά γ λυκείου quiz",
    "μαθηματικά προσανατολισμού",
    "όριο συνέχεια",
    "διαφορικός λογισμός",
    "ολοκληρωτικός λογισμός",
    "πανελλαδικές μαθηματικά",
    "φροντιστήριο ένα",
  ],
  alternates: { canonical: "https://1na.gr/mathimatika" },
  openGraph: {
    title: "Μαθηματικά Γ΄ Λυκείου — Διαδραστικό Quiz — Φροντιστήριο ΕΝΑ",
    description:
      "Διαδραστικό quiz επανάληψης για τα Μαθηματικά Προσανατολισμού Γ΄ Λυκείου.",
    url: "https://1na.gr/mathimatika",
  },
};

const SRC = "/mathimatika/quiz-g-lykeiou.html";

export default function MathimatikaQuizPage() {
  const navBtn =
    "inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col pt-[86px]">
      {/* 86px = ύψος του σταθερού μενού του site */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-10 sticky top-[86px] backdrop-blur-md">
        <Link href="/mock-exams" className={navBtn}>
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Προτεινόμενα Διαγωνίσματα</span>
          <span className="sm:hidden">Πίσω</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 min-w-0">
          <Sigma size={15} className="text-blue-400 shrink-0" />
          <span className="truncate">
            Μαθηματικά Προσανατολισμού Γ΄ Λυκείου · Διαδραστικό Quiz
          </span>
        </div>

        <a
          href={SRC}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10"
        >
          <span>Πλήρης οθόνη</span>
          <ExternalLink size={13} />
        </a>
      </header>

      <main className="flex-1 w-full relative">
        <iframe
          src={SRC}
          title="Μαθηματικά Γ΄ Λυκείου — Διαδραστικό Quiz"
          className="w-full h-full min-h-[calc(100vh-145px)] border-0"
        />
      </main>
    </div>
  );
}
