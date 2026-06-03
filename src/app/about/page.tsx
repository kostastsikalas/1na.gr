import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Σχετικά με εμάς — Η Ιστορία μας",
  description:
    "Από το 1999, ο Φροντιστηριακός Όμιλος ΕΝΑ οδηγεί χιλιάδες μαθητές στις σπουδές που ονειρεύονται. Μάθε πώς ξεκίνησε όλο αυτό — 25+ χρόνια αριστείας και 5.000+ επιτυχόντες.",
  keywords: [
    "φροντιστήριο ΕΝΑ ιστορία",
    "φροντιστήριο Ηράκλειο 1999",
    "Φροντιστηριακός Όμιλος ΕΝΑ",
    "25 χρόνια αριστείας",
  ],
  alternates: {
    canonical: "https://1na.gr/about",
  },
  openGraph: {
    title: "Η Ιστορία μας — Φροντιστήριο ΕΝΑ",
    description:
      "Από το 1999, ο Φροντιστηριακός Όμιλος ΕΝΑ οδηγεί χιλιάδες μαθητές στις σπουδές που ονειρεύονται.",
    url: "https://1na.gr/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
