"use client";

import { useState } from "react";
import { GripVertical, Trash2, Plus, ArrowUp, ArrowDown, Image as ImageIcon, Type, Bell, Newspaper } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

export type BlockType = "TEXTO" | "BANNER" | "NOTICIAS" | "AVISOS";

export interface BlockData {
  id?: string;
  tipo: BlockType;
  titulo?: string | null;
  conteudo: string; // JSON string ou HTML dependendo do tipo
  ordem: number;
}

interface BlockBuilderProps {
  blocks: BlockData[];
  onChange: (blocks: BlockData[]) => void;
}

export default function BlockBuilder({ blocks, onChange }: BlockBuilderProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const addBlock = (tipo: BlockType) => {
    let conteudoPadrao = "";
    if (tipo === "TEXTO") conteudoPadrao = "<p>Novo texto...</p>";
    if (tipo === "BANNER") conteudoPadrao = JSON.stringify({ imageUrl: "", title: "", subtitle: "", buttonText: "", buttonUrl: "" });
    if (tipo === "NOTICIAS") conteudoPadrao = JSON.stringify({ limit: 3 });
    if (tipo === "AVISOS") conteudoPadrao = JSON.stringify({ text: "Digite o aviso aqui...", type: "info" });

    const newBlocks = [
      ...blocks,
      {
        tipo,
        conteudo: conteudoPadrao,
        ordem: blocks.length,
      },
    ];
    onChange(newBlocks);
    setActiveTab(newBlocks.length - 1);
  };

  const removeBlock = (index: number) => {
    if (!confirm("Tem certeza que deseja remover este bloco?")) return;
    const newBlocks = blocks.filter((_, i) => i !== index);
    // Reordenar
    const reordered = newBlocks.map((b, i) => ({ ...b, ordem: i }));
    onChange(reordered);
    setActiveTab(Math.max(0, index - 1));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[swapIndex];
    newBlocks[swapIndex] = temp;

    // Update ordem
    newBlocks[index].ordem = index;
    newBlocks[swapIndex].ordem = swapIndex;

    onChange(newBlocks);
    setActiveTab(swapIndex);
  };

  const updateBlockContent = (index: number, newContent: string) => {
    const newBlocks = [...blocks];
    newBlocks[index].conteudo = newContent;
    onChange(newBlocks);
  };

  const updateBlockJson = (index: number, field: string, value: any) => {
    const newBlocks = [...blocks];
    try {
      const data = JSON.parse(newBlocks[index].conteudo);
      data[field] = value;
      newBlocks[index].conteudo = JSON.stringify(data);
      onChange(newBlocks);
    } catch (e) {
      console.error("Erro ao parsear JSON do bloco", e);
    }
  };

  const getIconForType = (tipo: BlockType) => {
    switch (tipo) {
      case "TEXTO": return <Type className="w-4 h-4" />;
      case "BANNER": return <ImageIcon className="w-4 h-4" />;
      case "NOTICIAS": return <Newspaper className="w-4 h-4" />;
      case "AVISOS": return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Adicionar Blocos */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => addBlock("TEXTO")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <Type className="w-4 h-4 text-blue-500" /> Adicionar Texto
        </button>
        <button type="button" onClick={() => addBlock("BANNER")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <ImageIcon className="w-4 h-4 text-purple-500" /> Adicionar Banner
        </button>
        <button type="button" onClick={() => addBlock("NOTICIAS")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <Newspaper className="w-4 h-4 text-emerald-500" /> Adicionar Notícias
        </button>
        <button type="button" onClick={() => addBlock("AVISOS")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <Bell className="w-4 h-4 text-orange-500" /> Adicionar Avisos
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">Nenhum bloco adicionado. Escolha uma opção acima para começar.</p>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Menu Lateral de Blocos (Navegação/Reordenação) */}
          <div className="w-64 shrink-0 space-y-2">
            {blocks.map((block, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${activeTab === index ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50' : 'bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'}`}
                onClick={() => setActiveTab(index)}
              >
                <div className="flex-1 flex items-center gap-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                  {getIconForType(block.tipo)}
                  {block.tipo}
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Área de Edição do Bloco Ativo */}
          <div className="flex-1 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
            {blocks[activeTab] && (
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    {getIconForType(blocks[activeTab].tipo)} Editando Bloco: {blocks[activeTab].tipo}
                  </h3>
                  <button type="button" onClick={() => removeBlock(activeTab)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" /> Remover Bloco
                  </button>
                </div>

                {/* Editor para TEXTO */}
                {blocks[activeTab].tipo === "TEXTO" && (
                  <RichTextEditor 
                    value={blocks[activeTab].conteudo} 
                    onChange={(html) => updateBlockContent(activeTab, html)} 
                  />
                )}

                {/* Editor para BANNER */}
                {blocks[activeTab].tipo === "BANNER" && (
                  <div className="space-y-4">
                    {(() => {
                      try {
                        const data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        return (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Imagem de Fundo (URL)</label>
                              <div className="flex gap-2">
                                <input 
                                  value={data.imageUrl || ''}
                                  onChange={(e) => updateBlockJson(activeTab, 'imageUrl', e.target.value)}
                                  className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                                  placeholder="/uploads/banner.jpg"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Título Principal</label>
                                <input 
                                  value={data.title || ''}
                                  onChange={(e) => updateBlockJson(activeTab, 'title', e.target.value)}
                                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Subtítulo (Opcional)</label>
                                <input 
                                  value={data.subtitle || ''}
                                  onChange={(e) => updateBlockJson(activeTab, 'subtitle', e.target.value)}
                                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Texto do Botão (Opcional)</label>
                                <input 
                                  value={data.buttonText || ''}
                                  onChange={(e) => updateBlockJson(activeTab, 'buttonText', e.target.value)}
                                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Link do Botão (Opcional)</label>
                                <input 
                                  value={data.buttonUrl || ''}
                                  onChange={(e) => updateBlockJson(activeTab, 'buttonUrl', e.target.value)}
                                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                                />
                              </div>
                            </div>
                          </>
                        );
                      } catch (e) {
                        return <p className="text-red-500">Erro no JSON do banner.</p>;
                      }
                    })()}
                  </div>
                )}

                {/* Editor para NOTICIAS */}
                {blocks[activeTab].tipo === "NOTICIAS" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Este bloco puxa automaticamente as últimas notícias do sistema.</p>
                    {(() => {
                      try {
                        const data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        return (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Quantidade de Notícias para Exibir</label>
                            <input 
                              type="number"
                              value={data.limit || 3}
                              onChange={(e) => updateBlockJson(activeTab, 'limit', Number(e.target.value))}
                              className="w-full max-w-xs px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                            />
                          </div>
                        );
                      } catch (e) {
                        return <p className="text-red-500">Erro no JSON.</p>;
                      }
                    })()}
                  </div>
                )}

                {/* Editor para AVISOS */}
                {blocks[activeTab].tipo === "AVISOS" && (
                  <div className="space-y-4">
                    {(() => {
                      try {
                        const data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        return (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Texto do Aviso</label>
                              <textarea 
                                value={data.text || ''}
                                onChange={(e) => updateBlockJson(activeTab, 'text', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700 h-24"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Tipo (Cor)</label>
                              <select 
                                value={data.type || 'info'}
                                onChange={(e) => updateBlockJson(activeTab, 'type', e.target.value)}
                                className="w-full max-w-xs px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                              >
                                <option value="info">Informativo (Azul)</option>
                                <option value="warning">Alerta (Amarelo)</option>
                                <option value="danger">Urgente (Vermelho)</option>
                              </select>
                            </div>
                          </>
                        );
                      } catch (e) {
                        return <p className="text-red-500">Erro no JSON.</p>;
                      }
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
