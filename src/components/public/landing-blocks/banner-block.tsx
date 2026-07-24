'use client'

import React from 'react'
import Link from 'next/link'

export const BannerBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Pronto para iniciar sua jornada acadêmica?'
  const subtitle = props.subtitle || 'Junte-se ao curso mais inovador da instituição.'
  const ctaText = props.ctaText || 'Matricule-se Já'
  const ctaUrl = props.ctaUrl || '/ingresso'
  const backgroundImage = props.backgroundImage

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-primary text-white">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-3 flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
          <p className="text-primary-foreground/80 max-w-xl">{subtitle}</p>
        </div>
        <div className="shrink-0">
          <Link 
            href={ctaUrl}
            className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
}
