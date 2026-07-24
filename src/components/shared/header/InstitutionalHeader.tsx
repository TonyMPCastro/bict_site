'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { HeaderConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'
import { Menu, X } from 'lucide-react'

export const InstitutionalHeader = ({
  config,
  socialLinks = []
}: {
  config: HeaderConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="w-full">
      {/* Topbar Institucional */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Universidade Federal do Maranhão — UFMA / BICT</span>
          <div className="flex items-center gap-4">
            <SocialLinks links={socialLinks} iconClassName="h-3.5 w-3.5" />
            <Link href="/login" className="hover:underline font-semibold">
              Portal do Aluno/Docente
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary text-white font-black text-2xl flex items-center justify-center">
              B
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                Bacharelado em Ciência e Tecnologia
              </h1>
              <p className="text-xs text-slate-500">Centro de Ciências Exatas e Tecnologia</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {config.links.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-700 dark:text-slate-200"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-100 dark:bg-slate-900 p-4 space-y-2">
          {config.links.map((link) => (
            <Link key={link.id} href={link.url} className="block text-sm font-semibold py-1">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
