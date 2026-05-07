"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Newspaper, GraduationCap, FileText, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Νέα & Εκδηλώσεις", href: "/admin/news", icon: Newspaper },
    { name: "Επιτυχόντες", href: "/admin/success-stories", icon: GraduationCap },
    { name: "Αρχείο Θεμάτων", href: "/admin/exams", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#213576] text-white flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-black tracking-widest text-white">
            ΕΝ<span className="text-[#df6060]">Α</span> <span className="text-sm font-normal text-gray-300 block">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-white/10 text-white font-bold" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Αποσύνδεση
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
