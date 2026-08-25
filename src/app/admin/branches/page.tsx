"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, Pencil, X, MapPin as MapPinIcon } from "lucide-react";

type Branch = {
  id: string;
  region: string;
  name: string;
  address: string;
  city: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
  map_url: string | null;
  directions_url: string | null;
  sort_order: number;
};

const emptyForm = {
  region: "",
  name: "",
  address: "",
  city: "",
  phone: "",
  email: "",
  mapUrl: "",
  directionsUrl: "",
  sortOrder: "0",
};

export default function AdminBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setBranches(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    const fileInput = document.getElementById("branch-image-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const startEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setForm({
      region: branch.region,
      name: branch.name,
      address: branch.address,
      city: branch.city || "",
      phone: branch.phone || "",
      email: branch.email || "",
      mapUrl: branch.map_url || "",
      directionsUrl: branch.directions_url || "",
      sortOrder: String(branch.sort_order ?? 0),
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.region || !form.name || !form.address) return;

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = editingId
        ? branches.find((b) => b.id === editingId)?.image ?? null
        : null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `branches/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const payload = {
        region: form.region,
        name: form.name,
        address: form.address,
        city: form.city || null,
        phone: form.phone || null,
        email: form.email || null,
        image: imageUrl,
        map_url: form.mapUrl || null,
        directions_url: form.directionsUrl || null,
        sort_order: Number(form.sortOrder) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from("branches").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("branches").insert([payload]);
        if (error) throw error;
      }

      resetForm();
      fetchBranches();
    } catch (error: any) {
      alert("Σφάλμα: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το παράρτημα;")) return;

    const { error } = await supabase.from("branches").delete().eq("id", id);

    if (!error) {
      if (editingId === id) resetForm();
      fetchBranches();
    } else {
      alert("Σφάλμα κατά τη διαγραφή.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Παραρτήματα</h1>
        <p className="text-gray-600 mt-2">
          Διαχειριστείτε τα παραρτήματα του φροντιστηρίου. Οι αλλαγές εμφανίζονται αυτόματα στη σελίδα
          Επικοινωνίας και στο footer της ιστοσελίδας.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Επεξεργασία Παραρτήματος" : "Νέο Παράρτημα"}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  type="button"
                  className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm"
                >
                  <X className="w-4 h-4" /> Ακύρωση
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Περιοχή / Ενότητα
                </label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="π.χ. ΗΡΑΚΛΕΙΟ ΚΡΗΤΗΣ"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Παραρτήματα με την ίδια περιοχή εμφανίζονται μαζί στη σελίδα Επικοινωνίας.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα Παραρτήματος</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="π.χ. Κτήριο 1 (Κέντρο)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Διεύθυνση</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="π.χ. Γραμβούσης 5 & Καγιαμπή"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Πόλη</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="π.χ. Ηράκλειο Κρήτης"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Τηλέφωνο</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                    placeholder="2810 285726"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                    placeholder="info@1na.gr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps — Embed URL (για τον χάρτη)
                </label>
                <input
                  type="text"
                  value={form.mapUrl}
                  onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="https://maps.google.com/maps?q=...&output=embed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps — Σύνδεσμος Κατεύθυνσης
                </label>
                <input
                  type="text"
                  value={form.directionsUrl}
                  onChange={(e) => setForm({ ...form, directionsUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="https://www.google.com/maps/search/?api=1&query=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ανοίξτε το παράρτημα στο Google Maps, πατήστε &quot;Κοινοποίηση&quot; για τον σύνδεσμο
                  κατεύθυνσης, και &quot;Ενσωμάτωση χάρτη&quot; για το embed URL.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Σειρά Εμφάνισης</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Φωτογραφία (εμφανίζεται στο footer)
                </label>
                <input
                  id="branch-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213576] text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#213576]/10 file:text-[#213576] hover:file:bg-[#213576]/20"
                />
                {editingId && !imageFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Αφήστε κενό για να διατηρηθεί η υπάρχουσα φωτογραφία.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#213576] hover:bg-[#1a2b60] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : editingId ? (
                  <Pencil className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {editingId ? "Αποθήκευση Αλλαγών" : "Προσθήκη Παραρτήματος"}
              </button>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Λίστα Παραρτημάτων ({branches.length})</h2>
            </div>

            <div className="p-0">
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#213576]" />
                </div>
              ) : branches.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  Δεν υπάρχουν καταχωρημένα παραρτήματα. Προσθέστε το πρώτο!
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
                  {branches.map((branch) => (
                    <li
                      key={branch.id}
                      className="p-4 sm:px-6 hover:bg-gray-50 transition-colors group flex items-start gap-4"
                    >
                      {branch.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={branch.image}
                          alt={branch.name}
                          className="h-16 w-16 object-cover rounded-lg border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 text-gray-300">
                          <MapPinIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              {branch.region}
                            </span>
                            <h3 className="text-lg font-bold text-[#213576]">{branch.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => startEdit(branch)}
                              className="p-2 text-gray-400 hover:text-[#213576] hover:bg-[#213576]/5 rounded-lg transition-all"
                              title="Επεξεργασία"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(branch.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Διαγραφή"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {branch.address}
                          {branch.city ? `, ${branch.city}` : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {[branch.phone, branch.email].filter(Boolean).join(" · ")}
                        </p>
                      </div>
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
