import { FileText, Link as LinkIcon, Download } from "lucide-react";

export default function DocumentsBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.docs || data.docs.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            {data.title}
          </h2>
        )}
        <div className="space-y-4">
          {data.docs.map((doc: any, i: number) => (
            <a 
              key={i} 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 shrink-0">
                {doc.type === 'link' ? <LinkIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                  {doc.type}
                </p>
              </div>
              <div className="ml-4 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
