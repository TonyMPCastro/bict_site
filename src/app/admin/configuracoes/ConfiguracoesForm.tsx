"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { saveConfiguracoes } from "./actions";
import { Save, Loader2, Palette, Image as ImageIcon, Type, Link as LinkIcon } from "lucide-react";
import ImageUploadField from "@/components/ui/ImageUploadField";

type ConfigFormData = {
  cor_primaria: string;
  logo_url: string;
  nome_site: string;
  footer_info: string;
  redes_instagram: string;
  redes_youtube: string;
};

export default function ConfiguracoesForm({ initialData }: { initialData: Partial<ConfigFormData> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, watch, setValue } = useForm<ConfigFormData>({
    defaultValues: {
      cor_primaria: initialData.cor_primaria || "#2563eb",
      logo_url: initialData.logo_url || "/cropped-bict-azul-1.png",
      nome_site: initialData.nome_site || "BACHARELADO INTERDISCIPLINAR EM CIÊNCIA E TECNOLOGIA",
      footer_info: initialData.footer_info || "Universidade Federal do Maranhão - UFMA",
      redes_instagram: initialData.redes_instagram || "https://instagram.com/bictufma",
      redes_youtube: initialData.redes_youtube || "",
    }
  });

  const corPrimaria = watch("cor_primaria");
  const logoUrl = watch("logo_url");

  const onSubmit = async (data: ConfigFormData) => {
    setIsSaving(true);
    setMessage(null);
    
    const result = await saveConfiguracoes(data as Record<string, string>);
    
    if (result.success) {
      setMessage({ type: 'success', text: "Configurações salvas com sucesso!" });
    } else {
      setMessage({ type: 'error', text: result.error || "Erro ao salvar" });
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações Gerais</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Personalize a identidade visual e dados do site</p>
        </div>

        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Configurações</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'}`}>
          {message.text}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Identidade Visual */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Identidade Visual</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor Primária do Site</label>
              <div className="flex gap-3 items-center">
                <input 
                  type="color"
                  value={corPrimaria}
                  onChange={(e) => setValue("cor_primaria", e.target.value)}
                  className="w-12 h-10 p-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded cursor-pointer"
                />
                <input 
                  type="text"
                  {...register("cor_primaria")}
                  className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <ImageUploadField 
                label="Logomarca do Site (Menu Principal)"
                value={logoUrl} 
                onChange={(url) => setValue("logo_url", url)} 
              />
            </div>
          </div>
        </div>

        {/* Informações Globais */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-4">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Informações Globais</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Oficial do Site (Exibido nas abas do navegador)</label>
              <input 
                {...register("nome_site")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Texto de Copyright (Rodapé)</label>
              <input 
                {...register("footer_info")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-4">
            <LinkIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Redes Sociais</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link do Instagram</label>
              <input 
                {...register("redes_instagram")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link do Youtube</label>
              <input 
                {...register("redes_youtube")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
