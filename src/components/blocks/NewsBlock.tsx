import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface NewsBlockProps {
  data: {
    limit?: number;
  };
}

export default function NewsBlock({ data }: NewsBlockProps) {
  const limit = data.limit || 3;
  
  // Fake data para demonstração (substituir por fetch real no futuro)
  const fakeNews = Array.from({ length: limit }).map((_, i) => ({
    id: i,
    title: "Edital para Iniciação Científica publicado",
    summary: "A coordenação do BICT informa que o novo edital de bolsas de pesquisa já está disponível para alunos do ciclo básico...",
    date: new Date().toLocaleDateString('pt-BR'),
    slug: "edital-ic-" + i
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-10 border-b border-gray-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Últimas Notícias</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Fique por dentro das novidades do BICT.</p>
        </div>
        <Link href="/noticias" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
          Ver todas <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fakeNews.map((news) => (
          <div key={news.id} className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            <div className="h-48 bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors"></div>
              {/* Fallback image cover */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                [Imagem da Notícia]
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Calendar className="w-4 h-4" /> {news.date}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {news.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                {news.summary}
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                <Link href={`/noticias/${news.slug}`} className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Ler mais <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center md:hidden">
        <Link href="/noticias" className="inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-colors hover:bg-gray-200 dark:hover:bg-slate-700">
          Ver todas as notícias
        </Link>
      </div>
    </div>
  );
}
