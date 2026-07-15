import { AlertTriangle, Info, BellRing } from "lucide-react";

interface NoticeBlockProps {
  data: {
    text?: string;
    type?: "info" | "warning" | "danger";
  };
}

export default function NoticeBlock({ data }: NoticeBlockProps) {
  if (!data.text) return null;

  const type = data.type || "info";

  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-300",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-300",
    danger: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-300",
  };

  const icons = {
    info: <Info className="w-6 h-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />,
    warning: <AlertTriangle className="w-6 h-6 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />,
    danger: <BellRing className="w-6 h-6 flex-shrink-0 text-red-600 dark:text-red-400" />,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className={`flex items-start gap-4 p-6 rounded-2xl border shadow-sm transition-colors ${styles[type]}`}>
        {icons[type]}
        <div className="flex-1">
          <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">{data.text}</p>
        </div>
      </div>
    </div>
  );
}
