"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePagina } from "../actions";
import { LandingPageBlockEditor } from "@/components/admin/cms/LandingPageBlockEditor";
import { LandingPageConfig, DEFAULT_LANDING_PAGE_CONFIG } from "@/types/landing-page";
import { Save, ArrowLeft, Loader2, ExternalLink, CheckCircle2, Layers } from "lucide-react";
import Link from "next/link";

interface PaginaFormProps {
  initialData?: {
    id?: string;
    titulo: string;
    slug?: string;
    descricao?: string | null;
    publicada: boolean;
    landingPageConfig?: string | null;
  };
}

export default function PaginaForm({ initialData }: PaginaFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(initialData?.slug || null);

  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [publicada, setPublicada] = useState(initialData?.publicada ?? false);

  const parseInitConfig = (): LandingPageConfig => {
    if (initialData?.landingPageConfig) {
      try {
        return JSON.parse(initialData.landingPageConfig);
      } catch (e) {
        return DEFAULT_LANDING_PAGE_CONFIG;
      }
    }
    return DEFAULT_LANDING_PAGE_CONFIG;
  };

  const [blockConfig, setBlockConfig] = useState<LandingPageConfig>(parseInitConfig());

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || titulo.length < 3) {
      setError("O título deve ter no mínimo 3 caracteres");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const result = await savePagina({
      id: initialData?.id,
      titulo,
      descricao,
      publicada,
      landingPageConfig: JSON.stringify(blockConfig),
      secoes: []
    });

    if (result.success) {
      if (!initialData?.id && result.id) {
        router.push(`/admin/paginas/form/${result.id}`);
      } else {
        setIsSaving(false);
        setSuccess(true);
        if (result.slug) {
          setCurrentSlug(result.slug);
        }
        setTimeout(() => setSuccess(false), 3000);
      }
    } else {
      setError(result.error || "Ocorreu um erro ao salvar.");
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col h-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/paginas" className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {initialData ? "Editar Página por Blocos" : "Nova Página por Blocos"}
            </h1>
            <p className="text-sm text-slate-500">
              Monte o visual da página utilizando o novo construtor por blocos modulares
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentSlug && (
            <Link
              href={`/paginas/${currentSlug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Página
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Página</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 p-4 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Página salva com sucesso!
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Título da Página
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Sobre o BICT"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Descrição Resumida (SEO)
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição resumida exibida nos buscadores"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publicada"
              checked={publicada}
              onChange={(e) => setPublicada(e.target.checked)}
              className="h-4 w-4 rounded text-primary cursor-pointer"
            />
            <label htmlFor="publicada" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Página Publicada (Visível no site)
            </label>
          </div>
        </div>

        {/* Editor por Blocos (Novo Padrão) */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Construtora por Blocos Modulares
            </h2>
          </div>

          <LandingPageBlockEditor
            config={blockConfig}
            onChange={(newConfig) => setBlockConfig(newConfig)}
          />
        </div>
      </form>
    </div>
  );
}
