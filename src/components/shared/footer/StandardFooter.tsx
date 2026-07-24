'use client'

import React from 'react'
import Link from 'next/link'
import { FooterConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'

export const StandardFooter = ({
  config,
  socialLinks = []
}: {
  config: FooterConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-white font-black text-xl flex items-center justify-center">
              B
            </div>
            <span className="font-extrabold text-xl text-white">BICT UFMA</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bacharelado Interdisciplinar em Ciência e Tecnologia da Universidade Federal do Maranhão.
          </p>
          {config.showSocialLinks !== false && <SocialLinks links={socialLinks} />}
        </div>

        {config.colunas.map((col) => (
          <div key={col.id} className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{col.titulo}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-xs text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        {config.copyrightText}
      </div>
    </footer>
  )
}
