"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  disabled?: boolean;
  positionValue?: string;
  onPositionChange?: (pos: string) => void;
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Imagem",
  accept = "image/*",
  disabled = false,
  positionValue,
  onPositionChange,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Apenas arquivos de imagem são permitidos.");
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const uploadUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/api/upload`
            : "/api/upload";

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.data?.link) {
          onChange(result.data.link);
        } else {
          setUploadError(result.error || "Erro ao fazer upload da imagem.");
        }
      } catch {
        setUploadError("Erro de conexão ao enviar imagem.");
      } finally {
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    onChange("");
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Preview quando há imagem */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-52 object-cover"
            style={positionValue ? { objectPosition: positionValue.replace('bg-', '') } : {}}
          />
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-gray-800 text-sm font-medium rounded-lg hover:bg-white transition-colors shadow"
            >
              <Upload className="w-4 h-4" />
              Trocar
            </button>
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow"
            >
              <X className="w-4 h-4" />
              Remover
            </button>
          </div>
          {/* Badge da URL */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white/80 text-xs truncate font-mono">{value}</p>
          </div>
          </div>
        </div>
      ) : (
        /* Área de drop quando não há imagem */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 
            h-40 rounded-xl border-2 border-dashed cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
                : "border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
            }
            ${disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-medium text-blue-500">Enviando...</p>
            </>
          ) : (
            <>
              <div
                className={`p-3 rounded-full transition-colors ${
                  isDragging
                    ? "bg-blue-100 dark:bg-blue-900/40"
                    : "bg-gray-100 dark:bg-slate-800"
                }`}
              >
                <ImageIcon
                  className={`w-6 h-6 ${
                    isDragging
                      ? "text-blue-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {isDragging
                    ? "Solte a imagem aqui"
                    : "Clique ou arraste uma imagem"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  PNG, JPG, WEBP, GIF até 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Input URL manual */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setUploadError(null);
          }}
          placeholder="Ou cole uma URL de imagem..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            isUploading
              ? "bg-gray-100 text-gray-400 border-gray-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed"
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/40"
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      {/* Mensagem de erro */}
      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {uploadError}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Seletor de Foco/Posição (Opcional) */}
      {value && onPositionChange && (
        <div className="pt-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
            Foco da Imagem
          </label>
          <select 
            value={positionValue || "center"} 
            onChange={(e) => onPositionChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-800 dark:text-gray-200"
          >
            <option value="center">Centro (Padrão)</option>
            <option value="top">Topo</option>
            <option value="bottom">Base</option>
            <option value="left">Esquerda</option>
            <option value="right">Direita</option>
          </select>
          <p className="text-[10px] text-gray-500 mt-1">Ajusta qual parte da imagem aparece quando for cortada por telas menores.</p>
        </div>
      )}
    </div>
  );
}
