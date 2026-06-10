/**
 * Builds the static exam-archive catalog from the PDF files in
 * public/themata/<year>/*.pdf and writes src/data/examArchive.json.
 *
 * Re-run after adding/removing PDFs:  node scripts/build-exam-archive.mjs
 *
 * Classification is heuristic (Greek-transliterated filenames vary a lot).
 * Review the generated JSON and patch obvious mistakes by hand if needed.
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const THEMATA_DIR = join(ROOT, "public", "themata");
const OUT = join(ROOT, "src", "data", "examArchive.json");

/* ── Subject taxonomy ──────────────────────────────────────────────
 * Each ΓΕΛ subject can belong to several "ομάδες προσανατολισμού".
 * Each ΕΠΑΛ subject belongs to one τομέας (or the common subjects).   */
const GEL_DIRECTIONS = {
  "Γενικής Παιδείας": ["Νεοελληνική Γλώσσα"],
  "Ανθρωπιστικών Σπουδών": ["Αρχαία Ελληνικά", "Ιστορία", "Λατινικά", "Κοινωνιολογία"],
  "Θετικών Σπουδών": ["Μαθηματικά", "Φυσική", "Χημεία"],
  "Σπουδών Υγείας": ["Φυσική", "Χημεία", "Βιολογία"],
  "Σπουδών Οικονομίας & Πληροφορικής": ["Μαθηματικά", "Οικονομία (ΑΟΘ)", "Πληροφορική (ΑΕΠΠ)"],
};

const EPAL_DIRECTIONS = {
  "Κοινά Μαθήματα": ["Νεοελληνική Γλώσσα", "Μαθηματικά"],
  "Τομέας Υγείας - Πρόνοιας": ["Ανατομία - Φυσιολογία ΙΙ", "Υγιεινή"],
  "Τομέας Πληροφορικής": ["Προγραμματισμός Υπολογιστών", "Δίκτυα Υπολογιστών"],
  "Τομέας Διοίκησης & Οικονομίας": ["Αρχές Οικονομικής Θεωρίας (ΑΟΘ)", "Αρχές Οργάνωσης & Διοίκησης (ΑΟΔΕ)"],
  "Τομέας Μηχανολογίας": ["Στοιχεία Μηχανών", "Μηχανές Εσωτερικής Καύσης (ΜΕΚ)"],
};

// ΕΠΑΛ-only specialty subjects force type=ΕΠΑΛ even without "epal" in the name.
const EPAL_ONLY = new Set([
  "Ανατομία - Φυσιολογία ΙΙ",
  "Υγιεινή",
  "Προγραμματισμός Υπολογιστών",
  "Δίκτυα Υπολογιστών",
  "Αρχές Οικονομικής Θεωρίας (ΑΟΘ)",
  "Αρχές Οργάνωσης & Διοίκησης (ΑΟΔΕ)",
  "Στοιχεία Μηχανών",
  "Μηχανές Εσωτερικής Καύσης (ΜΕΚ)",
]);

/* ── Subject detection (order matters: specific → generic) ── */
function detectSubject(name, isEpal) {
  const n = name.toLowerCase();
  // specialty / ΕΠΑΛ first
  if (/anat|anatomia|anatfys/.test(n)) return "Ανατομία - Φυσιολογία ΙΙ";
  if (/ygiein|ygieinh|ygieini|(^|_)yg(_|\b)/.test(n)) return "Υγιεινή";
  if (/diktya/.test(n)) return "Δίκτυα Υπολογιστών";
  if (/stoix|stx|mhx/.test(n)) return "Στοιχεία Μηχανών";
  if (/(^|_)mek|mekii/.test(n)) return "Μηχανές Εσωτερικής Καύσης (ΜΕΚ)";
  if (/programmatismos|progr|(^|_)prog(_|\b)/.test(n)) return "Προγραμματισμός Υπολογιστών";
  if (/aod|arxes_org|organwsh/.test(n)) return "Αρχές Οργάνωσης & Διοίκησης (ΑΟΔΕ)";
  if (/aoth/.test(n)) return "Αρχές Οικονομικής Θεωρίας (ΑΟΘ)";
  // Πληροφορική ΓΕΛ
  if (/plhrof|pliroforikh|plirof|plhroforikh|plhrof/.test(n)) return "Πληροφορική (ΑΕΠΠ)";
  // ΓΕΛ generic
  if (/arx/.test(n)) return "Αρχαία Ελληνικά";
  if (/istoria|(^|_)ist(_|\b)/.test(n)) return "Ιστορία";
  if (/latin|(^|_)lat(_|\b)/.test(n)) return "Λατινικά";
  if (/koin/.test(n)) return "Κοινωνιολογία";
  if (/biol|(^|_)bio(_|\b)/.test(n)) return "Βιολογία";
  if (/fysik|phys|(^|_)fys(_|\b)/.test(n)) return "Φυσική";
  if (/xhmeia|ximeia/.test(n)) return "Χημεία";
  if (/oikonom|(^|_)oik(_|\b)/.test(n)) return isEpal ? "Αρχές Οικονομικής Θεωρίας (ΑΟΘ)" : "Οικονομία (ΑΟΘ)";
  if (/math/.test(n)) return "Μαθηματικά";
  if (/nea[_-]?ell|(^|[^a-z])nea([^a-z]|$)|glwssa|glossa|(^|_)glo(_|\b)|ekthesi|ekthesh|ekthesis|neol|neoellhnikh/.test(n))
    return "Νεοελληνική Γλώσσα";
  return null;
}

/* ── Θέματα vs Λύσεις detection ── */
function detectKind(name, original) {
  const n = name.toLowerCase();
  // explicit solutions markers
  if (/(^|_)ap(_|t|an|a|\b)|apant|apan|sxolio|(^|_)1na(_|\b)/.test(n)) return "Λύσεις";
  // ministry themata markers
  if (/them/.test(n)) return "Θέματα";
  if (/_op_|op_hm|op_neo|neo_op|(^|_)h0\d/.test(n)) return "Θέματα";
  // an uppercase run of >=3 letters in the ORIGINAL name => ministry official PDF
  if (/[A-ZΑ-Ω]{3,}/.test(original)) return "Θέματα";
  // otherwise it's the φροντιστήριο's own solutions
  return "Λύσεις";
}

function directionsFor(type, subject) {
  const map = type === "ΕΠΑΛ" ? EPAL_DIRECTIONS : GEL_DIRECTIONS;
  return Object.entries(map)
    .filter(([, subs]) => subs.includes(subject))
    .map(([dir]) => dir);
}

const segEnc = (s) => encodeURIComponent(s);

const entries = [];
const unmatched = [];

const years = readdirSync(THEMATA_DIR).filter((y) => /^\d{4}$/.test(y)).sort();
for (const year of years) {
  const dir = join(THEMATA_DIR, year);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    if (!file.toLowerCase().endsWith(".pdf")) continue;
    const base = file.replace(/\.pdf$/i, "");
    const isEpal = /epal/i.test(file);
    let subject = detectSubject(base, isEpal);
    if (!subject) {
      unmatched.push(`${year}/${file}`);
      continue;
    }
    const type = isEpal || EPAL_ONLY.has(subject) ? "ΕΠΑΛ" : "ΓΕΛ";
    const directions = directionsFor(type, subject);
    if (directions.length === 0) unmatched.push(`${year}/${file} (subject="${subject}" no direction for ${type})`);
    const kind = detectKind(base, file);
    entries.push({
      id: `local-${year}-${base}`.replace(/[^a-zA-Z0-9-]/g, "_"),
      source: "local",
      year,
      type,
      subject,
      directions,
      kind,
      file_url: `/themata/${segEnc(year)}/${segEnc(file)}`,
    });
  }
}

// sort: year desc, type, subject, kind (Θέματα before Λύσεις)
entries.sort(
  (a, b) =>
    Number(b.year) - Number(a.year) ||
    a.type.localeCompare(b.type, "el") ||
    a.subject.localeCompare(b.subject, "el") ||
    a.kind.localeCompare(b.kind, "el"),
);

writeFileSync(OUT, JSON.stringify(entries, null, 2) + "\n", "utf8");

console.log(`✓ Wrote ${entries.length} entries → ${OUT}`);
if (unmatched.length) {
  console.log(`\n⚠ ${unmatched.length} files not classified:`);
  for (const u of unmatched) console.log("   " + u);
}
