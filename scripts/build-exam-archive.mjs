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
  "Τομέας Μηχανολογίας": [
    "Στοιχεία Μηχανών",
    "Μηχανές Εσωτερικής Καύσης (ΜΕΚ)",
    "Στοιχεία Ψύξης - Κλιματισμού",
    "Συστήματα Θέρμανσης",
    "Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων",
  ],
  "Τομέας Ηλεκτρολογίας": ["Ηλεκτροτεχνία", "Ηλεκτρικές Μηχανές"],
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
  "Στοιχεία Ψύξης - Κλιματισμού",
  "Συστήματα Θέρμανσης",
  "Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων",
  "Ηλεκτροτεχνία",
  "Ηλεκτρικές Μηχανές",
]);

/* ── Subject detection (order matters: specific → generic) ──
 * Handles both Latin-transliterated and Greek filenames.            */
function detectSubject(name, isEpal) {
  const n = name.toLowerCase();
  // ΕΠΑΛ specialties first (some contain substrings like "mhx" that
  // would otherwise match a more generic rule)
  // anchor "anat" so it doesn't match "pros-anat-olismou" (= προσανατολισμού)
  if (/anatomia|anatfys|anat_fys|stanat|(^|_)anat(_|\b)|ανατομ/.test(n)) return "Ανατομία - Φυσιολογία ΙΙ";
  if (/ygiein|(^|_)yg(_|\b)|υγιειν/.test(n)) return "Υγιεινή";
  if (/hl.*mhx|ηλεκτρ.*μηχ/.test(n)) return "Ηλεκτρικές Μηχανές";
  if (/hltex|hlektr|ηλεκτρ/.test(n)) return "Ηλεκτροτεχνία";
  if (/stpk|st_ps|ps_klim|stoixeia_ps|ψυξ|κλιματ/.test(n)) return "Στοιχεία Ψύξης - Κλιματισμού";
  if (/systher|θερμανσ/.test(n)) return "Συστήματα Θέρμανσης";
  if (/sxedi|σχεδ/.test(n)) return "Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων";
  if (/(^|_)mek|mekii|mhxesk|μεκ/.test(n)) return "Μηχανές Εσωτερικής Καύσης (ΜΕΚ)";
  if (/stoix|stx|mhx|στοιχεια μηχ|μηχανων/.test(n)) return "Στοιχεία Μηχανών";
  if (/dikt|δικτυ/.test(n)) return "Δίκτυα Υπολογιστών";
  if (/programmatismos|progr|prog|προγραμματ/.test(n)) return "Προγραμματισμός Υπολογιστών";
  if (/aepp|αεππ|εφαρμογ/.test(n)) return "Πληροφορική (ΑΕΠΠ)";
  if (/aod|arxes_org|organwsh|αρχες οργαν|οργανωσ/.test(n)) return "Αρχές Οργάνωσης & Διοίκησης (ΑΟΔΕ)";
  if (/aoth|arxes_oik|αρχες οικονομ/.test(n)) return "Αρχές Οικονομικής Θεωρίας (ΑΟΘ)";
  // Πληροφορική ΓΕΛ
  if (/plhrof|pliroforikh|plirof|plir|πληροφορ/.test(n)) return "Πληροφορική (ΑΕΠΠ)";
  // ΓΕΛ generic
  if (/arxaia|arxaiw|αρχαι|(^|_)arx(_|\b)/.test(n)) return "Αρχαία Ελληνικά";
  if (/istoria|ιστορ|(^|_)ist(_|\b)/.test(n)) return "Ιστορία";
  if (/latin|λατιν|(^|_)lat(_|\b)/.test(n)) return "Λατινικά";
  if (/koin|κοινωνιολ/.test(n)) return "Κοινωνιολογία";
  if (/biol|βιολογ|(^|_)bio(_|\b)/.test(n)) return "Βιολογία";
  if (/fysik|fis|phys|φυσικ|(^|_)fys(_|\b)/.test(n)) return "Φυσική";
  if (/xhmeia|ximeia|xhm|xim|χημ/.test(n)) return "Χημεία";
  if (/oikonom|οικονομ|(^|_)oik(_|\b)/.test(n)) return isEpal ? "Αρχές Οικονομικής Θεωρίας (ΑΟΘ)" : "Οικονομία (ΑΟΘ)";
  if (/math|(^|_)mat|μαθηματ/.test(n)) return "Μαθηματικά";
  if (/nea[_-]?ell|νεα ελλ|νεοελλ|(^|[^a-z])nea([^a-z]|$)|glwssa|glossa|(^|_)glo(_|\b)|ekthesi|ekthesh|ekthesis|neol|neoellhnikh|γλωσσ|εκθεσ/.test(n))
    return "Νεοελληνική Γλώσσα";
  return null;
}

/* ── Θέματα vs Λύσεις detection ── */
function detectKind(name, original) {
  const n = name.toLowerCase();
  // explicit solutions markers (Latin + Greek)
  if (/(^|_)ap(_|t|an|a|\b)|apant|apan|sxolio|(^|_)1na(_|\b)|απαντ|λυσ|σχολι/.test(n)) return "Λύσεις";
  // ministry themata markers
  if (/them|θεμα/.test(n)) return "Θέματα";
  if (/_op_|op_hm|op_neo|neo_op|(^|_)h0\d/.test(n)) return "Θέματα";
  // a Latin uppercase run of >=3 letters => ministry official PDF (exam codes)
  if (/[A-Z]{3,}/.test(original)) return "Θέματα";
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
    const isEpal = /epal|επαλ/i.test(file);
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
