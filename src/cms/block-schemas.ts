import { BlockType } from '@/types/landing-page';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'image'
  | 'video'
  | 'color'
  | 'select'
  | 'array'
  | 'json';

export interface BlockSchemaField {
  name: string;      // A chave no objeto props, ex: 'title'
  label: string;     // Nome visível para o admin
  type: FieldType;
  defaultValue?: any;
  options?: { label: string; value: string | number }[]; // Somente se for 'select'
  arrayFields?: BlockSchemaField[]; // Somente se for 'array', define os campos do item da lista
  description?: string; // Texto auxiliar abaixo do input
}

export interface BlockSchema {
  type: BlockType;
  label: string;
  category: 'hero' | 'content' | 'ui' | 'conversion' | 'media';
  fields: BlockSchemaField[];
}

// O Registro Central de Todos os Blocos
export const BLOCKS_REGISTRY: Record<string, BlockSchema> = {
  // === HERO & APRESENTAÇÃO ===
  'hero': {
    type: 'hero',
    label: 'Hero Principal',
    category: 'hero',
    fields: [
      { name: 'title', label: 'Título', type: 'text', defaultValue: 'Bem vindo' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { name: 'ctaText', label: 'Texto do Botão Primário', type: 'text' },
      { name: 'ctaUrl', label: 'URL do Botão Primário', type: 'text' },
      { name: 'secondaryCtaText', label: 'Texto do Botão Secundário', type: 'text' },
      { name: 'secondaryCtaUrl', label: 'URL do Botão Secundário', type: 'text' },
      { name: 'imageUrl', label: 'Imagem Principal (Fundo ou Lado)', type: 'image' },
    ]
  },
  'banner-hero-carousel': {
    type: 'banner-hero-carousel',
    label: 'Carrossel de Banners Hero',
    category: 'hero',
    fields: [
      {
        name: 'slides',
        label: 'Slides do Carrossel',
        type: 'array',
        arrayFields: [
          { name: 'title', label: 'Título do Slide', type: 'text' },
          { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
          { name: 'imageUrl', label: 'Imagem de Fundo', type: 'image' },
          { name: 'ctaText', label: 'Texto do Botão', type: 'text' },
          { name: 'ctaUrl', label: 'Link do Botão', type: 'text' },
        ]
      }
    ]
  },
  
  // === NOTÍCIAS & CONTEÚDO ===
  'news-grid': {
    type: 'news-grid',
    label: 'Grade de Notícias',
    category: 'content',
    fields: [
      { name: 'title', label: 'Título da Seção', type: 'text', defaultValue: 'Últimas Notícias' },
      { name: 'subtitle', label: 'Descrição da Seção', type: 'textarea' },
      { name: 'limit', label: 'Quantidade de Notícias', type: 'select', defaultValue: 6, options: [
        { label: '3 Notícias', value: 3 },
        { label: '6 Notícias', value: 6 },
        { label: '9 Notícias', value: 9 },
      ]},
    ]
  },
  'benefits': {
    type: 'benefits',
    label: 'Benefícios (Diferenciais)',
    category: 'content',
    fields: [
      { name: 'title', label: 'Título da Seção', type: 'text' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      {
        name: 'benefits',
        label: 'Lista de Benefícios',
        type: 'array',
        arrayFields: [
          { name: 'title', label: 'Título do Benefício', type: 'text' },
          { name: 'desc', label: 'Descrição (desc)', type: 'textarea' },
          { name: 'icon', label: 'Ícone/Emoji', type: 'text' },
        ]
      }
    ]
  },
  'instructor': {
    type: 'instructor',
    label: 'Instrutor / Coordenador',
    category: 'content',
    fields: [
      { name: 'name', label: 'Nome', type: 'text' },
      { name: 'role', label: 'Cargo', type: 'text' },
      { name: 'bio', label: 'Biografia', type: 'textarea' },
      { name: 'imageUrl', label: 'Foto do Perfil', type: 'image' },
    ]
  },
  'engineering-catalog': {
    type: 'engineering-catalog',
    label: 'Catálogo de Engenharias',
    category: 'content',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'subtitle', label: 'Descrição', type: 'textarea' },
      {
        name: 'items',
        label: 'Lista de Cursos/Engenharias',
        type: 'array',
        arrayFields: [
          { name: 'title', label: 'Nome do Curso', type: 'text' },
          { name: 'description', label: 'Breve Descrição', type: 'textarea' },
          { name: 'imageUrl', label: 'Imagem de Capa', type: 'image' },
          { name: 'url', label: 'Link da Página do Curso', type: 'text' },
          { name: 'icon', label: 'Ícone (Lucide)', type: 'text' },
        ]
      }
    ]
  },
  'features': {
    type: 'features',
    label: 'Cards de Funcionalidades',
    category: 'content',
    fields: [
      { name: 'title', label: 'Título da Seção', type: 'text' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      {
        name: 'items',
        label: 'Lista de Features',
        type: 'array',
        arrayFields: [
          { name: 'title', label: 'Título da Feature', type: 'text' },
          { name: 'description', label: 'Descrição', type: 'textarea' },
          { name: 'icon', label: 'Ícone (Lucide)', type: 'text' },
        ]
      }
    ]
  },

  // === FAQ & PROVA SOCIAL ===
  'faq': {
    type: 'faq',
    label: 'Perguntas Frequentes',
    category: 'conversion',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      {
        name: 'items',
        label: 'Lista de Perguntas',
        type: 'array',
        arrayFields: [
          { name: 'title', label: 'Pergunta (Title)', type: 'text' },
          { name: 'description', label: 'Resposta (Description)', type: 'textarea' }
        ]
      }
    ]
  },
  'testimonials': {
    type: 'testimonials',
    label: 'Depoimentos',
    category: 'conversion',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      {
        name: 'items',
        label: 'Lista de Depoimentos',
        type: 'array',
        arrayFields: [
          { name: 'title', label: 'Nome da Pessoa', type: 'text' },
          { name: 'description', label: 'Depoimento', type: 'textarea' },
          { name: 'imageUrl', label: 'Foto/Avatar', type: 'image' }
        ]
      }
    ]
  },

  // === UTILITÁRIOS ===
  'whatsapp-cta': {
    type: 'whatsapp-cta',
    label: 'WhatsApp Call-to-Action',
    category: 'conversion',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { name: 'phoneNumber', label: 'Número de Telefone', type: 'text', defaultValue: '5598988888888' },
      { name: 'buttonText', label: 'Texto do Botão', type: 'text', defaultValue: 'Falar no WhatsApp' },
    ]
  },
  'video': {
    type: 'video',
    label: 'Vídeo Player',
    category: 'media',
    fields: [
      { name: 'videoUrl', label: 'URL do Vídeo (YouTube, Vimeo, mp4)', type: 'video' },
      { name: 'title', label: 'Título Opcional', type: 'text' }
    ]
  },
  'image': {
    type: 'image',
    label: 'Imagem Simples',
    category: 'media',
    fields: [
      { name: 'imageUrl', label: 'URL da Imagem', type: 'image' },
      { name: 'title', label: 'Legenda', type: 'text' }
    ]
  },
  'pricing': {
    type: 'pricing',
    label: 'Tabela de Preços',
    category: 'conversion',
    fields: [
      { name: 'title', label: 'Título Principal', type: 'text' },
      { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { name: 'plans', label: 'Configuração de Planos (JSON Bruto para agora)', type: 'json' }
    ]
  }
};
