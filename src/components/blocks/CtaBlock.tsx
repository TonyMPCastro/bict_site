import Link from "next/link";

interface CtaBlockProps {
  data: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
    bgColor?: string;
    textColor?: string;
  };
}

export default function CtaBlock({ data }: CtaBlockProps) {
  const contrastColor = (hex: string) => {
    try {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0,2),16) / 255;
      const g = parseInt(h.substring(2,4),16) / 255;
      const b = parseInt(h.substring(4,6),16) / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum > 0.6 ? '#000000' : '#ffffff';
    } catch (e) {
      return '#ffffff';
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundColor: data.bgColor || '#2563EB' }}></div>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-20">
        {data.title && <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: data.textColor || '#ffffff' }}>{data.title}</h2>}

        {data.description && (
          <p className="max-w-2xl mx-auto mb-10 text-lg" style={{ color: data.textColor || 'rgba(255,255,255,0.9)' }}>
            {data.description}
          </p>
        )}

        {data.buttonText && data.buttonUrl && (
          <Link 
            href={data.buttonUrl} 
            className="inline-flex px-8 py-4 font-bold rounded-full shadow-xl hover:-translate-y-1 transition-all"
            style={{ backgroundColor: data.textColor || '#1e3a8a', color: contrastColor(data.textColor || '#1e3a8a') }}
          >
            {data.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
