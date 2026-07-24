'use client'

import React from 'react'
import Link from 'next/link'
import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import { Newspaper } from 'lucide-react'

export const NewsGridBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Últimas Notícias'
  const subtitle = props.subtitle || 'Acompanhe novidades, comunicados e eventos do BICT'
  const items = props.items || [
    {
      title: 'Inscrições Abertas para Seleção de Monitores BICT 2026.2',
      description: 'Confira o edital com prazos e vagas para monitoria das disciplinas do ciclo básico.',
      date: '24 Julho, 2026',
      slug: 'selecao-monitores-2026-2'
    },
    {
      title: 'Simpósio Interdisciplinar de Ciência e Tecnologia',
      description: 'Apresentação dos trabalhos de conclusão dos discentes com premiação.',
      date: '20 Julho, 2026',
      slug: 'simposio-interdisciplinar'
    },
    {
      title: 'Regulamento de Migração para as Engenharias',
      description: 'Atualização nas diretrizes de transição do ciclo básico para a habilitação específica.',
      date: '15 Julho, 2026',
      slug: 'regulamento-migracao-engenharias'
    }
  ]

  return (
    <div className="space-y-8 w-full">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      <BentoGrid>
        {items.map((item: any, idx: number) => (
          <BentoGridItem
            key={idx}
            title={item.title}
            description={item.description}
            header={
              <div className="flex items-center justify-between text-xs text-primary font-bold">
                <span className="flex items-center gap-1">
                  <Newspaper className="h-3.5 w-3.5" />
                  Notícia BICT
                </span>
                <span className="text-slate-400 font-normal">{item.date}</span>
              </div>
            }
            onClick={() => {
              if (item.slug) window.location.href = `/noticias/${item.slug}`
            }}
          />
        ))}
      </BentoGrid>
    </div>
  )
}
