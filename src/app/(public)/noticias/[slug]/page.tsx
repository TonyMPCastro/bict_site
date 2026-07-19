import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60; // revalidate every 60 seconds

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await db.post.findUnique({
    where: { slug }
  });

  if (!noticia) return { title: "Notícia não encontrada | BICT" };

  return {
    title: `${noticia.titulo} | BICT Notícias`,
    description: noticia.resumo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumo,
      images: noticia.imagem ? [noticia.imagem] : [],
    }
  };
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { slug } = await params;
  const noticia = await db.post.findUnique({
    where: { slug },
    include: { 
      autor: true, 
      categoria: true,
      galeria: {
        include: {
          imagens: {
            orderBy: { ordem: 'asc' }
          }
        }
      }
    }
  });

  if (!noticia || !noticia.publicado) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      {/* Imagem de Capa (Hero) */}
      <div className="w-full h-[50vh] md:h-[60vh] bg-gray-100 dark:bg-slate-900 relative">
        {noticia.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={noticia.imagem} alt={noticia.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
             <span className="text-primary/40 text-4xl font-bold">BICT News</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Container do Título sobreposto na imagem */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-white/90 text-sm font-medium">
              <span className="bg-primary/90 px-3 py-1 rounded-full text-white">{noticia.categoria.nome}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(noticia.dataPublicacao!).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {noticia.autor.nome}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {noticia.titulo}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/noticias" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Notícias
        </Link>

        {/* Resumo/Lead */}
        <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-12 pb-12 border-b border-gray-100 dark:border-slate-800/80">
          {noticia.resumo}
        </div>

        {/* Conteúdo Rico HTML */}
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {/* Galeria Vinculada */}
        {noticia.galeria && noticia.galeria.imagens.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Galeria de Imagens</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {noticia.galeria.imagens.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.altText || img.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-medium truncate">{img.titulo}</p>
                    {img.descricao && <p className="text-white/80 text-xs truncate mt-1">{img.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400">Publicado em {new Date(noticia.dataPublicacao!).toLocaleDateString('pt-BR')} às {new Date(noticia.dataPublicacao!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </article>
  );
}
