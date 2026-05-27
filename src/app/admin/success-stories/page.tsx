"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2 } from "lucide-react";

type SuccessStory = {
  id: string;
  name: string;
  school: string; // Used as PDF URL
  year: string;
};

export default function AdminSuccessStories() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  // Form states
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("success_stories")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setStories(data);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStories();
  }, [fetchStories]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !pdfFile) return;
    
    setIsSubmitting(true);

    // 1. Upload PDF
    const fileExt = pdfFile.name.split('.').pop();
    const fileName = `success_stories_${year}_${new Date().getTime()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, pdfFile);

    if (uploadError) {
      alert("Σφάλμα κατά το ανέβασμα του PDF: " + uploadError.message);
      setIsSubmitting(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    // 2. Insert record
    const { error } = await supabase
      .from("success_stories")
      .insert([{ 
        name: `Λίστα Επιτυχόντων ${year}`, 
        school: pdfUrl, 
        year 
      }]);

    if (!error) {
      setPdfFile(null);
      fetchStories(); // Refresh list
    } else {
      alert("Σφάλμα κατά την προσθήκη: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον επιτυχόντα;")) return;

    const { error } = await supabase
      .from("success_stories")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchStories();
    } else {
      alert("Σφάλμα κατά τη διαγραφή.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Διαχείριση Επιτυχόντων</h1>
        <p className="text-gray-600 mt-2">Προσθέστε ή διαγράψτε επιτυχόντες μαθητές από τη λίστα.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Νέος Επιτυχών</h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Αρχείο PDF Επιτυχόντων</label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Έτος</label>
                <input 
                  type="text" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="2026"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#213576] hover:bg-[#1a2b60] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Προσθήκη
              </button>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Λίστα Επιτυχόντων ({stories.length})</h2>
            </div>
            
            <div className="p-0">
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#213576]" />
                </div>
              ) : stories.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  Δεν υπάρχουν καταχωρημένοι επιτυχόντες. Προσθέστε τον πρώτο!
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {stories.map((story) => (
                    <li key={story.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{story.name}</h3>
                        <a href={story.school} target="_blank" rel="noopener noreferrer" className="text-sm text-[#213576] font-semibold hover:underline">Προβολή PDF</a>
                        {story.year && <span className="text-xs text-gray-500 mt-1 block">Έτος: {story.year}</span>}
                      </div>
                      <button 
                        onClick={() => handleDelete(story.id)}
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
