"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-12 lg:pt-32">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/arxiki.jpg" 
          alt="Φροντιστήριο ΕΝΑ Αρχική" 
          fill
          className="object-cover"
          priority
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002B5B]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-start">
          
          {/* Left Content Column - Glassmorphism Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl text-left p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
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
                className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#002B5B] text-[15px] font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
              >
                <span>Υπολογισμός Μορίων</span>
                <FileText size={18} className="text-[#e74c3c]" />
              </Link>
              
              <Link
                href="#success"
                className="flex items-center justify-center px-7 py-3.5 bg-transparent text-white border-2 border-white/80 text-[15px] font-bold rounded-full hover:bg-white/10 transition-all shadow-sm"
              >
                Δείτε τους Επιτυχόντες
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
