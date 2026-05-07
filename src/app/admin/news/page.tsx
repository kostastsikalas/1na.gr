"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, Upload, ImageIcon } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  category?: string;
  date_string?: string;
  description?: string;
  created_at: string;
  images: string[];
};

export default function AdminNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dateString, setDateString] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setNewsList(data);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        // Upload all selected files
        const uploadPromises = Array.from(files).map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `news/${Date.now()}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
          return data.publicUrl;
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      // Save to Database
      const { error: dbError } = await supabase
        .from("news")
        .insert([{ 
          title, 
          category,
          date_string: dateString,
          description,
          images: imageUrls 
        }]);

      if (dbError) throw dbError;

      // Reset form
      setTitle("");
      setCategory("");
      setDateString("");
      setDescription("");
      setFiles(null);
      // Reset the file input manually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchNews(); // Refresh list
      
    } catch (error: any) {
      alert("Σφάλμα: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το άλμπουμ;")) return;

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchNews();
    } else {
      alert("Σφάλμα κατά τη διαγραφή.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Νέα & Εκδηλώσεις</h1>
        <p className="text-gray-600 mt-2">Προσθέστε νέες εκδηλώσεις και ανεβάστε φωτογραφικό υλικό (Gallery).</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Νέα Εκδήλωση</h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος Εκδήλωσης</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576]"
                  placeholder="π.χ. Κοπή Πίτας 2026"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576]"
                    placeholder="π.χ. Εκπαιδευτική Εκδρομή"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία / Σχόλιο</label>
                  <input 
                    type="text" 
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576]"
                    placeholder="π.χ. Μάρτιος 2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] min-h-[80px]"
                  placeholder="Σύντομη περιγραφή της εκδήλωσης..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Φωτογραφίες</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#213576] transition-colors relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#213576] hover:text-[#1a2b60] focus-within:outline-none">
                        <span>{files && files.length > 0 ? `${files.length} αρχεία επιλέχθηκαν` : "Επιλέξτε φωτογραφίες"}</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*" 
                          multiple 
                          onChange={(e) => setFiles(e.target.files)} 
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">Μπορείτε να επιλέξετε πολλαπλές εικόνες (png, jpg)</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#213576] hover:bg-[#1a2b60] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Δημιουργία & Ανέβασμα
              </button>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Λίστα Εκδηλώσεων ({newsList.length})</h2>
            </div>
            
            <div className="p-0">
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#213576]" />
                </div>
              ) : newsList.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  Δεν υπάρχουν εκδηλώσεις.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
                  {newsList.map((item) => (
                    <li key={item.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[#213576]">{item.title}</h3>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Διαγραφή Ολόκληρου του Άλμπουμ"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{item.category || "Χωρίς Κατηγορία"}</span>
                        <span className="mx-1">•</span>
                        <span>{item.date_string || new Date(item.created_at).toLocaleDateString('el-GR')}</span>
                        <span className="mx-1">•</span>
                        <ImageIcon className="w-4 h-4 ml-1" />
                        <span>{item.images?.length || 0} Φωτογραφίες</span>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                      )}

                      {item.images && item.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {item.images.map((img, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              key={idx} 
                              src={img} 
                              alt="Gallery preview" 
                              className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-md border border-gray-200 shrink-0" 
                            />
                          ))}
                        </div>
                      )}
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
