/**
 * Κατάλογος διαδραστικού υλικού Οικονομίας (ΑΟΘ).
 * Τα αρχεία HTML ζουν στο public/oikonomia/<chapter>/<file>.html
 * και ενσωματώνονται σε iframe από τη σελίδα /oikonomia/[chapter]/[lesson].
 */

export type Lesson = {
  slug: string;
  title: string;
};

export type Chapter = {
  slug: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
};

export const chapters: Chapter[] = [
  {
    slug: "k1",
    number: 1,
    title: "Βασικά Προβλήματα της Οικονομίας",
    description:
      "Ανάγκες, αγαθά, οικονομικές μονάδες, κόστος ευκαιρίας, καμπύλη παραγωγικών δυνατοτήτων και οικονομικό κύκλωμα.",
    lessons: [
      { slug: "01-vasika-provlimata", title: "Αντικείμενο της Πολιτικής Οικονομίας" },
      { slug: "02-anagkes", title: "Οι Οικονομικές Ανάγκες" },
      { slug: "03-katigories-agathon", title: "Κατηγορίες Αγαθών" },
      { slug: "04-agora", title: "Η Αγορά" },
      { slug: "05-noikokyrio", title: "Το Νοικοκυριό" },
      { slug: "06-epixeiriseis", title: "Οι Επιχειρήσεις" },
      { slug: "07-ergatika-somateia-kratos", title: "Εργατικά Σωματεία & Κράτος" },
      { slug: "08-syntelestes-paragogis", title: "Οι Συντελεστές της Παραγωγής" },
      { slug: "09-kyrio-oikonomiko-provlima", title: "Το Κύριο Οικονομικό Πρόβλημα" },
      { slug: "10-kpd-kostos-efkairias", title: "ΚΠΔ & Κόστος Ευκαιρίας" },
      { slug: "11-katamerismos-ergon-xrima", title: "Καταμερισμός των Έργων & Χρήμα" },
      { slug: "12-oikonomiko-kykloma", title: "Το Οικονομικό Κύκλωμα" },
      { slug: "13-avevaiotita-plirofories", title: "Αβεβαιότητα & Πληροφορίες" },
    ],
  },
  {
    slug: "k2",
    number: 2,
    title: "Ζήτηση & Ελαστικότητα",
    description:
      "Συμπεριφορά του καταναλωτή, νόμος και συνάρτηση ζήτησης, προσδιοριστικοί παράγοντες και ελαστικότητες.",
    lessons: [
      { slug: "01-symperifora-katanaloti", title: "Η Συμπεριφορά του Καταναλωτή" },
      { slug: "02-nomos-zitisis", title: "Νόμος Ζήτησης & Καμπύλη Ζήτησης" },
      { slug: "03-agoraia-kampyli-zitisis", title: "Η Αγοραία Καμπύλη Ζήτησης" },
      { slug: "04-synartisi-zitisis", title: "Η Συνάρτηση Ζήτησης" },
      { slug: "05-prosdioristikoi-paragontes", title: "Προσδιοριστικοί Παράγοντες Ζήτησης" },
      { slug: "06-elastikotita-zitisis", title: "Ελαστικότητα Ζήτησης ως προς την Τιμή" },
      { slug: "07-eidi-elastikotitas", title: "Είδη Ελαστικότητας & Ειδικές Περιπτώσεις" },
      { slug: "08-synoliki-dapani", title: "Συνολική Δαπάνη & Ελαστικότητα" },
      { slug: "09-eisodimatiki-elastikotita", title: "Εισοδηματική Ελαστικότητα Ζήτησης" },
    ],
  },
  {
    slug: "k3",
    number: 3,
    title: "Παραγωγή & Κόστος",
    description:
      "Συνάρτηση παραγωγής, νόμος φθίνουσας απόδοσης, καμπύλες προϊόντος και κόστος στη βραχυχρόνια περίοδο.",
    lessons: [
      { slug: "01-paragogiki-diadikasia", title: "Παραγωγική Διαδικασία & Χρονικός Ορίζοντας" },
      { slug: "02-synartisi-paragogis", title: "Η Συνάρτηση Παραγωγής" },
      { slug: "03-synoliko-meso-oriako-proion", title: "Συνολικό, Μέσο & Οριακό Προϊόν" },
      { slug: "04-nomos-fthinousas-apodosis", title: "Ο Νόμος της Φθίνουσας Απόδοσης" },
      { slug: "05-epidrasi-nomou-fthinousas", title: "Επίδραση του Νόμου Φθίνουσας Απόδοσης" },
      { slug: "06-symperifora-kampylon", title: "Συμπεριφορά Καμπυλών ΤΡ, ΑΡ, ΜΡ" },
      { slug: "07-epidrasi-technologias", title: "Επίδραση Τεχνολογίας στη Συνάρτηση Παραγωγής" },
      { slug: "08-kostos-paragogis", title: "Το Κόστος Παραγωγής" },
      { slug: "09-meso-oriako-kostos", title: "Μέσο & Οριακό Κόστος" },
    ],
  },
];

export const formulaSheets = [
  { title: "Τυπολόγιο Μικροοικονομίας", href: "/oikonomia/typologio-mikrooikonomias.pdf" },
  { title: "Τυπολόγιο Μακροοικονομίας", href: "/oikonomia/typologio-makrooikonomias.pdf" },
];

export function getChapter(slug: string) {
  return chapters.find((c) => c.slug === slug);
}

export function getLessonNav(chapterSlug: string, lessonSlug: string) {
  const chapter = getChapter(chapterSlug);
  if (!chapter) return null;
  const index = chapter.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;
  return {
    chapter,
    lesson: chapter.lessons[index],
    index,
    prev: chapter.lessons[index - 1] ?? null,
    next: chapter.lessons[index + 1] ?? null,
  };
}
