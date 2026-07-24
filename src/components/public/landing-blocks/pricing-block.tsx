'use client'

import React from 'react'
import { MovingBorderButton } from './ui/moving-border'
import { Check } from 'lucide-react'

export const PricingBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Planos e Investimentos'
  const subtitle = props.subtitle || 'Escolha a melhor opção para a sua formação'
  
  const plans = props.plans || [
    {
      name: 'Vestibular / SiSU',
      price: 'Gratuito',
      period: '',
      description: 'Ingresso via nota do ENEM para ampla concorrência e cotas.',
      features: ['Formação Básica de 3 anos', 'Acesso às Engenharias', 'Projetos de Extensão', 'Iniciação Científica'],
      highlighted: false,
      buttonText: 'Saiba como ingressar'
    },
    {
      name: 'Transferência Externa',
      price: 'Sob Consulta',
      period: '',
      description: 'Para estudantes de outras IES que desejam ingressar no BICT.',
      features: ['Aproveitamento de Disciplinas', 'Acesso às Engenharias', 'Adaptação Curricular'],
      highlighted: true,
      buttonText: 'Ver Edital de Transferência'
    }
  ]

  return (
    <div className="space-y-12 w-full max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-auto-fit gap-8">
        {plans.map((plan: any, idx: number) => {
          const isHighlighted = plan.highlighted

          const CardContent = (
            <div className={`h-full p-8 flex flex-col justify-between ${isHighlighted ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-sm opacity-80">{plan.period}</span>}
                </div>
                <p className={`text-sm ${isHighlighted ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
                <div className="pt-4 space-y-3">
                  {plan.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium">
                      <div className={`p-0.5 rounded-full ${isHighlighted ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-8">
                {isHighlighted ? (
                  <MovingBorderButton className="w-full font-bold">
                    {plan.buttonText}
                  </MovingBorderButton>
                ) : (
                  <button className="w-full py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary font-bold transition-colors">
                    {plan.buttonText}
                  </button>
                )}
              </div>
            </div>
          )

          return (
            <div 
              key={idx} 
              className={`relative rounded-3xl ${
                isHighlighted 
                  ? 'bg-gradient-to-b from-primary to-blue-900 shadow-2xl scale-105 z-10' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {CardContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}
