import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Εκδηλώσεις & Δραστηριότητες",
  description:
    "Εκδηλώσεις, σεμινάρια και δραστηριότητες του Φροντιστηριακού Ομίλου ΕΝΑ. Ενημερωθείτε για τα επερχόμενα events και τις συμμετοχές μας.",
  alternates: {
    canonical: "https://1na.gr/events",
  },
  openGraph: {
    title: "Εκδηλώσεις — Φροντιστήριο ΕΝΑ",
    description:
      "Εκδηλώσεις, σεμινάρια και δραστηριότητες του Φροντιστηριακού Ομίλου ΕΝΑ.",
    url: "https://1na.gr/events",
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
