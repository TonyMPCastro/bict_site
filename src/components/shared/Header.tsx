import { db } from "@/lib/db";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, ChevronDown } from "lucide-react";

export default async function Header() {
  let configuracoes: { chave: string; valor: string }[] = [];
  let menuPublico: Awaited<ReturnType<typeof db.menu.findUnique>> | null = null;

  try {
    configuracoes = await db.configuracao.findMany();
    menuPublico = await db.menu.findUnique({
      where: { nome: "principal" },
      include: {
        itens: {
          where: { parentId: null },
          orderBy: { ordem: "asc" },
          include: {
            subitens: {
              orderBy: { ordem: "asc" },
            },
          },
        },
      },
    });
  } catch {
    // Banco indisponível (ex: build time sem DB). Usa valores padrão.
  }

  const logo = configuracoes.find((c) => c.chave === "logo_url")?.valor || "BICT";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/cropped-bict-azul-1.png"
            alt="Logo BICT"
            className="h-10 w-auto"
          />
          <span className="hidden lg:block font-bold text-sm text-blue-900 dark:text-blue-100 max-w-[200px] leading-tight">
            BACHARELADO INTERDISCIPLINAR EM CIÊNCIA E TECNOLOGIA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuPublico?.itens.map((item) => (
            <div key={item.id} className="relative group">
              <Link
                href={item.url}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
              >
                {item.label}
                {item.subitens.length > 0 && <ChevronDown className="w-4 h-4" />}
              </Link>

              {item.subitens.length > 0 && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-1 transition-all duration-200 z-50 overflow-hidden">
                  <div className="py-2">
                    {item.subitens.map((sub) => (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
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
