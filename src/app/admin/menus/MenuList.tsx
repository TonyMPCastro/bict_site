"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Layout, Link as LinkIcon, ChevronRight } from "lucide-react";
import { deleteMenuItem } from "./actions";

type MenuItem = {
  id: string;
  label: string;
  url: string;
  ordem: number;
  parentId: string | null;
  parent?: { label: string } | null;
};

export default function MenuList({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredItems = items.filter(i => 
    i.label.toLowerCase().includes(search.toLowerCase()) || 
    i.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item? Sub-menus também serão excluídos.")) return;
    
    setIsDeleting(id);
    const res = await deleteMenuItem(id);
    
    if (res.success) {
      // Remove ele e qualquer subitem dele na UI atual
      setItems(items.filter(i => i.id !== id && i.parentId !== id));
    } else {
      alert(res.error || "Erro ao excluir");
    }
    setIsDeleting(null);
  };

  // Agrupar items: Pai -> Filhos
  const parents = filteredItems.filter(i => !i.parentId).sort((a, b) => a.ordem - b.ordem);
  
  // Função helper para pegar os filhos de um pai
  const getChildren = (parentId: string) => {
    return filteredItems.filter(i => i.parentId === parentId).sort((a, b) => a.ordem - b.ordem);
  };

  const renderMobileItem = (item: MenuItem, isChild = false) => (
    <div key={item.id} className={`bg-white dark:bg-slate-950 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 relative overflow-hidden transition-colors ${isChild ? 'ml-6 mt-2 border-l-4 border-l-purple-500' : 'mt-4 border-l-4 border-l-blue-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            {isChild && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">↳ </span>}
            {item.label}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] mt-1 flex items-center gap-1">
            <LinkIcon className="w-3 h-3" /> {item.url}
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            href={`/admin/menus/form/${item.id}`}
            className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => handleDelete(item.id)}
            disabled={isDeleting === item.id}
            className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-slate-800">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ordem: {item.ordem}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {isChild ? "Sub-menu" : "Menu Principal"}
        </span>
      </div>
    </div>
  );

  const renderDesktopItem = (item: MenuItem, isChild = false) => (
    <tr key={item.id} className={`hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors ${isChild ? 'bg-gray-50/30 dark:bg-slate-900/30' : ''}`}>
      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
        <div className="flex items-center">
          {isChild ? (
            <span className="text-purple-400 dark:text-purple-500 ml-4 mr-2">↳</span>
          ) : (
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
          )}
          {item.label}
        </div>
      </td>
      <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-mono text-sm">{item.url}</td>
      <td className="py-4 px-6 text-gray-500 dark:text-gray-400 font-medium">{item.ordem}</td>
      <td className="py-4 px-6">
        {isChild ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
            Sub-menu
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            Nível Principal
          </span>
        )}
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex justify-end gap-2">
          <Link 
            href={`/admin/menus/form/${item.id}`}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => handleDelete(item.id)}
            disabled={isDeleting === item.id}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header e Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Menus</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie a navegação do site (Header)</p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar links..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <Link 
            href="/admin/menus/form" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Link</span>
          </Link>
        </div>
      </div>

      {/* Visão Mobile (Cards) */}
      <div className="md:hidden space-y-2">
        {parents.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800">
            <p className="text-gray-500 dark:text-gray-400">Nenhum item encontrado.</p>
          </div>
        ) : (
          parents.map((parent) => (
            <div key={parent.id}>
              {renderMobileItem(parent)}
              {getChildren(parent.id).map(child => renderMobileItem(child, true))}
            </div>
          ))
        )}
      </div>

      {/* Visão Desktop (Tabela) */}
      <div className="hidden md:block bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex-1 transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="py-4 px-6">Nome do Link</th>
                <th className="py-4 px-6">URL de Destino</th>
                <th className="py-4 px-6">Posição (Ordem)</th>
                <th className="py-4 px-6">Hierarquia</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {parents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    Nenhum item de menu encontrado.
                  </td>
                </tr>
              ) : (
                parents.map((parent) => (
                  <React.Fragment key={parent.id}>
                    {renderDesktopItem(parent)}
                    {getChildren(parent.id).map(child => renderDesktopItem(child, true))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
