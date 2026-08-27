"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Mail, Clock, ExternalLink } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const defaultBranches = [
  {
    id: "center",
    title: "ΗΡΑΚΛΕΙΟ (Κέντρο)",
    address: "Γραμβούσης 5 & Καγιαμπή",
    city: "Ηράκλειο Κρήτης",
    phone: "2810 285726",
    image: "/images/kentro/02.JPG",
    mapUrl: "https://maps.google.com/maps?q=Γραμβούσης%205,%20Ηράκλειο&t=&z=16&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Γραμβούσης+5+Ηράκλειο",
  },
  {
    id: "east",
    title: "ΗΡΑΚΛΕΙΟ (Κνωσού)",
    address: "Λεωφ. Κνωσού 187",
    city: "Ηράκλειο Κρήτης",
    phone: "2810 212333",
    image: "/images/knossou/DSC00715.JPG",
    mapUrl: "https://maps.google.com/maps?q=Λεωφ.%20Κνωσού%20187,%20Ηράκλειο&t=&z=16&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Λεωφόρος+Κνωσού+187+Ηράκλειο",
  },
  {
    id: "athens",
    title: "ΑΘΗΝΑ",
    address: "Ησιόδου 18, Άλιμος",
    city: "Αθήνα",
    phone: "210 991 3433",
    image: "/images/athens.png",
    mapUrl: "https://maps.google.com/maps?q=Ησιόδου%2018,%20Άλιμος&t=&z=16&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Ησιόδου+18+Άλιμος",
  },
];

const quickLinks = [
  {
    heading: "Πανελλήνιες",
    links: [
      { name: "Επιτυχίες", href: "/success" },
      { name: "Θέματα Εξετάσεων", href: "/archive" },
      { name: "Προσομοιωτικά", href: "/mock-exams" },
    ],
  },
  {
    heading: "Μηχανογραφικό",
    links: [
      { name: "Υπολογιστής Μορίων", href: "/calculator" },
      { name: "Βάσεις Εισαγωγής", href: "/bases" },
      { name: "Οδηγός", href: "/guide" },
    ],
  },
  {
    heading: "Φροντιστήριο",
    links: [
      { name: "Σχετικά με εμάς", href: "/about" },
      { name: "Η Ομάδα μας", href: "/team" },
      { name: "Εκδόσεις", href: "/publications" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [branches, setBranches] = useState(defaultBranches);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("branches")
          .select("*")
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setBranches(
            data.map((b) => ({
              id: b.id,
              title: b.name,
              address: b.address,
              city: b.city || "",
              phone: b.phone || "",
              image: b.image || "/images/kentro/02.JPG",
              mapUrl: b.map_url,
              directionsUrl: b.directions_url,
            }))
          );
        }
      } catch (_) {
        console.log("Χρήση στατικών παραρτημάτων.");
      }
    };
    fetchBranches();
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-gradient-to-b from-[#0a1e3d] to-[#050e1d] text-white overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ──── Branch Cards (Hidden on Contact Page) ──── */}
        {pathname !== "/contact" && (
          <div className="pt-16 pb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 tracking-wide">
              ΟΙ ΕΓΚΑΤΑΣΤΑΣΕΙΣ ΜΑΣ
            </h2>
            <p className="text-blue-200/60 text-center text-sm mb-10 max-w-md mx-auto">
              {branches.length} σύγχρονες {branches.length === 1 ? "δομή" : "δομές"} σε όλη την Ελλάδα
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="group bg-white/[0.04] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1"
                >
                  {/* Branch Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={branch.image}
                      alt={branch.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e3d] via-transparent to-transparent" />
                  </div>

                  {/* Branch Info */}
                  <div className="p-5">
                    <h3 className="text-[#e74c3c] font-bold text-base mb-3">
                      {branch.title}
                    </h3>

                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-3 text-gray-300 text-[13px]">
                        <MapPin className="text-blue-400/70 w-4 h-4 shrink-0" />
                        <span>
                          {branch.address}, {branch.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300 text-[13px]">
                        <Phone className="text-blue-400/70 w-4 h-4 shrink-0" />
                        <span>{branch.phone}</span>
                      </div>
                    </div>

                    <a
                      href={branch.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl text-[13px] font-medium text-blue-200 transition-all duration-200"
                    >
                      <MapPin size={14} />
                      Δείτε στον Χάρτη
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──── Divider ──── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ──── Quick Links + Info ──── */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image 
                src="/images/logo-ena.png" 
                alt="Φροντιστηριακός Όμιλος ΕΝΑ" 
                width={180} 
                height={80} 
                className="h-[50px] w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Η σίγουρη επιλογή προς την επιτυχία. Κορυφαία προετοιμασία για
              Πανελλαδικές εξετάσεις από το 1999.
            </p>

            {/* Contact Snippet */}
            <div className="space-y-3 text-[13px]">
              <a
                href="mailto:info@1na.gr"
                className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={15} className="text-blue-400/70" />
                info@1na.gr
              </a>
              <div className="flex flex-col gap-1.5 text-gray-400">
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-blue-400/70 shrink-0" />
                  <span>Δευ - Παρ. 09:00-13:30 & 17:00-21:00</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[15px] shrink-0" />
                  <span>Σάββατο 09:00-13:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Link Columns */}
          {quickLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ──── Divider ──── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ──── Bottom Bar ──── */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-gray-500">
            © {new Date().getFullYear()} Φροντιστηριακός Όμιλος ΕΝΑ. Με
            επιφύλαξη παντός δικαιώματος.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/1na.gr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
              aria-label="Facebook"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/frontistirio.ena/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
              aria-label="Instagram"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                ></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@frontistrioena?_r=1&_t=ZN-99E7weZxdTS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
              aria-label="TikTok"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UCfmVMF00ZV2bNehoGGG_SOw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
              aria-label="YouTube"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
