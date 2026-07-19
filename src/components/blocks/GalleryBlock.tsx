"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

export default function GalleryBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.images || data.images.length === 0) return null;

  const [lightboxImg, setLightboxImg] = useState<{url: string, caption?: string} | null>(null);

  // Fechar lightbox com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevenir scroll do body quando lightbox aberto
  useEffect(() => {
    if (lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [lightboxImg]);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
            {data.title}
          </h2>
        )}
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {data.images.map((img: any, i: number) => (
            <div 
              key={i} 
              className="relative group break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-800 shadow-sm"
              onClick={() => setLightboxImg(img)}
            >
              <img 
                src={img.url} 
                alt={img.caption || `Galeria imagem ${i+1}`} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ objectPosition: img.imageFocus || 'center' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-8">
                <ZoomIn className="text-white w-8 h-8 mb-3 drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                {img.caption && (
                  <p className="text-white/90 text-center px-6 font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {img.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxImg(null); }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <img 
              src={lightboxImg.url} 
              alt={lightboxImg.caption || "Ampliada"} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
            {lightboxImg.caption && (
              <p className="text-white/80 mt-4 text-center max-w-2xl text-lg font-medium" onClick={(e) => e.stopPropagation()}>
                {lightboxImg.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
