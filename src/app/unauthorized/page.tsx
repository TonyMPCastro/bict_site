import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center">
      <div className="max-w-md w-full space-y-6 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="h-16 w-16 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Acesso Não Autorizado</h1>
          <p className="text-sm text-slate-400">
            Sua conta de usuário não possui as permissões necessárias para acessar este recurso.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Painel Admin
        </Link>
      </div>
    </main>
  );
}
