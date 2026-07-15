"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, FileText, CheckCircle2, XCircle } from "lucide-react";
import { deletePagina } from "./actions";

type Pagina = {
  id: string;
  titulo: string;
  slug: string;
  publicada: boolean;
  atualizadoEm: Date;
};

export default function PaginasList({ initialPaginas }: { initialPaginas: Pagina[] }) {
  const [paginas, setPaginas] = useState(initialPaginas);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredPaginas = paginas.filter(p => 
    p.titulo.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta página? Esta ação é irreversível.")) return;
    
    setIsDeleting(id);
    const res = await deletePagina(id);
    
    if (res.success) {
      setPaginas(paginas.filter(p => p.id !== id));
    } else {
      alert(res.error || "Erro ao excluir");
    }
    setIsDeleting(null);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header e Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Páginas</h1>
            <p className="text-sm text-gray-500">Gerencie o conteúdo institucional do site</p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar páginas..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <Link 
            href="/admin/paginas/form" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Página</span>
          </Link>
        </div>
      </div>

      {/* Visão Mobile (Cards) */}
      <div className="md:hidden space-y-4">
        {filteredPaginas.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">Nenhuma página encontrada.</p>
          </div>
        ) : (
          filteredPaginas.map((pagina) => (
            <div key={pagina.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3 relative overflow-hidden">
              {pagina.publicada ? (
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              ) : (
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{pagina.titulo}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">/{pagina.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/admin/paginas/form/${pagina.id}`}
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(pagina.id)}
                    disabled={isDeleting === pagina.id}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm">
                  {pagina.publicada ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                      <XCircle className="w-3.5 h-3.5" /> Rascunho
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(pagina.atualizadoEm).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Visão Desktop (Tabela) */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="py-4 px-6">Título da Página</th>
                <th className="py-4 px-6">Slug (URL)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Última Atualização</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPaginas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    Nenhuma página encontrada para sua busca.
                  </td>
                </tr>
              ) : (
                filteredPaginas.map((pagina) => (
                  <tr key={pagina.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{pagina.titulo}</td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-sm">/{pagina.slug}</td>
                    <td className="py-4 px-6">
                      {pagina.publicada ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {new Date(pagina.atualizadoEm).toLocaleDateString('pt-BR', { 
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/paginas/form/${pagina.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(pagina.id)}
                          disabled={isDeleting === pagina.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
    </div>
  );
}
