import type { Metadata } from "next";
import PublicationsClient from "./PublicationsClient";

export const metadata: Metadata = {
  title: "Εκδόσεις & Συγγράμματα",
  description:
    "Εκδόσεις και εκπαιδευτικά βιβλία του Φροντιστηριακού Ομίλου ΕΝΑ. Βοηθήματα για Γυμνάσιο, Λύκειο και Πανελλαδικές εξετάσεις από βραβευμένους συγγραφείς.",
  keywords: [
    "εκδόσεις φροντιστήριο ΕΝΑ",
    "βοηθήματα πανελλαδικές",
    "εκπαιδευτικά βιβλία",
    "Klett National Geographic",
  ],
  alternates: {
    canonical: "https://1na.gr/publications",
  },
  openGraph: {
    title: "Εκδόσεις & Βοηθήματα — Φροντιστήριο ΕΝΑ",
    description:
      "Εκπαιδευτικά βιβλία και βοηθήματα από τον Φροντιστηριακό Όμιλο ΕΝΑ.",
    url: "https://1na.gr/publications",
  },
};

export default function PublicationsPage() {
  return <PublicationsClient />;
}
