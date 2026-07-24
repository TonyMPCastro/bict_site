'use client'

import React from 'react'
import { MessageCircle, ArrowUpRight } from 'lucide-react'

export const WhatsAppCtaBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Dúvidas sobre o BICT ou Ingressos?'
  const subtitle = props.subtitle || 'Converse diretamente com a equipe de coordenação pelo WhatsApp.'
  const buttonText = props.buttonText || 'Chamar no WhatsApp Agora'
  const phoneNumber = (props.phoneNumber || '5598988888888').replace(/\D/g, '')
  const defaultMessage = encodeURIComponent(
    props.defaultMessage || 'Olá! Vim pelo site do BICT e gostaria de tirar dúvidas.'
  )
  const url = `https://wa.me/${phoneNumber}?text=${defaultMessage}`

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-3 max-w-2xl text-center md:text-left z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
          <MessageCircle className="h-4 w-4" />
          Atendimento Direto
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-emerald-100 text-sm">{subtitle}</p>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="z-10 shrink-0 bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-3 text-sm"
      >
        <MessageCircle className="h-5 w-5 fill-emerald-600 text-white" />
        {buttonText}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  )
}
