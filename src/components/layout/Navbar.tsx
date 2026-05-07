"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Info,
  Users,
  Briefcase,
  Trophy,
  FileText,
  ClipboardList,
  BookOpen,
  Calculator,
  BarChart3,
  Compass,
  MapPin,
  ChevronDown,
  Calendar,
} from "lucide-react";

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const YoutubeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

type SubItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
};

type NavTab = {
  label: string;
  href?: string;
  items?: SubItem[];
};

const navTabs: NavTab[] = [
  {
    label: "Το ΕΝΑ",
    items: [
      {
        name: "Σχετικά με εμάς",
        href: "/about",
        icon: Info,
        description: "Η ιστορία & το όραμά μας",
      },
      {
        name: "Η Ομάδα μας",
        href: "/team",
        icon: Users,
        description: "Το έμπειρο διδακτικό προσωπικό",
      },
      {
        name: "Υπηρεσίες",
        href: "/services",
        icon: Briefcase,
        description: "Τι προσφέρουμε στους μαθητές μας",
      },
    ],
  },
  {
    label: "Πανελλήνιες",
    items: [
      {
        name: "Επιτυχόντες",
        href: "/success",
        icon: Trophy,
        description: "Οι επιτυχόντες μαθητές μας",
      },
      {
        name: "Θέματα & Λύσεις",
        href: "/archive",
        icon: FileText,
        description: "Αρχείο θεμάτων πανελλαδικών",
      },
      {
        name: "Προτεινόμενα Διαγωνίσματα",
        href: "/mock-exams",
        icon: ClipboardList,
        description: "Εξάσκηση με διαγωνίσματα ΕΝΑ",
      },
    ],
  },
  {
    label: "Εκδόσεις",
    items: [
      {
        name: "Βιβλιοθήκη Εκδόσεων",
        href: "/publications",
        icon: BookOpen,
        description: "Βιβλία για Α΄, Β΄ & Γ΄ Λυκείου",
      },
    ],
  },
  {
    label: "Μηχανογραφικό",
    items: [
      {
        name: "Βάσεις Εισαγωγής",
        href: "/bases",
        icon: BarChart3,
        description: "Συγκριτικός πίνακας βάσεων σχολών",
      },
      {
        name: "Οδηγός Σπουδών",
        href: "/guide",
        icon: Compass,
        description: "Βήμα-βήμα οδηγός μηχανογραφικού",
      },
      {
        name: "Υπολογισμός Μορίων",
        href: "/calculator",
        icon: Calculator,
        description: "Υπολογίστε τα μόριά σας online",
      },
    ],
  },
  {
    label: "Εκδηλώσεις",
    href: "/events",
  },
  {
    label: "Επικοινωνία",
    href: "/contact",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<number | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setActiveTab(null);
    setMobileOpen(false);
    setMobileAccordion(null);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (idx: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveTab(idx);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveTab(null), 150);
  };

  // Check if any sub-item in a tab matches the current path
  const isTabActive = (tab: NavTab) => {
    if (tab.href) {
      return pathname === tab.href || pathname.startsWith(tab.href + "/");
    }
    return (
      tab.items?.some(
        (item) =>
          pathname === item.href || pathname.startsWith(item.href + "/")
      ) ?? false
    );
  };

  return (
    <header ref={navRef} className="fixed top-0 left-0 w-full z-50">
      {/* Glass bar */}
      <div className="mx-auto max-w-[1400px] px-4 pt-4">
        <nav className="relative bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl">
          <div className="px-5 lg:px-8">
            <div className="flex items-center justify-between h-[68px]">
              {/* ──── Logo ──── */}
              <Link
                href="/"
                className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
              >
                <Image 
                  src="/images/logo-ena.png" 
                  alt="Φροντιστηριακός Όμιλος ΕΝΑ" 
                  width={180} 
                  height={80} 
                  className="h-[60px] w-auto object-contain"
                  priority
                />
              </Link>

              {/* ──── Desktop Tabs ──── */}
              <div className="hidden lg:flex items-center gap-1">
                {navTabs.map((tab, idx) => (
                  <div
                    key={tab.label}
                    className="relative"
                    onMouseEnter={() => !tab.href && handleMouseEnter(idx)}
                    onMouseLeave={() => !tab.href && handleMouseLeave()}
                  >
                    {tab.href ? (
                      <Link
                        href={tab.href}
                        className={`flex items-center gap-1.5 px-4 py-2 text-[15px] font-semibold rounded-xl transition-all duration-200 ${
                          isTabActive(tab)
                            ? "text-[#c0392b]"
                            : "text-[#213576]/80 hover:text-[#213576] hover:bg-[#213576]/5"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1.5 px-4 py-2 text-[15px] font-semibold rounded-xl transition-all duration-200 ${
                          activeTab === idx
                            ? "bg-[#213576]/8 text-[#213576]"
                            : isTabActive(tab)
                            ? "text-[#c0392b]"
                            : "text-[#213576]/80 hover:text-[#213576] hover:bg-[#213576]/5"
                        }`}
                      >
                        {tab.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            activeTab === idx ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* ──── Dropdown Panel ──── */}
                    {!tab.href && tab.items && (
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                          activeTab === idx
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100/80 overflow-hidden min-w-[300px]">
                          <div className="p-2">
                            {tab.items.map((item) => {
                              const Icon = item.icon;
                              const isActive =
                                pathname === item.href ||
                                pathname.startsWith(item.href + "/");
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={`flex items-start gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150 group ${
                                    isActive
                                      ? "bg-[#213576]/6"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div
                                    className={`mt-0.5 flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors ${
                                      isActive
                                        ? "bg-[#213576] text-white"
                                        : "bg-[#213576]/8 text-[#213576] group-hover:bg-[#213576]/15"
                                    }`}
                                  >
                                    <Icon size={18} />
                                  </div>
                                  <div>
                                    <div
                                      className={`text-[14px] font-semibold leading-tight ${
                                        isActive
                                          ? "text-[#213576]"
                                          : "text-gray-800"
                                      }`}
                                    >
                                      {item.name}
                                    </div>
                                    <div className="text-[12.5px] text-gray-400 mt-0.5 leading-snug">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ──── Social Media (Desktop) ──── */}
              <div className="hidden lg:flex items-center gap-1.5 ml-2 border-l border-gray-200 pl-4">
                <a href="https://www.facebook.com/1na.gr/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl text-[#213576]/70 hover:bg-[#213576]/10 hover:text-[#213576] transition-all">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://www.instagram.com/frontistirio.ena/?hl=en" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl text-[#213576]/70 hover:bg-[#213576]/10 hover:text-[#213576] transition-all">
                  <InstagramIcon size={18} />
                </a>
                <a href="https://www.tiktok.com/@frontistrioena" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl text-[#213576]/70 hover:bg-[#213576]/10 hover:text-[#213576] transition-all">
                  <TikTokIcon size={18} />
                </a>
                <a href="https://www.youtube.com/channel/UCfmVMF00ZV2bNehoGGG_SOw" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl text-[#213576]/70 hover:bg-[#213576]/10 hover:text-[#213576] transition-all">
                  <YoutubeIcon size={18} />
                </a>
              </div>

              {/* ──── Mobile Hamburger ──── */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#213576] hover:bg-[#213576]/5 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ══════ Mobile Full-Screen Overlay ══════ */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-[88px] left-4 right-4 max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-y-auto transition-all duration-300 ${
            mobileOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="p-4 space-y-1">
            {navTabs.map((tab, idx) => (
              <div key={tab.label}>
                {tab.href ? (
                  <Link
                    href={tab.href}
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left text-[15px] font-semibold transition-colors ${
                      isTabActive(tab)
                        ? "text-[#c0392b]"
                        : "text-[#213576]/80 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ) : (
                  <>
                    {/* Accordion Header */}
                    <button
                      onClick={() =>
                        setMobileAccordion(mobileAccordion === idx ? null : idx)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left text-[15px] font-semibold transition-colors ${
                        mobileAccordion === idx
                          ? "bg-[#213576]/6 text-[#213576]"
                          : isTabActive(tab)
                          ? "text-[#c0392b]"
                          : "text-[#213576]/80 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          mobileAccordion === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Accordion Body */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        mobileAccordion === idx
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-3 pr-1 pb-2 space-y-0.5">
                        {tab.items?.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                isActive
                                  ? "bg-[#213576]/6 text-[#213576]"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                                  isActive
                                    ? "bg-[#213576] text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                <Icon size={16} />
                              </div>
                              <div>
                                <div className="text-[14px] font-medium">
                                  {item.name}
                                </div>
                                <div className="text-[12px] text-gray-400">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Mobile Social Media */}
            <div className="pt-4 pb-2 border-t border-gray-100 mt-2 flex items-center justify-center gap-4">
              <a href="https://www.facebook.com/1na.gr/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#213576]/5 text-[#213576] hover:bg-[#213576]/10 transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="https://www.instagram.com/frontistirio.ena/?hl=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#213576]/5 text-[#213576] hover:bg-[#213576]/10 transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="https://www.tiktok.com/@frontistrioena" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#213576]/5 text-[#213576] hover:bg-[#213576]/10 transition-colors">
                <TikTokIcon size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCfmVMF00ZV2bNehoGGG_SOw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#213576]/5 text-[#213576] hover:bg-[#213576]/10 transition-colors">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
