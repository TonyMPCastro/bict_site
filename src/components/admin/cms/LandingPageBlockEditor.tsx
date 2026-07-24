'use client'

import React, { useState } from 'react'
import { LandingPageConfig, SectionConfig, BlockConfig, BlockType } from '@/types/landing-page'
import { BlockEditorModal } from './BlockEditorModal'
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Layout, Layers } from 'lucide-react'

interface LandingPageBlockEditorProps {
  config: LandingPageConfig
  onChange: (config: LandingPageConfig) => void
}

export const LandingPageBlockEditor: React.FC<LandingPageBlockEditorProps> = ({
  config,
  onChange
}) => {
  const [activeBlock, setActiveBlock] = useState<{
    sectionId: string
    rowId: string
    colId: string
    block: BlockConfig
  } | null>(null)

  const handleAddSection = () => {
    const newSection: SectionConfig = {
      id: `sec-${Date.now()}`,
      title: `Nova Seção ${config.sections.length + 1}`,
      visible: true,
      backgroundColor: 'transparent',
      padding: '64px 0',
      rows: [
        {
          id: `row-${Date.now()}`,
          columns: [
            {
              id: `col-${Date.now()}`,
              width: '100%',
              block: {
                id: `blk-${Date.now()}`,
                type: 'hero',
                props: { title: 'Título da Seção', subtitle: 'Subtítulo descritivo...' }
              }
            }
          ]
        }
      ]
    }

    onChange({
      ...config,
      sections: [...config.sections, newSection]
    })
  }

  const handleRemoveSection = (secId: string) => {
    onChange({
      ...config,
      sections: config.sections.filter((s) => s.id !== secId)
    })
  }

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= newSections.length) return
    const temp = newSections[idx]
    newSections[idx] = newSections[targetIdx]
    newSections[targetIdx] = temp
    onChange({ ...config, sections: newSections })
  }

  const handleAddBlockToRow = (secId: string, rowId: string, type: BlockType) => {
    const updatedSections = config.sections.map((sec) => {
      if (sec.id !== secId) return sec
      return {
        ...sec,
        rows: sec.rows.map((row) => {
          if (row.id !== rowId) return row
          return {
            ...row,
            columns: [
              ...row.columns,
              {
                id: `col-${Date.now()}`,
                width: '100%' as const,
                block: {
                  id: `blk-${Date.now()}`,
                  type,
                  props: { title: `Novo Bloco ${type}` }
                }
              }
            ]
          }
        })
      }
    })

    onChange({ ...config, sections: updatedSections })
  }

  const handleSaveBlockProps = (updatedBlock: BlockConfig) => {
    if (!activeBlock) return

    const updatedSections = config.sections.map((sec) => {
      if (sec.id !== activeBlock.sectionId) return sec
      return {
        ...sec,
        rows: sec.rows.map((row) => {
          if (row.id !== activeBlock.rowId) return row
          return {
            ...row,
            columns: row.columns.map((col) => {
              if (col.id !== activeBlock.colId) return col
              return {
                ...col,
                block: updatedBlock
              }
            })
          }
        })
      }
    })

    onChange({ ...config, sections: updatedSections })
    setActiveBlock(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Estrutura de Seções da Landing Page
          </h3>
          <p className="text-xs text-slate-500">Reordene, adicione ou edite os blocos visuais da página</p>
        </div>
        <button
          type="button"
          onClick={handleAddSection}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova Seção
        </button>
      </div>

      {/* Lista de Seções */}
      <div className="space-y-4">
        {config.sections.map((sec, secIdx) => (
          <div
            key={sec.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  {secIdx + 1}
                </span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {sec.title || `Seção ${secIdx + 1}`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveSection(secIdx, 'up')}
                  disabled={secIdx === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSection(secIdx, 'down')}
                  disabled={secIdx === config.sections.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveSection(sec.id)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Linhas e Colunas */}
            {sec.rows.map((row) => (
              <div key={row.id} className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {row.columns.map((col) => (
                    <div
                      key={col.id}
                      className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {col.block.type}
                        </span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                          {col.block.props?.title || 'Sem título'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveBlock({
                            sectionId: sec.id,
                            rowId: row.id,
                            colId: col.id,
                            block: col.block
                          })
                        }
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="h-3 w-3" /> Editar
                      </button>
                    </div>
                  ))}
                </div>

                {/* Adicionar Bloco */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400">Adicionar Bloco:</span>
                  <button
                    type="button"
                    onClick={() => handleAddBlockToRow(sec.id, row.id, 'news-grid')}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-[11px]"
                  >
                    + Notícias
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlockToRow(sec.id, row.id, 'whatsapp-cta')}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-[11px]"
                  >
                    + WhatsApp CTA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlockToRow(sec.id, row.id, 'faq')}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-[11px]"
                  >
                    + FAQ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {activeBlock && (
        <BlockEditorModal
          block={activeBlock.block}
          isOpen={!!activeBlock}
          onClose={() => setActiveBlock(null)}
          onSave={handleSaveBlockProps}
        />
      )}
    </div>
  )
}
