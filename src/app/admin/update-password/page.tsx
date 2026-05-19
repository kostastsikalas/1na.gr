"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setMessage("Ο κωδικός σας ενημερώθηκε με επιτυχία! Μεταφορά στο Dashboard...");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#213576]">
          Δημιουργία νέου κωδικού
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Πληκτρολογήστε τον νέο σας κωδικό πρόσβασης
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleUpdate}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-md text-sm text-center font-medium border border-emerald-100">
                {message}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Νέος Κωδικός
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-[#213576] focus:border-[#213576] block w-full pl-10 pr-10 sm:text-sm border border-gray-300 rounded-md py-3 bg-white text-gray-900 shadow-sm"
                  placeholder="Τουλάχιστον 6 χαρακτήρες"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#213576] hover:bg-[#1a2b60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#213576] disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Ενημέρωση..." : "Αποθήκευση νέου κωδικού"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
