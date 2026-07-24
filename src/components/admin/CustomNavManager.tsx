'use client'

import React, { useState } from 'react'
import { CustomNavLink } from '@/types/cms'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface CustomNavManagerProps {
  links: CustomNavLink[]
  onChange: (links: CustomNavLink[]) => void
}

export const CustomNavManager: React.FC<CustomNavManagerProps> = ({ links, onChange }) => {
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAdd = () => {
    if (!newLabel || !newUrl) return
    const newLink: CustomNavLink = {
      id: Date.now().toString(),
      label: newLabel,
      url: newUrl
    }
    onChange([...links, newLink])
    setNewLabel('')
    setNewUrl('')
  }

  const handleRemove = (id: string) => {
    onChange(links.filter((l) => l.id !== id))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newLinks.length) return
    const temp = newLinks[index]
    newLinks[index] = newLinks[targetIdx]
    newLinks[targetIdx] = temp
    onChange(newLinks)
  }

  return (
    <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Links de Navegação</h4>

      <div className="space-y-2">
        {links.map((link, idx) => (
          <div
            key={link.id}
            className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">{link.label}</span>
              <span className="text-slate-400">({link.url})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === links.length - 1}
                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(link.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          placeholder="Nome do link"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
        <input
          type="text"
          placeholder="URL (ex: /engenharias)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 text-xs bg-primary text-white font-bold rounded-lg flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Adicionar
        </button>
      </div>
    </div>
  )
}
