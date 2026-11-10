import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, GraduationCap } from "lucide-react";
import { chapters, getLessonNav } from "@/data/oikonomia";

type Params = { chapter: string; lesson: string };

export function generateStaticParams(): Params[] {
  return chapters.flatMap((c) =>
    c.lessons.map((l) => ({ chapter: c.slug, lesson: l.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { chapter, lesson } = await params;
  const nav = getLessonNav(chapter, lesson);
  if (!nav) return {};
  const title = `${nav.lesson.title} — Οικονομία (ΑΟΘ) | 1na.gr`;
  return {
    title,
    description: `Διαδραστικό μάθημα Οικονομίας (ΑΟΘ) — Κεφάλαιο ${nav.chapter.number}: ${nav.lesson.title}. Φροντιστηριακός Όμιλος ΕΝΑ.`,
    alternates: { canonical: `https://1na.gr/oikonomia/${chapter}/${lesson}` },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { chapter, lesson } = await params;
  const nav = getLessonNav(chapter, lesson);
  if (!nav) notFound();

  const src = `/oikonomia/${nav.chapter.slug}/${nav.lesson.slug}.html`;
  const navBtn =
    "inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col pt-[86px]">
      {/* 86px = ύψος του σταθερού μενού του site */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-10 sticky top-[86px] backdrop-blur-md">
        <Link href="/oikonomia" className={navBtn}>
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Όλα τα μαθήματα</span>
          <span className="sm:hidden">Μαθήματα</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 min-w-0">
          <GraduationCap size={15} className="text-blue-400 shrink-0" />
          <span className="truncate">
            Κεφ. {nav.chapter.number} · {nav.index + 1}/{nav.chapter.lessons.length} · {nav.lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {nav.prev && (
            <Link
              href={`/oikonomia/${nav.chapter.slug}/${nav.prev.slug}`}
              className={navBtn}
              aria-label={`Προηγούμενο: ${nav.prev.title}`}
            >
              <ArrowLeft size={16} />
              <span className="hidden lg:inline">Προηγούμενο</span>
            </Link>
          )}
          {nav.next && (
            <Link
              href={`/oikonomia/${nav.chapter.slug}/${nav.next.slug}`}
              className={navBtn}
              aria-label={`Επόμενο: ${nav.next.title}`}
            >
              <span className="hidden lg:inline">Επόμενο</span>
              <ArrowRight size={16} />
            </Link>
          )}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10"
          >
            <span>Πλήρης οθόνη</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        <iframe
          src={src}
          title={nav.lesson.title}
          className="w-full h-full min-h-[calc(100vh-145px)] border-0"
        />
      </main>
    </div>
  );
}
