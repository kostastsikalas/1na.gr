import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";

export const metadata: Metadata = {
  title: "Φροντιστηριακός Όμιλος ΕΝΑ | 1na.gr — Η Σίγουρη Επιλογή",
  description:
    "Ο Φροντιστηριακός Όμιλος ΕΝΑ — η σίγουρη επιλογή προς την επιτυχία. Κορυφαία φροντιστήρια Ηρακλείου & Αττικής για Γυμνάσιο, Λύκειο & ΕΠΑΛ. 25+ χρόνια αριστείας, 5.000+ επιτυχόντες στις Πανελλαδικές.",
  alternates: {
    canonical: "https://1na.gr",
  },
  openGraph: {
    title: "Φροντιστηριακός Όμιλος ΕΝΑ | Η Σίγουρη Επιλογή",
    description:
      "Κορυφαία φροντιστήρια Ηρακλείου & Αττικής. 25+ χρόνια αριστείας, 5.000+ επιτυχόντες στις Πανελλαδικές εξετάσεις.",
    url: "https://1na.gr",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
