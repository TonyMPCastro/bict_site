'use client'

import React, { useState } from 'react'
import { LandingPageConfig, SectionConfig, BlockConfig, BlockType } from '@/types/landing-page'
import { BlockEditorModal } from './BlockEditorModal'
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Layout, Layers, Settings2 } from 'lucide-react'

interface LandingPageBlockEditorProps {
  config: LandingPageConfig
  onChange: (config: LandingPageConfig) => void
}

export const LandingPageBlockEditor: React.FC<LandingPageBlockEditorProps> = ({
  config,
  onChange
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
              <div className="flex flex-col gap-1 w-full sm:w-auto flex-1">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {secIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={sec.title || ''}
                    onChange={(e) => {
                      const newSections = [...config.sections]
                      newSections[secIdx].title = e.target.value
                      onChange({ ...config, sections: newSections })
                    }}
                    placeholder="Título da Seção (Interno)"
                    className="font-bold text-sm text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none w-full placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 justify-end">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                  className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-colors ${
                    expandedSection === sec.id ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Configurações da Seção"
                >
                  <Settings2 className="h-4 w-4" /> Estilo
                </button>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
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

            {/* Painel Expansível de Estilo da Seção */}
            {expandedSection === sec.id && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Layout className="h-3.5 w-3.5" /> Estilo e Configuração da Seção
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor de Fundo (Tema)</label>
                    <select
                      value={sec.backgroundColor || 'transparent'}
                      onChange={(e) => {
                        const newSections = [...config.sections]
                        newSections[secIdx].backgroundColor = e.target.value as any
                        onChange({ ...config, sections: newSections })
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    >
                      <option value="transparent">Transparente</option>
                      <option value="default">Padrão do Site</option>
                      <option value="muted">Secundária (Muted)</option>
                      <option value="primary">Destaque Primário</option>
                      <option value="dark">Fundo Escuro (Dark)</option>
                      <option value="custom">Cor Personalizada</option>
                    </select>
                  </div>
                  
                  {sec.backgroundColor === 'custom' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hex/RGB Fundo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={sec.customBackgroundColor || '#ffffff'}
                          onChange={(e) => {
                            const newSections = [...config.sections]
                            newSections[secIdx].customBackgroundColor = e.target.value
                            onChange({ ...config, sections: newSections })
                          }}
                          className="h-8 w-10 p-0.5 rounded cursor-pointer border-none bg-transparent"
                        />
                        <input
                          type="text"
                          value={sec.customBackgroundColor || ''}
                          onChange={(e) => {
                            const newSections = [...config.sections]
                            newSections[secIdx].customBackgroundColor = e.target.value
                            onChange({ ...config, sections: newSections })
                          }}
                          placeholder="#ffffff"
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor do Texto (Opcional)</label>
                    <input
                      type="text"
                      value={sec.textColor || ''}
                      onChange={(e) => {
                        const newSections = [...config.sections]
                        newSections[secIdx].textColor = e.target.value
                        onChange({ ...config, sections: newSections })
                      }}
                      placeholder="#000 ou var(--primary)"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Espaçamento (Padding)</label>
                    <select
                      value={sec.padding || '64px 0'}
                      onChange={(e) => {
                        const newSections = [...config.sections]
                        newSections[secIdx].padding = e.target.value
                        onChange({ ...config, sections: newSections })
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    >
                      <option value="64px 0">Normal (64px)</option>
                      <option value="32px 0">Pequeno (32px)</option>
                      <option value="96px 0">Grande (96px)</option>
                      <option value="0">Sem Espaçamento</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

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
