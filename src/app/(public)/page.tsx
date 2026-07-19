import { db } from "@/lib/db";
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
import TextImageBlock from "@/components/blocks/TextImageBlock";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const homePage = await db.pagina.findUnique({

    where: { slug: "home" },
    include: {
      secoes: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  if (!homePage || !homePage.publicada) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-slate-900 transition-colors">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Bem-vindo ao BICT</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
          Nossa página inicial está sendo construída. Se você é um administrador, vá até o Painel, crie uma página com o título "Home", publique-a e adicione blocos construtores!
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col pb-20 bg-white dark:bg-slate-950 transition-colors">
      {homePage.secoes.map((secao) => {
        try {
          const data = secao.tipo === "TEXTO" ? null : JSON.parse(secao.conteudo);
          
          switch (secao.tipo) {
            case "BANNER":
              return <BannerBlock key={secao.id} data={data} />;
            case "TEXTO":
              return <RichTextBlock key={secao.id} html={secao.conteudo} />;
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
            case "TEXTO_IMAGEM":
              return <TextImageBlock key={secao.id} conteudo={secao.conteudo} />;
            default:
              return null;
          }
        } catch (e) {
          console.error(`Erro ao renderizar bloco ${secao.tipo}:`, e);
          return null;
        }
      })}
    </main>
  );
}
