"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      // Trigger hover only if mouse is in the left half of the screen
      setIsHovered(e.clientX < window.innerWidth / 2);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-12 lg:pt-32"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full-screen Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/images/arxiki.jpg"
          className="object-cover w-full h-full"
        >
          <source src="/download.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle Gradient Overlay */}
        <div className={`absolute inset-0 bg-[#002B5B]/30 mix-blend-multiply transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100 md:opacity-100' : 'opacity-100 md:opacity-0'}`} />
        <div className={`absolute inset-0 bg-gradient-to-r from-[#002B5B]/60 to-transparent transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100 md:opacity-100' : 'opacity-100 md:opacity-0'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-end">
        <div className="flex items-center justify-start flex-1">
          
          {/* Left Content Column - Glassmorphism Card */}
          <div 
            className={`w-full max-w-2xl text-left p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-700 ease-out ${isHovered ? 'opacity-100 md:opacity-100 md:translate-x-0' : 'opacity-100 md:opacity-0 md:-translate-x-8'}`}
          >
            <h1 className="text-[2.75rem] md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
              Η Σίγουρη Επιλογή<br />
              προς την Επιτυχία
            </h1>
            
            <p className="text-lg md:text-xl text-white/95 mb-10 leading-relaxed font-medium drop-shadow-sm max-w-xl">
              Ο Φροντιστηριακός Όμιλος ΕΝΑ σας οδηγεί στην αριστεία με έμπειρο διδακτικό προσωπικό και σύγχρονα προγράμματα σπουδών για Γυμνάσιο, Λύκειο & ΕΠΑΛ.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#002B5B] text-[15px] font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
              >
                <span>Υπολογισμός Μορίων</span>
                <FileText size={18} className="text-[#e74c3c]" />
              </Link>
              
              <Link
                href="/success"
                className="flex items-center justify-center px-7 py-3.5 bg-transparent text-white border-2 border-white/80 text-[15px] font-bold rounded-full hover:bg-white/10 transition-all shadow-sm"
              >
                Δείτε τους Επιτυχόντες
              </Link>
            </div>
          </div>

        </div>

        {/* Video Controls Desktop */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsMuted(!isMuted)}
          className="hidden md:flex ml-4 mb-4 p-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 hover:scale-105 transition-all shadow-lg items-center justify-center group/mute"
          aria-label={isMuted ? "Ενεργοποίηση ήχου" : "Απενεργοποίηση ήχου"}
        >
          {isMuted ? <VolumeX size={24} className="opacity-80 group-hover/mute:opacity-100" /> : <Volume2 size={24} className="opacity-80 group-hover/mute:opacity-100" />}
        </motion.button>
      </div>

      {/* Video Controls Mobile */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsMuted(!isMuted)}
        className="md:hidden absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all shadow-lg z-20 flex items-center justify-center"
        aria-label={isMuted ? "Ενεργοποίηση ήχου" : "Απενεργοποίηση ήχου"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </section>
  );
}
