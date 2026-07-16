import * as LucideIcons from "lucide-react";

interface FeatureData {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface FeaturesBlockProps {
  data: {
    title?: string;
    description?: string;
    features?: FeatureData[];
  };
}

export default function FeaturesBlock({ data }: FeaturesBlockProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo': return { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-600 dark:text-indigo-400', groupHover: 'group-hover:bg-indigo-600' };
      case 'emerald': return { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400', groupHover: 'group-hover:bg-emerald-600' };
      case 'orange': return { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400', groupHover: 'group-hover:bg-orange-600' };
      case 'purple': return { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400', groupHover: 'group-hover:bg-purple-600' };
      default: return { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400', groupHover: 'group-hover:bg-blue-600' };
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {data.title && <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{data.title}</h2>}
          {data.description && (
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {data.description}
            </p>
          )}
        </div>

        {data.features && data.features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {data.features.map((feature, index) => {
              // Dynamically get the icon component from lucide-react
              // Need to cast to any because LucideIcons is a module export object
              const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.HelpCircle;
              const colors = getColorClasses(feature.color);

              return (
                <div key={index} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group cursor-default">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${colors.bg} ${colors.groupHover}`}>
                    <IconComponent className={`w-6 h-6 group-hover:text-white transition-colors ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
