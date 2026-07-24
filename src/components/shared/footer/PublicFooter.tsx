'use client'

import React from 'react'
import { FooterConfig, SocialLinkConfig } from '@/types/cms'
import { StandardFooter } from './StandardFooter'
import { MinimalFooter } from './MinimalFooter'
import { InstitutionalFooter } from './InstitutionalFooter'
import { FloatingFooter } from './FloatingFooter'
import { CompactFooter } from './CompactFooter'

interface PublicFooterProps {
  config: FooterConfig
  socialLinks?: SocialLinkConfig[]
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ config, socialLinks = [] }) => {
  switch (config.layout) {
    case 'minimal':
      return <MinimalFooter config={config} socialLinks={socialLinks} />
    case 'institutional':
      return <InstitutionalFooter config={config} socialLinks={socialLinks} />
    case 'floating':
      return <FloatingFooter config={config} socialLinks={socialLinks} />
    case 'compact':
      return <CompactFooter config={config} socialLinks={socialLinks} />
    case 'standard':
    default:
      return <StandardFooter config={config} socialLinks={socialLinks} />
  }
}
