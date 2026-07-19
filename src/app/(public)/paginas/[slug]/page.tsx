import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

import BannerBlock from "@/components/blocks/BannerBlock";
import RichTextBlock from "@/components/blocks/RichTextBlock";
import NoticeBlock from "@/components/blocks/NoticeBlock";
import NewsBlock from "@/components/blocks/NewsBlock";
import HeroBlock from "@/components/blocks/HeroBlock";
import FeaturesBlock from "@/components/blocks/FeaturesBlock";
import CtaBlock from "@/components/blocks/CtaBlock";
import DocumentsBlock from "@/components/blocks/DocumentsBlock";
import TeamBlock from "@/components/blocks/TeamBlock";
import FaqBlock from "@/components/blocks/FaqBlock";
import GalleryBlock from "@/components/blocks/GalleryBlock";
import VideoBlock from "@/components/blocks/VideoBlock";
import MapBlock from "@/components/blocks/MapBlock";
import ButtonsBlock from "@/components/blocks/ButtonsBlock";

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
      
      {/* Blocos da Página */}
      <div className="w-full flex-1">
        {pagina.secoes.length === 0 && (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="italic text-slate-500 dark:text-slate-400">
              Nenhum conteúdo disponível nesta página ainda.
            </p>
          </div>
        )}

        {pagina.secoes.map((secao) => {
          try {
            const data = secao.tipo === "TEXTO" ? null : JSON.parse(secao.conteudo);
            
            switch (secao.tipo) {
              case "BANNER":
                return <BannerBlock key={secao.id} data={data} />;
              case "TEXTO":
                return (
                  <section key={secao.id} className="py-12 md:py-16 bg-white dark:bg-slate-950">
                    <div className="container mx-auto px-4 max-w-4xl">
                      {secao.titulo && <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{secao.titulo}</h2>}
                      <div className="prose prose-slate dark:prose-invert md:prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl font-sans [&_p]:font-sans [&_span]:font-sans [&_*]:font-sans">
                        <RichTextBlock html={secao.conteudo} />
                      </div>
                    </div>
                  </section>
                );
              case "AVISOS":
                return <NoticeBlock key={secao.id} data={data} />;
              case "NOTICIAS":
                return <NewsBlock key={secao.id} data={data} />;
              case "HERO":
                return <HeroBlock key={secao.id} data={data} />;
              case "FEATURES":
                return <FeaturesBlock key={secao.id} data={data} />;
              case "CTA":
                return <CtaBlock key={secao.id} data={data} />;
              case "DOCUMENTOS":
                return <DocumentsBlock key={secao.id} conteudo={secao.conteudo} />;
              case "EQUIPE":
                return <TeamBlock key={secao.id} conteudo={secao.conteudo} />;
              case "FAQ":
                return <FaqBlock key={secao.id} conteudo={secao.conteudo} />;
              case "GALERIA":
                return <GalleryBlock key={secao.id} conteudo={secao.conteudo} />;
              case "VIDEO":
                return <VideoBlock key={secao.id} conteudo={secao.conteudo} />;
              case "MAPA":
                return <MapBlock key={secao.id} conteudo={secao.conteudo} />;
              case "BOTOES":
                return <ButtonsBlock key={secao.id} conteudo={secao.conteudo} />;
              default:
                return null;
            }
          } catch (e) {
            console.error(`Erro ao renderizar bloco ${secao.tipo}:`, e);
            return null;
          }
        })}
      </div>
    </main>
  );
}
