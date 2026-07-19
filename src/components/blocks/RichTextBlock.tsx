export default function RichTextBlock({ html }: { html: string }) {
  if (!html) return null;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div 
        className="prose prose-lg dark:prose-invert max-w-none 
                   prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                   prose-a:text-primary hover:prose-a:text-primary/80
                   prose-img:rounded-xl prose-img:shadow-md [&_img[style*="float: right"]]:ml-6 [&_img[style*="float: right"]]:mb-4 [&_img[style*="float: left"]]:mr-6 [&_img[style*="float: left"]]:mb-4
                   prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
