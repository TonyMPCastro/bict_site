"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, ExternalLink, CheckCircle2, Layers } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { LandingPageBlockEditor } from "@/components/admin/cms/LandingPageBlockEditor";
import { LandingPageConfig, DEFAULT_LANDING_PAGE_CONFIG } from "@/types/landing-page";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(3, "Título muito curto"),
  slug: z.string().min(3, "Slug muito curto"),
  resumo: z.string().min(10, "Resumo deve ter pelo menos 10 caracteres"),
  imagem: z.string().optional().nullable(),
  conteudo: z.string().optional().nullable(),
  publicado: z.boolean(),
  destaque: z.boolean(),
  galeriaId: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

export default function NoticiaFormPage() {
  const router = useRouter();
  const params = useParams<{ id?: string[] }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = Boolean(routeId);
  const postId = routeId ?? null;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [galerias, setGalerias] = useState<{ id: string, titulo: string }[]>([]);

  const [useBlockBuilder, setUseBlockBuilder] = useState(false);
  const [blockConfig, setBlockConfig] = useState<LandingPageConfig>(DEFAULT_LANDING_PAGE_CONFIG);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      slug: "",
      resumo: "",
      imagem: "",
      conteudo: "",
      publicado: false,
      destaque: false,
      galeriaId: "",
    }
  });

  const tituloWatcher = watch("titulo");

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
        
      generatedSlug = generatedSlug.split("-").slice(0, 6).join("-");
      setValue("slug", generatedSlug);
    }
  }, [tituloWatcher, isEditing, setValue]);

  useEffect(() => {
    fetch("/api/admin/galerias")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setGalerias(data.data);
        }
      })
      .catch(err => console.error("Erro ao carregar galerias", err));
  }, []);

  useEffect(() => {
    if (isEditing && postId) {
      setIsLoading(true);
      fetch(`/api/admin/noticias/single?id=${encodeURIComponent(postId)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const post = data.data;
            setValue("id", post.id);
            setValue("titulo", post.titulo);
            setValue("slug", post.slug);
            setCurrentSlug(post.slug);
            setValue("resumo", post.resumo || "");
            setValue("imagem", post.imagem || "");
            setValue("conteudo", post.conteudo || "");
            setValue("publicado", post.publicado || false);
            setValue("destaque", post.destaque || false);
            setValue("galeriaId", post.galeriaId || "");

            if (post.landingPageConfig) {
              try {
                setBlockConfig(JSON.parse(post.landingPageConfig));
                setUseBlockBuilder(true);
              } catch (e) {
                console.error("Erro ao parsear landingPageConfig da notícia:", e);
              }
            }
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

      const uploadUrl = typeof window !== "undefined"
        ? `${window.location.origin}/api/upload`
        : "/api/upload";

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.data && data.data.link) {
        setValue("imagem", data.data.link);
      } else {
        alert(data.error || "Erro no upload da imagem");
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
    setSuccess(false);

    const payload = {
      ...data,
      conteudo: data.conteudo || "",
      landingPageConfig: useBlockBuilder ? JSON.stringify(blockConfig) : null
    };

    try {
      const res = await fetch("/api/admin/noticias", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(true);
        if (result.data?.slug) setCurrentSlug(result.data.slug);
        
        if (!isEditing && result.data?.id) {
          router.push(`/admin/noticias/form/${result.data.id}`);
        } else {
          router.refresh();
          setTimeout(() => setSuccess(false), 3000);
        }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/noticias" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEditing ? "Editar Notícia" : "Nova Notícia"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentSlug && (
            <Link
              href={`/noticias/${currentSlug}`}
              target="_blank"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg font-medium transition-colors border border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center text-xs"
              title="Visualizar Notícia"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver no Site</span>
            </Link>
          )}

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md disabled:opacity-70 w-full sm:w-auto"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Notícia</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Notícia salva com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título da Notícia</label>
              <input
                type="text"
                {...register("titulo")}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.titulo && <p className="text-xs text-red-500">{errors.titulo.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL Amigável (Slug)</label>
              <input
                type="text"
                {...register("slug")}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Resumo da Notícia</label>
            <textarea
              rows={2}
              {...register("resumo")}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
            />
            {errors.resumo && <p className="text-xs text-red-500">{errors.resumo.message}</p>}
          </div>

          {/* Imagem de Capa */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Imagem de Capa (URL)</label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register("imagem")}
                placeholder="https://..."
                className="flex-1 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
              />
              <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-300 dark:border-slate-700">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                <span>Enviar Imagem</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" {...register("publicado")} className="h-4 w-4 rounded text-primary" />
              <span>Publicado (Visível no site)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" {...register("destaque")} className="h-4 w-4 rounded text-primary" />
              <span>Notícia em Destaque</span>
            </label>
          </div>
        </div>

        {/* Alternador de Modo do Conteúdo */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Conteúdo da Notícia</h2>
              <p className="text-xs text-slate-500">Escolha o formato de edição do corpo da notícia</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUseBlockBuilder(false)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  !useBlockBuilder ? "bg-white dark:bg-slate-800 shadow text-primary" : "text-slate-600"
                }`}
              >
                Texto / HTML Simples
              </button>
              <button
                type="button"
                onClick={() => setUseBlockBuilder(true)}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  useBlockBuilder ? "bg-primary text-white shadow" : "text-slate-600"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Construtora por Blocos Modulares
              </button>
            </div>
          </div>

          {!useBlockBuilder ? (
            <Controller
              name="conteudo"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Escreva o conteúdo da notícia aqui..."
                />
              )}
            />
          ) : (
            <LandingPageBlockEditor
              config={blockConfig}
              onChange={(newConfig) => setBlockConfig(newConfig)}
            />
          )}
        </div>
      </form>
    </div>
  );
}
