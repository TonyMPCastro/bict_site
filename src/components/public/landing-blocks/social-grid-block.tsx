'use client'

import React from 'react'
import { Globe, Video, MessageCircle, Share2 } from 'lucide-react'

export const SocialGridBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Siga o BICT nas Redes Sociais'
  const subtitle = props.subtitle || 'Acompanhe fotos, eventos e comunicados oficiais da coordenação'

  const socials = [
    {
      name: 'Instagram',
      handle: '@bict_ufma',
      url: 'https://instagram.com/bict_ufma',
      icon: Globe,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'YouTube',
      handle: 'Canal Oficial BICT',
      url: 'https://youtube.com',
      icon: Video,
      color: 'from-red-600 to-red-700'
    },
    {
      name: 'LinkedIn',
      handle: 'BICT UFMA',
      url: 'https://linkedin.com',
      icon: Share2,
      color: 'from-blue-600 to-sky-700'
    },
    {
      name: 'WhatsApp',
      handle: 'Canal de Avisos',
      url: 'https://wa.me/5598988888888',
      icon: MessageCircle,
      color: 'from-emerald-500 to-teal-600'
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {socials.map((item, idx) => {
          const Icon = item.icon
          return (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 flex items-center gap-4"
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500">{item.handle}</p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
