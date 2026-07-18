"use client";

import dynamic from "next/dynamic";
import React from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Importação dinâmica com ssr:false para evitar "window is not defined"
// durante a avaliação do módulo no servidor (draft-js e html-to-draftjs
// referenciam window em nível de módulo, não em função).
const RichTextEditorClient = dynamic(
  () => import("./RichTextEditorClient"),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 min-h-[380px] flex items-center justify-center">
        <span className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">
          Carregando editor...
        </span>
      </div>
    ),
  }
);

export default function RichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditorClient {...props} />;
}
