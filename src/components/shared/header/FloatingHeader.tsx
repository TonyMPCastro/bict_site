'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { HeaderConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'
import { Menu, X } from 'lucide-react'

export const FloatingHeader = ({
  config,
  socialLinks = []
}: {
  config: HeaderConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="sticky top-4 z-50 w-full px-4 max-w-6xl mx-auto">
      <header className="rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-xl px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary text-white font-black text-lg flex items-center justify-center">
            B
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
            BICT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {config.links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {config.showSocialLinks !== false && <SocialLinks links={socialLinks} />}
          <Link
            href="/login"
            className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full transition-all"
          >
            Entrar
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-700 dark:text-slate-200"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 shadow-2xl">
          {config.links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 py-1.5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
