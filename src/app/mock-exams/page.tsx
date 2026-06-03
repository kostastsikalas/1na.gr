import type { Metadata } from "next";
import MockExamsClient from "./MockExamsClient";

export const metadata: Metadata = {
  title: "Προσομοιωτικές Εξετάσεις — Mock Exams",
  description:
    "Προσομοιωτικές εξετάσεις Πανελλαδικών (Mock Exams) από τον Φροντιστηριακό Όμιλο ΕΝΑ. Προετοιμαστείτε για τις πραγματικές εξεταστικές συνθήκες με αξιολόγηση και ανατροφοδότηση.",
  keywords: [
    "προσομοιωτικές εξετάσεις",
    "mock exams πανελλαδικές",
    "διαγωνίσματα φροντιστήριο",
    "προετοιμασία πανελλαδικές",
  ],
  alternates: {
    canonical: "https://1na.gr/mock-exams",
  },
  openGraph: {
    title: "Προσομοιωτικές Εξετάσεις — Φροντιστήριο ΕΝΑ",
    description:
      "Προσομοιωτικές εξετάσεις Πανελλαδικών με αξιολόγηση και ανατροφοδότηση.",
    url: "https://1na.gr/mock-exams",
  },
};

export default function MockExamsPage() {
  return <MockExamsClient />;
}
