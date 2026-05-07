"use client";

import { useState, useEffect } from "react";
import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

type NewsItem = {
  id: string;
  title: string;
  created_at: string;
  images: string[];
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setNews(data);
        setActiveEventId(data[0].id);
      }
      setIsLoading(false);
    }

    fetchNews();
  }, [supabase]);

  const activeEvent = news.find(e => e.id === activeEventId);

  return (
    <main className="pt-32 pb-20 min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#213576] tracking-tight">
            ΝΕΑ & ΕΚΔΗΛΩΣΕΙΣ
          </h1>
          <div className="w-24 h-1.5 bg-[#df6060] mt-6"></div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#213576]" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">Δεν υπάρχουν εκδηλώσεις</h2>
            <p className="text-gray-500 mt-2">Σύντομα θα προστεθεί φωτογραφικό υλικό.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar - Event List */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-1/3 flex flex-col gap-3"
            >
              {news.map((event) => {
                const isActive = activeEventId === event.id;
                return (
                  <button
                    key={event.id}
                    onClick={() => setActiveEventId(event.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-md transition-all duration-200 border-l-4 ${
                      isActive 
                        ? "bg-white border-[#213576] shadow-md text-[#213576] font-bold" 
                        : "bg-[#e2e8f0]/60 border-transparent text-gray-700 hover:bg-[#e2e8f0] font-medium"
                    }`}
                  >
                    <Camera className={`w-5 h-5 ${isActive ? "text-[#213576]" : "text-[#213576]"}`} strokeWidth={2.5} />
                    <div className="flex flex-col items-start">
                      <span className="text-left text-[15px]">{event.title}</span>
                      <span className="text-xs text-gray-500 font-normal">{new Date(event.created_at).toLocaleDateString('el-GR')}</span>
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Gallery Area */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-2/3 bg-white border border-gray-200 p-4 md:p-8 min-h-[600px] shadow-sm flex flex-col"
            >
              <AnimatePresence mode="wait">
                {activeEvent && (
                  <motion.div
                    key={activeEventId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                      <Camera className="w-6 h-6 text-[#df6060]" />
                      <h2 className="text-2xl font-bold text-[#213576]">
                        {activeEvent.title}
                      </h2>
                    </div>

                    {!activeEvent.images || activeEvent.images.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p>Δεν υπάρχουν φωτογραφίες για αυτή την εκδήλωση ακόμα.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
                        {activeEvent.images.map((src, idx) => (
                          <div 
                            key={idx} 
                            className="relative aspect-[4/3] group overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={src} 
                              alt={`${activeEvent.title} photo ${idx + 1}`}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        )}
      </div>
    </main>
  );
}
