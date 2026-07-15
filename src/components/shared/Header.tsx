import { db } from "@/lib/db";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, User } from "lucide-react";

export default async function Header() {
  const configuracoes = await db.configuracao.findMany();
  const logo = configuracoes.find(c => c.chave === "logo_url")?.valor || "BICT";
  
  const menuPublico = await db.menu.findUnique({
    where: { nome: "Menu Principal" },
    include: { itens: true }
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 dark:text-blue-400">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm">
            {logo.charAt(0)}
          </div>
          <span>{logo}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuPublico?.itens.map(item => (
            <Link 
              key={item.id} 
              href={item.url}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-full transition-colors shadow-md shadow-blue-500/20"
            >
              <User className="w-4 h-4" />
              Área Restrita
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button className="p-2 text-slate-600 dark:text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
