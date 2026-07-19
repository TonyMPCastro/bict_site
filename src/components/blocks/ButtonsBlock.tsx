import * as Icons from "lucide-react";

export default function ButtonsBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.buttons || data.buttons.length === 0) return null;

  return (
    <section className="py-12 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {data.title && (
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            {data.title}
          </h2>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {data.buttons.map((btn: any, i: number) => {
            // Usa o ícone passado ou 'Link' como fallback
            const IconComponent = (Icons as any)[btn.icon || 'Link'] || Icons.Link;
            
            let btnClass = "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 active:translate-y-0 ";
            
            if (btn.style === 'primary') {
              btnClass += "bg-blue-600 hover:bg-blue-700 text-white border-transparent border";
            } else if (btn.style === 'secondary') {
              btnClass += "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border-transparent border";
            } else { // outline
              btnClass += "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/30";
            }

            return (
              <a 
                key={i} 
                href={btn.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={btnClass}
              >
                <IconComponent className="w-5 h-5" />
                {btn.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
