"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

const orientationGroups = {
  "Θετικών Σπουδών": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Μαθηματικά"],
  "Ανθρωπιστικών Σπουδών": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Αρχαία Ελληνικά", "Ιστορία", "Λατινικά"],
  "Σπουδών Υγείας": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Βιολογία"],
  "Σπουδών Οικονομίας & Πληροφορικής": ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Μαθηματικά", "Πληροφορική (ΑΕΠΠ)", "Οικονομία (ΑΟΘ)"],
};

type GroupType = keyof typeof orientationGroups;

export default function Calculator() {
  const [selectedGroup, setSelectedGroup] = useState<GroupType>("Θετικών Σπουδών");
  const [grades, setGrades] = useState<Record<string, number>>({
    "Νεοελληνική Γλώσσα & Λογοτεχνία": 18.2,
    "Φυσική": 19.0,
    "Χημεία": 18.8,
    "Μαθηματικά": 17.5,
  });

  const [totalPoints, setTotalPoints] = useState(18450);

  const currentSubjects = orientationGroups[selectedGroup];

  // Simple calculation for demonstration (sum * 250)
  // In a real app, this would use specific coefficients based on the chosen orientation group.
  useEffect(() => {
    let sum = 0;
    currentSubjects.forEach(subject => {
      sum += grades[subject] || 0;
    });
    setTotalPoints(Math.round(sum * 250));
  }, [grades, currentSubjects]);

  const handleGradeChange = (subject: string, value: string) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue > 20) numValue = 20;
    if (numValue < 0) numValue = 0;
    setGrades((prev) => ({ ...prev, [subject]: numValue }));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroup = e.target.value as GroupType;
    setSelectedGroup(newGroup);
    
    // Initialize any missing subjects with 15 as default
    setGrades(prev => {
      const newGrades = { ...prev };
      orientationGroups[newGroup].forEach(sub => {
        if (newGrades[sub] === undefined) {
          newGrades[sub] = 15.0;
        }
      });
      return newGrades;
    });
  };

  // Calculate SVG stroke dasharray for the semi-circle gauge
  const radius = 90;
  const circumference = Math.PI * radius; // Half circle
  const progress = (totalPoints / 20000) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <section id="calculator" className="py-24 bg-[#f4fbff] relative overflow-hidden">
      {/* Hexagon Background Pattern - Simplified with CSS */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-[8px] border-red-100 rounded-2xl rotate-45"></div>
        <div className="absolute top-40 right-20 w-48 h-48 border-[12px] border-blue-50 rounded-3xl rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 border-[6px] border-red-50 rounded-xl -rotate-12"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#002B5B] mb-3">Υπολογιστής Μορίων 2026</h2>
          <p className="text-gray-600 text-lg">Υπολόγισε τα μόριά σου για την Τριτοβάθμια Εκπαίδευση</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row gap-12">
          
          {/* Left Panel: Inputs */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-12">
            
            {/* Top Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Ομάδα Προσανατολισμού</label>
                <select 
                  value={selectedGroup}
                  onChange={handleGroupChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none bg-white"
                >
                  {Object.keys(orientationGroups).map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Ειδικά Μαθήματα</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none bg-white">
                  <option>None selected</option>
                  <option>Αγγλικά</option>
                  <option>Ελεύθερο & Γραμμικό Σχέδιο</option>
                </select>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#002B5B] mb-8">Βαθμολογία Μαθημάτων</h3>
            
            <div className="space-y-6">
              {currentSubjects.map((subject) => (
                <div key={subject} className="space-y-2">
                  <label className="block text-[15px] font-semibold text-gray-800">{subject}</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={grades[subject] || ""}
                      onChange={(e) => handleGradeChange(subject, e.target.value)}
                      className="w-24 px-3 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                      placeholder="π.χ. 18.2"
                    />
                    <div className="flex-1 relative flex items-center">
                      <span className="text-xs text-gray-400 absolute -left-4">0</span>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={grades[subject] || 0}
                        onChange={(e) => handleGradeChange(subject, e.target.value)}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002B5B]"
                      />
                      <span className="text-xs text-gray-400 absolute -right-5">20</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Gauge and Result */}
          <div className="flex-1 flex flex-col items-center justify-center pt-4 md:pt-0">
            <div className="relative w-[280px] h-[150px] flex items-end justify-center mb-6">
              {/* SVG Gauge */}
              <svg viewBox="0 0 200 110" className="absolute bottom-0 w-full h-full overflow-visible">
                {/* Background Track */}
                <path
                  d="M 10,100 A 90,90 0 0,1 190,100"
                  fill="none"
                  stroke="#002B5B"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Progress Track */}
                <path
                  d="M 10,100 A 90,90 0 0,1 190,100"
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              
              {/* Labels */}
              <span className="absolute -bottom-6 left-2 text-xs font-semibold text-gray-500">0</span>
              <span className="absolute -bottom-6 right-0 text-xs font-semibold text-gray-500">20,000</span>
              
              {/* Score inside gauge */}
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-[3.5rem] font-bold text-[#004aad] leading-none tracking-tight">
                  {totalPoints.toLocaleString('el-GR')}
                </span>
                <span className="text-xl font-bold text-[#002B5B] mt-1">Μόρια</span>
              </div>
            </div>

            <p className="text-gray-600 font-medium mt-10 mb-6 text-center">
              Βάση Εισαγωγής (Ελάχιστη): 10,250
            </p>

            <button className="w-full max-w-xs bg-red-400 hover:bg-red-500 text-[#002B5B] font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-400/30">
              <span>Δείτε τις Σχολές σας</span>
              <ArrowUpRight size={22} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
