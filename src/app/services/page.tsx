import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Υπηρεσίες — Τμήματα & Προγράμματα",
  description:
    "Ολοκληρωμένες εκπαιδευτικές υπηρεσίες: τμήματα Γυμνασίου, Λυκείου & ΕΠΑΛ, προετοιμασία Πανελλαδικών, μηχανογραφικό, coaching. Γιατί να επιλέξετε φροντιστήριο και όχι ιδιαίτερα;",
  keywords: [
    "υπηρεσίες φροντιστηρίου",
    "τμήματα γυμνασίου",
    "τμήματα λυκείου",
    "ΕΠΑΛ φροντιστήριο",
    "πανελλαδικές προετοιμασία",
    "μηχανογραφικό συμβουλευτική",
  ],
  alternates: {
    canonical: "https://1na.gr/services",
  },
  openGraph: {
    title: "Υπηρεσίες & Τμήματα — Φροντιστήριο ΕΝΑ",
    description:
      "Τμήματα Γυμνασίου, Λυκείου & ΕΠΑΛ, προετοιμασία Πανελλαδικών, μηχανογραφικό. Ολοκληρωμένες λύσεις για κάθε μαθητή.",
    url: "https://1na.gr/services",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
