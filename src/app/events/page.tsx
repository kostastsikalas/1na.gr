"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Lightbulb, PartyPopper, Users, X, ChevronLeft, ChevronRight, Cake, Star, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Define the type for our event items from Supabase
type EventItem = {
  id: string;
  title: string;
  category?: string;
  date_string?: string;
  description?: string;
  created_at: string;
  images: string[];
};

// Helper function to dynamically map categories to icons and colors
const getCategoryStyle = (category: string | undefined) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("εκδρομή") || cat.includes("cern")) {
    return { icon: MapPin, color: "bg-emerald-500 text-white" };
  }
  if (cat.includes("σεμινάριο") || cat.includes("ημερίδα") || cat.includes("φυσική")) {
    return { icon: Lightbulb, color: "bg-amber-500 text-white" };
  }
  if (cat.includes("γιορτή") || cat.includes("τσικνοπέμπτη")) {
    return { icon: PartyPopper, color: "bg-rose-500 text-white" };
  }
  if (cat.includes("αθλητισμός") || cat.includes("αθλητικές")) {
    return { icon: Users, color: "bg-indigo-500 text-white" };
  }
  if (cat.includes("κοπή") || cat.includes("πίτα")) {
    return { icon: Cake, color: "bg-blue-500 text-white" };
  }
  return { icon: Star, color: "bg-[#213576] text-white" }; // Default
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setEvents(data);
    }
    setIsLoading(false);
  };

  const openGallery = (event: EventItem) => {
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
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#213576]" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Δεν βρέθηκαν εκδηλώσεις.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const { icon: Icon, color } = getCategoryStyle(event.category);
              const coverImage = event.images && event.images.length > 0 ? event.images[0] : null;

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
                      <div className={`w-full h-full flex items-center justify-center ${color}`}>
                        <Icon size={48} className="opacity-50" />
                      </div>
                    )}
                    {/* Floating Icon */}
                    <div className={`absolute top-4 right-4 p-3 rounded-2xl ${color} shadow-lg`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit mb-4">
                      {event.category || "ΕΚΔΗΛΩΣΗ"}
                    </span>
                    
                    <h3 className="text-2xl font-bold text-[#213576] mb-3 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                      <Calendar size={16} />
                      {event.date_string || new Date(event.created_at).toLocaleDateString('el-GR')}
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-sm flex-1 line-clamp-3">
                      {event.description || "Πατήστε για να δείτε φωτογραφικό υλικό από την εκδήλωση."}
                    </p>
                  </div>
                  
                  {/* Footer Action */}
                  <div 
                    className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-sm text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                      {event.images?.length || 0} φωτογραφίες
                    </span>
                    <button className="text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-1">
                      Άνοιγμα Gallery &rarr;
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
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
