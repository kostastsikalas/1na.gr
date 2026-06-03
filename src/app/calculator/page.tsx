import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Υπολογιστής Μορίων 2026",
  description:
    "Υπολογίστε τα μόριά σας για τις Πανελλαδικές εξετάσεις 2026 με βάση τους πραγματικούς συντελεστές βαρύτητας κάθε σχολής (ΦΕΚ 7145/2025). Δείτε ποιες σχολές μπορείτε να εισαχθείτε.",
  keywords: [
    "υπολογιστής μορίων 2026",
    "μόρια πανελλαδικές 2026",
    "μηχανογραφικό 2026",
    "συντελεστές βαρύτητας",
    "βάσεις εισαγωγής",
    "ΦΕΚ 7145",
  ],
  alternates: {
    canonical: "https://1na.gr/calculator",
  },
  openGraph: {
    title: "Υπολογιστής Μορίων 2026 — Φροντιστήριο ΕΝΑ",
    description:
      "Υπολογίστε τα μόριά σας για Πανελλαδικές 2026 με τους πραγματικούς συντελεστές κάθε σχολής.",
    url: "https://1na.gr/calculator",
  },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
