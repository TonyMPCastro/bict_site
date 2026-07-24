'use client'

import React, { useState } from 'react'
import { WhatsAppConfig } from '@/types/cms'
import { MessageCircle, X, Send } from 'lucide-react'

interface FloatingWhatsAppProps {
  config: WhatsAppConfig
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!config.enabled || !config.phoneNumber) return null

  const positionClass =
    config.position === 'bottom-left' ? 'bottom-6 left-6' : 'bottom-6 right-6'

  const formattedPhone = config.phoneNumber.replace(/\D/g, '')
  const encodedMsg = encodeURIComponent(config.defaultMessage || '')
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMsg}`

  return (
    <div className={`fixed z-50 ${positionClass} flex flex-col items-end pointer-events-auto`}>
      {/* Pop-up Drawer Estilo HeroUI / Aceternity */}
      {isOpen && (
        <div className="mb-4 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-3">
              {config.avatarUrl ? (
                <img
                  src={config.avatarUrl}
                  alt={config.attendantName}
                  className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  WA
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {config.attendantName || 'Atendimento BICT'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online agora
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3 mb-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {config.welcomeMessage || 'Olá! Como podemos ajudar você hoje?'}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            Iniciar Conversa no WhatsApp
          </a>
        </div>
      )}

      {/* Botão Suspenso Pulsante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 transition-all duration-300 ${
          config.pulseAnimation ? 'animate-bounce' : ''
        }`}
        title="Fale conosco no WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 blur-sm group-hover:opacity-75 transition-opacity" />
        <MessageCircle className="h-7 w-7 relative z-10" />
      </button>
    </div>
  )
}
