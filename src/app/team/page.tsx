import type { Metadata } from "next";
import TeamClient from "./TeamClient";

export const metadata: Metadata = {
  title: "Η Ομάδα μας — Καθηγητές & Διδακτικό Προσωπικό",
  description:
    "Γνωρίστε την έμπειρη ομάδα καθηγητών του Φροντιστηριακού Ομίλου ΕΝΑ. Εξειδικευμένο διδακτικό προσωπικό με πάνω από 10 χρόνια εμπειρίας στις Πανελλαδικές εξετάσεις.",
  keywords: [
    "καθηγητές φροντιστηρίου ΕΝΑ",
    "διδακτικό προσωπικό",
    "ομάδα ΕΝΑ",
  ],
  alternates: {
    canonical: "https://1na.gr/team",
  },
  openGraph: {
    title: "Η Ομάδα μας — Φροντιστήριο ΕΝΑ",
    description:
      "Εξειδικευμένο διδακτικό προσωπικό με πάνω από 10 χρόνια εμπειρίας.",
    url: "https://1na.gr/team",
  },
};

export default function TeamPage() {
  return <TeamClient />;
}
