"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  bgType?: "image" | "color" | "gradient";
  imageUrl?: string;
  bgColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  overlayOpacity?: number;
}

interface BannerBlockProps {
  data: {
    slides?: BannerSlide[];
  } & BannerSlide; // Para manter compatibilidade com dados legados
}

export default function BannerBlock({ data }: BannerBlockProps) {
  // Migração transparente de legacy para array de slides
  const slides = data.slides && data.slides.length > 0 ? data.slides : [data];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center text-center overflow-hidden bg-slate-900">
      
      {/* Renderização dos Slides */}
      {slides.map((slide, index) => {
        const bgType = slide.bgType || "image";
        
        return (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 z-0 ${index === currentIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background Layer */}
            <div 
              className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ${index === currentIndex ? 'scale-105' : 'scale-100'}`}
              style={
                bgType === "color" ? { backgroundColor: slide.bgColor || "#2563eb" } :
                bgType === "gradient" ? { backgroundImage: `linear-gradient(to right, ${slide.gradientColor1 || '#2563eb'}, ${slide.gradientColor2 || '#4f46e5'})` } :
                { backgroundImage: `url('${slide.imageUrl || '/default-banner.jpg'}')` }
              }
            >
              <div 
                className="absolute inset-0 backdrop-blur-[2px]" 
                style={{ backgroundColor: `rgba(0, 0, 0, ${slide.overlayOpacity !== undefined ? slide.overlayOpacity / 100 : 0.5})` }}
              ></div>
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto space-y-6">
              {slide.title && (
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight animate-fade-in-up">
                  {slide.title}
                </h1>
              )}
              
              {slide.subtitle && (
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md max-w-2xl font-light">
                  {slide.subtitle}
                </p>
              )}

              {slide.buttonText && slide.buttonUrl && (
                <div className="pt-4">
                  <Link 
                    href={slide.buttonUrl}
                    className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-primary/50 hover:-translate-y-1"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Carousel Controls */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
