'use client'

import React, { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import { BlockSchemaField } from '@/cms/block-schemas'

interface ArrayFieldEditorProps {
  items: any[]
  onChange: (items: any[]) => void
  schema?: BlockSchemaField[]
}

export const ArrayFieldEditor: React.FC<ArrayFieldEditorProps> = ({ items = [], onChange, schema }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleAddItem = () => {
    const newItem: Record<string, any> = { id: `item-${Date.now()}` }
    
    // Preenche com valores default caso o schema exista
    if (schema) {
      schema.forEach(field => {
        newItem[field.name] = field.defaultValue || ''
      })
    } else {
      // Legacy fallback
      newItem.title = ''
      newItem.description = ''
    }

    onChange([...items, newItem])
    setExpandedIndex(items.length)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    
    onChange(newItems)
  }

  const handleChangeField = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  // Mini renderizador de campo
  const renderField = (idx: number, field: BlockSchemaField, value: any) => {
    switch (field.type) {
      case 'text':
        return (
          <input type="text" value={value || ''} onChange={e => handleChangeField(idx, field.name, e.target.value)} placeholder={field.defaultValue} className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold" />
        )
      case 'textarea':
        return (
          <textarea rows={3} value={value || ''} onChange={e => handleChangeField(idx, field.name, e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
        )
      case 'select':
        return (
          <select value={value || field.defaultValue} onChange={e => handleChangeField(idx, field.name, e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold">
             {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )
      case 'image':
      case 'video':
        return (
          <input type="text" value={value || ''} onChange={e => handleChangeField(idx, field.name, e.target.value)} placeholder="https://... (URL da imagem/vídeo)" className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono" />
        )
      default:
        return (
          <input type="text" value={value || ''} onChange={e => handleChangeField(idx, field.name, e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
        )
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isExpanded = expandedIndex === idx

        // Lógica para achar o título primário para exibir no Header do Accordion
        let titleValue = 'Novo Item'
        if (schema && schema.length > 0) {
          titleValue = item[schema[0].name] || 'Item sem título'
        } else {
          titleValue = item.title || item.titulo || item.nome || item.question || 'Novo Item'
        }

        return (
          <div key={item.id || idx} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all">
            <div 
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 cursor-pointer select-none"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-400 text-xs w-6 text-center">{idx + 1}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">
                  {titleValue}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleMoveItem(idx, 'up') }}
                  disabled={idx === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleMoveItem(idx, 'down') }}
                  disabled={idx === items.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveItem(idx) }}
                  className="p-1.5 text-red-400 hover:text-red-600 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </div>
            </div>

            {isExpanded && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 bg-slate-50/30 dark:bg-slate-900/30">
                {schema ? (
                  <div className="grid grid-cols-1 gap-4">
                    {schema.map(field => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {field.label}
                        </label>
                        {field.description && <p className="text-[10px] text-slate-500">{field.description}</p>}
                        {renderField(idx, field, item[field.name])}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-amber-600">Este array não tem um schema definido. Modo Legacy de Edição Indisponível (Por favor, defina um schema).</div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-primary transition-colors"
      >
        <Plus className="w-5 h-5" /> Adicionar Novo Item
      </button>
    </div>
  )
}
