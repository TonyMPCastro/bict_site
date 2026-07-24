'use client'

import React from 'react'
import { SocialLinkConfig } from '@/types/cms'
import {
  Globe,
  Share2,
  Mail,
  MessageCircle,
  Video
} from 'lucide-react'

interface SocialLinksProps {
  links: SocialLinkConfig[]
  className?: string
  iconClassName?: string
  showLabels?: boolean
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  className = '',
  iconClassName = 'h-5 w-5',
  showLabels = false
}) => {
  const activeLinks = links.filter((l) => l.enabled && l.url)

  if (activeLinks.length === 0) return null

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle className={iconClassName} />
      case 'email':
        return <Mail className={iconClassName} />
      case 'youtube':
        return <Video className={iconClassName} />
      default:
        return <Globe className={iconClassName} />
    }
  }

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {activeLinks.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors flex items-center gap-2"
          title={getPlatformName(item.platform)}
        >
          {getIcon(item.platform)}
          {showLabels && <span className="text-xs font-medium">{getPlatformName(item.platform)}</span>}
        </a>
      ))}
    </div>
  )
}
