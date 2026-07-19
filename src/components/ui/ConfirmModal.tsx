"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Timeout to allow the DOM to render before adding the visible class for transition
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for transition to finish before unmounting
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onCancel}
      />

      {/* Modal */}
      <div 
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 transition-all duration-200 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full flex-shrink-0 ${
              isDanger 
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500" 
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500"
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-950/50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-primary hover:bg-primary/90 focus:ring-primary"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
