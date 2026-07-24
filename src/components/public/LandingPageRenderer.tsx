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
import { ImageBlock } from './landing-blocks/image-block'
import { PricingBlock } from './landing-blocks/pricing-block'
import { InstructorBlock } from './landing-blocks/instructor-block'
import { BenefitsBlock } from './landing-blocks/benefits-block'
import { BannerBlock } from './landing-blocks/banner-block'
import { GuaranteeBlock } from './landing-blocks/guarantee-block'
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
      case 'banner-carousel':
        return <TestimonialsBlock props={block.props} />
      case 'faq':
        return <FaqBlock props={block.props} />
      case 'video':
        return <VideoBlock props={block.props} />
      case 'cta':
        return <CtaBlock props={block.props} />
      case 'pricing':
        return <PricingBlock props={block.props} />
      case 'text':
        return <TextBlock props={block.props} />
      case 'divider':
        return <DividerBlock props={block.props} />
      case 'image':
      case 'image-gallery':
        return <ImageBlock props={block.props} />
      case 'instructor':
        return <InstructorBlock props={block.props} />
      case 'benefits':
        return <BenefitsBlock props={block.props} />
      case 'banner':
      case 'banner-grid':
      case 'banner-fullwidth':
      case 'floating-checkout':
      case 'countdown':
        return <BannerBlock props={block.props} />
      case 'guarantee':
        return <GuaranteeBlock props={block.props} />
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
              backgroundColor: section.customBackgroundColor || (section.backgroundColor === 'custom' ? 'var(--background)' : undefined),
              color: section.textColor
            }}
            className={`w-full ${
              section.backgroundColor === 'muted'
                ? 'bg-muted dark:bg-muted/50'
                : section.backgroundColor === 'primary'
                ? 'bg-primary/10'
                : section.backgroundColor === 'dark'
                ? 'bg-slate-950 text-white'
                : ''
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {section.rows.map((row) => (
                <div key={row.id} className="flex flex-col md:flex-row items-center gap-6 w-full">
                  {row.columns.map((col) => (
                    <div
                      key={col.id}
                      style={{ 
                        width: col.width || '100%',
                        backgroundColor: col.block.customStyle?.backgroundColor,
                        color: col.block.customStyle?.textColor,
                        padding: col.block.customStyle?.padding,
                        borderRadius: col.block.customStyle?.borderRadius,
                        boxShadow: col.block.customStyle?.glowColor 
                          ? `0 0 32px ${col.block.customStyle.glowColor}` 
                          : undefined
                      }}
                      className="w-full transition-all duration-300"
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
