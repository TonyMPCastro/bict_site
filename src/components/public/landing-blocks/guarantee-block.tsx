'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'

export const GuaranteeBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Formação Garantida pelo MEC'
  const subtitle = props.subtitle || 'O BICT possui nota máxima nas avaliações do MEC, garantindo um diploma de peso em todo território nacional.'
  
  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
        <ShieldCheck className="w-10 h-10" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
