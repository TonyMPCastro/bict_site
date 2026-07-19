import Image from "next/image";

export default function TextImageBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.html && !data.imageUrl) return null;

  const imageOnRight = data.imagePosition === 'right';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      {data.title && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-800 pb-4">
          {data.title}
        </h2>
      )}
      
      <div className={`flex flex-col gap-8 md:gap-12 ${imageOnRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <div className="flex-1 w-full relative min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-slate-800">
           {data.imageUrl ? (
             <Image 
               src={data.imageUrl} 
               alt={data.title || "Imagem"} 
               fill 
               className="object-cover" 
             />
           ) : (
             <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
               Sem imagem
             </div>
           )}
        </div>
        
        <div className="flex-1 w-full flex flex-col justify-center">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none 
                       prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                       prose-a:text-primary hover:prose-a:text-primary/80
                       prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: data.html || '' }} 
          />
        </div>
      </div>
    </div>
  );
}
