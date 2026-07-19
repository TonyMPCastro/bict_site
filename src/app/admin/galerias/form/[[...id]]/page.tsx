"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { Save, Loader2, ArrowLeft, Image as ImageIcon, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";
import ImageUploadField from "@/components/ui/ImageUploadField";

const imageSchema = z.object({
  url: z.string().url("URL da imagem inválida"),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  altText: z.string().optional()
});

const formSchema = z.object({
  titulo: z.string().min(3, "Título muito curto"),
  slug: z.string().min(3, "Slug muito curto"),
  descricao: z.string().optional(),
  publicada: z.boolean().default(true),
  imagens: z.array(imageSchema).default([])
});

type FormData = z.infer<typeof formSchema>;

export default function GaleriaFormPage() {
  const router = useRouter();
  const params = useParams<{ id?: string[] }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = Boolean(routeId);
  const galeriaId = routeId ?? null;

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      slug: "",
      descricao: "",
      publicada: true,
      imagens: []
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "imagens"
  });

  const tituloWatcher = watch("titulo");
  
  // Auto-gerar slug a partir do título (apenas na criação)
  useEffect(() => {
    if (!isEditing && tituloWatcher) {
      let generatedSlug = tituloWatcher
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
        
      setValue("slug", generatedSlug);
    }
  }, [tituloWatcher, isEditing, setValue]);

  // Carregar dados na edição
  useEffect(() => {
    if (isEditing && galeriaId) {
      const loadData = async () => {
        try {
          const res = await fetch(`/api/admin/galerias/single?id=${galeriaId}`);
          const result = await res.json();
          if (result.success && result.data) {
            const data = result.data;
            setValue("titulo", data.titulo);
            setValue("slug", data.slug);
            setCurrentSlug(data.slug);
            setValue("descricao", data.descricao || "");
            setValue("publicada", data.publicada);
            setValue("imagens", data.imagens.map((img: any) => ({
              url: img.url,
              titulo: img.titulo,
              descricao: img.descricao || "",
              altText: img.altText || ""
            })));
          }
        } catch (error) {
          console.error("Erro ao carregar galeria:", error);
        }
      };
      loadData();
    }
  }, [isEditing, galeriaId, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const url = isEditing ? `/api/admin/galerias/single` : `/api/admin/galerias`;
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...data,
        ...(isEditing && { id: galeriaId })
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(true);
        if (!isEditing) {
          setTimeout(() => router.push("/admin/galerias"), 1500);
        }
        router.refresh();
      } else {
        alert(result.message || "Erro ao salvar");
      }
    } catch (error) {
      alert("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/galerias" className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Editar Galeria" : "Nova Galeria"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Preencha os detalhes e adicione fotos.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing && currentSlug && (
            <Link 
              href={`/galerias/${currentSlug}`} 
              target="_blank"
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Ver Galeria
            </Link>
          )}
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400 rounded-xl flex items-center justify-between">
          <span>Galeria salva com sucesso! {(!isEditing) && "Redirecionando..."}</span>
        </div>
      )}

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título da Galeria</label>
              <input 
                {...register("titulo")}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Ex: Evento de Formatura 2026"
              />
              {errors.titulo && <span className="text-red-500 text-sm mt-1">{errors.titulo.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
              <textarea 
                {...register("descricao")}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="Breve descrição sobre a galeria (opcional)"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Imagens ({fields.length})</h3>
              </div>
              <button 
                type="button" 
                onClick={() => append({ url: "", titulo: "", descricao: "", altText: "" })}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Adicionar Imagem
              </button>
            </div>

            <div className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                  Nenhuma imagem adicionada. Clique no botão acima para adicionar.
                </div>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 flex gap-4 items-start">
                    <div className="pt-2 text-gray-400 cursor-move flex flex-col gap-1">
                      <button type="button" onClick={() => index > 0 && move(index, index - 1)} disabled={index === 0} className="hover:text-primary disabled:opacity-30">▲</button>
                      <button type="button" onClick={() => index < fields.length - 1 && move(index, index + 1)} disabled={index === fields.length - 1} className="hover:text-primary disabled:opacity-30">▼</button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <ImageUploadField 
                          label="Imagem" 
                          value={watch(`imagens.${index}.url`)} 
                          onChange={(url) => setValue(`imagens.${index}.url`, url, { shouldValidate: true })} 
                        />
                        {errors.imagens?.[index]?.url && <span className="text-red-500 text-sm mt-1">{errors.imagens[index].url.message}</span>}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Título da Foto</label>
                          <input 
                            {...register(`imagens.${index}.titulo`)}
                            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md outline-none"
                            placeholder="Ex: Foto da Turma"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Texto Alternativo (Acessibilidade)</label>
                          <input 
                            {...register(`imagens.${index}.altText`)}
                            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md outline-none"
                            placeholder="Ex: Alunos sorrindo na formatura"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remover Imagem"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Barra Lateral */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Configurações</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL amigável)</label>
              <input 
                {...register("slug")}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
                readOnly={isEditing}
              />
              {errors.slug && <span className="text-red-500 text-sm mt-1">{errors.slug.message}</span>}
              <p className="text-xs text-gray-400 mt-1">Gerado automaticamente. {isEditing && "Não editável após criação."}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <input 
                  type="checkbox" 
                  {...register("publicada")}
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">Publicar Galeria</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">Visível para inserção em notícias e acesso público.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
