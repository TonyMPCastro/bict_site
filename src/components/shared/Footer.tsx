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
                className="h-12 w-auto bg-transparent dark:bg-white rounded p-1"
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
            <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">Secretaria</strong>
                <p className="flex items-center gap-2 mt-1"><Phone className="w-4 h-4" /> (98) 3272-9166</p>
                <p className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4" /> <a href="mailto:secretaria.bct@ufma.br" className="hover:text-blue-600 dark:hover:text-blue-400">secretaria.bct@ufma.br</a></p>
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">Coordenação</strong>
                <p className="flex items-center gap-2 mt-1"><Phone className="w-4 h-4" /> (98) 3272-9167</p>
                <p className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4" /> <a href="mailto:bct@ufma.br" className="hover:text-blue-600 dark:hover:text-blue-400">bct@ufma.br</a></p>
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">Suporte Digital</strong>
                <p className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4" /> <a href="mailto:bictdigital.ufma@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400">bictdigital.ufma@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-500 dark:text-slate-400 text-sm group">
          <p>
            {footerInfo}
            <span className="inline-block ml-2 text-[10px] text-primary/40 " title="Desenvolvido com carinho">ampc</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
