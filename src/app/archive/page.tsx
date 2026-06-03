import type { Metadata } from "next";
import ArchiveClient from "./ArchiveClient";

export const metadata: Metadata = {
  title: "Αρχείο Θεμάτων & Διαγωνισμάτων",
  description:
    "Αρχείο θεμάτων Πανελλαδικών εξετάσεων και διαγωνισμάτων από τον Φροντιστηριακό Όμιλο ΕΝΑ. Μελετήστε παλαιότερα θέματα για καλύτερη προετοιμασία.",
  keywords: [
    "αρχείο θεμάτων πανελλαδικές",
    "παλαιά θέματα πανελλαδικές",
    "διαγωνίσματα αρχείο",
  ],
  alternates: {
    canonical: "https://1na.gr/archive",
  },
  openGraph: {
    title: "Αρχείο Θεμάτων — Φροντιστήριο ΕΝΑ",
    description:
      "Αρχείο θεμάτων Πανελλαδικών εξετάσεων και διαγωνισμάτων για καλύτερη προετοιμασία.",
    url: "https://1na.gr/archive",
  },
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
