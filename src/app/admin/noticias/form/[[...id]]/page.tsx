"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(3, "Título muito curto"),
  slug: z.string().min(3, "Slug muito curto"),
  resumo: z.string().min(10, "Resumo deve ter pelo menos 10 caracteres"),
  imagem: z.string().optional().nullable(),
  conteudo: z.string().min(1, "O conteúdo não pode estar vazio"),
  publicado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function NoticiaFormPage({ params }: { params: { id?: string[] } }) {
  const router = useRouter();
  const isEditing = !!params.id && params.id.length > 0;
  const postId = isEditing ? params.id![0] : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      slug: "",
      resumo: "",
      imagem: "",
      conteudo: "",
      publicado: false,
    }
  });

  const tituloWatcher = watch("titulo");
  
  // Auto-gerar slug a partir do título (apenas na criação)
  useEffect(() => {
    if (!isEditing && tituloWatcher) {
      const generatedSlug = tituloWatcher
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

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      fetch(`/api/admin/noticias/single?id=${postId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const post = data.data;
            setValue("id", post.id);
            setValue("titulo", post.titulo);
            setValue("slug", post.slug);
            setValue("resumo", post.resumo || "");
            setValue("imagem", post.imagem || "");
            setValue("conteudo", post.conteudo || "");
            setValue("publicado", post.publicado || false);
          } else {
            alert("Erro ao carregar a notícia.");
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEditing, postId, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setValue("imagem", data.data.link);
      } else {
        alert("Erro no upload da imagem");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/noticias", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        router.push("/admin/noticias");
        router.refresh();
      } else {
        alert(result.message || "Erro ao salvar a notícia.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a notícia.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing && isLoading && !watch("titulo")) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/noticias" className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Editar Notícia" : "Nova Notícia"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input 
                  {...register("titulo")}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Digite o título da notícia..."
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Resumo</label>
                <textarea 
                  {...register("resumo")}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
                  placeholder="Um breve resumo que aparecerá na listagem..."
                />
                {errors.resumo && <p className="text-red-500 text-sm mt-1">{errors.resumo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Conteúdo</label>
                <div className="min-h-[400px] border rounded-lg overflow-hidden dark:border-slate-700">
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
                </div>
                {errors.conteudo && <p className="text-red-500 text-sm mt-1">{errors.conteudo.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Configurações</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input 
                  {...register("slug")}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700 text-sm font-mono text-gray-500"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
              </div>

              <div className="pt-4 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="publicado" 
                  {...register("publicado")} 
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="publicado" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                  Publicar imediatamente
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Imagem de Capa</h3>
              
              <div className="space-y-4">
                {watch("imagem") ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={watch("imagem") || ""} alt="Capa" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue("imagem", "")}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remover Imagem
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-slate-900/50">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhuma imagem selecionada</p>
                  </div>
                )}

                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`w-full text-center py-2 px-4 rounded-lg font-medium transition-colors border ${isUploading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-700'}`}>
                    {isUploading ? "Enviando..." : "Escolher Imagem"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Save Button */}
        <div className="fixed bottom-0 left-64 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 flex justify-end px-8 z-50">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEditing ? "Salvar Alterações" : "Criar Notícia"}
          </button>
        </div>

      </form>
    </div>
  );
}
