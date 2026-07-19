export default function VideoBlock({ conteudo }: { conteudo: string }) {
  let data;
  try {
    data = JSON.parse(conteudo);
  } catch {
    return null;
  }
  
  if (!data.videoUrl) return null;

  // Função simples para tentar converter URL do Youtube padrão para embed
  let embedUrl = data.videoUrl;
  if (embedUrl.includes('youtube.com/watch?v=')) {
    embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    const ampersandPos = embedUrl.indexOf('&');
    if (ampersandPos !== -1) {
      embedUrl = embedUrl.substring(0, ampersandPos);
    }
  } else if (embedUrl.includes('youtu.be/')) {
    embedUrl = embedUrl.replace('youtu.be/', 'www.youtube.com/embed/');
  }

  return (
    <section className="py-16 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-5xl">
        {data.title && (
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
            {data.title}
          </h2>
        )}
        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl aspect-video bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800/50">
          {embedUrl.startsWith('<iframe') ? (
            // Se o usuário colou o iframe inteiro
            <div 
              className="absolute top-0 left-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
              dangerouslySetInnerHTML={{ __html: embedUrl }}
            />
          ) : (
            // Se o usuário colou apenas o link
            <iframe 
              src={embedUrl}
              title={data.title || "Video Player"}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
}
