'use client'

import React from 'react'
import { InfiniteMovingCards } from './ui/infinite-moving-cards'

export const TestimonialsBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Depoimentos de Alunos e Egressos'
  const subtitle = props.subtitle || 'Saiba como o BICT impulsionou a trajetória acadêmica e profissional dos nossos estudantes'

  const items = props.items || [
    {
      quote:
        'O BICT me deu a base matemática e interdisciplinar necessária para me destacar na Engenharia da Computação. A transição foi suave e enriquecedora.',
      name: 'Lucas Almeida',
      title: 'Engenheiro de Software & Ex-Aluno BICT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    {
      quote:
        'A flexibilidade de escolher a Engenharia após experimentar as disciplinas básicas salvou meu futuro acadêmico. Recomendo fortemente!',
      name: 'Mariana Costa',
      title: 'Estudante de Engenharia Mecânica',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    },
    {
      quote:
        'Os projetos de extensão e iniciação científica no BICT me abriram portas para intercâmbio e pesquisa de ponta.',
      name: 'Gabriel Ribeiro',
      title: 'Engenheiro Elétrico & Pesquisador',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    }
  ]

  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      <InfiniteMovingCards items={items} speed="normal" />
    </div>
  )
}
