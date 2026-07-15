import Link from "next/link";
import Image from "next/image";

interface BannerBlockProps {
  data: {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
}

export default function BannerBlock({ data }: BannerBlockProps) {
  const bgImage = data.imageUrl || "/default-banner.jpg"; // fall back

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
        {data.title && (
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight animate-fade-in-up">
            {data.title}
          </h1>
        )}
        
        {data.subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 drop-shadow-md max-w-2xl font-light">
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
