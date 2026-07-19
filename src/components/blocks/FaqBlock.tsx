"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.faqs || data.faqs.length === 0) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-3xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
            {data.title}
          </h2>
        )}
        <div className="space-y-4">
          {data.faqs.map((faq: any, i: number) => (
            <div 
              key={i} 
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 overflow-hidden transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-900/50"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className={`font-semibold text-lg transition-colors ${openIndex === i ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} 
                />
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="p-5 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
