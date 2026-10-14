import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Το Οικονομικό Κύκλωμα — Διαδραστικό Μάθημα Οικονομίας (ΑΟΘ) | 1na.gr",
  description:
    "Διαδραστική παρουσίαση και ερωτήσεις αυτοαξιολόγησης για το Οικονομικό Κύκλωμα (ΑΟΘ - Γ΄ Λυκείου). Επιμέλεια: Ερωτοκριτάκης Κώστας — Οικονομολόγος, Φροντιστηριακός Όμιλος ΕΝΑ.",
  keywords: [
    "οικονομικό κύκλωμα",
    "αοθ γ λυκείου",
    "διαγώνισμα οικονομίας",
    "συντελεστές παραγωγής",
    "φροντιστήριο ένα",
  ],
  alternates: {
    canonical: "https://1na.gr/mock-exams/oikonomiko-kykloma",
  },
};

export default function OikonomikoKyklomaPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md">
        <Link
          href="/mock-exams"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60"
        >
          <ArrowLeft size={16} />
          <span>Επιστροφή στα Διαγωνίσματα</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
          <GraduationCap size={15} className="text-blue-400" />
          <span>Οικονομία Γ΄ Λυκείου (ΑΟΘ)</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Sparkles size={12} /> Διαδραστική Εξάσκηση
          </span>
        </div>

        <a
          href="/oikonomiko-kykloma.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10"
        >
          <span>Πλήρης οθόνη</span>
          <ExternalLink size={13} />
        </a>
      </header>

      {/* Embedded Interactive Lesson */}
      <main className="flex-1 w-full relative">
        <iframe
          src="/oikonomiko-kykloma.html"
          title="Χτίζοντας το Οικονομικό Κύκλωμα — Διαδραστικό Μάθημα"
          className="w-full h-full min-h-[calc(100vh-57px)] border-0"
        />
      </main>
    </div>
  );
}
