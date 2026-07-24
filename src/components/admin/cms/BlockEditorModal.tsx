'use client'

import React, { useState } from 'react'
import { BlockConfig } from '@/types/landing-page'
import { X, Save } from 'lucide-react'

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
  const [props, setProps] = useState<Record<string, any>>(block?.props || {})

  if (!isOpen || !block) return null

  const handlePropChange = (key: string, value: any) => {
    setProps((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave({
      ...block,
      props
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Editar Bloco: {block.type}
            </h3>
            <p className="text-xs text-slate-500">Ajuste os parâmetros visuais e textos do bloco</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Campos dinâmicos conforme o tipo de bloco */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título</label>
            <input
              type="text"
              value={props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtítulo / Descrição</label>
            <textarea
              rows={3}
              value={props.subtitle || props.description || ''}
              onChange={(e) => handlePropChange('subtitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>

          {(block.type === 'hero' || block.type === 'cta' || block.type === 'whatsapp-cta') && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Texto do Botão CTA</label>
                <input
                  type="text"
                  value={props.ctaText || props.buttonText || ''}
                  onChange={(e) => handlePropChange('ctaText', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL do Botão</label>
                <input
                  type="text"
                  value={props.ctaUrl || props.buttonUrl || ''}
                  onChange={(e) => handlePropChange('ctaUrl', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>
            </>
          )}

          {block.type === 'video' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL do Vídeo Embed (YouTube)</label>
              <input
                type="text"
                value={props.videoUrl || ''}
                onChange={(e) => handlePropChange('videoUrl', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>
          )}

          {block.type === 'text' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Conteúdo HTML / Texto</label>
              <textarea
                rows={6}
                value={props.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg flex items-center gap-1.5 shadow-md"
          >
            <Save className="h-4 w-4" /> Salvar Bloco
          </button>
        </div>
      </div>
    </div>
  )
}
