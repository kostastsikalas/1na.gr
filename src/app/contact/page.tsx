import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Επικοινωνία & Εγκαταστάσεις",
  description:
    "Επικοινωνήστε με τον Φροντιστηριακό Όμιλο ΕΝΑ. Εγκαταστάσεις στο Ηράκλειο Κρήτης (Κέντρο & Κνωσός) και στην Αττική (Άλιμος). Τηλέφωνα, email και χάρτες.",
  keywords: [
    "φροντιστήριο ΕΝΑ επικοινωνία",
    "φροντιστήριο Ηράκλειο τηλέφωνο",
    "φροντιστήριο Αλιμος",
    "Γραμβούσης 5 Ηράκλειο",
    "Ησιόδου 18 Αλιμος",
  ],
  alternates: {
    canonical: "https://1na.gr/contact",
  },
  openGraph: {
    title: "Επικοινωνία & Εγκαταστάσεις — Φροντιστήριο ΕΝΑ",
    description:
      "Εγκαταστάσεις στο Ηράκλειο Κρήτης και στην Αττική. Τηλέφωνα, email και χάρτες.",
    url: "https://1na.gr/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
