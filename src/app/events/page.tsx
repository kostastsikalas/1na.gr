"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Lightbulb, PartyPopper, Users, X, ChevronLeft, ChevronRight, Star } from "lucide-react";

// Hardcoded Event Data utilizing the local images
const eventsData = [
  {
    id: "cern",
    title: "Εκδρομή στο CERN",
    description: "Εκπαιδευτική εκδρομή στο Ευρωπαϊκό Κέντρο Πυρηνικών Ερευνών (CERN) στη Γενεύη.",
    date: "2009",
    category: "Εκδρομή",
    icon: MapPin,
    color: "bg-emerald-500",
    images: [
      "/images/cern/05.jpg",
      "/images/cern/12.jpg",
      "/images/cern/2009_cern_13.JPG",
      "/images/cern/2009_cern_6.JPG",
      "/images/cern/26.jpg",
      "/images/cern/58.jpg"
    ]
  },
  {
    id: "eppagelmatikos",
    title: "Ημερίδες Επαγγελματικού Προσανατολισμού",
    description: "Ενημερωτικές εκδηλώσεις για μαθητές και γονείς σχετικά με την επιλογή σπουδών και επαγγέλματος.",
    date: "2018 - 2019",
    category: "Ημερίδα",
    icon: Lightbulb,
    color: "bg-amber-500",
    images: [
      "/images/eppagelmatikos/20.JPG",
      "/images/eppagelmatikos/20180422_113207.jpg",
      "/images/eppagelmatikos/20190203_110336.jpg",
      "/images/eppagelmatikos/20190203_112907.jpg",
      "/images/eppagelmatikos/DSC00108.JPG",
      "/images/eppagelmatikos/DSC00651.JPG",
      "/images/eppagelmatikos/DSC01057.JPG",
      "/images/eppagelmatikos/DSC01645.JPG",
      "/images/eppagelmatikos/DSC02697.JPG",
      "/images/eppagelmatikos/DSC03245.JPG",
      "/images/eppagelmatikos/DSC03248.JPG",
      "/images/eppagelmatikos/DSC04147.JPG"
    ]
  },
  {
    id: "fusiki",
    title: "Ημέρες Φυσικής",
    description: "Πειράματα και διαδραστικές παρουσιάσεις φυσικής στο χώρο του φροντιστηρίου.",
    date: "Διάφορα Έτη",
    category: "Εκπαιδευτική Δράση",
    icon: Star,
    color: "bg-purple-500",
    images: [
      "/images/fusiki/DSC01439.JPG",
      "/images/fusiki/DSC01449.JPG",
      "/images/fusiki/DSC01450.JPG",
      "/images/fusiki/DSC01452.JPG",
      "/images/fusiki/DSC01459.JPG",
      "/images/fusiki/DSC01463.JPG",
      "/images/fusiki/DSC01467.JPG"
    ]
  },
  {
    id: "tsiknopempti",
    title: "Τσικνοπέμπτη",
    description: "Γιορτάζουμε μαζί με τους μαθητές μας σε μια ζεστή και διασκεδαστική ατμόσφαιρα.",
    date: "Διάφορα Έτη",
    category: "Γιορτή",
    icon: PartyPopper,
    color: "bg-rose-500",
    images: [
      "/images/tsiknopempti/DSC00077.JPG",
      "/images/tsiknopempti/DSC00096.JPG",
      "/images/tsiknopempti/DSC00100.JPG",
      "/images/tsiknopempti/DSC00133.JPG",
      "/images/tsiknopempti/DSC01074.JPG",
      "/images/tsiknopempti/DSC01129.JPG",
      "/images/tsiknopempti/DSC01140.JPG",
      "/images/tsiknopempti/DSC03059.JPG",
      "/images/tsiknopempti/DSC04079.JPG",
      "/images/tsiknopempti/DSC04088.JPG"
    ]
  },
  {
    id: "athlitikes",
    title: "Αθλητικές Εκδηλώσεις",
    description: "Συμμετοχή σε αθλητικές δραστηριότητες και τουρνουά.",
    date: "Διάφορα Έτη",
    category: "Αθλητισμός",
    icon: Users,
    color: "bg-indigo-500",
    images: [
      "/images/athlitikes ekdilwseis/DSC00009.JPG",
      "/images/athlitikes ekdilwseis/DSC00010.JPG",
      "/images/athlitikes ekdilwseis/DSC00022.JPG",
      "/images/athlitikes ekdilwseis/DSC01256.JPG",
      "/images/athlitikes ekdilwseis/DSC01259.JPG",
      "/images/athlitikes ekdilwseis/DSC01272.JPG",
      "/images/athlitikes ekdilwseis/P1.JPG",
      "/images/athlitikes ekdilwseis/P1030561_resize.JPG",
      "/images/athlitikes ekdilwseis/P1070629.JPG"
    ]
  }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (event: typeof eventsData[0]) => {
    if (!event.images || event.images.length === 0) return;
    setSelectedEvent(event);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedEvent(null);
  };

  const nextImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length);
    }
  };

  const prevImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* ──── Header Section ──── */}
      <section className="bg-[#213576] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            Εκδηλώσεις & Δράσεις
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
          >
            Στον Φροντιστηριακό Όμιλο ΕΝΑ πιστεύουμε ότι η εκπαίδευση πρέπει να
            συνδυάζεται με στιγμές χαράς, δημιουργίας και ομαδικότητας.
          </motion.p>
        </div>
      </section>

      {/* ──── Events Grid ──── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.map((event, index) => {
            const Icon = event.icon;
            const coverImage = event.images[0];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col cursor-pointer"
                onClick={() => openGallery(event)}
              >
                {/* Cover Image */}
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white ${event.color}`}>
                      <Icon size={48} className="opacity-50" />
                    </div>
                  )}
                  {/* Floating Icon */}
                  <div className={`absolute top-4 right-4 p-3 rounded-2xl text-white shadow-lg ${event.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit mb-4">
                    {event.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-[#213576] mb-3 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                    <Calendar size={16} />
                    {event.date}
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed text-sm flex-1">
                    {event.description}
                  </p>
                </div>
                
                {/* Footer Action */}
                <div 
                  className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors"
                >
                  <span className="text-sm text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                    {event.images.length} φωτογραφίες
                  </span>
                  <button className="text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-1">
                    Άνοιγμα Gallery &rarr;
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ──── Lightbox / Gallery Modal ──── */}
      <AnimatePresence>
        {selectedEvent && selectedEvent.images && selectedEvent.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
              <X size={28} />
            </button>

            {/* Event Info Overlay */}
            <div className="absolute top-6 left-6 text-white z-50">
              <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
              <p className="text-white/70 text-sm">
                Φωτογραφία {currentImageIndex + 1} από {selectedEvent.images.length}
              </p>
            </div>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Container */}
            <div className="relative w-full max-w-5xl h-[80vh] px-16">
              <Image
                src={selectedEvent.images[currentImageIndex]}
                alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
            
            {/* Thumbnails */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50 flex-wrap justify-center max-w-2xl">
              {selectedEvent.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentImageIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
