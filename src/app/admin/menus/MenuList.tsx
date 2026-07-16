"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Layout, Link as LinkIcon, ChevronRight, Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { deleteMenuItem, saveMenuItem } from "./actions";

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
  const [editingParent, setEditingParent] = useState<MenuItem | null>(null);
  const [childEdits, setChildEdits] = useState<MenuItem[]>([]);
  const [isSavingBatch, setIsSavingBatch] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState<string | null>(null);

  const filteredItems = items.filter(i => 
    i.label.toLowerCase().includes(search.toLowerCase()) || 
    i.url.toLowerCase().includes(search.toLowerCase())
  );

  // helper: map of parentId -> children
  const childrenMap = useMemo(() => {
    const m: Record<string, MenuItem[]> = {};
    filteredItems.forEach(i => {
      const key = i.parentId || "__root__";
      m[key] = m[key] || [];
      m[key].push(i);
    });
    Object.keys(m).forEach(k => m[k].sort((a,b)=>a.ordem-b.ordem));
    return m;
  }, [filteredItems]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({}));

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    filteredItems.forEach(i => { all[i.id] = true; });
    setExpanded(all);
  };

  const collapseAll = () => setExpanded({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

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

  const swapOrderAndPersist = async (a: MenuItem, b: MenuItem) => {
    // optimistic UI
    setItems(prev => prev.map(it => {
      if (it.id === a.id) return { ...it, ordem: b.ordem };
      if (it.id === b.id) return { ...it, ordem: a.ordem };
      return it;
    }));

    setIsReordering(a.id);
    try {
      await saveMenuItem({ id: a.id, label: a.label, url: a.url, ordem: b.ordem, parentId: a.parentId });
      await saveMenuItem({ id: b.id, label: b.label, url: b.url, ordem: a.ordem, parentId: b.parentId });
    } catch (err) {
      alert('Erro ao reordenar.');
      // revert by refetching would be ideal; simple revert swap
      setItems(prev => prev.map(it => {
        if (it.id === a.id) return { ...it, ordem: a.ordem };
        if (it.id === b.id) return { ...it, ordem: b.ordem };
        return it;
      }));
    } finally {
      setIsReordering(null);
    }
  };

  const moveUp = async (item: MenuItem) => {
    const siblings = items.filter(i => i.parentId === item.parentId).sort((x, y) => x.ordem - y.ordem);
    const idx = siblings.findIndex(s => s.id === item.id);
    if (idx <= 0) return; // already first
    const above = siblings[idx - 1];
    await swapOrderAndPersist(item, above);
  };

  const moveDown = async (item: MenuItem) => {
    const siblings = items.filter(i => i.parentId === item.parentId).sort((x, y) => x.ordem - y.ordem);
    const idx = siblings.findIndex(s => s.id === item.id);
    if (idx === -1 || idx >= siblings.length - 1) return; // already last
    const below = siblings[idx + 1];
    await swapOrderAndPersist(item, below);
  };

  // Agrupar items: Pai -> Filhos
  const parents = filteredItems.filter(i => !i.parentId).sort((a, b) => a.ordem - b.ordem);
  
  // Função helper para pegar os filhos de um pai
  const getChildren = (parentId: string) => {
    return childrenMap[parentId] || [];
  };

  // Identifica itens que não foram renderizados pela árvore (órfãos ou faltantes)
  const renderedIds = new Set<string>();
  parents.forEach(p => {
    renderedIds.add(p.id);
    getChildren(p.id).forEach(c => renderedIds.add(c.id));
  });
  const remaining = filteredItems.filter(i => !renderedIds.has(i.id));

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
          <button onClick={() => moveUp(item)} disabled={isReordering === item.id} title="Subir" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-slate-900/20 rounded-lg transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => moveDown(item)} disabled={isReordering === item.id} title="Descer" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-slate-900/20 rounded-lg transition-colors">
            <ArrowDown className="w-4 h-4" />
          </button>
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
      {/* Modal de edição rápida de pai + filhos */}
      {editingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingParent(null)} />
          <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-950 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Editar Link</h3>
                <p className="text-sm text-gray-500">Editar pai e sub-itens rapidamente</p>
              </div>
              <button onClick={() => setEditingParent(null)} className="text-sm text-gray-500">Fechar</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div className="col-span-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Label</label>
                  <input className="w-full px-3 py-2 border rounded-lg" value={editingParent.label} onChange={(e) => setEditingParent({ ...editingParent, label: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                  <input className="w-full px-3 py-2 border rounded-lg" value={editingParent.url} onChange={(e) => setEditingParent({ ...editingParent, url: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordem</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-lg" value={editingParent.ordem ?? 0} onChange={(e) => setEditingParent({ ...editingParent, ordem: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Menu Pai (reparent)</label>
                  <select className="w-full px-3 py-2 border rounded-lg" value={editingParent.parentId ?? ""} onChange={(e) => setEditingParent({ ...editingParent, parentId: e.target.value || null })}>
                    <option value="">(Nenhum) - será menu principal</option>
                    {items.filter(i => !i.parentId && i.id !== editingParent.id).map(pm => (
                      <option key={pm.id} value={pm.id}>{pm.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filhos</h4>
                  <span className="text-sm text-gray-500">{childEdits.length} subitem(s)</span>
                </div>
                <div className="space-y-3 mt-2 max-h-[60vh] overflow-auto">
                  {childEdits.length === 0 && <p className="text-sm text-gray-500">Sem submenus</p>}
                  {childEdits.map((c, idx) => (
                    <div key={c.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-2 border rounded-lg">
                      <div className="flex items-center gap-2 col-span-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
                        <input className="px-2 py-1 border rounded w-full" value={c.label} onChange={(e) => {
                          const copy = [...childEdits]; copy[idx] = { ...c, label: e.target.value }; setChildEdits(copy);
                        }} />
                      </div>
                      <input className="col-span-3 px-2 py-1 border rounded" value={c.url} onChange={(e) => {
                        const copy = [...childEdits]; copy[idx] = { ...c, url: e.target.value }; setChildEdits(copy);
                      }} />
                      <input type="number" className="px-2 py-1 border rounded w-20 col-span-1" value={c.ordem} onChange={(e) => {
                        const copy = [...childEdits]; copy[idx] = { ...c, ordem: Number(e.target.value) }; setChildEdits(copy);
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setEditingParent(null)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-900">Cancelar</button>
                <button disabled={isSavingBatch} onClick={async () => {
                  setIsSavingBatch(true);
                  try {
                    // salva o pai
                    await saveMenuItem({ id: editingParent.id, label: editingParent.label, url: editingParent.url, ordem: editingParent.ordem ?? 0, parentId: editingParent.parentId });
                    // salva os filhos
                    for (const child of childEdits) {
                      await saveMenuItem({ id: child.id, label: child.label, url: child.url, ordem: child.ordem ?? 0, parentId: child.parentId });
                    }
                    // atualiza UI local
                    const refreshed = items.map(it => {
                      if (it.id === editingParent.id) return { ...it, label: editingParent.label, url: editingParent.url, ordem: editingParent.ordem };
                      const found = childEdits.find(c => c.id === it.id);
                      if (found) return { ...it, label: found.label, url: found.url, ordem: found.ordem };
                      return it;
                    });
                    setItems(refreshed);
                    setEditingParent(null);
                  } catch (err) {
                    alert('Erro ao salvar');
                  } finally {
                    setIsSavingBatch(false);
                  }
                }} className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2">
                  {isSavingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-slate-800">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ordem: {item.ordem}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{isChild ? "Sub-menu" : "Menu Principal"}</span>
      </div>
    </div>
  );

  const renderDesktopItem = (item: MenuItem, isChild = false, depth = 0) => (
    <tr key={item.id} className={`hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors ${isChild ? 'bg-gray-50/30 dark:bg-slate-900/30' : ''}`}>
      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div style={{ width: depth * 12 }} />
            {childrenMap[item.id] && childrenMap[item.id].length > 0 ? (
              <button onClick={() => toggle(item.id)} className="text-gray-400">{expanded[item.id] ? '▾' : '▸'}</button>
            ) : (
              <div className="w-3" />
            )}
            <span className={`${isChild ? 'ml-2' : ''}`}>{item.label}</span>
          </div>
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
          {!isChild && (
            <button
              onClick={() => {
                setEditingParent(item);
                setChildEdits(getChildren(item.id));
              }}
              title="Editar pai e filhos"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-slate-900/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
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

  // recursive tree renderer for desktop
  const renderTreeRows = (parentId: string | null, depth = 0) => {
    const list = parentId ? childrenMap[parentId] || [] : childrenMap['__root__'] || [];
    return list.flatMap(item => {
      const row = [renderDesktopItem(item, depth > 0, depth)];
      if (expanded[item.id]) {
        row.push(...renderTreeRows(item.id, depth + 1));
      }
      return row;
    });
  };

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
        <div className="flex gap-2 mb-2">
          <button className="px-3 py-1 bg-gray-100 rounded" onClick={expandAll}>Expandir tudo</button>
          <button className="px-3 py-1 bg-gray-100 rounded" onClick={collapseAll}>Recolher tudo</button>
        </div>
        {parents.length === 0 && remaining.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800">
            <p className="text-gray-500 dark:text-gray-400">Nenhum item encontrado.</p>
          </div>
        ) : (
          <>
            {renderTreeRows(null, 0) /* used for desktop, but keep mobile simple below */}
            {parents.map((parent) => (
              <div key={parent.id}>
                {renderMobileItem(parent)}
                {getChildren(parent.id).map(child => renderMobileItem(child, true))}
              </div>
            ))}

            {remaining.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Outros itens</h3>
                {remaining.map(it => renderMobileItem(it))}
              </div>
            )}
          </>
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
              {(parents.length === 0 && remaining.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    Nenhum item de menu encontrado.
                  </td>
                </tr>
              ) : (
                <>
                  {renderTreeRows(null, 0)}
                  {remaining.map(it => (
                    <React.Fragment key={it.id}>{renderDesktopItem(it)}</React.Fragment>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
