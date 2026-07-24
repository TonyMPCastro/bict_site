'use client'

import React, { useState } from 'react'
import { BlockConfig, CustomBlockStyle } from '@/types/landing-page'
import { X, Save, Sliders, Layout, Sparkles, MessageCircle, Quote, Tag } from 'lucide-react'

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

  const isNewsBlock = block.type === 'news-grid' || block.type === 'news-featured'
  const isHeroBlock = block.type === 'hero' || block.type === 'banner-hero-carousel' || block.type === 'banner-hero-search'
  const isEngBlock = block.type === 'engineering-catalog'
  const isFaqBlock = block.type === 'faq'
  const isWhatsAppBlock = block.type === 'whatsapp-cta'
  const isTestimonialsBlock = block.type === 'testimonials' || block.type === 'banner-carousel'
  const isPricingBlock = block.type === 'pricing'

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
                Customizar Bloco: <span className="uppercase text-primary">{block.type}</span>
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
              {/* Título e Subtítulo Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título do Bloco</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="Ex: Últimas Notícias & Comunicados"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtítulo / Descrição</label>
                  <textarea
                    rows={2}
                    value={props.subtitle || props.description || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="Descrição curta exibida abaixo do título..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              {/* CUSTOMIZAÇÃO ESPECÍFICA PARA BLOCOS DE NOTÍCIAS */}
              {isNewsBlock && (
                <div className="space-y-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Parâmetros de Notícias
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Quantidade de Notícias</label>
                      <select
                        value={props.limit || 6}
                        onChange={(e) => handlePropChange('limit', Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950 font-bold"
                      >
                        <option value={3}>3 Notícias</option>
                        <option value={6}>6 Notícias</option>
                        <option value={9}>9 Notícias</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOMIZAÇÃO PARA ENGENHARIAS */}
              {isEngBlock && (
                <div className="space-y-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Layout className="h-4 w-4" /> Opções de Engenharias
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Visual dos Cards</label>
                      <select
                        value={props.cardVariant || '3d'}
                        onChange={(e) => handlePropChange('cardVariant', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
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
                <div className="space-y-4 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Opções do Hero Banner
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Texto do Botão Principal</label>
                      <input
                        type="text"
                        value={props.ctaText || 'Conhecer as Engenharias'}
                        onChange={(e) => handlePropChange('ctaText', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div className="space-y-1">
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

              {/* WHATSAPP CTA */}
              {isWhatsAppBlock && (
                <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" /> Opções do WhatsApp CTA
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Número de Telefone</label>
                      <input
                        type="text"
                        value={props.phoneNumber || '5598988888888'}
                        onChange={(e) => handlePropChange('phoneNumber', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Texto do Botão</label>
                      <input
                        type="text"
                        value={props.buttonText || 'Falar no WhatsApp'}
                        onChange={(e) => handlePropChange('buttonText', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TESTIMONIALS */}
              {isTestimonialsBlock && (
                <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Quote className="h-4 w-4" /> Configuração do Carrossel (Items JSON)
                  </h4>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Array de Itens (JSON)</label>
                    <textarea
                      rows={6}
                      value={typeof props.items === 'string' ? props.items : JSON.stringify(props.items || [], null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value)
                          handlePropChange('items', parsed)
                        } catch(err) {
                          handlePropChange('items', e.target.value) // salva string se invalido enquanto digita
                        }
                      }}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>
              )}
              
              {/* PRICING */}
              {isPricingBlock && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag className="h-4 w-4" /> Planos (JSON)
                  </h4>
                  <div className="space-y-1">
                    <textarea
                      rows={8}
                      value={typeof props.plans === 'string' ? props.plans : JSON.stringify(props.plans || [], null, 2)}
                      onChange={(e) => {
                        try {
                          handlePropChange('plans', JSON.parse(e.target.value))
                        } catch(err) {
                          handlePropChange('plans', e.target.value) 
                        }
                      }}
                      className="w-full text-xs p-3 rounded-xl border bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* IMAGE / VIDEO */}
              {(block.type === 'video' || block.type === 'image') && (
                <div className="space-y-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL da Mídia</label>
                  <input
                    type="text"
                    value={props.videoUrl || props.imageUrl || ''}
                    onChange={(e) => handlePropChange(block.type === 'video' ? 'videoUrl' : 'imageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 font-mono"
                  />
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
                    className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950 font-mono"
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
                  className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor de Brilho / Sombra (Glow)</label>
                <input
                  type="text"
                  value={customStyle.glowColor || ''}
                  onChange={(e) => handleStyleChange('glowColor', e.target.value)}
                  placeholder="Ex: rgba(37, 99, 235, 0.5)"
                  className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Espaçamento Interno (Padding)</label>
                <select
                  value={customStyle.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
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
                  className="w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-slate-950"
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

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-xs font-bold bg-primary text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
          >
            <Save className="h-4 w-4" /> Salvar Bloco
          </button>
        </div>
      </div>
    </div>
  )
}
