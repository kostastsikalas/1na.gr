"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FileUp, Save, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

const FIELD_MAP: Record<string, string> = {
  "1": "Ανθρωπιστικών Σπουδών",
  "2": "Θετικών Σπουδών",
  "3": "Σπουδών Υγείας",
  "4": "Σπουδών Οικονομίας & Πληροφορικής",
};

export default function CalculatorAdmin() {
  const [gelFile, setGelFile] = useState<File | null>(null);
  const [epalFile, setEpalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ gel: number; epal: number } | null>(null);
  
  const supabase = createClient();

  // Βοηθητική συνάρτηση για την καθαρότητα της πόλης (αφαιρεί παρενθέσεις)
  const cleanCity = (name: string) => {
    const match = name.match(/\(([^)]+)\)$/);
    if (match) {
      const city = match[1];
      return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    }
    return "Άγνωστο";
  };

  const handleUpdate = async () => {
    if (!gelFile && !epalFile) {
      setError("Παρακαλώ επιλέξτε τουλάχιστον ένα αρχείο Excel.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const schools: { name: string; institution: string; city: string; field: string; coefficients: number[]; base2025: number; }[] = [];
      let gelCount = 0;
      let epalCount = 0;

      // Επεξεργασία ΓΕΛ
      if (gelFile) {
        const gelData = await gelFile.arrayBuffer();
        const gelWorkbook = XLSX.read(gelData, { type: "array" });
        const gelSheet = gelWorkbook.Sheets[gelWorkbook.SheetNames[0]];
        const gelRows = XLSX.utils.sheet_to_json(gelSheet, { header: 1 }) as unknown[][];
        
        // Ξεκινάμε από τη γραμμή 3 (index 2) επειδή υπάρχουν headers
        for (let i = 2; i < gelRows.length; i++) {
          const row = gelRows[i];
          if (!row || row.length < 5) continue;
          
          if (row[3] === "ΓΕΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.") {
            const name = String(row[2]).trim();
            const inst = String(row[1]).trim();
            const city = cleanCity(name);
            const fieldsStr = String(row[4]).trim();
            const basePoints = row[12]; // Η βάση (ΒΑΘΜΟΣ ΤΕΛΕΥΤΑΙΟΥ)
            
            if (basePoints === undefined || basePoints === null || isNaN(Number(basePoints))) continue;

            const fieldsArray = fieldsStr.split("/");
            for (const f of fieldsArray) {
              const mappedField = FIELD_MAP[f.trim()];
              if (mappedField) {
                schools.push({
                  name,
                  institution: inst,
                  city,
                  field: mappedField,
                  coefficients: [0.25, 0.25, 0.25, 0.25], // Default συντελεστές
                  base2025: Number(basePoints),
                });
                gelCount++;
              }
            }
          }
        }
      }

      // Επεξεργασία ΕΠΑΛ
      if (epalFile) {
        const epalData = await epalFile.arrayBuffer();
        const epalWorkbook = XLSX.read(epalData, { type: "array" });
        const epalSheet = epalWorkbook.Sheets[epalWorkbook.SheetNames[0]];
        const epalRows = XLSX.utils.sheet_to_json(epalSheet, { header: 1 }) as unknown[][];
        
        for (let i = 2; i < epalRows.length; i++) {
          const row = epalRows[i];
          if (!row || row.length < 5) continue;
          
          if (row[3] === "ΕΠΑΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.") {
            const name = String(row[2]).trim();
            const inst = String(row[1]).trim();
            const city = cleanCity(name);
            const basePoints = row[11]; // Στο ΕΠΑΛ η βάση είναι στη στήλη 11 (index 11)
            
            if (basePoints === undefined || basePoints === null || isNaN(Number(basePoints))) continue;

            schools.push({
              name,
              institution: inst,
              city,
              field: "ΕΠΑΛ",
              coefficients: [0.25, 0.25, 0.25, 0.25],
              base2025: Number(basePoints),
            });
            epalCount++;
          }
        }
      }

      if (schools.length === 0) {
        throw new Error("Δεν βρέθηκε καμία έγκυρη σχολή. Ελέγξτε τη μορφή των Excel.");
      }

      // Αποθήκευση στο Supabase Storage (αντικαθιστά το παλιό αρχείο)
      const jsonBlob = new Blob([JSON.stringify(schools)], { type: "application/json" });
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload("calculator_bases.json", jsonBlob, {
          upsert: true, // Αντικαθιστά το υπάρχον αν υπάρχει
          contentType: "application/json",
        });

      if (uploadError) {
        throw new Error("Σφάλμα κατά την αποθήκευση στο Storage: " + uploadError.message);
      }

      setStats({ gel: gelCount, epal: epalCount });
      setSuccess(true);
      setGelFile(null);
      setEpalFile(null);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Προέκυψε ένα άγνωστο σφάλμα κατά την επεξεργασία.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ανανέωση Βάσεων Υπολογιστή</h1>
        <p className="text-gray-500 mt-2">
          Ανεβάστε τα επίσημα Excel του Υπουργείου (ΓΕΛ και ΕΠΑΛ) για να ενημερώσετε δυναμικά τις βάσεις του Υπολογιστή Μορίων στην ιστοσελίδα.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Οδηγίες */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex gap-3">
          <AlertTriangle className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-900 leading-relaxed">
            <strong>Σημαντικό:</strong> Το σύστημα περιμένει τη δομή Excel που χρησιμοποιεί το Υπουργείο Παιδείας. 
            Σιγουρευτείτε ότι κατεβάζετε τα αρχεία για τη &quot;ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜΕΡΗΣΙΩΝ&quot;. 
            Μπορείτε να ανεβάσετε είτε μόνο του ΓΕΛ, είτε του ΕΠΑΛ, είτε και τα δύο.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Uploader ΓΕΛ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Αρχείο ΓΕΛ (.xls, .xlsx)</label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${gelFile ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-[#213576] hover:bg-gray-50'}`}>
              <input
                type="file"
                accept=".xls,.xlsx"
                className="hidden"
                id="gel-upload"
                onChange={(e) => setGelFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="gel-upload" className="cursor-pointer flex flex-col items-center">
                <FileUp className={`w-8 h-8 mb-2 ${gelFile ? 'text-emerald-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${gelFile ? 'text-emerald-700' : 'text-gray-600'}`}>
                  {gelFile ? gelFile.name : "Επιλογή Excel ΓΕΛ"}
                </span>
              </label>
            </div>
          </div>

          {/* Uploader ΕΠΑΛ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Αρχείο ΕΠΑΛ (.xls, .xlsx)</label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${epalFile ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-[#213576] hover:bg-gray-50'}`}>
              <input
                type="file"
                accept=".xls,.xlsx"
                className="hidden"
                id="epal-upload"
                onChange={(e) => setEpalFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="epal-upload" className="cursor-pointer flex flex-col items-center">
                <FileUp className={`w-8 h-8 mb-2 ${epalFile ? 'text-emerald-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${epalFile ? 'text-emerald-700' : 'text-gray-600'}`}>
                  {epalFile ? epalFile.name : "Επιλογή Excel ΕΠΑΛ"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm font-medium mb-6 flex gap-2 items-center">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {success && stats && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-6 flex flex-col gap-1">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 size={18} />
              Η ενημέρωση ολοκληρώθηκε επιτυχώς!
            </div>
            <p className="ml-6">Ενημερώθηκαν <strong>{stats.gel}</strong> τμήματα ΓΕΛ και <strong>{stats.epal}</strong> τμήματα ΕΠΑΛ.</p>
            <p className="ml-6 mt-1 text-xs text-emerald-600">Οι αλλαγές εμφανίζονται ήδη live στον Υπολογιστή Μορίων.</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={loading || (!gelFile && !epalFile)}
            className="flex items-center gap-2 bg-[#213576] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a2d66] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Επεξεργασία..." : "Ενημέρωση Βάσεων"}
          </button>
        </div>
      </div>
    </div>
  );
}
