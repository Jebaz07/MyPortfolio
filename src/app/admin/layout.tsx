"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  Award,
  Mail,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && !pathname?.includes("/login")) {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated" && !pathname?.includes("/login")) {
    return null;
  }

  if (pathname?.includes("/login")) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/admin/login" });
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-black flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/5 border-r border-white/10 backdrop-blur-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-black">JW</span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">Admin Panel</p>
                <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{link.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-3 text-zinc-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gold transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center">
                <span className="text-xs font-bold text-black">JW</span>
              </div>
              <span className="text-sm text-zinc-400">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
