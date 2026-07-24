'use client'

import React from 'react'
import Link from 'next/link'
import { FooterConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'

export const InstitutionalFooter = ({
  config,
  socialLinks = []
}: {
  config: FooterConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
        <div>
          <h2 className="text-white font-extrabold text-lg mb-2">BICT - UFMA</h2>
          <p className="text-xs text-slate-400">
            Universidade Federal do Maranhão — Cidade Universitária Dom Delgado, São Luís - MA.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Redes Oficiais</h3>
          <SocialLinks links={socialLinks} showLabels />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Acesso Rápido</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {config.colunas.flatMap((c) => c.links).map((link) => (
              <Link key={link.id} href={link.url} className="bg-slate-900 px-3 py-1.5 rounded text-slate-300 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-6 text-center text-xs text-slate-500">
        {config.copyrightText}
      </div>
    </footer>
  )
}
