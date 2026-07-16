import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroBlockProps {
  data: {
    superTitle?: string;
    title?: string;
    gradientWord?: string;
    description?: string;
    button1Text?: string;
    button1Url?: string;
    button2Text?: string;
    button2Url?: string;
  };
}

export default function HeroBlock({ data }: HeroBlockProps) {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 dark:from-slate-900 via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 opacity-50"></div>

      <div className="container mx-auto px-4 text-center">
        {data.superTitle && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fadeInUp">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            {data.superTitle}
          </div>
        )}
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          {data.title && <>{data.title} <br className="hidden md:block" /></>}
          {data.gradientWord && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {data.gradientWord}
            </span>
          )}
        </h1>
        
        {data.description && (
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {data.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          {data.button1Text && data.button1Url && (
            <Link 
              href={data.button1Url} 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              {data.button1Text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {data.button2Text && data.button2Url && (
            <Link 
              href={data.button2Url} 
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {data.button2Text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
