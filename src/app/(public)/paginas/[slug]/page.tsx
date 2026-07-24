import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { LandingPageRenderer } from "@/components/public/LandingPageRenderer";
import { LandingPageConfig } from "@/types/landing-page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pagina = await db.pagina.findUnique({
    where: { slug },
  });
  
  if (!pagina) {
    return { title: "Página não encontrada" };
  }

  return {
    title: `${pagina.titulo} | BICT`,
    description: pagina.descricao || `Página sobre ${pagina.titulo}`,
  };
}

export default async function PaginaDinamica({ params }: Props) {
  const { slug } = await params;
  const pagina = await db.pagina.findUnique({
    where: { slug, publicada: true },
    include: {
      secoes: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  if (!pagina) {
    notFound();
  }

  let landingConfig: LandingPageConfig | null = null;
  if (pagina.landingPageConfig) {
    try {
      landingConfig = JSON.parse(pagina.landingPageConfig);
    } catch {
      landingConfig = null;
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col pb-20 bg-white dark:bg-slate-950 transition-colors animate-fadeIn">
      {/* Cabeçalho da página */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 pt-12 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors font-medium bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            {pagina.titulo}
          </h1>
          {pagina.descricao && (
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {pagina.descricao}
            </p>
          )}
        </div>
      </section>
      
      {/* Conteúdo por Construtor de Blocos */}
      <div className="w-full flex-1">
        {landingConfig ? (
          <LandingPageRenderer config={landingConfig} />
        ) : (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="italic text-slate-500 dark:text-slate-400">
              Nenhum conteúdo disponível nesta página ainda.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
