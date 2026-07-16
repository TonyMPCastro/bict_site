"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveMenuItem } from "../actions";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type FormData = {
  id?: string;
  label: string;
  url: string;
  ordem: number;
  parentId: string | null;
};

type OptionItem = { id: string; titulo?: string; label?: string; slug?: string; url?: string };

interface MenuFormProps {
  initialData?: FormData;
  paginas: OptionItem[];
  parentMenus: OptionItem[];
}

export default function MenuForm({ initialData, paginas, parentMenus }: MenuFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: initialData || {
      label: "",
      url: "",
      ordem: 0,
      parentId: null,
    },
  });

  // Garantir que, quando a rota fornece `initialData` depois do mount,
  // o react-hook-form seja atualizado (evita formulário em branco)
  useEffect(() => {
    if (initialData) {
      // normalize parentId to empty string for the select when null
      const normalized = { ...initialData, parentId: initialData.parentId ?? "" } as any;
      // set values
      Object.keys(normalized).forEach((k) => {
        try { setValue(k as any, (normalized as any)[k]); } catch (e) { /* ignore */ }
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);
    
    // Tratamento para empty string no parentId (quando seleciona a primeira option vazia)
    if (!data.parentId || data.parentId === "") {
      data.parentId = null;
    }
    
    data.ordem = Number(data.ordem);

    const result = await saveMenuItem(data);
    
    if (result.success) {
      router.push("/admin/menus");
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
      setIsSaving(false);
    }
  };

  const handlePaginaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (slug) {
      setValue("url", `/paginas/${slug}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <Link href="/admin/menus" className="p-2 bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {initialData ? "Editar Link do Menu" : "Novo Link do Menu"}
            </h1>
          </div>
        </div>

        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto justify-center"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Link</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Link (Label) <span className="text-red-500">*</span></label>
              <input 
                {...register("label", { required: "Nome obrigatório" })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Ex: Sobre Nós"
              />
              {errors.label && <p className="text-sm text-red-500 dark:text-red-400">{errors.label.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordem de Exibição <span className="text-red-500">*</span></label>
              <input 
                type="number"
                {...register("ordem", { required: true })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Ex: 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL Destino <span className="text-red-500">*</span></label>
              <input 
                {...register("url", { required: "URL obrigatória" })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Ex: /paginas/sobre ou https://..."
              />
              {errors.url && <p className="text-sm text-red-500 dark:text-red-400">{errors.url.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ou selecione uma página existente</label>
              <select 
                onChange={handlePaginaChange}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                <option value="">Selecione para preencher a URL...</option>
                {paginas.map(p => (
                  <option key={p.id} value={p.slug}>{p.titulo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Menu Pai (Criar um submenu dropdown)</label>
            <select 
              {...register("parentId")}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            >
              <option value="">(Nenhum) - Será um menu principal</option>
              {parentMenus.filter(m => m.id !== initialData?.id).map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Selecione outro link para que este apareça dentro dele como um menu suspenso.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
