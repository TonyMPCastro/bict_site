'use client'

import React from 'react'
import { HeaderConfig, SocialLinkConfig } from '@/types/cms'
import { StandardHeader } from './StandardHeader'
import { FloatingHeader } from './FloatingHeader'
import { InstitutionalHeader } from './InstitutionalHeader'
import { CompactHeader } from './CompactHeader'
import { MinimalHeader } from './MinimalHeader'

interface PublicHeaderProps {
  config: HeaderConfig
  socialLinks?: SocialLinkConfig[]
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ config, socialLinks = [] }) => {
  switch (config.layout) {
    case 'floating':
      return <FloatingHeader config={config} socialLinks={socialLinks} />
    case 'institutional':
      return <InstitutionalHeader config={config} socialLinks={socialLinks} />
    case 'compact':
      return <CompactHeader config={config} socialLinks={socialLinks} />
    case 'minimal':
      return <MinimalHeader config={config} socialLinks={socialLinks} />
    case 'standard':
    default:
      return <StandardHeader config={config} socialLinks={socialLinks} />
  }
}
