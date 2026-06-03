import type { Metadata } from "next";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
  title: "Νέα & Εκδηλώσεις",
  description:
    "Τα τελευταία νέα και φωτογραφικό υλικό από τις εκδηλώσεις του Φροντιστηριακού Ομίλου ΕΝΑ. Ενημερωθείτε για δράσεις, βραβεύσεις και εκπαιδευτικά events.",
  alternates: {
    canonical: "https://1na.gr/news",
  },
  openGraph: {
    title: "Νέα & Εκδηλώσεις — Φροντιστήριο ΕΝΑ",
    description:
      "Τα τελευταία νέα και φωτογραφικό υλικό από τις εκδηλώσεις του Φροντιστηριακού Ομίλου ΕΝΑ.",
    url: "https://1na.gr/news",
  },
};

export default function NewsPage() {
  return <NewsClient />;
}
