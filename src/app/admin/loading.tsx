import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Carregando painel administrativo...</p>
      </div>
    </div>
  );
}
