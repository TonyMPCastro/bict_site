"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, FileText, CheckCircle2, XCircle } from "lucide-react";
import { deletePagina } from "./actions";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Pagina = {
  id: string;
  titulo: string;
  slug: string;
  publicada: boolean;
  atualizadoEm: string;
};

export default function PaginasList({ initialPaginas }: { initialPaginas: Pagina[] }) {
  const [paginas, setPaginas] = useState(initialPaginas);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [paginaToDelete, setPaginaToDelete] = useState<string | null>(null);

  const filteredPaginas = paginas.filter(p => 
    p.titulo.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setPaginaToDelete(id);
  };

  const confirmDelete = async () => {
    if (!paginaToDelete) return;
    const id = paginaToDelete;
    setIsDeleting(id);
    setPaginaToDelete(null);
    const res = await deletePagina(id);
    
    if (res.success) {
      setPaginas(paginas.filter(p => p.id !== id));
    } else {
      alert(res.error || "Erro ao excluir");
    }
    setIsDeleting(null);
  };

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredPaginas.length / ITEMS_PER_PAGE);
  const currentPaginas = filteredPaginas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header e Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Páginas</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie o conteúdo institucional do site</p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar páginas..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Resetar página ao buscar
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
            />
          </div>
          <Link 
            href="/admin/paginas/form" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Página</span>
          </Link>
        </div>
      </div>

      {/* Grid de Páginas (Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentPaginas.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma página encontrada.</p>
          </div>
        ) : (
          currentPaginas.map((pagina) => (
            <div key={pagina.id} className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{pagina.titulo}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1">/{pagina.slug}</p>
                </div>
                {pagina.publicada ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 shrink-0">
                    <XCircle className="w-3.5 h-3.5" /> Rascunho
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4">
                <span>
                  {new Date(pagina.atualizadoEm).toLocaleDateString('pt-BR', { 
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </span>
                
                <div className="flex gap-2">
                  <Link 
                    href={`/admin/paginas/form/${pagina.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-gray-50 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(pagina.id)}
                    disabled={isDeleting === pagina.id}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-gray-50 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tabela de Páginas (Desktop) */}
      <div className="hidden md:block bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <th className="py-4 px-6">Título</th>
                <th className="py-4 px-6">Slug (URL)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Última Atualização</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {currentPaginas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma página encontrada para sua busca.
                  </td>
                </tr>
              ) : (
                currentPaginas.map((pagina) => (
                  <tr key={pagina.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{pagina.titulo}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 font-mono text-sm">/{pagina.slug}</td>
                    <td className="py-4 px-6">
                      {pagina.publicada ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(pagina.atualizadoEm).toLocaleDateString('pt-BR', { 
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/paginas/form/${pagina.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(pagina.id)}
                          disabled={isDeleting === pagina.id}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-950 px-4 py-3 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPaginas.length)}</span> de <span className="font-medium">{filteredPaginas.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-slate-700 focus:z-20 focus:outline-offset-0 ${
                      currentPage === idx + 1 
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' 
                      : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Próxima</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!paginaToDelete}
        title="Excluir Página"
        message="Tem certeza que deseja excluir esta página? Esta ação é irreversível."
        onConfirm={confirmDelete}
        onCancel={() => setPaginaToDelete(null)}
        variant="danger"
      />
    </div>
  );
}
