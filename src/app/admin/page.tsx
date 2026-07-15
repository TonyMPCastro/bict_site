import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visão Geral</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo de volta, {session?.user?.name || "Administrador"}. Aqui você pode gerenciar o conteúdo do seu site.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Menus</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie a navegação do site</p>
        </div>
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Configurações</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Altere cores, logo e rodapé</p>
        </div>
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Páginas</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crie e edite conteúdo via construtor</p>
        </div>
      </div>
    </div>
  );
}
