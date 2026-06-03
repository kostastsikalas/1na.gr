import type { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Οι Επιτυχόντες μας",
  description:
    "Χιλιάδες μαθητές εμπιστεύτηκαν τον Φροντιστηριακό Όμιλο ΕΝΑ και πέτυχαν στις Πανελλαδικές εξετάσεις. Αναζητήστε ονόματα, σχολές και χρονιές επιτυχόντων από το 2009 έως σήμερα.",
  keywords: [
    "επιτυχόντες ΕΝΑ",
    "επιτυχόντες πανελλαδικές",
    "αποτελέσματα φροντιστηρίου",
    "επιτυχίες ΕΝΑ",
  ],
  alternates: {
    canonical: "https://1na.gr/success",
  },
  openGraph: {
    title: "Οι Επιτυχόντες μας — Φροντιστήριο ΕΝΑ",
    description:
      "Χιλιάδες μαθητές εμπιστεύτηκαν τον Φροντιστηριακό Όμιλο ΕΝΑ και πέτυχαν στις Πανελλαδικές.",
    url: "https://1na.gr/success",
  },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
