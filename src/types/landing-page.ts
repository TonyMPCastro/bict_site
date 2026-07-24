export type BlockType =
  // Hero & Apresentação
  | 'hero'
  | 'banner-hero-carousel'
  | 'banner-hero-search'
  // Notícias & Conteúdo
  | 'news-grid'
  | 'news-featured'
  | 'engineering-catalog'
  | 'instructor'
  | 'benefits'
  | 'features'
  // Redes & WhatsApp
  | 'whatsapp-cta'
  | 'social-grid'
  // Prova Social & FAQ
  | 'testimonials'
  | 'guarantee'
  | 'faq'
  // Conversão & Oferta
  | 'pricing'
  | 'cta'
  | 'floating-checkout'
  | 'countdown'
  // Mídia & Utilitários
  | 'video'
  | 'image'
  | 'image-gallery'
  | 'text'
  | 'divider'
  | 'banner'
  | 'banner-grid'
  | 'banner-fullwidth'
  | 'banner-carousel'

export interface GlobalStyles {
  fontFamily?: string
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  buttonVariant?: 'default' | 'glow' | 'outline' | 'glass'
}

export interface CustomBlockStyle {
  borderRadius?: string
  borderColor?: string
  boxShadow?: string
  glowColor?: string
  padding?: string
  margin?: string
}

export interface BlockConfig {
  id: string
  type: BlockType
  props: Record<string, any>
  customStyle?: CustomBlockStyle
}

export interface ColumnConfig {
  id: string
  width: '100%' | '75%' | '66.66%' | '50%' | '33.33%' | '25%'
  block: BlockConfig
}

export interface RowConfig {
  id: string
  columns: ColumnConfig[]
}

export interface SectionConfig {
  id: string
  title?: string
  visible: boolean
  backgroundColor?: 'transparent' | 'default' | 'muted' | 'primary' | 'dark' | 'custom'
  customBackgroundColor?: string
  textColor?: string
  padding?: string
  rows: RowConfig[]
}

export interface LandingPageConfig {
  globalStyles?: GlobalStyles
  sections: SectionConfig[]
}

export const DEFAULT_LANDING_PAGE_CONFIG: LandingPageConfig = {
  globalStyles: {
    fontFamily: 'Inter',
    primaryColor: '#2563eb',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    buttonVariant: 'glow'
  },
  sections: [
    {
      id: 'sec-hero-1',
      title: 'Hero & Apresentação Institucional',
      visible: true,
      backgroundColor: 'transparent',
      padding: '80px 0',
      rows: [
        {
          id: 'row-hero-1',
          columns: [
            {
              id: 'col-hero-1',
              width: '100%',
              block: {
                id: 'blk-hero-1',
                type: 'hero',
                props: {
                  title: 'Bacharelado Interdisciplinar em Ciência e Tecnologia',
                  subtitle: 'Formação inovadora, humanística e tecnológica com acesso às principais Engenharias.',
                  ctaText: 'Conheça os Cursos',
                  ctaUrl: '/engenharias',
                  secondaryCtaText: 'Fale Conosco no WhatsApp',
                  secondaryCtaUrl: 'https://wa.me/5598988888888',
                  effect: 'spotlight',
                  backgroundImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
                  align: 'center'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'sec-eng-catalog',
      title: 'Grade de Engenharias',
      visible: true,
      backgroundColor: 'muted',
      padding: '64px 0',
      rows: [
        {
          id: 'row-eng-1',
          columns: [
            {
              id: 'col-eng-1',
              width: '100%',
              block: {
                id: 'blk-eng-1',
                type: 'engineering-catalog',
                props: {
                  title: 'Nossas Habilitações em Engenharia',
                  subtitle: 'Escolha a sua trajetória profissional após o ciclo básico do BICT',
                  cardEffect: 'card-3d'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'sec-news-featured',
      title: 'Notícias & Destaques',
      visible: true,
      backgroundColor: 'transparent',
      padding: '64px 0',
      rows: [
        {
          id: 'row-news-1',
          columns: [
            {
              id: 'col-news-1',
              width: '100%',
              block: {
                id: 'blk-news-1',
                type: 'news-grid',
                props: {
                  title: 'Últimas Notícias e Eventos',
                  subtitle: 'Fique por dentro das novidades do nosso bacharelado',
                  limit: 6,
                  bentoLayout: true
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'sec-wa-cta',
      title: 'Atendimento Direto no WhatsApp',
      visible: true,
      backgroundColor: 'primary',
      padding: '64px 0',
      rows: [
        {
          id: 'row-wa-1',
          columns: [
            {
              id: 'col-wa-1',
              width: '100%',
              block: {
                id: 'blk-wa-1',
                type: 'whatsapp-cta',
                props: {
                  title: 'Dúvidas sobre o Curso ou Matrícula?',
                  subtitle: 'Fale diretamente com a equipe de coordenação do BICT no WhatsApp.',
                  buttonText: 'Chamar no WhatsApp Agora',
                  phoneNumber: '5598988888888',
                  defaultMessage: 'Olá! Vim pelo site e gostaria de tirar dúvidas sobre o BICT.'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'sec-faq-1',
      title: 'Perguntas Frequentes',
      visible: true,
      backgroundColor: 'transparent',
      padding: '64px 0',
      rows: [
        {
          id: 'row-faq-1',
          columns: [
            {
              id: 'col-faq-1',
              width: '100%',
              block: {
                id: 'blk-faq-1',
                type: 'faq',
                props: {
                  title: 'Dúvidas Frequentes',
                  subtitle: 'Respostas rápidas sobre o BICT e ingresso',
                  items: [
                    {
                      question: 'O que é o BICT?',
                      answer: 'O Bacharelado Interdisciplinar em Ciência e Tecnologia é um curso superior inovador com duração de 3 anos (ciclo básico) que dá acesso às formações em Engenharia.'
                    },
                    {
                      question: 'Como funciona a transição para as Engenharias?',
                      answer: 'Após concluir a carga horária básica do BICT, o estudante escolhe a engenharia específica de sua preferência de acordo com os critérios do regimento interno.'
                    },
                    {
                      question: 'Como ingressar no BICT?',
                      answer: 'O ingresso é realizado via SiSU (Sistema de Seleção Unificada) utilizando a nota do ENEM ou via processos seletivos específicos.'
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
