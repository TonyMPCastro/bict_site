import Link from "next/link";

interface CtaBlockProps {
  data: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
}

export default function CtaBlock({ data }: CtaBlockProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600 -z-10"></div>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 -z-10"></div>
      
      <div className="container mx-auto px-4 text-center">
        {data.title && <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{data.title}</h2>}
        
        {data.description && (
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            {data.description}
          </p>
        )}
        
        {data.buttonText && data.buttonUrl && (
          <Link 
            href={data.buttonUrl} 
            className="inline-flex px-8 py-4 bg-white text-blue-700 hover:bg-slate-50 font-bold rounded-full shadow-xl hover:-translate-y-1 transition-all"
          >
            {data.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
