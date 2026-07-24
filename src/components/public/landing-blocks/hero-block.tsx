'use client'

import React from 'react'
import Link from 'next/link'
import { Spotlight } from './ui/spotlight'
import { MovingBorderButton } from './ui/moving-border'

export const HeroBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Bacharelado em Ciência e Tecnologia'
  const subtitle = props.subtitle || 'Formação inovadora e acesso às Engenharias'
  const ctaText = props.ctaText || 'Conheça os Cursos'
  const ctaUrl = props.ctaUrl || '/engenharias'
  const secondaryCtaText = props.secondaryCtaText
  const secondaryCtaUrl = props.secondaryCtaUrl
  const effect = props.effect || 'spotlight'

  return (
    <div className="relative min-h-[500px] w-full rounded-3xl overflow-hidden bg-slate-950 text-white flex flex-col items-center justify-center p-8 lg:p-16 border border-slate-800 shadow-2xl">
      {effect === 'spotlight' && <Spotlight fill="#3b82f6" />}

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
          Curso Superior BICT
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href={ctaUrl}>
            <MovingBorderButton>{ctaText}</MovingBorderButton>
          </Link>

          {secondaryCtaText && secondaryCtaUrl && (
            <Link
              href={secondaryCtaUrl}
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-900 transition-colors text-sm font-semibold"
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
