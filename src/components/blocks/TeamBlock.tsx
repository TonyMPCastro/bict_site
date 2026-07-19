import { Mail, GraduationCap } from "lucide-react";

export default function TeamBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.members || data.members.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            {data.title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.members.map((m: any, i: number) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <img 
                  src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=random`} 
                  alt={m.name} 
                  className="relative w-28 h-28 rounded-full object-cover ring-4 ring-white dark:ring-slate-950 shadow-md"
                  style={{ objectPosition: m.photoFocus || 'center' }}
                />
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">{m.name}</h3>
              {m.role && <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">{m.role}</p>}
              
              {m.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1" title={m.bio}>
                  {m.bio}
                </p>
              )}
              
              <div className="flex gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full justify-center">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="E-mail">
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                {m.lattes && (
                  <a href={m.lattes} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Currículo Lattes">
                    <GraduationCap className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
