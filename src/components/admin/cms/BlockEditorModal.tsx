'use client'

import React, { useState } from 'react'
import { BlockConfig } from '@/types/landing-page'
import { X, Save, Plus, Trash2, Sliders, Layout, Sparkles } from 'lucide-react'

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

  const isNewsBlock = block.type === 'news-grid' || block.type === 'news-featured'
  const isHeroBlock = block.type === 'hero' || block.type === 'banner-hero-carousel' || block.type === 'banner-hero-search'
  const isEngBlock = block.type === 'engineering-catalog'
  const isFaqBlock = block.type === 'faq'
  const isWhatsAppBlock = block.type === 'whatsapp-cta'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Customizar Bloco: <span className="uppercase text-primary">{block.type}</span>
              </h3>
              <p className="text-xs text-slate-500">Configure quantidades, destaques, parâmetros e layout</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Título e Subtítulo Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título do Bloco</label>
              <input
                type="text"
                value={props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                placeholder="Ex: Últimas Notícias & Comunicados"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtítulo / Descrição</label>
              <textarea
                rows={2}
                value={props.subtitle || props.description || ''}
                onChange={(e) => handlePropChange('subtitle', e.target.value)}
                placeholder="Descrição curta exibida abaixo do título..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>
          </div>

          {/* CUSTOMIZAÇÃO ESPECÍFICA PARA BLOCOS DE NOTÍCIAS */}
          {isNewsBlock && (
            <div className="space-y-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Parâmetros de Notícias
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantidade de Notícias</label>
                  <select
                    value={props.limit || 6}
                    onChange={(e) => handlePropChange('limit', Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  >
                    <option value={3}>3 Notícias</option>
                    <option value={6}>6 Notícias</option>
                    <option value={9}>9 Notícias</option>
                    <option value={12}>12 Notícias</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estilo de Layout</label>
                  <select
                    value={props.layoutStyle || 'bento'}
                    onChange={(e) => handlePropChange('layoutStyle', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  >
                    <option value="bento">Bento Grid (Aceternity UI)</option>
                    <option value="cards3d">Cartões 3D com Efeito Hover</option>
                    <option value="grid">Grade Padrão de Cartões</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-blue-100 dark:border-blue-900/40">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={props.showDestaque ?? true}
                    onChange={(e) => handlePropChange('showDestaque', e.target.checked)}
                    className="h-4 w-4 rounded text-primary cursor-pointer"
                  />
                  <span>Exibir Notícia em Destaque no Topo (Card Expandido)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={props.showDate ?? true}
                    onChange={(e) => handlePropChange('showDate', e.target.checked)}
                    className="h-4 w-4 rounded text-primary cursor-pointer"
                  />
                  <span>Exibir Data de Publicação</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={props.showExcerpt ?? true}
                    onChange={(e) => handlePropChange('showExcerpt', e.target.checked)}
                    className="h-4 w-4 rounded text-primary cursor-pointer"
                  />
                  <span>Exibir Resumo/Lead das Notícias</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Texto do Botão "Ver Mais"</label>
                <input
                  type="text"
                  value={props.buttonText || 'Ver Todas as Notícias'}
                  onChange={(e) => handlePropChange('buttonText', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>
            </div>
          )}

          {/* CUSTOMIZAÇÃO PARA ENGENHARIAS */}
          {isEngBlock && (
            <div className="space-y-4 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Layout className="h-4 w-4" /> Opções de Engenharias
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantidade Exibida</label>
                  <select
                    value={props.limit || 6}
                    onChange={(e) => handlePropChange('limit', Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <option value={3}>3 Cursos</option>
                    <option value={6}>6 Cursos (Todos)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Visual dos Cards</label>
                  <select
                    value={props.cardVariant || '3d'}
                    onChange={(e) => handlePropChange('cardVariant', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <option value="3d">Cartões 3D com Efeito Tilt</option>
                    <option value="bento">Bento Grid com Destaque</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMIZAÇÃO PARA HERO */}
          {isHeroBlock && (
            <div className="space-y-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Opções do Hero Banner
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold">Badge em Destaque (Topo)</label>
                  <input
                    type="text"
                    value={props.badgeText || ''}
                    onChange={(e) => handlePropChange('badgeText', e.target.value)}
                    placeholder="Ex: Inscrições Abertas 2026.2"
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">Texto do Botão Principal</label>
                  <input
                    type="text"
                    value={props.ctaText || 'Conhecer as Engenharias'}
                    onChange={(e) => handlePropChange('ctaText', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold">URL do Botão Principal</label>
                  <input
                    type="text"
                    value={props.ctaUrl || '/engenharias'}
                    onChange={(e) => handlePropChange('ctaUrl', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CAMPO DE VÍDEO EMBED */}
          {block.type === 'video' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL do Vídeo (YouTube)</label>
              <input
                type="text"
                value={props.videoUrl || ''}
                onChange={(e) => handlePropChange('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
              />
            </div>
          )}

          {/* TEXTO LIVRE */}
          {block.type === 'text' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Conteúdo HTML / Texto</label>
              <textarea
                rows={6}
                value={props.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
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
            className="px-5 py-2.5 text-xs font-bold bg-primary text-white rounded-xl flex items-center gap-1.5 shadow-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4" /> Salvar Customizações
          </button>
        </div>
      </div>
    </div>
  )
}
