import { db } from "@/lib/db";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NoticiasPage() {
  const noticias = await db.post.findMany({
    where: {
      publicado: true,
    },
    orderBy: {
      dataPublicacao: 'desc',
    },
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notícias e Comunicados
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mt-4 max-w-2xl">
            Acompanhe as últimas novidades, editais e informações importantes sobre o BICT.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {noticias.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              Nenhuma notícia publicada ainda.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Volte em breve para conferir as novidades.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((noticia, index) => {
              const isFeatured = index === 0;

              return (
                <div 
                  key={noticia.id} 
                  className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
                    isFeatured ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div className={`${isFeatured ? "h-64 md:h-[400px]" : "h-56"} bg-slate-100 dark:bg-slate-800 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors z-10"></div>
                    {noticia.imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={noticia.imagem} alt={noticia.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 font-bold">
                        BICT Notícias
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-6 flex-1 flex flex-col ${isFeatured ? "md:p-10" : ""}`}>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                      <Calendar className="w-4 h-4 text-primary" /> 
                      {noticia.dataPublicacao ? new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR') : 'Data não definida'}
                      
                      {isFeatured && (
                        <span className="ml-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                          Destaque
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`${isFeatured ? "text-2xl md:text-4xl" : "text-xl"} font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors tracking-tight`}>
                      {noticia.titulo}
                    </h3>
                    
                    <p className={`text-slate-600 dark:text-slate-400 flex-1 ${isFeatured ? "text-lg line-clamp-3" : "line-clamp-3"}`}>
                      {noticia.resumo}
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                      <Link 
                        href={`/noticias/${noticia.slug}`} 
                        className="inline-flex items-center gap-2 text-primary font-bold text-xs hover:gap-3 transition-all"
                      >
                        Ler matéria completa <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
