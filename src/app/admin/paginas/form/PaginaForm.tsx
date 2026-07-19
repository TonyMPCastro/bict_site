"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { savePagina } from "../actions";
import BlockBuilder, { BlockData } from "./BlockBuilder";
import { Save, ArrowLeft, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const blockSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum([
    "TEXTO", "BANNER", "NOTICIAS", "AVISOS", "HERO", "FEATURES", "CTA",
    "DOCUMENTOS", "EQUIPE", "FAQ", "GALERIA", "VIDEO", "MAPA", "BOTOES", "TEXTO_IMAGEM"
  ]),
  titulo: z.string().optional().nullable(),
  conteudo: z.string(),
  ordem: z.number(),
});

const schema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional().nullable(),
  publicada: z.boolean(),
  secoes: z.array(blockSchema),
});

type FormData = z.infer<typeof schema>;

interface PaginaFormProps {
  initialData?: FormData;
}

export default function PaginaForm({ initialData }: PaginaFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>((initialData as any)?.slug || null);

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
      publicada: false,
      secoes: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    
    // Atualiza a ordem dos blocos baseado na posição do array
    data.secoes = data.secoes.map((s, i) => ({ ...s, ordem: i }));

    const result = await savePagina(data as any);
    
    if (result.success) {
      if (!initialData?.id && result.id) {
        // Redireciona para o form de edição para não criar duplicatas se clicar de novo
        router.push(`/admin/paginas/form/${result.id}`);
      } else {
        setIsSaving(false);
        setSuccess(true);
        if (result.slug) {
          setCurrentSlug(result.slug);
        }
        
        // Remove a mensagem de sucesso depois de 3 segundos
        setTimeout(() => setSuccess(false), 3000);
      }
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col h-full space-y-6">
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

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentSlug && (
            <Link
              href={currentSlug === 'home' ? '/' : `/paginas/${currentSlug}`}
              target="_blank"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg font-medium transition-colors border border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center"
              title="Visualizar Página Final"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Visualizar</span>
            </Link>
          )}
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto justify-center"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Página</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl border border-green-200 dark:border-green-900/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          Página salva com sucesso!
        </div>
      )}

      {/* Formulário Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Coluna Esquerda: Construtor de Blocos */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">Conteúdo da Página</h2>
            <Controller
              name="secoes"
              control={control}
              render={({ field }) => (
                <BlockBuilder 
                  blocks={field.value as any} 
                  onChange={field.onChange} 
                />
              )}
            />
          </div>
        </div>

        {/* Coluna Direita: Metadados */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título da Página <span className="text-red-500">*</span></label>
              <input 
                {...register("titulo")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Ex: Sobre Nós"
              />
              {errors.titulo && <p className="text-sm text-red-500 dark:text-red-400">{errors.titulo.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição Breve (SEO)</label>
              <textarea 
                {...register("descricao")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors h-24 resize-none"
                placeholder="Resumo que aparece no Google..."
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" {...register("publicada")} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  Página Publicada
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Se desmarcado, apenas administradores poderão ver (Rascunho).
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
