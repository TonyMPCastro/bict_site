import { db } from './db'
import {
  HeaderConfig,
  FooterConfig,
  LoginConfig,
  SocialLinkConfig,
  WhatsAppConfig,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_LOGIN_CONFIG,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_WHATSAPP_CONFIG
} from '@/types/cms'
import { LandingPageConfig, DEFAULT_LANDING_PAGE_CONFIG } from '@/types/landing-page'

export interface CmsFullSettings {
  header: HeaderConfig
  footer: FooterConfig
  login: LoginConfig
  socialLinks: SocialLinkConfig[]
  whatsApp: WhatsAppConfig
  homeLanding: LandingPageConfig
}

export function parseJsonSafe<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback
  try {
    const parsed = JSON.parse(jsonString)
    if (Array.isArray(fallback)) {
      return (Array.isArray(parsed) ? parsed : fallback) as T
    }
    if (Array.isArray(parsed)) {
      return parsed as T
    }
    return { ...fallback, ...parsed }
  } catch (error) {
    console.error('Erro ao fazer parse do JSON do CMS:', error)
    return fallback
  }
}

export async function getCmsSettings(): Promise<CmsFullSettings> {
  try {
    const configuracoes = await db.configuracao.findMany({
      where: {
        chave: {
          in: [
            'header_config',
            'footer_config',
            'login_config',
            'social_links_config',
            'whatsapp_config',
            'home_landing_config'
          ]
        }
      }
    })

    const configMap = new Map(configuracoes.map((c) => [c.chave, c.valor]))

    return {
      header: parseJsonSafe<HeaderConfig>(configMap.get('header_config'), DEFAULT_HEADER_CONFIG),
      footer: parseJsonSafe<FooterConfig>(configMap.get('footer_config'), DEFAULT_FOOTER_CONFIG),
      login: parseJsonSafe<LoginConfig>(configMap.get('login_config'), DEFAULT_LOGIN_CONFIG),
      socialLinks: parseJsonSafe<SocialLinkConfig[]>(
        configMap.get('social_links_config'),
        DEFAULT_SOCIAL_LINKS
      ),
      whatsApp: parseJsonSafe<WhatsAppConfig>(
        configMap.get('whatsapp_config'),
        DEFAULT_WHATSAPP_CONFIG
      ),
      homeLanding: parseJsonSafe<LandingPageConfig>(
        configMap.get('home_landing_config'),
        DEFAULT_LANDING_PAGE_CONFIG
      )
    }
  } catch (error) {
    console.error('Erro ao buscar configurações do CMS no banco:', error)
    return {
      header: DEFAULT_HEADER_CONFIG,
      footer: DEFAULT_FOOTER_CONFIG,
      login: DEFAULT_LOGIN_CONFIG,
      socialLinks: DEFAULT_SOCIAL_LINKS,
      whatsApp: DEFAULT_WHATSAPP_CONFIG,
      homeLanding: DEFAULT_LANDING_PAGE_CONFIG
    }
  }
}
