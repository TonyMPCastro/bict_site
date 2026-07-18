"use client";

import { useState } from "react";
import { GripVertical, Trash2, Plus, ArrowUp, ArrowDown, Image as ImageIcon, Type, Bell, Newspaper, Upload, Loader2, Rocket, LayoutGrid, Megaphone } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

export type BlockType = "TEXTO" | "BANNER" | "NOTICIAS" | "AVISOS" | "HERO" | "FEATURES" | "CTA";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, activeTab: number, currentUrls: string = '') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const newUrls = [];
      for(let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);
        
        const uploadUrl = typeof window !== "undefined"
          ? `${window.location.origin}/api/upload`
          : "/api/upload";

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        
        const result = await response.json();
        if(result.success) {
          newUrls.push(result.data.link);
        }
      }
      
      const combinedUrls = currentUrls ? `${currentUrls}, ${newUrls.join(", ")}` : newUrls.join(", ");
      updateBlockJson(activeTab, 'imageUrl', combinedUrls);
    } catch (error) {
      alert("Erro no upload");
    } finally {
      setIsUploading(false);
      // reset file input
      e.target.value = '';
    }
  };

  const addBlock = (tipo: BlockType) => {
    let conteudoPadrao = "";
    if (tipo === "TEXTO") conteudoPadrao = "<p>Novo texto...</p>";
    if (tipo === "BANNER") conteudoPadrao = JSON.stringify({ imageUrl: "", title: "", subtitle: "", buttonText: "", buttonUrl: "" });
    if (tipo === "NOTICIAS") conteudoPadrao = JSON.stringify({ limit: 3 });
    if (tipo === "AVISOS") conteudoPadrao = JSON.stringify({ text: "Digite o aviso aqui...", type: "info" });
    if (tipo === "HERO") conteudoPadrao = JSON.stringify({ superTitle: "Plataforma Acadêmica", title: "Bacharelado Interdisciplinar em", gradientWord: "Ciência e Tecnologia", description: "Gerencie sua trajetória acadêmica...", button1Text: "Ver Grades", button1Url: "/engenharias", button2Text: "Área do Aluno", button2Url: "/login" });
    if (tipo === "FEATURES") conteudoPadrao = JSON.stringify({ title: "Tudo o que você precisa", description: "Nossa plataforma foi desenhada para centralizar informações...", features: [{ icon: "Cpu", title: "Grades Dinâmicas", description: "Visualize os pré-requisitos...", color: "blue" }, { icon: "Layers", title: "Multidisciplinar", description: "Acesse facilmente informações...", color: "indigo" }, { icon: "ShieldCheck", title: "Portal Seguro", description: "Sistema administrativo protegido...", color: "emerald" }] });
    if (tipo === "CTA") conteudoPadrao = JSON.stringify({ title: "Pronto para organizar seus estudos?", description: "Acesse a plataforma e navegue com mais autonomia pelo seu percurso acadêmico.", buttonText: "Acessar Plataforma", buttonUrl: "/engenharias", bgColor: "#ffffff", textColor: "#000000" });

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
      case "HERO": return <Rocket className="w-4 h-4" />;
      case "FEATURES": return <LayoutGrid className="w-4 h-4" />;
      case "CTA": return <Megaphone className="w-4 h-4" />;
  };


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
        <button type="button" onClick={() => addBlock("HERO")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <Rocket className="w-4 h-4 text-indigo-500" /> Adicionar Hero
        </button>
        <button type="button" onClick={() => addBlock("FEATURES")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <LayoutGrid className="w-4 h-4 text-cyan-500" /> Adicionar Features
        </button>
        <button type="button" onClick={() => addBlock("CTA")} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
          <Megaphone className="w-4 h-4 text-pink-500" /> Adicionar CTA
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
                  <div className="space-y-6">
                    {(() => {
                      try {
                        let data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        
                        // Migração de formato antigo para novo (array de slides)
                        if (!data.slides) {
                          const oldSlide = { ...data };
                          data = { slides: [oldSlide] };
                        }
                        const slides = data.slides || [];

                        const updateSlide = (slideIndex: number, field: string, value: any) => {
                          const newSlides = [...slides];
                          newSlides[slideIndex] = { ...newSlides[slideIndex], [field]: value };
                          updateBlockContent(activeTab, JSON.stringify({ ...data, slides: newSlides }));
                        };

                        const addSlide = () => {
                          const newSlides = [...slides, { bgType: 'image', imageUrl: '', title: 'Novo Slide' }];
                          updateBlockContent(activeTab, JSON.stringify({ ...data, slides: newSlides }));
                        };

                        const removeSlide = (slideIndex: number) => {
                          const newSlides = slides.filter((_: any, i: number) => i !== slideIndex);
                          updateBlockContent(activeTab, JSON.stringify({ ...data, slides: newSlides }));
                        };
                        
                        const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
                           const files = e.target.files;
                           if (!files || files.length === 0) return;
                           
                           setIsUploading(true);
                           try {
                             const formData = new FormData();
                             formData.append("image", files[0]); // apenas 1 por vez no slide
                             const uploadUrl = typeof window !== "undefined"
                               ? `${window.location.origin}/api/upload`
                               : "/api/upload";
                             const response = await fetch(uploadUrl, { method: "POST", body: formData });
                             const result = await response.json();
                             if(result.success) {
                               updateSlide(slideIndex, 'imageUrl', result.data.link);
                             }
                           } catch (error) {
                             alert("Erro no upload");
                           } finally {
                             setIsUploading(false);
                             e.target.value = '';
                           }
                        };

                        return (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Slides do Banner</h4>
                              <button type="button" onClick={addSlide} className="text-sm bg-blue-100 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors">
                                <Plus className="w-4 h-4 inline-block mr-1" />
                                Adicionar Slide
                              </button>
                            </div>

                            {slides.map((slide: any, slideIndex: number) => (
                              <div key={slideIndex} className="p-5 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-900/50 space-y-4 relative">
                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800 pb-3">
                                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Slide {slideIndex + 1}</span>
                                  <button type="button" onClick={() => removeSlide(slideIndex)} disabled={slides.length === 1} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded transition-colors disabled:opacity-30">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <div className="space-y-4 border-b border-gray-200 dark:border-slate-800 pb-4 mb-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo de Fundo</label>
                                    <select 
                                      value={slide.bgType || 'image'}
                                      onChange={(e) => updateSlide(slideIndex, 'bgType', e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950"
                                    >
                                      <option value="image">Imagem</option>
                                      <option value="color">Cor Sólida</option>
                                      <option value="gradient">Gradiente</option>
                                    </select>
                                  </div>

                                  {(!slide.bgType || slide.bgType === 'image') && (
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Imagem de Fundo (URL)</label>
                                      <div className="flex gap-2">
                                        <input 
                                          value={slide.imageUrl || ''}
                                          onChange={(e) => updateSlide(slideIndex, 'imageUrl', e.target.value)}
                                          className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950"
                                          placeholder="/banner1.jpg"
                                        />
                                        <div className="relative">
                                          <input 
                                            type="file" accept="image/*"
                                            onChange={(e) => handleSlideImageUpload(e, slideIndex)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            disabled={isUploading}
                                          />
                                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 dark:border-slate-700 h-full ${isUploading ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50'}`}>
                                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {slide.bgType === 'color' && (
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Cor de Fundo (Hex)</label>
                                      <div className="flex gap-2 items-center">
                                        <input type="color" value={slide.bgColor || '#2563eb'} onChange={(e) => updateSlide(slideIndex, 'bgColor', e.target.value)} className="w-14 h-10 p-1 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer" />
                                        <input type="text" value={slide.bgColor || '#2563eb'} onChange={(e) => updateSlide(slideIndex, 'bgColor', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-mono" />
                                      </div>
                                    </div>
                                  )}

                                  {slide.bgType === 'gradient' && (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Cor 1 (Hex)</label>
                                        <div className="flex gap-2 items-center">
                                          <input type="color" value={slide.gradientColor1 || '#2563eb'} onChange={(e) => updateSlide(slideIndex, 'gradientColor1', e.target.value)} className="w-14 h-10 p-1 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer" />
                                          <input type="text" value={slide.gradientColor1 || '#2563eb'} onChange={(e) => updateSlide(slideIndex, 'gradientColor1', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-mono" />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Cor 2 (Hex)</label>
                                        <div className="flex gap-2 items-center">
                                          <input type="color" value={slide.gradientColor2 || '#4f46e5'} onChange={(e) => updateSlide(slideIndex, 'gradientColor2', e.target.value)} className="w-14 h-10 p-1 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer" />
                                          <input type="text" value={slide.gradientColor2 || '#4f46e5'} onChange={(e) => updateSlide(slideIndex, 'gradientColor2', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-mono" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Título Principal</label>
                                    <input value={slide.title || ''} onChange={(e) => updateSlide(slideIndex, 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Subtítulo (Opcional)</label>
                                    <input value={slide.subtitle || ''} onChange={(e) => updateSlide(slideIndex, 'subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto do Botão (Opcional)</label>
                                    <input value={slide.buttonText || ''} onChange={(e) => updateSlide(slideIndex, 'buttonText', e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Link do Botão (Opcional)</label>
                                    <input value={slide.buttonUrl || ''} onChange={(e) => updateSlide(slideIndex, 'buttonUrl', e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
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
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Quantidade de Notícias para Exibir</label>
                              <input 
                                type="number"
                                value={data.limit || 3}
                                onChange={(e) => updateBlockJson(activeTab, 'limit', Number(e.target.value))}
                                className="w-full max-w-xs px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <input 
                                type="checkbox"
                                id="highlightNews"
                                checked={data.highlight || false}
                                onChange={(e) => updateBlockJson(activeTab, 'highlight', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="highlightNews" className="text-sm font-medium">Destacar a primeira notícia?</label>
                            </div>
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

                {/* Editor para HERO */}
                {blocks[activeTab].tipo === "HERO" && (
                  <div className="space-y-4">
                    {(() => {
                      try {
                        const data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-sm font-medium">Selo Superior (Super Title)</label>
                              <input value={data.superTitle || ''} onChange={(e) => updateBlockJson(activeTab, 'superTitle', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-sm font-medium">Título Principal (Texto normal)</label>
                              <input value={data.title || ''} onChange={(e) => updateBlockJson(activeTab, 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-sm font-medium">Palavra com Gradiente (Destaque)</label>
                              <input value={data.gradientWord || ''} onChange={(e) => updateBlockJson(activeTab, 'gradientWord', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-sm font-medium">Descrição</label>
                              <textarea value={data.description || ''} onChange={(e) => updateBlockJson(activeTab, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 h-20" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Texto Botão Primário</label>
                              <input value={data.button1Text || ''} onChange={(e) => updateBlockJson(activeTab, 'button1Text', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">URL Botão Primário</label>
                              <input value={data.button1Url || ''} onChange={(e) => updateBlockJson(activeTab, 'button1Url', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Texto Botão Secundário</label>
                              <input value={data.button2Text || ''} onChange={(e) => updateBlockJson(activeTab, 'button2Text', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">URL Botão Secundário</label>
                              <input value={data.button2Url || ''} onChange={(e) => updateBlockJson(activeTab, 'button2Url', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                          </div>
                        );
                      } catch (e) {
                        return <p className="text-red-500">Erro no JSON.</p>;
                      }
                    })()}
                  </div>
                )}

                {/* Editor para FEATURES */}
                {blocks[activeTab].tipo === "FEATURES" && (
                  <div className="space-y-6">
                    {(() => {
                      try {
                        const data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        const features = Array.isArray(data.features) ? data.features : [];

                        const updateFeature = (fIndex: number, field: string, value: string) => {
                          const newFeatures = [...features];
                          newFeatures[fIndex] = { ...newFeatures[fIndex], [field]: value };
                          updateBlockJson(activeTab, 'features', newFeatures);
                        };

                        return (
                          <>
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                              <div>
                                <label className="text-sm font-medium">Título da Seção</label>
                                <input value={data.title || ''} onChange={(e) => updateBlockJson(activeTab, 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Descrição da Seção</label>
                                <input value={data.description || ''} onChange={(e) => updateBlockJson(activeTab, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center justify-between">
                                Cartões de Funcionalidades
                                <button type="button" onClick={() => updateBlockJson(activeTab, 'features', [...features, { icon: 'Star', title: 'Nova Feature', description: '', color: 'blue' }])} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md">
                                  + Adicionar Cartão
                                </button>
                              </h4>
                              
                              {features.map((feature: any, fIndex: number) => (
                                <div key={fIndex} className="p-4 border rounded-xl bg-gray-50/50 dark:bg-slate-900/50 space-y-3 relative">
                                  <button type="button" onClick={() => updateBlockJson(activeTab, 'features', features.filter((_: any, i: number) => i !== fIndex))} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  
                                  <div className="grid grid-cols-2 gap-4 mr-8">
                                    <div>
                                      <label className="text-xs font-medium">Nome do Ícone (Lucide)</label>
                                      <input value={feature.icon} onChange={e => updateFeature(fIndex, 'icon', e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-800" placeholder="ex: Cpu, Layers..." />
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium">Cor do Ícone</label>
                                      <select value={feature.color} onChange={e => updateFeature(fIndex, 'color', e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-800">
                                        <option value="blue">Azul</option>
                                        <option value="indigo">Índigo</option>
                                        <option value="emerald">Verde (Emerald)</option>
                                        <option value="orange">Laranja</option>
                                        <option value="purple">Roxo</option>
                                      </select>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-xs font-medium">Título do Cartão</label>
                                      <input value={feature.title} onChange={e => updateFeature(fIndex, 'title', e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-800" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-xs font-medium">Descrição</label>
                                      <textarea value={feature.description} onChange={e => updateFeature(fIndex, 'description', e.target.value)} className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-slate-800 h-16" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      } catch (e) {
                        return <p className="text-red-500">Erro no JSON.</p>;
                      }
                    })()}
                  </div>
                )}

                {/* Editor para CTA */}
                {blocks[activeTab].tipo === "CTA" && (
                  <div className="space-y-4">
                    {(() => {
                      try {
                        const data = JSON.parse(blocks[activeTab].conteudo || '{}');
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-sm font-medium">Título da Chamada</label>
                              <input value={data.title || ''} onChange={(e) => updateBlockJson(activeTab, 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-sm font-medium">Descrição</label>
                              <textarea value={data.description || ''} onChange={(e) => updateBlockJson(activeTab, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 h-20" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Texto do Botão</label>
                              <input value={data.buttonText || ''} onChange={(e) => updateBlockJson(activeTab, 'buttonText', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">URL do Botão</label>
                              <input value={data.buttonUrl || ''} onChange={(e) => updateBlockJson(activeTab, 'buttonUrl', e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Cor de Fundo</label>
                              <input type="color" value={data.bgColor || '#ffffff'} onChange={(e) => updateBlockJson(activeTab, 'bgColor', e.target.value)} className="w-12 h-10 p-0 border rounded-lg bg-white" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Cor do Texto</label>
                              <input type="color" value={data.textColor || '#000000'} onChange={(e) => updateBlockJson(activeTab, 'textColor', e.target.value)} className="w-12 h-10 p-0 border rounded-lg bg-white" />
                            </div>
                          </div>
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