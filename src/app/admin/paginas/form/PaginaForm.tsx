"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { savePagina } from "../actions";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  conteudo: z.string().min(10, "O conteúdo é muito curto"),
  publicada: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface PaginaFormProps {
  initialData?: FormData;
}

export default function PaginaForm({ initialData }: PaginaFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      titulo: "",
      descricao: "",
      conteudo: "",
      publicada: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);
    
    const result = await savePagina(data);
    
    if (result.success) {
      router.push("/admin/paginas");
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <Link href="/admin/paginas" className="p-2 bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {initialData ? "Editar Página" : "Nova Página"}
            </h1>
          </div>
        </div>

        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto justify-center"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Página</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título da Página <span className="text-red-500">*</span></label>
              <input 
                {...register("titulo")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Ex: Sobre o BICT"
              />
              {errors.titulo && <p className="text-sm text-red-500 dark:text-red-400">{errors.titulo.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <div className="flex items-center gap-3 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register("publicada")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Publicada</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição Breve (SEO e Resumo)</label>
            <input 
              {...register("descricao")}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Uma breve descrição sobre a página..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo da Página <span className="text-red-500">*</span></label>
            <Controller
              name="conteudo"
              control={control}
              render={({ field }) => (
                <RichTextEditor 
                  value={field.value} 
                  onChange={field.onChange} 
                />
              )}
            />
            {errors.conteudo && <p className="text-sm text-red-500 dark:text-red-400">{errors.conteudo.message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
