'use client'

import React, { useState } from 'react'
import { CustomNavLink } from '@/types/cms'
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'

interface CustomNavManagerProps {
  links: CustomNavLink[]
  onChange: (links: CustomNavLink[]) => void
  title?: string
}

export const CustomNavManager: React.FC<CustomNavManagerProps> = ({
  links = [],
  onChange,
  title = 'Links de Navegação'
}) => {
  const safeLinks = Array.isArray(links) ? links : []
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newNovaAba, setNewNovaAba] = useState(false)

  const handleAdd = () => {
    if (!newLabel || !newUrl) return
    const newLink: CustomNavLink = {
      id: Date.now().toString(),
      label: newLabel,
      url: newUrl,
      novaAba: newNovaAba
    }
    onChange([...safeLinks, newLink])
    setNewLabel('')
    setNewUrl('')
    setNewNovaAba(false)
  }

  const handleUpdate = (id: string, field: keyof CustomNavLink, value: any) => {
    onChange(
      safeLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const handleRemove = (id: string) => {
    onChange(safeLinks.filter((l) => l.id !== id))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...safeLinks]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newLinks.length) return
    const temp = newLinks[index]
    newLinks[index] = newLinks[targetIdx]
    newLinks[targetIdx] = temp
    onChange(newLinks)
  }

  // --- Sublinks Logic ---
  const [expandedLinkIds, setExpandedLinkIds] = useState<string[]>([])
  const [newSubLabels, setNewSubLabels] = useState<Record<string, string>>({})
  const [newSubUrls, setNewSubUrls] = useState<Record<string, string>>({})

  const toggleExpand = (id: string) => {
    setExpandedLinkIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleAddSublink = (parentId: string) => {
    const label = newSubLabels[parentId]
    const url = newSubUrls[parentId]
    if (!label || !url) return

    onChange(
      safeLinks.map(l => {
        if (l.id === parentId) {
          const newSub: Omit<CustomNavLink, 'sublinks'> = {
            id: Date.now().toString(),
            label,
            url,
            novaAba: false
          }
          return { ...l, sublinks: [...(l.sublinks || []), newSub] }
        }
        return l
      })
    )
    setNewSubLabels(prev => ({ ...prev, [parentId]: '' }))
    setNewSubUrls(prev => ({ ...prev, [parentId]: '' }))
  }

  const handleUpdateSublink = (parentId: string, subId: string, field: string, value: any) => {
    onChange(
      safeLinks.map(l => {
        if (l.id === parentId) {
          return {
            ...l,
            sublinks: (l.sublinks || []).map(s => s.id === subId ? { ...s, [field]: value } : s)
          }
        }
        return l
      })
    )
  }

  const handleRemoveSublink = (parentId: string, subId: string) => {
    onChange(
      safeLinks.map(l => {
        if (l.id === parentId) {
          return {
            ...l,
            sublinks: (l.sublinks || []).filter(s => s.id !== subId)
          }
        }
        return l
      })
    )
  }

  return (
    <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/50">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {title} ({safeLinks.length})
      </h4>

      <div className="space-y-2.5">
        {safeLinks.map((link, idx) => (
          <div key={link.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdate(link.id, 'label', e.target.value)}
                  placeholder="Rótulo do link"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-slate-100"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdate(link.id, 'url', e.target.value)}
                  placeholder="URL (ex: /engenharias)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-600 dark:text-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.novaAba || false}
                    onChange={(e) => handleUpdate(link.id, 'novaAba', e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-primary"
                  />
                  <span>Nova aba</span>
                </label>

                <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-2">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === safeLinks.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(link.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remover link"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleExpand(link.id)}
                    className={`p-1 flex items-center gap-1 font-bold rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 ${expandedLinkIds.includes(link.id) ? 'text-primary' : 'text-slate-500'}`}
                    title="Gerenciar Sublinks"
                  >
                    {link.sublinks?.length ? `(${link.sublinks.length})` : ''} 
                    {expandedLinkIds.includes(link.id) ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Expansão de Sublinks */}
            {expandedLinkIds.includes(link.id) && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sub-menus (Dropdown)</h5>
                
                {link.sublinks && link.sublinks.length > 0 ? (
                  <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                    {link.sublinks.map(sub => (
                      <div key={sub.id} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={sub.label}
                          onChange={(e) => handleUpdateSublink(link.id, sub.id, 'label', e.target.value)}
                          placeholder="Rótulo"
                          className="flex-1 px-2 py-1.5 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                        <input
                          type="text"
                          value={sub.url}
                          onChange={(e) => handleUpdateSublink(link.id, sub.id, 'url', e.target.value)}
                          placeholder="URL"
                          className="flex-1 px-2 py-1.5 text-[11px] font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSublink(link.id, sub.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remover Sublink"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic pl-2">Nenhum submenu cadastrado.</p>
                )}

                <div className="flex gap-2 pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 border-dashed">
                  <input
                    type="text"
                    value={newSubLabels[link.id] || ''}
                    onChange={(e) => setNewSubLabels({ ...newSubLabels, [link.id]: e.target.value })}
                    placeholder="Novo submenu"
                    className="flex-1 px-2 py-1 text-[11px] rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={newSubUrls[link.id] || ''}
                    onChange={(e) => setNewSubUrls({ ...newSubUrls, [link.id]: e.target.value })}
                    placeholder="URL (/...)"
                    className="flex-1 px-2 py-1 text-[11px] font-mono rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSublink(link.id)}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors text-[11px] font-bold rounded flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Adicionar Novo Link */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nome do novo link"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
        <input
          type="text"
          placeholder="URL (ex: /noticias)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
        >
          <Plus className="h-3.5 w-3.5" /> Adicionar Link
        </button>
      </div>
    </div>
  )
}
