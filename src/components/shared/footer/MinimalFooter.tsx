'use client'

import React from 'react'
import { FooterConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'

export const MinimalFooter = ({
  config,
  socialLinks = []
}: {
  config: FooterConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>{config.copyrightText}</div>
        <SocialLinks links={socialLinks} />
      </div>
    </footer>
  )
}
