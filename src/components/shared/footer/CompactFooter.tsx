'use client'

import React from 'react'
import { FooterConfig, SocialLinkConfig } from '@/types/cms'

export const CompactFooter = ({
  config
}: {
  config: FooterConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-4 px-4 text-center text-xs border-t border-slate-800">
      {config.copyrightText}
    </footer>
  )
}
