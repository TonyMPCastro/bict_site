import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Layout, Home, LogOut, FileText, Settings2, Newspaper } from "lucide-react";
import LogoutButton from "./LogoutButton";
import SessionGuard from "./SessionGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <SessionGuard />
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-colors">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
          <Link href="/admin" className="text-xl font-bold text-primary dark:text-primary">
            Painel BICT
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Home className="h-5 w-5" />
            Visão Geral
          </Link>
          <Link href="/admin/paginas" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <FileText className="h-5 w-5" />
            Páginas
          </Link>
          <Link href="/admin/noticias" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Newspaper className="h-5 w-5" />
            Notícias
          </Link>
          <Link href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Layout className="h-5 w-5" />
            Menus
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Settings2 className="h-5 w-5" />
            Configurações
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{session.user?.name || "Administrador"}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{session.user?.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between lg:hidden">
            <span className="text-lg font-bold text-gray-800">Painel BICT</span>
        </header>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
