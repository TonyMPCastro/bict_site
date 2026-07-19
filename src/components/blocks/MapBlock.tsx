import { MapPin } from "lucide-react";

export default function MapBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.iframeUrl) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center flex items-center justify-center gap-3">
            <MapPin className="text-blue-600 dark:text-blue-400 w-8 h-8" />
            {data.title}
          </h2>
        )}
        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          <div 
            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 grayscale hover:grayscale-0 transition-all duration-1000"
            dangerouslySetInnerHTML={{ __html: data.iframeUrl }}
          />
        </div>
      </div>
    </section>
  );
}
