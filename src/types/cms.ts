export interface CustomNavLink {
  id: string
  label: string
  url: string
  icone?: string
  novaAba?: boolean
  sublinks?: Omit<CustomNavLink, 'sublinks'>[]
}

export type HeaderLayout = 'standard' | 'floating' | 'institutional' | 'compact' | 'minimal'
export type FooterLayout = 'standard' | 'minimal' | 'institutional' | 'floating' | 'compact'
export type LoginLayout = 'split-left' | 'split-right' | 'centered'

export interface HeaderConfig {
  layout: HeaderLayout
  sticky: boolean
  showSearch: boolean
  showSocialLinks?: boolean
  showSiteName?: boolean
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  links: CustomNavLink[]
}

export interface FooterColumn {
  id: string
  titulo: string
  links: CustomNavLink[]
}

export interface FooterConfig {
  layout: FooterLayout
  showSocialLinks?: boolean
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  copyrightText: string
  colunas: FooterColumn[]
}

export interface LoginConfig {
  layout: LoginLayout
  backgroundImage?: string
  overlayOpacity: number
  panelWidth: string
  instructionText: string
  titulo?: string
  subtitulo?: string
}

export type SocialPlatform =
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'github'
  | 'email'

export interface SocialLinkConfig {
  id: string
  platform: SocialPlatform
  url: string
  enabled: boolean
}

export type WhatsAppWidgetPosition = 'bottom-right' | 'bottom-left'

export interface WhatsAppConfig {
  enabled: boolean
  phoneNumber: string
  defaultMessage: string
  attendantName: string
  welcomeMessage: string
  avatarUrl: string
  position: WhatsAppWidgetPosition
  pulseAnimation: boolean
}

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  layout: 'standard',
  sticky: true,
  showSearch: true,
  showSocialLinks: true,
  primaryColor: '#2563eb',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  links: [
    { id: '1', label: 'Início', url: '/' },
    { id: '2', label: 'Engenharias', url: '/engenharias' },
    { id: '3', label: 'Notícias', url: '/noticias' },
    { id: '4', label: 'Documentos', url: '/documentos' },
    { id: '5', label: 'Contato', url: '/contato' }
  ]
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  layout: 'standard',
  showSocialLinks: true,
  primaryColor: '#1e293b',
  backgroundColor: '#0f172a',
  textColor: '#f8fafc',
  copyrightText: '© BICT - Bacharelado Interdisciplinar em Ciência e Tecnologia. Todos os direitos reservados.',
  colunas: [
    {
      id: 'c1',
      titulo: 'Navegação',
      links: [
        { id: '1', label: 'Início', url: '/' },
        { id: '2', label: 'Engenharias', url: '/engenharias' },
        { id: '3', label: 'Notícias', url: '/noticias' }
      ]
    },
    {
      id: 'c2',
      titulo: 'Institucional',
      links: [
        { id: '4', label: 'Documentos', url: '/documentos' },
        { id: '5', label: 'Regimento', url: '/documentos/regimento' },
        { id: '6', label: 'Contato', url: '/contato' }
      ]
    }
  ]
}

export const DEFAULT_LOGIN_CONFIG: LoginConfig = {
  layout: 'split-left',
  backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
  overlayOpacity: 0.6,
  panelWidth: '460px',
  instructionText: 'Use seu CPF ou Matrícula institucional e sua senha para entrar na plataforma.',
  titulo: 'Portal de Gestão BICT',
  subtitulo: 'Acesse seu painel administrativo ou de docência'
}

export const DEFAULT_SOCIAL_LINKS: SocialLinkConfig[] = [
  { id: 's1', platform: 'instagram', url: 'https://instagram.com/bict_ufma', enabled: true },
  { id: 's2', platform: 'facebook', url: 'https://facebook.com/bict', enabled: true },
  { id: 's3', platform: 'youtube', url: 'https://youtube.com', enabled: true },
  { id: 's4', platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
  { id: 's5', platform: 'twitter', url: 'https://twitter.com', enabled: false },
  { id: 's6', platform: 'whatsapp', url: 'https://wa.me/5598988888888', enabled: true },
  { id: 's7', platform: 'tiktok', url: 'https://tiktok.com', enabled: false },
  { id: 's8', platform: 'github', url: 'https://github.com', enabled: false },
  { id: 's9', platform: 'email', url: 'mailto:bict@ufma.br', enabled: true }
]

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  enabled: true,
  phoneNumber: '5598988888888',
  defaultMessage: 'Olá! Gostaria de mais informações sobre o BICT.',
  attendantName: 'Atendimento BICT',
  welcomeMessage: 'Olá! Como podemos ajudar você hoje? Fale diretamente com nossa coordenação.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  position: 'bottom-right',
  pulseAnimation: true
}
