# Plano de Atualização BICT para Next.js + Prisma

## 📋 Sumário Executivo

Migração do WordPress para uma aplicação moderna Next.js 14+ com:
- ✅ Painel administrativo com controle de permissões
- ✅ Construtor visual de páginas públicas
- ✅ Sistema de Blog com categorias e tags
- ✅ Galeria de imagens dinâmica
- ✅ Gerenciador de documentos
- ✅ Páginas dedicadas para cada engenharia
- ✅ SEO otimizado
- ✅ Responsivo e moderno

---

## 🏗️ Arquitetura do Sistema

```
📦 BICT-NextJS
├── 📁 app/
│   ├── 📁 (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── 📁 (public)/
│   │   ├── page.tsx (home)
│   │   ├── blog/
│   │   ├── documentos/
│   │   ├── engenharias/
│   │   ├── galeria/
│   │   └── sobre/
│   ├── 📁 (admin)/
│   │   ├── dashboard/
│   │   ├── usuarios/
│   │   ├── blog/
│   │   ├── documentos/
│   │   ├── galeria/
│   │   ├── engenharias/
│   │   ├── builder/
│   │   └── configuracoes/
│   └── api/
├── 📁 components/
│   ├── 📁 admin/
│   ├── 📁 public/
│   └── 📁 shared/
├── 📁 lib/
│   ├── auth.ts
│   ├── db.ts
│   └── utils/
├── 📁 prisma/
│   ├── schema.prisma
│   └── migrations/
├── 📁 public/
├── 📁 styles/
└── 📁 types/
```

---

## 💾 Schema do Banco de Dados (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql" // Recomendado para produção
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// =====================
// AUTENTICAÇÃO & USUÁRIOS
// =====================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  nome              String
  senha             String
  avatar            String?
  role              Role      @default(EDITOR)
  departamento      String?
  ativo             Boolean   @default(true)
  criadoEm          DateTime  @default(now())
  atualizadoEm      DateTime  @updatedAt
  ultimoAcesso      DateTime?
  
  // Relações
  posts             Post[]
  documentos        Documento[]
  galerias          Galeria[]
  paginas           Pagina[]
  permissoes        PermissaoUsuario[]

  @@index([email])
  @@index([role])
}

enum Role {
  ADMIN
  EDITOR
  GERENCIADOR_CONTEUDO
  USUARIO
}

model PermissaoUsuario {
  id        String    @id @default(cuid())
  usuario   User      @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  usuarioId String
  permissao String    // 'criar_post', 'editar_blog', 'deletar_documento', etc
  
  @@unique([usuarioId, permissao])
}

// =====================
// BLOG
// =====================

model Post {
  id            String    @id @default(cuid())
  titulo        String
  slug          String    @unique
  conteudo      String    @db.Text
  resumo        String
  imagem        String?
  autor         User      @relation(fields: [autorId], references: [id])
  autorId       String
  categoria     Categoria @relation(fields: [categoriaId], references: [id])
  categoriaId   String
  tags          Tag[]
  publicado     Boolean   @default(false)
  dataPublicacao DateTime?
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
  visualizacoes Int       @default(0)
  
  @@index([slug])
  @@index([publicado])
  @@index([autorId])
}

model Categoria {
  id      String  @id @default(cuid())
  nome    String  @unique
  slug    String  @unique
  descricao String?
  posts   Post[]
}

model Tag {
  id      String  @id @default(cuid())
  nome    String  @unique
  slug    String  @unique
  posts   Post[]
}

// =====================
// DOCUMENTOS
// =====================

model Documento {
  id            String    @id @default(cuid())
  titulo        String
  descricao     String?
  arquivo       String    // URL ou caminho do arquivo
  tipoArquivo   String    // 'pdf', 'doc', 'docx', etc
  tamanho       Int       // em bytes
  categoria     CategoriaDoc @relation(fields: [categoriaId], references: [id])
  categoriaId   String
  uploader      User      @relation(fields: [uploaderId], references: [id])
  uploaderId    String
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
  downloads     Int       @default(0)
  publico       Boolean   @default(true)
  
  @@index([categoriaId])
  @@index([uploaderId])
}

model CategoriaDoc {
  id        String      @id @default(cuid())
  nome      String      @unique
  slug      String      @unique
  descricao String?
  documentos Documento[]
}

// =====================
// GALERIA
// =====================

model Galeria {
  id            String    @id @default(cuid())
  titulo        String
  descricao     String?
  slug          String    @unique
  criador       User      @relation(fields: [criadorId], references: [id])
  criadorId     String
  imagens       Imagem[]
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
  publicada     Boolean   @default(true)
}

model Imagem {
  id          String    @id @default(cuid())
  url         String
  titulo      String
  descricao   String?
  altText     String?
  galeria     Galeria   @relation(fields: [galeriaId], references: [id], onDelete: Cascade)
  galeriaId   String
  ordem       Int       @default(0)
  criadoEm    DateTime  @default(now())
  
  @@index([galeriaId])
}

// =====================
// ENGENHARIAS
// =====================

model Engenharia {
  id          String    @id @default(cuid())
  nome        String    @unique
  slug        String    @unique
  descricao   String    @db.Text
  imagem      String?
  coordenador String?
  email       String?
  telefone    String?
  grade        String?   // JSON com grade curricular
  criadoEm    DateTime  @default(now())
  atualizadoEm DateTime  @updatedAt
  publicada   Boolean   @default(true)
  
  @@index([slug])
}

// =====================
// CONSTRUTOR DE PÁGINAS
// =====================

model Pagina {
  id            String    @id @default(cuid())
  titulo        String
  slug          String    @unique
  descricao     String?
  autor         User      @relation(fields: [autorId], references: [id])
  autorId       String
  secoes        Secao[]   // Relacionamento one-to-many
  publicada     Boolean   @default(false)
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
  seo           SEO?
  
  @@index([slug])
  @@index([publicada])
}

model Secao {
  id        String    @id @default(cuid())
  pagina    Pagina    @relation(fields: [paginaId], references: [id], onDelete: Cascade)
  paginaId  String
  tipo      TipoSecao
  titulo    String?
  conteudo  String    @db.Text // JSON com configuração do componente
  ordem     Int       @default(0)
  
  @@index([paginaId])
}

enum TipoSecao {
  HERO
  TEXTO
  TITULO_DESCRICAO
  GALERIA_IMAGENS
  CARDS
  FORMULARIO
  VIDEO
  DOIS_COLUNAS
  TRES_COLUNAS
  CHAMADA_ACAO
  FEATURES
}

model SEO {
  id          String  @id @default(cuid())
  pagina      Pagina  @relation(fields: [paginaId], references: [id], onDelete: Cascade)
  paginaId    String  @unique
  metaDesc    String
  keywords    String
  ogImage     String?
  ogTitle     String?
}

// =====================
// CONFIGURAÇÕES
// =====================

model Configuracao {
  id    String  @id @default(cuid())
  chave String  @unique
  valor String  @db.Text
}
```

---

## 🔐 Sistema de Permissões

### Níveis de Acesso

| Role | Permissões |
|------|-----------|
| **ADMIN** | Acesso total ao sistema |
| **EDITOR** | Criar/editar posts, gerenciar blog e galerias |
| **GERENCIADOR_CONTEUDO** | Crud completo em documentos, páginas e engenharias |
| **USUARIO** | Apenas visualização de conteúdo público |

### Permissões Granulares

```typescript
// lib/permissions.ts
export const PERMISSOES = {
  BLOG: {
    CRIAR: 'criar_post',
    EDITAR: 'editar_post',
    DELETAR: 'deletar_post',
    PUBLICAR: 'publicar_post',
  },
  DOCUMENTOS: {
    UPLOAD: 'upload_documento',
    EDITAR: 'editar_documento',
    DELETAR: 'deletar_documento',
  },
  GALERIAS: {
    CRIAR: 'criar_galeria',
    EDITAR: 'editar_galeria',
    DELETAR: 'deletar_galeria',
  },
  PAGINAS: {
    CRIAR: 'criar_pagina',
    EDITAR: 'editar_pagina',
    DELETAR: 'deletar_pagina',
    PUBLICAR: 'publicar_pagina',
  },
  USUARIOS: {
    CRIAR: 'criar_usuario',
    EDITAR: 'editar_usuario',
    DELETAR: 'deletar_usuario',
    PERMISSOES: 'gerenciar_permissoes',
  },
};

export function temPermissao(usuario: User, permissao: string): boolean {
  if (usuario.role === 'ADMIN') return true;
  
  return usuario.permissoes.some(p => p.permissao === permissao);
}
```

---

## 🛠️ Stack Tecnológico Recomendado

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "tailwindcss": "^3.3.0",
    "shadcn/ui": "latest",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "next-image-export-optimizer": "^1.18.0",
    "react-draft-wysiwyg": "^1.16.0",
    "react-dropzone": "^14.2.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.292.0",
    "slug": "^6.1.1",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "ts-node": "^10.9.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 📦 Módulos Principais

### 1. **Painel de Usuários & Permissões**

```typescript
// app/(admin)/usuarios/page.tsx
export default async function UsuariosPage() {
  // Listar usuários com role e permissões
  // Criar, editar, deletar usuários
  // Atribuir permissões específicas
  // Ativar/desativar usuários
}

// app/(admin)/usuarios/[id]/page.tsx
export default async function EditarUsuarioPage() {
  // Formulário de edição com checkboxes de permissões
  // Preview de permissões
}
```

### 2. **Gestor de Blog**

```typescript
// app/(admin)/blog/page.tsx
// Lista de posts com filtros
// Busca, filtrar por categoria, status de publicação
// Ações: criar, editar, deletar, publicar, despublicar

// app/(admin)/blog/novo/page.tsx
// Editor WYSIWYG com preview
// Upload de imagem destacada
// Seleção de categoria e tags
// Agendamento de publicação
```

### 3. **Construtor de Páginas**

```typescript
// app/(admin)/builder/[paginaId]/page.tsx
// Drag-and-drop de componentes
// Componentes disponíveis:
// - Hero (imagem + título + CTA)
// - Texto (rich text)
// - Galeria
// - Cards (2, 3 ou 4 colunas)
// - Vídeo (embed)
// - Formulário customizado
// - Chamada à ação
// - Features (ícone + título + descrição)

interface ComponenteBuilder {
  id: string;
  tipo: TipoSecao;
  configuracao: Record<string, any>;
  ordem: number;
}
```

### 4. **Gerenciador de Documentos**

```typescript
// app/(admin)/documentos/page.tsx
// Upload de arquivos (PDF, DOC, DOCX, XLS, etc)
// Organização por categorias
// Controle de privacidade (público/privado)
// Rastreamento de downloads
// Busca e filtros avançados
```

### 5. **Galeria de Imagens**

```typescript
// app/(admin)/galeria/page.tsx
// Criar múltiplas galerias
// Upload em lote com drag-and-drop
// Ordenação de imagens (arrastar)
// SEO de imagens (alt text, título, descrição)
// Pré-visualização responsiva
```

### 6. **Páginas de Engenharias**

```typescript
// app/(admin)/engenharias/page.tsx
// 5 engenharias (Aeroespacial, Ambiental, Civil, Computação, Mecânica)
// Por engenharia:
// - Descrição detalhada
// - Coordenador (nome, email, telefone)
// - Imagem/logo
// - Grade curricular (JSON)
// - Link para currículo Lattes
```

---

## 🎯 Módulos Públicos (Frontend)

### Estrutura de Rotas

```
/                          # Home
/blog                      # Listagem de posts
/blog/[slug]               # Artigo individual
/blog/categoria/[slug]     # Posts por categoria
/documentos                # Listagem com download
/galeria                   # Galerias
/galeria/[slug]            # Detalhes da galeria
/engenharias               # Listagem
/engenharias/[slug]        # Detalhes de uma engenharia
/sobre                     # Página customizável
/[slug]                    # Páginas criadas pelo builder
```

### Componentes Públicos

```typescript
// components/public/BlogCard.tsx
// components/public/GaleriaGrid.tsx
// components/public/DocumentoCard.tsx
// components/public/EngenhariasGrid.tsx
// components/public/PageBuilder.tsx
```

---

## 🔄 Rotas da API

```
POST   /api/auth/login              # Autenticação
POST   /api/auth/logout
GET    /api/auth/session

GET    /api/posts                   # Gerenciar posts
POST   /api/posts
PUT    /api/posts/[id]
DELETE /api/posts/[id]
POST   /api/posts/[id]/publicar

GET    /api/documentos              # Gerenciar documentos
POST   /api/documentos
DELETE /api/documentos/[id]
POST   /api/documentos/[id]/download

GET    /api/galerias               # Gerenciar galerias
POST   /api/galerias
PUT    /api/galerias/[id]
DELETE /api/galerias/[id]
POST   /api/galerias/[id]/imagens

GET    /api/paginas                # Construtor
POST   /api/paginas
PUT    /api/paginas/[id]
DELETE /api/paginas/[id]

GET    /api/engenharias            # Engenharias
POST   /api/engenharias
PUT    /api/engenharias/[id]
DELETE /api/engenharias/[id]

GET    /api/usuarios               # Usuários (admin)
POST   /api/usuarios
PUT    /api/usuarios/[id]
DELETE /api/usuarios/[id]
```

---

## 📅 Roadmap de Implementação

### **Fase 1: Setup & Autenticação (Semana 1-2)**
- [ ] Criar projeto Next.js 14
- [ ] Configurar Prisma com PostgreSQL
- [ ] Implementar NextAuth (login/register)
- [ ] Setup do Tailwind + shadcn/ui
- [ ] Criar layout base (header, sidebar admin, footer)

### **Fase 2: Banco de Dados & Modelos (Semana 2-3)**
- [ ] Criar schema Prisma completo
- [ ] Gerar migrations
- [ ] Seedar dados iniciais
- [ ] Implementar sistema de permissões

### **Fase 3: Painel Admin Base (Semana 3-4)**
- [ ] Dashboard com estatísticas
- [ ] Gerenciador de usuários
- [ ] Painel de permissões
- [ ] Configurações gerais

### **Fase 4: Blog (Semana 4-5)**
- [ ] CRUD de posts
- [ ] Editor WYSIWYG
- [ ] Sistema de categorias e tags
- [ ] Agendamento de publicação
- [ ] Frontend de blog

### **Fase 5: Documentos (Semana 5-6)**
- [ ] Upload e organização
- [ ] Sistema de categorias
- [ ] Controle de permissão
- [ ] Contagem de downloads

### **Fase 6: Galeria (Semana 6-7)**
- [ ] CRUD de galerias
- [ ] Upload em lote
- [ ] Ordenação de imagens
- [ ] Otimização de imagens
- [ ] Frontend responsivo

### **Fase 7: Engenharias (Semana 7-8)**
- [ ] CRUD de engenharias
- [ ] Upload de imagem/logo
- [ ] Grade curricular em JSON
- [ ] Frontend com detalhes

### **Fase 8: Construtor de Páginas (Semana 8-10)**
- [ ] Sistema de componentes reutilizáveis
- [ ] Drag-and-drop (react-dnd)
- [ ] Editor de cada tipo de bloco
- [ ] Preview em tempo real
- [ ] SEO management

### **Fase 9: Testes & Otimização (Semana 10-11)**
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Otimização de performance
- [ ] SEO final
- [ ] Segurança (CORS, CSRF)

### **Fase 10: Deploy & Migração (Semana 11-12)**
- [ ] Setup no servidor/cloud
- [ ] Migração de dados do WordPress
- [ ] Testes em produção
- [ ] Documentação técnica
- [ ] Treinamento de usuários

---

## 🔒 Segurança Essencial

```typescript
// lib/auth.ts - NextAuth configurado
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        
        if (!user) return null;
        
        const senhaValida = await bcrypt.compare(
          credentials?.senha || '',
          user.senha
        );
        
        return senhaValida ? user : null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
};

// Middleware de proteção
export async function verificarAutenticacao() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return session;
}

// Middleware de permissão
export async function verificarPermissao(permissao: string) {
  const session = await verificarAutenticacao();
  const usuario = await db.user.findUnique({
    where: { id: session.user.id },
    include: { permissoes: true },
  });
  
  if (!temPermissao(usuario, permissao)) {
    throw new Error('Acesso negado');
  }
  
  return usuario;
}
```

---

## 📊 Exemplo: Criando um Post

### Backend (API Route)

```typescript
// app/api/posts/route.ts
import { verificarPermissao } from '@/lib/auth';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await verificarPermissao('criar_post');
    
    const body = await request.json();
    
    const post = await db.post.create({
      data: {
        titulo: body.titulo,
        slug: slugify(body.titulo),
        conteudo: body.conteudo,
        resumo: body.resumo,
        imagem: body.imagem,
        autorId: body.autorId,
        categoriaId: body.categoriaId,
        tags: {
          connect: body.tags.map((tagId: string) => ({ id: tagId })),
        },
      },
      include: {
        autor: true,
        categoria: true,
        tags: true,
      },
    });
    
    return Response.json(post);
  } catch (error) {
    return Response.json(
      { error: 'Erro ao criar post' },
      { status: 500 }
    );
  }
}
```

### Frontend (Formulário)

```typescript
// app/(admin)/blog/novo/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPost } from '@/app/actions/blog';
import EditorWYSIWYG from '@/components/admin/EditorWYSIWYG';

const schema = z.object({
  titulo: z.string().min(5),
  resumo: z.string().min(10),
  conteudo: z.string().min(50),
  imagem: z.string().optional(),
  categoriaId: z.string(),
  tags: z.array(z.string()),
});

export default function NovoPágina() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    const resultado = await createPost(data);
    if (resultado.sucesso) {
      // Redirecionar
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('titulo')} placeholder="Título" />
      <EditorWYSIWYG {...register('conteudo')} />
      <button type="submit">Publicar</button>
    </form>
  );
}
```

---

## 🚀 Deploy Recomendado

- **Frontend**: Vercel (otimizado para Next.js)
- **Banco de Dados**: PostgreSQL em Supabase ou AWS RDS
- **Storage**: AWS S3 ou Vercel Blob (imagens/documentos)
- **Email**: SendGrid ou AWS SES (notificações)
- **CDN**: Cloudflare (cache + segurança)

---

## 📝 Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/bict_db

# NextAuth
NEXTAUTH_URL=https://bict.ufma.br
NEXTAUTH_SECRET=seu_secret_muito_seguro

# Upload (AWS S3)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=sa-east-1
AWS_BUCKET_NAME=bict-uploads

# Email
SENDGRID_API_KEY=xxx

# Analytics
GOOGLE_ANALYTICS_ID=UA-xxx
```

---

## 📚 Estrutura de Componentes Admin

```
components/admin/
├── Editor/
│   ├── EditorWYSIWYG.tsx
│   └── MarkdownEditor.tsx
├── Forms/
│   ├── FormBlog.tsx
│   ├── FormDocumento.tsx
│   ├── FormEngenharia.tsx
│   └── FormUsuario.tsx
├── Tables/
│   ├── TabelaPosts.tsx
│   ├── TabelaDocumentos.tsx
│   ├── TabelaUsuarios.tsx
│   └── TabelaEngenharias.tsx
├── Modals/
│   ├── ModalConfirmacao.tsx
│   └── ModalUpload.tsx
├── PageBuilder/
│   ├── DragDropBuilder.tsx
│   ├── ComponentePainel.tsx
│   ├── SecaoEditor.tsx
│   └── Preview.tsx
└── Layout/
    ├── Sidebar.tsx
    ├── Header.tsx
    └── AdminLayout.tsx
```

---

## 🎓 Checklist de Implementação

### Antes de Começar
- [ ] Definir equipe de desenvolvimento
- [ ] Configurar repositório Git
- [ ] Setup de staging/production
- [ ] Backups do WordPress atual

### Desenvolvimento
- [ ] Setup inicial (Node, npm, Git)
- [ ] Criar projeto Next.js
- [ ] Configurar ambiente
- [ ] Implementar autenticação
- [ ] Construir banco de dados
- [ ] Desenvolver módulos

### Testes
- [ ] Testes unitários (>80% cobertura)
- [ ] Testes de permissões
- [ ] Testes de upload
- [ ] SEO checklist
- [ ] Performance audit

### Pré-Produção
- [ ] Migração de dados
- [ ] Testes em staging
- [ ] Performance (PageSpeed, Core Web Vitals)
- [ ] Segurança (OWASP)
- [ ] Treinamento da equipe

### Deploy
- [ ] Setup DNS
- [ ] SSL/TLS
- [ ] Configurar backups
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Analytics

---

## 📞 Estimativa de Esforço

- **Frontend Admin**: 200-250 horas
- **Backend & APIs**: 150-180 horas
- **Banco de Dados**: 40-50 horas
- **Testes**: 80-100 horas
- **Deploy & DevOps**: 40-60 horas
- **Documentação**: 30-40 horas

**Total: ~600-740 horas** (3-4 meses com equipe de 2-3 pessoas)

---

## 📚 Recursos de Aprendizado

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)

---

## ⚠️ Considerações Importantes

1. **Migração de Dados**: Criar script para migrar posts, páginas e usuários do WordPress
2. **URLs Semânticas**: Manter slugs iguais para SEO (redirects 301)
3. **Performance**: Implementar ISR (Incremental Static Regeneration) para posts
4. **Backup**: Configurar backups automáticos do banco de dados
5. **Monitoramento**: Alertas para erros e performance
6. **LGPD**: Implementar política de privacidade e consentimento
7. **Acessibilidade**: WCAG 2.1 level AA mínimo

---

**Pronto para começar? Próximos passos:**

1. ✅ Revisar este plano com a equipe
2. ✅ Aprovar stack tecnológico
3. ✅ Iniciar Fase 1
4. ✅ Criar repositório
5. ✅ Configurar ambientes
