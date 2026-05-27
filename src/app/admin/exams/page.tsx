"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, Upload, FileText } from "lucide-react";

type ExamArchive = {
  id: string;
  year: string;
  category: string;
  subject: string;
  file_url: string;
};

export default function AdminExams() {
  const [exams, setExams] = useState<ExamArchive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  // Form states
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState("Θετικών Σπουδών");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("exam_archives")
      .select("*")
      .order("year", { ascending: false });
    
    if (!error && data) {
      setExams(data);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !file) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `exams/${year}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from("exam_archives")
        .insert([{ 
          year, 
          category, 
          subject, 
          file_url: publicUrlData.publicUrl 
        }]);

      if (dbError) throw dbError;

      // Reset form
      setSubject("");
      setFile(null);
      fetchExams(); // Refresh list
      
    } catch (error: any) {
      alert("Σφάλμα: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το θέμα;")) return;

    const { error } = await supabase
      .from("exam_archives")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchExams();
    } else {
      alert("Σφάλμα κατά τη διαγραφή.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Διαχείριση Θεμάτων</h1>
        <p className="text-gray-600 mt-2">Ανεβάστε αρχεία PDF με τα θέματα των Πανελλαδικών.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Νέο Αρχείο Θεμάτων</h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Έτος</label>
                <input 
                  type="text" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="π.χ. 2026"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Κατεύθυνση / Κατηγορία</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                >
                  <option value="Θετικών Σπουδών">Θετικών Σπουδών</option>
                  <option value="Ανθρωπιστικών Σπουδών">Ανθρωπιστικών Σπουδών</option>
                  <option value="Σπουδών Υγείας">Σπουδών Υγείας</option>
                  <option value="Σπουδών Οικονομίας & Πληροφορικής">Σπουδών Οικονομίας & Πληροφορικής</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Μάθημα</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="π.χ. Μαθηματικά"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Αρχείο PDF</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#213576] transition-colors relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#213576] hover:text-[#1a2b60] focus-within:outline-none">
                        <span>{file ? file.name : "Επιλέξτε αρχείο"}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                      </label>
                    </div>
                    {!file && <p className="text-xs text-gray-500">Μόνο αρχεία PDF</p>}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !file}
                className="w-full bg-[#213576] hover:bg-[#1a2b60] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Ανέβασμα & Αποθήκευση
              </button>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Αρχείο Θεμάτων ({exams.length})</h2>
            </div>
            
            <div className="p-0">
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#213576]" />
                </div>
              ) : exams.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  Δεν υπάρχουν ανεβασμένα θέματα.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
                  {exams.map((exam) => (
                    <li key={exam.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-1">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{exam.subject}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-semibold text-[#213576]">{exam.year}</span>
                            <span>•</span>
                            <span>{exam.category}</span>
                          </div>
                          <a href={exam.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">Προβολή PDF</a>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(exam.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Διαγραφή"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
