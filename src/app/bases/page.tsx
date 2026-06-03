import type { Metadata } from "next";
import BasesClient from "./BasesClient";

export const metadata: Metadata = {
  title: "Βάσεις Εισαγωγής 2025",
  description:
    "Πίνακας βάσεων εισαγωγής 2025 για όλες τις σχολές ΑΕΙ. Αναζητήστε βάσεις εισαγωγής ανά σχολή, πεδίο και ίδρυμα. Συγκριτικά δεδομένα 2023-2025.",
  keywords: [
    "βάσεις εισαγωγής 2025",
    "βάσεις εισαγωγής ΑΕΙ",
    "βάσεις πανελλαδικές",
    "βάσεις σχολών",
    "μηχανογραφικό 2025",
  ],
  alternates: {
    canonical: "https://1na.gr/bases",
  },
  openGraph: {
    title: "Βάσεις Εισαγωγής 2025 — Φροντιστήριο ΕΝΑ",
    description:
      "Πλήρης πίνακας βάσεων εισαγωγής 2025 για όλες τις σχολές ΑΕΙ. Συγκρίνετε τάσεις 2023-2025.",
    url: "https://1na.gr/bases",
  },
};

export default function BasesPage() {
  return <BasesClient />;
}
