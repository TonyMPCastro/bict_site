"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageProps {
  id: string;
  url: string;
  titulo: string;
  descricao?: string | null;
  altText?: string | null;
}

interface PublicGalleryProps {
  images: ImageProps[];
}

export default function PublicGallery({ images }: PublicGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const displayImages = isExpanded ? images : images.slice(0, 6);
  const hasMore = images.length > 6;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((img, index) => (
          <div 
            key={img.id} 
            className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100 dark:bg-slate-900 cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img.url} 
              alt={img.altText || img.titulo} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-sm font-medium truncate">{img.titulo}</p>
              {img.descricao && <p className="text-white/80 text-xs truncate mt-1">{img.descricao}</p>}
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && hasMore && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsExpanded(true)}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Veja mais {images.length - 6} imagens
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[101]"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            {images.length > 1 && (
              <button 
                className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[101]"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            <div 
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={images[lightboxIndex].url} 
                alt={images[lightboxIndex].altText || images[lightboxIndex].titulo} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="text-center mt-6 max-w-2xl">
                <h3 className="text-white text-xl font-semibold">{images[lightboxIndex].titulo}</h3>
                {images[lightboxIndex].descricao && (
                  <p className="text-white/70 mt-2 text-sm">{images[lightboxIndex].descricao}</p>
                )}
                <p className="text-white/40 mt-4 text-xs font-mono">
                  {lightboxIndex + 1} / {images.length}
                </p>
              </div>
            </div>

            {images.length > 1 && (
              <button 
                className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[101]"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
