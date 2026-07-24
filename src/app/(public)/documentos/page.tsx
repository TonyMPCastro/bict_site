import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Download, Folder, ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Repositório de Documentos | BICT",
  description: "Acesse e faça o download de regulamentos, PPCs, editais e formulários oficiais do BICT.",
};

export default async function PublicDocumentosPage() {
  const documentos = await db.documento.findMany({
    where: { publico: true },
    include: { categoria: true },
    orderBy: { criadoEm: 'desc' }
  });

  const categorias = await db.categoriaDoc.findMany({
    orderBy: { nome: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-28 pb-14">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Repositório de Documentos
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            Regulamentos institucionais, Projeto Pedagógico do Curso (PPC), formulários e editais do BICT.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {documentos.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
              Nenhum documento disponível no momento.
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Os documentos públicos cadastrados no sistema serão exibidos aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {doc.categoria?.nome || 'Geral'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      {doc.tipoArquivo || 'PDF'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-start gap-2">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    {doc.titulo}
                  </h3>

                  {doc.descricao && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {doc.descricao}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Atualizado em {new Date(doc.criadoEm).toLocaleDateString('pt-BR')}
                  </span>

                  <a
                    href={doc.arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
