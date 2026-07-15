import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Layout, Home, LogOut, FileText, Settings2 } from "lucide-react";
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
    <div className="flex h-screen bg-gray-100">
      <SessionGuard />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800">Painel BICT</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Home className="h-5 w-5" />
            Início
          </Link>
          <Link href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Layout className="h-5 w-5" />
            Gerenciar Menus
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings2 className="h-5 w-5" />
            Configurações
          </Link>
          <Link href="/admin/paginas" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <FileText className="h-5 w-5" />
            Páginas
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
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
