import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FileText, Users, Layout, Activity, Eye, Edit, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Admin BICT",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Consultas ao banco de dados em paralelo para maior performance
  const [
    totalPaginas,
    paginasPublicadas,
    totalMenus,
    totalUsuarios,
    paginasRecentes
  ] = await Promise.all([
    db.pagina.count(),
    db.pagina.count({ where: { publicada: true } }),
    db.menuItem.count(),
    db.user.count(),
    db.pagina.findMany({
      take: 5,
      orderBy: { atualizadoEm: 'desc' },
      select: { id: true, titulo: true, slug: true, publicada: true, atualizadoEm: true }
    })
  ]);

  const rascunhos = totalPaginas - paginasPublicadas;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header do Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo de volta, <strong className="text-gray-900 dark:text-white font-medium">{session?.user?.name || "Administrador"}</strong>. Aqui está o resumo do seu site hoje.
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card: Total de Páginas */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Páginas</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalPaginas}</h3>
          </div>
        </div>

        {/* Card: Páginas Publicadas */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Páginas Publicadas</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{paginasPublicadas}</h3>
          </div>
        </div>

        {/* Card: Links de Menu */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Itens no Menu</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalMenus}</h3>
          </div>
        </div>

        {/* Card: Usuários */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuários</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsuarios}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sessão Principal: Atividade Recente */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              Páginas Editadas Recentemente
            </h2>
            <Link href="/admin/paginas" className="text-sm text-blue-600 dark:text-blue-500 hover:underline flex items-center">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {paginasRecentes.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhuma página foi criada ou editada ainda.
                </div>
              ) : (
                paginasRecentes.map((pagina) => (
                  <div key={pagina.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-900/50 flex items-center justify-between transition-colors">
                    <div className="flex flex-col gap-1">
                      <Link href={`/admin/paginas/form/${pagina.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {pagina.titulo}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>/{pagina.slug}</span>
                        <span>•</span>
                        <span>
                          {pagina.publicada ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Publicado</span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Rascunho</span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                        {new Date(pagina.atualizadoEm).toLocaleDateString('pt-BR')} às {new Date(pagina.atualizadoEm).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <Link 
                        href={`/admin/paginas/form/${pagina.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Direita: Status Rápido */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Status do Conteúdo</h2>
          
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors space-y-6">
            
            {/* Status: Publicadas */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Páginas Publicadas</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{paginasPublicadas}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: totalPaginas > 0 ? `${(paginasPublicadas / totalPaginas) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            {/* Status: Rascunhos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Em Rascunho</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{rascunhos}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gray-400 dark:bg-gray-500 h-2 rounded-full" 
                  style={{ width: totalPaginas > 0 ? `${(rascunhos / totalPaginas) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
              <Link 
                href="/admin/paginas/form"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Criar Nova Página
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
