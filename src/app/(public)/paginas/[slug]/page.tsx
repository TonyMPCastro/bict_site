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
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl min-h-[60vh] animate-fadeIn">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a página inicial
      </Link>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
          {pagina.titulo}
        </h1>
        
        {pagina.descricao && (
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
            {pagina.descricao}
          </p>
        )}

        <div className="w-full mt-8">
          {pagina.secoes.map((secao) => {
            try {
              const data = secao.tipo === "TEXTO" ? null : JSON.parse(secao.conteudo);
              
              switch (secao.tipo) {
                case "BANNER":
                  return <BannerBlock key={secao.id} data={data} />;
                case "TEXTO":
                  return (
                    <div key={secao.id} className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl mb-8">
                      {secao.titulo && <h3>{secao.titulo}</h3>}
                      <RichTextBlock html={secao.conteudo} />
                    </div>
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
          
          {pagina.secoes.length === 0 && (
            <p className="italic text-slate-500 dark:text-slate-400 text-center py-12">
              Nenhum conteúdo disponível nesta página ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
