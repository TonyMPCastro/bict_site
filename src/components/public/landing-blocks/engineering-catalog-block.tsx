'use client'

import React from 'react'
import Link from 'next/link'
import { Card3D } from './ui/card-3d'
import { Cpu, Wrench, Building2, Zap, ArrowRight } from 'lucide-react'

export const EngineeringCatalogBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Habilitações em Engenharia'
  const subtitle = props.subtitle || 'Após 3 anos de ciclo básico no BICT, continue para sua Engenharia'

  const engenharias = [
    {
      nome: 'Engenharia da Computação',
      desc: 'Sistemas embarcados, inteligência artificial e arquitetura de computadores.',
      icon: Cpu,
      slug: 'engenharia-da-computacao'
    },
    {
      nome: 'Engenharia Mecânica',
      desc: 'Termodinâmica, robótica industrial e projeto de componentes mecânicos.',
      icon: Wrench,
      slug: 'engenharia-mecanica'
    },
    {
      nome: 'Engenharia Civil',
      desc: 'Infraestrutura, cálculo estrutural e gestão sustentável de obras.',
      icon: Building2,
      slug: 'engenharia-civil'
    },
    {
      nome: 'Engenharia Elétrica',
      desc: 'Sistemas de potência, eletrônica, energias renováveis e automação.',
      icon: Zap,
      slug: 'engenharia-eletrica'
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {engenharias.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card3D key={idx}>
              <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {item.nome}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <Link
                  href={`/engenharias#${item.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  Ver Grade Curricular <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card3D>
          )
        })}
      </div>
    </div>
  )
}
