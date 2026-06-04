"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

/* ─── Book data ─── */
type Book = { title: string; image: string };

const categories = [
  {
    label: "Α' Λυκείου",
    books: [
      { title: "Έκθεση", image: "/vivlia/a-lykeiou/ekthesi-a.jpg" },
      { title: "Άλγεβρα", image: "/vivlia/a-lykeiou/algebra-a.jpg" },
      { title: "Χημεία", image: "/vivlia/a-lykeiou/ximeia-a.jpg" },
      { title: "Αρχαία", image: "/vivlia/a-lykeiou/arxaia-a.jpg" },
      { title: "Φυσική", image: "/vivlia/a-lykeiou/fysiki-a.jpg" },
      { title: "Τράπεζα Θεμάτων Μαθηματικών", image: "/vivlia/a-lykeiou/trapeza-mathimatikon-a.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/a-lykeiou/theoria-ekthesis-a.jpg" },
    ],
  },
  {
    label: "Β' Λυκείου – Ανθρωπιστικών Σπουδών",
    books: [
      { title: "Έκθεση", image: "/vivlia/b-lykeiou-anthropistikon/ekthesi-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/b-lykeiou-anthropistikon/theoria-ekthesis-b.jpg" },
      { title: "Ιστορία", image: "/vivlia/b-lykeiou-anthropistikon/istoria-b.jpg" },
      { title: "Συντακτικό", image: "/vivlia/b-lykeiou-anthropistikon/syntaktiko-b.jpg" },
      { title: "Λατινικά (Γραμματική - Συντακτικό)", image: "/vivlia/b-lykeiou-anthropistikon/latinika-grammatiki-b.jpg" },
      { title: "Λατινικά (Κείμενα)", image: "/vivlia/b-lykeiou-anthropistikon/latinika-keimena-b.jpg" },
      { title: "Τράπεζα Θεμάτων Αρχαίων", image: "/vivlia/b-lykeiou-anthropistikon/trapeza-arxaion-b.jpg" },
    ],
  },
  {
    label: "Β' Λυκείου – Θετικής & Υγείας",
    books: [
      { title: "Έκθεση", image: "/vivlia/b-lykeiou-thetikis-ygeias/ekthesi-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/b-lykeiou-thetikis-ygeias/theoria-ekthesis-b.jpg" },
      { title: "Μαθηματικά", image: "/vivlia/b-lykeiou-thetikis-ygeias/mathimatika-b.jpg" },
      { title: "Άλγεβρα", image: "/vivlia/b-lykeiou-thetikis-ygeias/algebra-b.jpg" },
      { title: "Τράπεζα Θεμάτων Άλγεβρας", image: "/vivlia/b-lykeiou-thetikis-ygeias/trapeza-algebras-b.jpg" },
      { title: "Τράπεζα Θεμάτων Μαθηματικών", image: "/vivlia/b-lykeiou-thetikis-ygeias/trapeza-mathimatikon-b.jpg" },
      { title: "Φυσική", image: "/vivlia/b-lykeiou-thetikis-ygeias/fysiki-b.jpg" },
      { title: "Τράπεζα Θεμάτων Φυσικής", image: "/vivlia/b-lykeiou-thetikis-ygeias/trapeza-fysikis-b.jpg" },
      { title: "Βιολογία Προσανατολισμού", image: "/vivlia/b-lykeiou-thetikis-ygeias/biologia-prosanatolismou-b.jpg" },
    ],
  },
  {
    label: "Β' Λυκείου – Οικονομίας",
    books: [
      { title: "Έκθεση", image: "/vivlia/b-lykeiou-oikonomias/ekthesi-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/b-lykeiou-oikonomias/theoria-ekthesis-b.jpg" },
      { title: "Μαθηματικά", image: "/vivlia/b-lykeiou-oikonomias/mathimatika-b.jpg" },
      { title: "Άλγεβρα", image: "/vivlia/b-lykeiou-oikonomias/algebra-b.jpg" },
      { title: "Αρχές Οικονομικής Θεωρίας", image: "/vivlia/b-lykeiou-oikonomias/aoth-b.jpg" },
      { title: "Πληροφορική", image: "/vivlia/b-lykeiou-oikonomias/pliroforiki-b.jpg" },
    ],
  },
  {
    label: "Γ' Λυκείου – Ανθρωπιστικών Σπουδών",
    books: [
      { title: "Έκθεση – Α' Τόμος", image: "/vivlia/g-lykeiou-anthropistikon/ekthesi-g-a.jpg" },
      { title: "Έκθεση – Β' Τόμος", image: "/vivlia/g-lykeiou-anthropistikon/ekthesi-g-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/g-lykeiou-anthropistikon/theoria-ekthesis-g.jpg" },
      { title: "Γνωστό Κείμενο", image: "/vivlia/g-lykeiou-anthropistikon/gnosto-keimeno.jpg" },
      { title: "Συντακτικό", image: "/vivlia/g-lykeiou-anthropistikon/syntaktiko-g.jpg" },
      { title: "Ιστορία", image: "/vivlia/g-lykeiou-anthropistikon/istoria-g.jpg" },
      { title: "Λατινικά", image: "/vivlia/g-lykeiou-anthropistikon/latinika-g.jpg" },
    ],
  },
  {
    label: "Γ' Λυκείου – Θετικής",
    books: [
      { title: "Έκθεση – Α' Τόμος", image: "/vivlia/g-lykeiou-thetikis/ekthesi-g-a.jpg" },
      { title: "Έκθεση – Β' Τόμος", image: "/vivlia/g-lykeiou-thetikis/ekthesi-g-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/g-lykeiou-thetikis/theoria-ekthesis-g.jpg" },
      { title: "Μαθηματικά", image: "/vivlia/g-lykeiou-thetikis/mathimatika-g.jpg" },
      { title: "Ταλαντώσεις", image: "/vivlia/g-lykeiou-thetikis/talantoseis.jpg" },
      { title: "Κρούσεις", image: "/vivlia/g-lykeiou-thetikis/krouseis-g.jpg" },
      { title: "Μηχανική Στερεού", image: "/vivlia/g-lykeiou-thetikis/mixaniki-stereou.jpg" },
      { title: "Ηλεκτρομαγνητισμός", image: "/vivlia/g-lykeiou-thetikis/ilektromagnitismos.jpg" },
      { title: "Τελευταία Επανάληψη", image: "/vivlia/g-lykeiou-thetikis/teleftaia-epanalipsi.jpg" },
    ],
  },
  {
    label: "Γ' Λυκείου – Υγείας",
    books: [
      { title: "Έκθεση – Α' Τόμος", image: "/vivlia/g-lykeiou-ygeias/ekthesi-g-a.jpg" },
      { title: "Έκθεση – Β' Τόμος", image: "/vivlia/g-lykeiou-ygeias/ekthesi-g-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/g-lykeiou-ygeias/theoria-ekthesis-g.jpg" },
      { title: "Βιολογία Προσανατολισμού", image: "/vivlia/g-lykeiou-ygeias/biologia-prosanatolismou-g.jpg" },
      { title: "Ταλαντώσεις", image: "/vivlia/g-lykeiou-ygeias/talantoseis.jpg" },
      { title: "Κρούσεις", image: "/vivlia/g-lykeiou-ygeias/krouseis-g.jpg" },
      { title: "Μηχανική Στερεού", image: "/vivlia/g-lykeiou-ygeias/mixaniki-stereou.jpg" },
      { title: "Ηλεκτρομαγνητισμός", image: "/vivlia/g-lykeiou-ygeias/ilektromagnitismos.jpg" },
      { title: "Τελευταία Επανάληψη", image: "/vivlia/g-lykeiou-ygeias/teleftaia-epanalipsi.jpg" },
    ],
  },
  {
    label: "Γ' Λυκείου – Οικονομίας",
    books: [
      { title: "Έκθεση – Α' Τόμος", image: "/vivlia/g-lykeiou-oikonomias/ekthesi-g-a.jpg" },
      { title: "Έκθεση – Β' Τόμος", image: "/vivlia/g-lykeiou-oikonomias/ekthesi-g-b.jpg" },
      { title: "Θεωρία Έκθεσης", image: "/vivlia/g-lykeiou-oikonomias/theoria-ekthesis-g.jpg" },
      { title: "Μαθηματικά", image: "/vivlia/g-lykeiou-oikonomias/mathimatika-g.jpg" },
      { title: "Αρχές Οικονομικής Θεωρίας", image: "/vivlia/g-lykeiou-oikonomias/aoth-g.jpg" },
      { title: "Πληροφορική", image: "/vivlia/g-lykeiou-oikonomias/pliroforiki-g.jpg" },
    ],
  },
];

/* ─── Carousel component ─── */
function BookCarousel({ books, label }: { books: Book[]; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      {/* Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 bg-white/95 border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-[#213576] hover:bg-[#213576] hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-11 h-11 bg-white/95 border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-[#213576] hover:bg-[#213576] hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.map((book, i) => (
          <motion.div
            key={book.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="snap-start shrink-0 w-[180px] sm:w-[200px] group/card"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-50 group-hover/card:border-[#213576]/20 group-hover/card:-translate-y-1">
              <Image
                src={encodeURI(book.image)}
                alt={book.title}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-[#002B5B] text-center leading-tight line-clamp-2">
              {book.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function PublicationsClient() {
  return (
    <div className="bg-white">
      {/* ══════ Hero ══════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
              <BookOpen size={15} />
              Εκδόσεις
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-[1.1] mb-6 tracking-tight"
          >
            Βιβλιοθήκη Εκδόσεων
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Πλήρης σειρά εκπαιδευτικών εκδόσεων του Φροντιστηριακού Ομίλου ΕΝΑ
            για Α΄, Β΄ & Γ΄ Λυκείου.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center gap-8 mt-10"
          >
            {[
              { value: categories.reduce((s, c) => s + c.books.length, 0).toString(), label: "Εκδόσεις" },
              { value: "3", label: "Τάξεις" },
              { value: "10+", label: "Μαθήματα" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-[#213576]">{s.value}</div>
                <div className="text-[12px] text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ Carousels ══════ */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#213576] flex items-center justify-center text-white text-[14px] font-bold shrink-0">
                  {cat.label.split(" ")[0]}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#002B5B]">
                    {cat.label}
                  </h2>
                  <p className="text-[13px] text-gray-400">
                    {cat.books.length} εκδόσεις
                  </p>
                </div>
              </div>

              <BookCarousel books={cat.books} label={cat.label} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
