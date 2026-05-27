"use client";

import Image from "next/image";
import { Phone, MapPin } from "lucide-react";

const branches = [
  {
    id: "center",
    title: "ΗΡΑΚΛΕΙΟ (Κέντρο)",
    address: "Οδός Καγιαμπή 2",
    phone: "2810 123456",
    image: "/images/branch_center.png",
  },
  {
    id: "east",
    title: "ΗΡΑΚΛΕΙΟ (Ανατολικά)",
    address: "Λεωφ. Κνωσού 150",
    phone: "2810 654321",
    image: "/images/branch_east.png",
  },
  {
    id: "athens",
    title: "ΑΘΗΝΑ",
    address: "Ησιόδου 18, Άλιμος",
    phone: "210 991 3433",
    image: "/images/athens.png",
  },
];

export default function Branches() {
  return (
    <section id="branches" className="w-full bg-gradient-to-b from-[#0a4b86] to-[#052b52] pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 tracking-wide">
          ΤΑ ΠΑΡΑΡΤΗΜΑΤΑ ΜΑΣ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {branches.map((branch) => (
            <div 
              key={branch.id} 
              className="bg-[#1c3851] rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex flex-col transform transition-transform hover:-translate-y-1"
            >
              <div className="relative h-56 w-full">
                <Image 
                  src={branch.image} 
                  alt={branch.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="p-8 flex flex-col items-center flex-grow">
                <h3 className="text-red-400 font-bold text-[1.1rem] mb-2 text-center">{branch.title}</h3>
                <p className="text-white text-[15px] mb-8 text-center">{branch.address}</p>
                
                <div className="w-full space-y-4 mb-8 text-sm">
                  <div className="flex items-center gap-4 text-gray-300 ml-4">
                    <Phone className="text-red-400 w-5 h-5 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-300 ml-4">
                    <MapPin className="text-red-400 w-5 h-5 shrink-0" />
                    <span>Χάρτης</span>
                  </div>
                </div>
                
                <button className="mt-auto w-full bg-[#18589c] text-white py-3.5 rounded-xl hover:bg-[#2069b3] transition-colors font-medium shadow-md">
                  Δείτε στον Χάρτη
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2026 Φροντιστηριακός Όμιλος ΕΝΑ.</p>
          <div className="flex items-center gap-5 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
