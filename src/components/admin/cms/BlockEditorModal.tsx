'use client'

import React, { useState } from 'react'
import { BlockConfig, CustomBlockStyle } from '@/types/landing-page'
import { X, Save, Sliders } from 'lucide-react'
import { ArrayFieldEditor } from './ArrayFieldEditor'
import { BLOCKS_REGISTRY, BlockSchemaField } from '@/cms/block-schemas'

interface BlockEditorModalProps {
  block: BlockConfig
  isOpen: boolean
  onClose: () => void
  onSave: (updatedBlock: BlockConfig) => void
}

export const BlockEditorModal: React.FC<BlockEditorModalProps> = ({
  block,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content')
  const [props, setProps] = useState<Record<string, any>>(block?.props || {})
  const [customStyle, setCustomStyle] = useState<CustomBlockStyle>(block?.customStyle || {})

  if (!isOpen || !block) return null

  const schema = BLOCKS_REGISTRY[block.type]

  const handlePropChange = (key: string, value: any) => {
    setProps((prev) => ({ ...prev, [key]: value }))
  }

  const handleStyleChange = (key: keyof CustomBlockStyle, value: any) => {
    setCustomStyle((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave({
      ...block,
      props,
      customStyle
    })
    onClose()
  }

  const renderField = (field: BlockSchemaField, value: any, onChangeField: (val: any) => void) => {
    switch (field.type) {
      case 'text':
        return (
          <input type="text" value={value || ''} onChange={e => onChangeField(e.target.value)} placeholder={field.defaultValue} className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold" />
        )
      case 'textarea':
        return (
          <textarea rows={2} value={value || ''} onChange={e => onChangeField(e.target.value)} className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
        )
      case 'select':
        return (
          <select value={value || field.defaultValue} onChange={e => onChangeField(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold">
             {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )
      case 'image':
      case 'video':
        return (
          <input type="text" value={value || ''} onChange={e => onChangeField(e.target.value)} placeholder="https://..." className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono" />
        )
      case 'array':
        return (
          <ArrayFieldEditor items={Array.isArray(value) ? value : []} onChange={onChangeField} schema={field.arrayFields} />
        )
      case 'json':
        return (
          <textarea rows={8} value={typeof value === 'string' ? value : JSON.stringify(value || [], null, 2)} onChange={e => { try { onChangeField(JSON.parse(e.target.value)) } catch { onChangeField(e.target.value) } }} className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono" />
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Customizar Bloco: <span className="uppercase text-primary">{schema?.label || block.type}</span>
              </h3>
              <p className="text-xs text-slate-500">Configure o conteúdo e o estilo visual local</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Conteúdo & Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'style' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Estilo Visual Local
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
          
          {activeTab === 'content' && (
            <div className="space-y-6">
              {schema ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  {schema.fields.map((field) => (
                    <div key={field.name} className={`space-y-1 ${field.type === 'array' || field.type === 'textarea' || field.type === 'json' ? 'md:col-span-2' : ''}`}>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{field.label}</label>
                      {field.description && <p className="text-[10px] text-slate-500 mb-1">{field.description}</p>}
                      {renderField(field, props[field.name], (val) => handlePropChange(field.name, val))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-amber-600 bg-amber-50 rounded-xl border border-amber-200">
                  Aviso: Este bloco ("{block.type}") não possui um Schema definido no BLOCKS_REGISTRY.
                </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor de Fundo Local (Bloco)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={customStyle.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 p-1 bg-white dark:bg-slate-900 border rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customStyle.backgroundColor || ''}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    placeholder="Opcional (#hex ou rgb)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor do Texto Local (Bloco)</label>
                <input
                  type="text"
                  value={customStyle.textColor || ''}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  placeholder="Opcional (#hex)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor de Brilho / Sombra (Glow)</label>
                <input
                  type="text"
                  value={customStyle.glowColor || ''}
                  onChange={(e) => handleStyleChange('glowColor', e.target.value)}
                  placeholder="Ex: rgba(37, 99, 235, 0.5)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Espaçamento Interno (Padding)</label>
                <select
                  value={customStyle.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                >
                  <option value="">Padrão do Bloco</option>
                  <option value="1rem">Pequeno (16px)</option>
                  <option value="2rem">Médio (32px)</option>
                  <option value="4rem">Grande (64px)</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Arredondamento das Bordas</label>
                <select
                  value={customStyle.borderRadius || ''}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                >
                  <option value="">Padrão do Bloco</option>
                  <option value="0px">Zero (Reto)</option>
                  <option value="0.5rem">Suave (8px)</option>
                  <option value="1.5rem">Arredondado (24px)</option>
                  <option value="9999px">Circular (Pill)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 flex items-center gap-2 transition-colors"
          >
            <Save className="h-4 w-4" /> Aplicar Estilos
          </button>
        </div>
      </div>
    </div>
  )
}
