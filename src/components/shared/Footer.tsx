import { db } from "@/lib/db";
import Link from "next/link";
import { Mail, Globe, Phone } from "lucide-react";

export default async function Footer() {
  let configuracoes: { chave: string; valor: string }[] = [];

  try {
    configuracoes = await db.configuracao.findMany();
  } catch {
    // Banco indisponível (ex: build time sem DB). Usa valores padrão.
  }

  const footerInfo =
    configuracoes.find((c) => c.chave === "footer_info")?.valor ||
    "© 2026 BICT. Todos os direitos reservados.";

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img
                src="/cropped-bict-azul-1.png"
                alt="Logo BICT"
                className="h-12 w-auto bg-white/10 rounded p-1"
              />
              <span className="font-bold text-sm text-blue-900 dark:text-blue-100 max-w-[250px] leading-tight">
                BACHARELADO INTERDISCIPLINAR EM CIÊNCIA E TECNOLOGIA
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Um sistema moderno para gestão do Bacharelado Interdisciplinar em Ciência e Tecnologia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Links Úteis</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Página Inicial</Link></li>
              <li><Link href="/login" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Área Restrita</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Contato</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-500 dark:text-slate-400 text-sm relative group">
          <p>{footerInfo}</p>
          <span className="absolute bottom-0 right-4 text-[10px] text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 cursor-default" title="Desenvolvido com carinho">ampc</span>
        </div>
      </div>
    </footer>
  );
}
