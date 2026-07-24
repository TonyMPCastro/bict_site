'use client'

import React from 'react'

export const BenefitsBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Por que escolher o BICT?'
  const subtitle = props.subtitle || 'Vantagens exclusivas do nosso modelo interdisciplinar'
  
  const benefits = props.benefits || [
    { title: 'Flexibilidade', desc: 'Escolha sua Engenharia apenas após o ciclo básico.', icon: '🔀' },
    { title: 'Formação Ampla', desc: 'Sólida base em matemática, física e humanidades.', icon: '📚' },
    { title: 'Dois Diplomas', desc: 'Receba o diploma de Bacharel Interdisciplinar e o de Engenheiro.', icon: '🎓' },
    { title: 'Iniciação Científica', desc: 'Forte incentivo à pesquisa desde o primeiro semestre.', icon: '🔬' }
  ]

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((item: any, i: number) => (
          <div key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex items-start gap-4 md:gap-6">
            <div className="text-4xl md:text-5xl bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
