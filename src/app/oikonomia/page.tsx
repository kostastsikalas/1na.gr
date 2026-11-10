import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileDown, Sparkles, ChevronRight, TrendingUp } from "lucide-react";
import { chapters, formulaSheets } from "@/data/oikonomia";

export const metadata: Metadata = {
  title: "Οικονομία (ΑΟΘ) — Διαδραστικό Υλικό | 1na.gr",
  description:
    "Διαδραστικά μαθήματα και ερωτήσεις αυτοαξιολόγησης για την Οικονομία (ΑΟΘ) της Γ΄ Λυκείου: Κεφάλαια 1–3 και τυπολόγια. Επιμέλεια: Ερωτοκριτάκης Κώστας — Οικονομολόγος, Φροντιστηριακός Όμιλος ΕΝΑ.",
  keywords: [
    "οικονομία αοθ γ λυκείου",
    "αρχές οικονομικής θεωρίας",
    "ελαστικότητα ζήτησης",
    "νόμος φθίνουσας απόδοσης",
    "τυπολόγιο οικονομίας",
    "φροντιστήριο ένα",
  ],
  alternates: { canonical: "https://1na.gr/oikonomia" },
  openGraph: {
    title: "Οικονομία (ΑΟΘ) — Διαδραστικό Υλικό — Φροντιστήριο ΕΝΑ",
    description:
      "Διαδραστικά μαθήματα και τυπολόγια για την Οικονομία Γ΄ Λυκείου (ΑΟΘ).",
    url: "https://1na.gr/oikonomia",
  },
};

export default function OikonomiaPage() {
  const totalLessons = chapters.reduce((n, c) => n + c.lessons.length, 0);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
            <TrendingUp size={15} />
            Σπουδών Οικονομίας & Πληροφορικής
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight">
            Οικονομία (ΑΟΘ)
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {totalLessons} διαδραστικά μαθήματα με κάρτες θεωρίας και ερωτήσεις
            αυτοαξιολόγησης, μαζί με τα τυπολόγια. Επιμέλεια: Ερωτοκριτάκης
            Κώστας — Οικονομολόγος.
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {chapters.map((chapter) => (
          <div
            key={chapter.slug}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-emerald-600">
                  Κεφάλαιο {chapter.number}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#002B5B]">
                  {chapter.title}
                </h2>
                <p className="text-[14px] text-gray-500 mt-1">{chapter.description}</p>
              </div>
            </div>

            <ol className="grid sm:grid-cols-2 gap-2">
              {chapter.lessons.map((lesson, i) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/oikonomia/${chapter.slug}/${lesson.slug}`}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-[#213576] transition-colors"
                  >
                    <span className="w-7 h-7 shrink-0 rounded-lg bg-white text-[#213576] text-[12px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[14px] font-medium text-gray-700 group-hover:text-white">
                      {lesson.title}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-white shrink-0"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {/* Formula sheets */}
        <div className="bg-gradient-to-r from-[#213576] to-[#002B5B] rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <FileDown size={20} /> Τυπολόγια
          </h2>
          <p className="text-[14px] text-white/70 mb-5">
            Όλοι οι τύποι σε ένα PDF για γρήγορη επανάληψη.
          </p>
          <div className="flex flex-wrap gap-3">
            {formulaSheets.map((sheet) => (
              <a
                key={sheet.href}
                href={sheet.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[14px] font-semibold transition-colors"
              >
                <FileDown size={16} />
                {sheet.title}
              </a>
            ))}
          </div>
        </div>

        {/* Link to existing interactive exam */}
        <Link
          href="/mock-exams/oikonomiko-kykloma"
          className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors text-[14px] font-semibold"
        >
          <Sparkles size={18} className="text-amber-500" />
          Δοκίμασε και το διαδραστικό διαγώνισμα «Το Οικονομικό Κύκλωμα»
          <ChevronRight size={16} className="ml-auto" />
        </Link>
      </section>
    </div>
  );
}
