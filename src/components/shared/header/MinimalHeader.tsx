'use client'

import React from 'react'
import Link from 'next/link'
import { HeaderConfig, SocialLinkConfig } from '@/types/cms'

export const MinimalHeader = ({
  config
}: {
  config: HeaderConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 py-4 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
          BICT
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {config.links.map((link) => (
            <Link key={link.id} href={link.url} className="text-slate-600 dark:text-slate-300 hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar →
          </Link>
        </div>
      </div>
    </header>
  )
}
