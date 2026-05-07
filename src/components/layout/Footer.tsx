"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Mail, Clock, ExternalLink } from "lucide-react";

const branches = [
  {
    id: "center",
    title: "ΗΡΑΚΛΕΙΟ (Κέντρο)",
    address: "Γραμβούσης 5 & Καγιαμπή",
    city: "Ηράκλειο Κρήτης",
    phone: "2810 285726",
    image: "/images/kentro/02.JPG",
    mapUrl: "https://maps.google.com/maps?q=Γραμβούσης%205,%20Ηράκλειο&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "east",
    title: "ΗΡΑΚΛΕΙΟ (Κνωσού)",
    address: "Λεωφ. Κνωσού 187",
    city: "Ηράκλειο Κρήτης",
    phone: "2810 212333",
    image: "/images/knossou/DSC00715.JPG",
    mapUrl: "https://maps.google.com/maps?q=Λεωφ.%20Κνωσού%20187,%20Ηράκλειο&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "athens",
    title: "ΑΘΗΝΑ",
    address: "Οδός Ερμού 5",
    city: "Αθήνα",
    phone: "210 9876543",
    image: "/images/branch_athens.png",
    mapUrl: "https://maps.google.com",
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
              ΤΑ ΠΑΡΑΡΤΗΜΑΤΑ ΜΑΣ
            </h2>
            <p className="text-blue-200/60 text-center text-sm mb-10 max-w-md mx-auto">
              3 σύγχρονες δομές σε Ηράκλειο & Αθήνα
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
                      href={branch.mapUrl}
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
              Πανελλαδικές εξετάσεις από το 2005.
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
              <div className="flex items-center gap-2.5 text-gray-400">
                <Clock size={15} className="text-blue-400/70" />
                Δευ – Παρ: 09:00 – 21:00
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
              href="#"
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
              href="#"
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
            {/* LinkedIn */}
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
              aria-label="LinkedIn"
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
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
