'use client'

import React from 'react'
import Link from 'next/link'
import { HeaderConfig, SocialLinkConfig } from '@/types/cms'

export const CompactHeader = ({
  config
}: {
  config: HeaderConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <header className="w-full bg-slate-900 text-white h-12 flex items-center px-4">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="font-bold text-sm flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-primary text-white text-xs flex items-center justify-center font-black">
            B
          </span>
          BICT UFMA
        </Link>
        <nav className="flex items-center gap-4 text-xs">
          {config.links.map((link) => (
            <Link key={link.id} href={link.url} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="bg-primary px-3 py-1 rounded font-medium">
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}
