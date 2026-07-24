'use client'

import React from 'react'
import { LandingPageConfig, BlockConfig } from '@/types/landing-page'
import { HeroBlock } from './landing-blocks/hero-block'
import { NewsGridBlock } from './landing-blocks/news-grid-block'
import { EngineeringCatalogBlock } from './landing-blocks/engineering-catalog-block'
import { WhatsAppCtaBlock } from './landing-blocks/whatsapp-cta-block'
import { SocialGridBlock } from './landing-blocks/social-grid-block'
import { TestimonialsBlock } from './landing-blocks/testimonials-block'
import { FaqBlock } from './landing-blocks/faq-block'
import { VideoBlock } from './landing-blocks/video-block'
import { TextBlock, CtaBlock, DividerBlock } from './landing-blocks/text-block'

interface LandingPageRendererProps {
  config: LandingPageConfig
}

export const LandingPageRenderer: React.FC<LandingPageRendererProps> = ({ config }) => {
  if (!config || !config.sections) return null

  const renderBlock = (block: BlockConfig) => {
    switch (block.type) {
      case 'hero':
      case 'banner-hero-carousel':
      case 'banner-hero-search':
        return <HeroBlock props={block.props} />
      case 'news-grid':
      case 'news-featured':
        return <NewsGridBlock props={block.props} />
      case 'engineering-catalog':
        return <EngineeringCatalogBlock props={block.props} />
      case 'whatsapp-cta':
        return <WhatsAppCtaBlock props={block.props} />
      case 'social-grid':
        return <SocialGridBlock props={block.props} />
      case 'testimonials':
        return <TestimonialsBlock props={block.props} />
      case 'faq':
        return <FaqBlock props={block.props} />
      case 'video':
        return <VideoBlock props={block.props} />
      case 'cta':
      case 'pricing':
        return <CtaBlock props={block.props} />
      case 'text':
        return <TextBlock props={block.props} />
      case 'divider':
        return <DividerBlock props={block.props} />
      default:
        return <HeroBlock props={block.props} />
    }
  }

  return (
    <div className="w-full space-y-12">
      {config.sections
        .filter((sec) => sec.visible !== false)
        .map((section) => (
          <section
            key={section.id}
            style={{
              padding: section.padding || '64px 0',
              backgroundColor:
                section.backgroundColor === 'custom'
                  ? section.customBackgroundColor
                  : undefined
            }}
            className={`w-full ${
              section.backgroundColor === 'muted'
                ? 'bg-slate-50 dark:bg-slate-900/50'
                : section.backgroundColor === 'primary'
                ? 'bg-primary/10'
                : ''
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {section.rows.map((row) => (
                <div key={row.id} className="flex flex-col md:flex-row items-center gap-6 w-full">
                  {row.columns.map((col) => (
                    <div
                      key={col.id}
                      style={{ width: col.width || '100%' }}
                      className="w-full"
                    >
                      {renderBlock(col.block)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
