'use client'

import React from 'react'
import { FooterConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'

export const FloatingFooter = ({
  config,
  socialLinks = []
}: {
  config: FooterConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <div className="w-full p-4">
      <footer className="max-w-6xl mx-auto rounded-3xl bg-slate-900 text-slate-300 p-8 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xs text-slate-400">{config.copyrightText}</div>
        <SocialLinks links={socialLinks} />
      </footer>
    </div>
  )
}
