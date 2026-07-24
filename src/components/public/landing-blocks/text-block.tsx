'use client'

import React from 'react'

export const TextBlock = ({ props }: { props: any }) => {
  const content = props.content || 'Insira o seu conteúdo de texto formatado aqui.'

  return (
    <div
      className="prose dark:prose-invert max-w-4xl mx-auto leading-relaxed text-slate-800 dark:text-slate-200"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export const CtaBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Pronto para ingressar no BICT?'
  const subtitle = props.subtitle || 'Saiba como se inscrever via SiSU e acompanhe os editais'
  const buttonText = props.buttonText || 'Ver Formas de Ingresso'
  const buttonUrl = props.buttonUrl || '/contato'

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-10 md:p-14 text-center space-y-6 shadow-2xl border border-slate-800 relative overflow-hidden">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
      <p className="text-slate-300 text-sm max-w-2xl mx-auto">{subtitle}</p>
      <a
        href={buttonUrl}
        className="inline-block bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
      >
        {buttonText}
      </a>
    </div>
  )
}

export const DividerBlock = ({ props }: { props: any }) => {
  const style = props.style || 'line'

  if (style === 'spacer') {
    return <div className="h-12 w-full" />
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-8 border-t border-slate-200 dark:border-slate-800" />
  )
}
