"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerBlockProps {
  data: {
    bgType?: "image" | "color" | "gradient";
    imageUrl?: string;
    bgColor?: string;
    gradientColor1?: string;
    gradientColor2?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
}

export default function BannerBlock({ data }: BannerBlockProps) {
  const bgType = data.bgType || "image";
  const images = (data.imageUrl || "/default-banner.jpg").split(",").map(s => s.trim()).filter(Boolean);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (bgType !== "image" || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bgType, images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center text-center overflow-hidden"
      style={
        bgType === "color" ? { backgroundColor: data.bgColor || "#2563eb" } :
        bgType === "gradient" ? { backgroundImage: `linear-gradient(to right, ${data.gradientColor1 || '#2563eb'}, ${data.gradientColor2 || '#4f46e5'})` } :
        {}
      }
    >
      {/* Background Images Carousel */}
      {bgType === "image" && images.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          style={{ backgroundImage: `url('${img}')` }}
        >
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]"></div>
        </div>
      ))}

      {/* Carousel Controls */}
      {bgType === "image" && images.length > 1 && (
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
            {images.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
        {data.title && (
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight animate-fade-in-up">
            {data.title}
          </h1>
        )}
        
        {data.subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md max-w-2xl font-light">
            {data.subtitle}
          </p>
        )}

        {data.buttonText && data.buttonUrl && (
          <div className="pt-4">
            <Link 
              href={data.buttonUrl}
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-primary/50 hover:-translate-y-1"
            >
              {data.buttonText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
