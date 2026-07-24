import { db } from "@/lib/db";
import Link from "next/link";
import { Search, Newspaper, FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resultados da Busca | BICT",
  description: "Busque por notícias, documentos e páginas do BICT.",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BuscaPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || "";

  if (!query) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Search className="w-16 h-16 text-slate-300 dark:text-slate-700" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          O que você está procurando?
        </h1>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          Use a barra de busca no topo da página para encontrar notícias, documentos ou informações sobre os cursos do BICT.
        </p>
      </div>
    );
  }

  // Buscar Notícias
  const noticias = await db.post.findMany({
    where: {
      publicado: true,
      OR: [
        { titulo: { contains: query } },
        { resumo: { contains: query } },
        { conteudo: { contains: query } },
      ],
    },
    orderBy: { dataPublicacao: "desc" },
    take: 10,
    select: {
      id: true,
      titulo: true,
      slug: true,
      resumo: true,
      dataPublicacao: true,
    },
  });

  // Buscar Documentos
  const documentos = await db.documento.findMany({
    where: {
      publico: true,
      OR: [
        { titulo: { contains: query } },
        { descricao: { contains: query } },
      ],
    },
    orderBy: { criadoEm: "desc" },
    take: 10,
    include: { categoria: true },
  });

  const temResultados = noticias.length > 0 || documentos.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 min-h-screen">
      <header className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          Resultados para "{query}"
        </h1>
        <p className="text-slate-500">
          Encontramos {noticias.length} notícia(s) e {documentos.length} documento(s).
        </p>
      </header>

      {!temResultados ? (
        <div className="text-center py-12 space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
            Nenhum resultado encontrado
          </h2>
          <p className="text-sm text-slate-500">
            Tente buscar com palavras-chave diferentes ou mais curtas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Coluna Notícias */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Newspaper className="w-5 h-5 text-primary" />
              Notícias
            </h2>
            {noticias.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Nenhuma notícia encontrada.</p>
            ) : (
              <div className="space-y-4">
                {noticias.map((noticia) => (
                  <Link
                    key={noticia.id}
                    href={`/noticias/${noticia.slug}`}
                    className="block group bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-md"
                  >
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-2">
                      {noticia.titulo}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {noticia.resumo}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-primary">
                      Ler Notícia <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Coluna Documentos */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Documentos & Editais
            </h2>
            {documentos.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Nenhum documento encontrado.</p>
            ) : (
              <div className="space-y-4">
                {documentos.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full mb-2 inline-block">
                          {doc.categoria.nome}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors line-clamp-2">
                          {doc.titulo}
                        </h3>
                        {doc.descricao && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {doc.descricao}
                          </p>
                        )}
                      </div>
                      <FileText className="w-8 h-8 text-slate-200 dark:text-slate-800 shrink-0 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
