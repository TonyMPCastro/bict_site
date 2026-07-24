'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const FaqBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Perguntas Frequentes'
  const subtitle = props.subtitle || 'Tire suas dúvidas sobre o curso, vestibulares e normas'
  const items = props.items || [
    {
      question: 'O que é o BICT?',
      answer: 'O Bacharelado Interdisciplinar em Ciência e Tecnologia é um curso superior inovador de 3 anos de ciclo básico com diploma de graduação, permitindo prosseguir para a habilitação em Engenharia.'
    },
    {
      question: 'Como funciona a transição para as Engenharias?',
      answer: 'Ao concluir o BICT, o discente concorre às vagas das engenharias específicas (Computação, Elétrica, Mecânica, Civil) conforme os critérios de coeficiente do regimento.'
    },
    {
      question: 'O diploma do BICT é reconhecido?',
      answer: 'Sim, o BICT confere diploma de graduação pleno em nível superior reconhecido pelo MEC e pela UFMA.'
    }
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {items.map((item: any, idx: number) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between gap-4"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-primary transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
