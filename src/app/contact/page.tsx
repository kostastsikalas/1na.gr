"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const branches = [
  {
    region: "ΗΡΑΚΛΕΙΟ ΚΡΗΤΗΣ",
    locations: [
      {
        name: "Κτήριο 1 (Κέντρο)",
        address: "Γραμβούσης 5 & Καγιαμπή",
        phone: "2810 285726",
        email: "info@1na.gr",
        mapUrl: "https://maps.google.com/maps?q=Γραμβούσης%205,%20Ηράκλειο&t=&z=16&ie=UTF8&iwloc=&output=embed",
      },
      {
        name: "Κτήριο 2 (Κνωσού)",
        address: "Λεωφ. Κνωσού 187",
        phone: "2810 212333",
        email: "knwssos@1na.gr",
        mapUrl: "https://maps.google.com/maps?q=Λεωφ.%20Κνωσού%20187,%20Ηράκλειο&t=&z=16&ie=UTF8&iwloc=&output=embed",
      },
    ],
  },
  {
    region: "ΑΤΤΙΚΗ: ΑΛΙΜΟΣ – ΑΓ. ΔΗΜΗΤΡΙΟΣ",
    locations: [
      {
        name: "Κτήριο 1",
        address: "Ησιόδου 18",
        phone: "210 9913433",
        email: "1isiodou@ena.edu.gr",
        mapUrl: "https://maps.google.com/maps?q=Ησιόδου%2018,%20Άλιμος&t=&z=16&ie=UTF8&iwloc=&output=embed",
      },
      {
        name: "Κτήριο 2",
        address: "Θεομήτορος 54",
        phone: "210 9820561",
        email: "1theomitoros@ena.edu.gr",
        mapUrl: "https://maps.google.com/maps?q=Θεομήτορος%2054,%20Άλιμος&t=&z=16&ie=UTF8&iwloc=&output=embed",
      },
    ],
  },
];

export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-[#f4fbff] via-white to-[#eef5ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213576]/8 text-[#213576] text-[13px] font-semibold rounded-full mb-6">
            <MapPin size={15} />
            Επικοινωνία & Παραρτήματα
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] mb-6 tracking-tight">
            Είμαστε δίπλα σας
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Βρείτε μας στα παραρτήματά μας σε Ηράκλειο Κρήτης και Αττική. 
            Επικοινωνήστε μαζί μας για οποιαδήποτε απορία ή εγγραφή.
          </p>
        </motion.div>

        {/* Regions */}
        <div className="space-y-24">
          {branches.map((regionData, regionIdx) => (
            <motion.div 
              key={regionData.region}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: regionIdx * 0.1, duration: 0.5 }}
            >
              {/* Region Title */}
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-gray-200 flex-1"></div>
                <h2 className="text-xl md:text-2xl font-black text-[#213576] tracking-widest uppercase text-center">
                  {regionData.region}
                </h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
                {regionData.locations.map((loc, idx) => (
                  <div 
                    key={loc.name}
                    className="group bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-[#213576]/20 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-8 h-full">
                      
                      {/* Info Section */}
                      <div className="flex-1 flex flex-col justify-center space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-[#002B5B] mb-2">{loc.name}</h3>
                          <div className="w-12 h-1 bg-[#213576] rounded-full"></div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3 text-gray-600">
                            <div className="mt-1 w-8 h-8 rounded-full bg-[#213576]/10 flex items-center justify-center shrink-0 text-[#213576]">
                              <MapPin size={16} />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Διευθυνση</p>
                              <p className="font-medium text-[15px]">{loc.address}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 text-gray-600">
                            <div className="mt-1 w-8 h-8 rounded-full bg-[#213576]/10 flex items-center justify-center shrink-0 text-[#213576]">
                              <Phone size={16} />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Τηλεφωνο</p>
                              <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="font-medium text-[15px] hover:text-[#df6060] transition-colors block">
                                {loc.phone}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 text-gray-600">
                            <div className="mt-1 w-8 h-8 rounded-full bg-[#213576]/10 flex items-center justify-center shrink-0 text-[#213576]">
                              <Mail size={16} />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                              <a href={`mailto:${loc.email}`} className="font-medium text-[15px] hover:text-[#df6060] transition-colors break-all block">
                                {loc.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Map Section */}
                      <div className="w-full md:w-[300px] h-[250px] md:h-auto rounded-2xl overflow-hidden shadow-inner bg-gray-50 shrink-0 border border-gray-100 relative group-hover:shadow-lg transition-shadow duration-300">
                        <iframe 
                          src={loc.mapUrl}
                          className="absolute inset-0 w-full h-full" 
                          style={{ border: 0 }} 
                          allowFullScreen={true} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
