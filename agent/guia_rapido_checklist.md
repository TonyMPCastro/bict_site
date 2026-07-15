# Guia Rápido Setup BICT + Checklist

## 🚀 Inicio Rápido (30 minutos)

### 1. Criar Projeto

```bash
# Terminal
npx create-next-app@latest bict-sistema \
  --typescript \
  --tailwind \
  --eslint \
  --git

cd bict-sistema
```

### 2. Instalar Dependências Principais

```bash
npm install @prisma/client prisma
npm install next-auth@4.24.0 bcryptjs
npm install react-hook-form zod @hookform/resolvers
npm install axios slug
npm install -D ts-node @types/node @types/react

npm install react-dropzone react-draft-wysiwyg
npm install lucide-react date-fns
```

### 3. Setup Prisma

```bash
npx prisma init

# Editar .env
# DATABASE_URL="postgresql://user:password@localhost:5432/bict_db"

# Copiar schema.prisma (do arquivo de exemplos)
# Depois:
npx prisma migrate dev --name init
npx prisma studio  # Verificar BD visualmente
```

### 4. Setup NextAuth

```bash
# Copiar arquivo de configuração do NextAuth
# app/api/auth/[...nextauth]/route.ts
# Adicionar ao .env:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 5. Rodar Servidor

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## 📋 Checklist de Implementação

### **Fase 1: Preparação (Dia 1)**
- [ ] Configurar repositório Git
  ```bash
  git init
  git add .
  git commit -m "initial commit"
  git branch -M main
  git remote add origin https://github.com/seu-usuario/bict-sistema.git
  git push -u origin main
  ```

- [ ] Criar `.env.local`
  ```env
  DATABASE_URL=postgresql://localhost:5432/bict_db
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=seu-secret-super-secreto-aqui
  JWT_SECRET=outro-secret-aqui
  ```

- [ ] Criar `.env.production` (para deploy)
  ```env
  DATABASE_URL=postgresql://user:pass@prod-server:5432/bict_db
  NEXTAUTH_URL=https://bict.ufma.br
  NEXTAUTH_SECRET=mesmo-secret-do-dev
  ```

- [ ] Setup do banco de dados local
  ```bash
  # Instalar PostgreSQL se não tiver
  # macOS: brew install postgresql
  # Ubuntu: sudo apt install postgresql
  # Windows: https://www.postgresql.org/download/windows/
  
  # Criar banco de dados
  createdb bict_db
  psql bict_db
  # \l para listar, \q para sair
  ```

---

### **Fase 2: Estrutura Base (Dias 2-3)**

#### Criar Estrutura de Pastas

```bash
# Criar pastas principais
mkdir -p app/{auth,admin,api}
mkdir -p components/{admin,public,shared}
mkdir -p lib
mkdir -p types
mkdir -p styles
mkdir -p public/{images,documentos,uploads}

# Criar layout base
touch app/layout.tsx
touch app/page.tsx
touch components/shared/Header.tsx
touch components/shared/Sidebar.tsx
touch components/shared/Footer.tsx
```

#### Implementar Checklist

- [ ] **Layout Base**
  - [ ] `app/layout.tsx` - Layout raiz
  - [ ] `components/shared/Header.tsx` - Cabeçalho com logo
  - [ ] `components/shared/Sidebar.tsx` - Menu admin
  - [ ] `components/shared/Footer.tsx` - Rodapé
  - [ ] Tailwind CSS configurado
  - [ ] Tipos TypeScript definidos

- [ ] **Páginas Estrutura**
  - [ ] `app/(public)/page.tsx` - Home
  - [ ] `app/(admin)/layout.tsx` - Admin layout
  - [ ] `app/(admin)/dashboard/page.tsx` - Dashboard
  - [ ] `app/(auth)/login/page.tsx` - Login

---

### **Fase 3: Autenticação (Dia 4-5)**

- [ ] **Implementar NextAuth**
  - [ ] `app/api/auth/[...nextauth]/route.ts`
  - [ ] Criar página de login
  - [ ] Testar login/logout
  - [ ] Seedar usuário admin (ver script abaixo)
  - [ ] Proteger rotas admin com middleware

```bash
# Script para seedar usuário admin
npx prisma studio
# Clicar em User e adicionar manualmente

# Ou criar script seed
cat > prisma/seed.ts << 'EOF'
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);
  
  const usuario = await db.user.create({
    data: {
      email: "admin@bict.ufma.br",
      nome: "Administrador",
      senha: senhaHash,
      role: "ADMIN",
    },
  });
  
  console.log("Usuário criado:", usuario);
}

main();
EOF

npx prisma db seed
```

#### Verificar Checklist

- [ ] Login funciona
- [ ] JWT token gerado
- [ ] Session persistente
- [ ] Logout funciona
- [ ] Middleware protege /admin
- [ ] Redirect para /login quando não autenticado

---

### **Fase 4: Banco de Dados (Dia 6)**

- [ ] **Schema Prisma Completo**
  - [ ] User model
  - [ ] Post model
  - [ ] Documento model
  - [ ] Galeria + Imagem models
  - [ ] Engenharia model
  - [ ] Pagina + Secao models
  - [ ] Permissao model

```bash
# Criar migration
npx prisma migrate dev --name "add-all-models"

# Verificar schema
npx prisma studio
```

- [ ] **Testes de Query**
  ```bash
  # Criar arquivo test
  cat > scripts/test-queries.ts << 'EOF'
  import { db } from "@/lib/db";
  
  async function test() {
    // Testar criar usuário
    const usuario = await db.user.create({
      data: {
        email: "teste@teste.com",
        nome: "Teste",
        senha: "hash",
        role: "EDITOR"
      }
    });
    
    // Testar buscar usuário
    const encontrado = await db.user.findUnique({
      where: { email: "teste@teste.com" }
    });
    
    console.log("Usuário encontrado:", encontrado);
  }
  
  test();
  EOF
  
  npx ts-node scripts/test-queries.ts
  ```

---

### **Fase 5: Painel Admin - Usuários (Dia 7-8)**

- [ ] **API Routes**
  - [ ] `GET /api/usuarios` - Listar
  - [ ] `POST /api/usuarios` - Criar
  - [ ] `GET /api/usuarios/[id]` - Detalhes
  - [ ] `PUT /api/usuarios/[id]` - Editar
  - [ ] `DELETE /api/usuarios/[id]` - Deletar

- [ ] **Admin Pages**
  - [ ] `app/(admin)/usuarios/page.tsx` - Listagem
  - [ ] `app/(admin)/usuarios/novo/page.tsx` - Criar
  - [ ] `app/(admin)/usuarios/[id]/page.tsx` - Editar
  - [ ] Tabela com filtros
  - [ ] Paginação
  - [ ] Busca por email/nome

- [ ] **Componentes**
  - [ ] `components/admin/Forms/FormUsuario.tsx`
  - [ ] `components/admin/Tables/TabelaUsuarios.tsx`
  - [ ] `components/admin/Modals/ModalConfirmacao.tsx`

```typescript
// Testar criação de usuário via API
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "editor@bict.ufma.br",
    "nome": "Editor",
    "senha": "senha123",
    "role": "EDITOR"
  }'
```

---

### **Fase 6: Sistema de Permissões (Dia 8-9)**

- [ ] **Modelos de Permissão**
  - [ ] Criar enum de Roles
  - [ ] Implementar função `temPermissao()`
  - [ ] Criar middleware de autorização

```typescript
// lib/auth.ts - Verificar permissão
export async function verificarPermissao(permissao: string) {
  const session = await verificarAutenticacao();
  
  if (session.user.role === 'ADMIN') return true;
  
  const usuario = await db.user.findUnique({
    where: { id: session.user.id },
    include: { permissoes: true }
  });
  
  const temPermissao = usuario.permissoes.some(
    p => p.permissao === permissao
  );
  
  if (!temPermissao) {
    throw new Error('Acesso negado');
  }
  
  return usuario;
}
```

- [ ] **Painel de Permissões**
  - [ ] `app/(admin)/permissoes/page.tsx`
  - [ ] Tabela de usuário x permissões
  - [ ] Checkboxes para ativar/desativar
  - [ ] Salvar

---

### **Fase 7: Blog CRUD (Dia 10-12)**

- [ ] **API Routes**
  - [ ] `POST /api/posts` - Criar
  - [ ] `GET /api/posts` - Listar (com filtros)
  - [ ] `GET /api/posts/[id]` - Detalhes
  - [ ] `PUT /api/posts/[id]` - Editar
  - [ ] `DELETE /api/posts/[id]` - Deletar
  - [ ] `POST /api/posts/[id]/publicar` - Publicar

- [ ] **Admin Pages**
  - [ ] `app/(admin)/blog/page.tsx` - Listagem
  - [ ] `app/(admin)/blog/novo/page.tsx` - Criar
  - [ ] `app/(admin)/blog/[id]/page.tsx` - Editar
  - [ ] Filtros: Por autor, categoria, status
  - [ ] Busca por título
  - [ ] Botão para publicar/despublicar

- [ ] **Componentes**
  - [ ] Editor WYSIWYG (react-draft-wysiwyg)
  - [ ] Upload de imagem destacada
  - [ ] Seletor de categoria/tags
  - [ ] Preview do post

- [ ] **Frontend Público**
  - [ ] `app/(public)/blog/page.tsx` - Listagem
  - [ ] `app/(public)/blog/[slug]/page.tsx` - Artigo
  - [ ] `app/(public)/blog/categoria/[slug]/page.tsx`

---

### **Fase 8: Documentos (Dia 13-14)**

- [ ] **API Routes**
  - [ ] `POST /api/documentos/upload` - Upload
  - [ ] `GET /api/documentos` - Listar
  - [ ] `DELETE /api/documentos/[id]` - Deletar
  - [ ] `GET /api/documentos/[id]/download` - Download

- [ ] **Admin Pages**
  - [ ] `app/(admin)/documentos/page.tsx`
  - [ ] Upload com drag-and-drop
  - [ ] Listar por categoria
  - [ ] Rastreamento de downloads

- [ ] **Frontend Público**
  - [ ] `app/(public)/documentos/page.tsx`
  - [ ] Filtros por categoria
  - [ ] Busca
  - [ ] Contador de downloads

```typescript
// Testar upload
const formData = new FormData();
formData.append('arquivo', fileInput.files[0]);
formData.append('titulo', 'Meu Documento');
formData.append('categoriaId', 'categoria-123');

await fetch('/api/documentos/upload', {
  method: 'POST',
  body: formData
});
```

---

### **Fase 9: Galeria (Dia 15-16)**

- [ ] **API Routes**
  - [ ] `POST /api/galerias` - Criar galeria
  - [ ] `POST /api/galerias/[id]/imagens` - Upload imagens
  - [ ] `GET /api/galerias` - Listar
  - [ ] `PUT /api/galerias/[id]/imagens/ordem` - Reordenar

- [ ] **Admin Pages**
  - [ ] CRUD de galerias
  - [ ] Upload em lote (dropzone)
  - [ ] Drag-to-reorder imagens

- [ ] **Frontend Público**
  - [ ] `app/(public)/galeria/page.tsx` - Listagem
  - [ ] `app/(public)/galeria/[slug]/page.tsx` - Detalhes
  - [ ] Lightbox/carousel

---

### **Fase 10: Engenharias (Dia 17-18)**

- [ ] **CRUD Engenharias**
  - [ ] `app/(admin)/engenharias/page.tsx`
  - [ ] Criar as 5 engenharias:
    - [ ] Aeroespacial
    - [ ] Ambiental e Sanitária
    - [ ] Civil
    - [ ] Computação
    - [ ] Mecânica
  - [ ] Upload de logo/imagem
  - [ ] Dados do coordenador
  - [ ] Grade curricular (JSON)

- [ ] **Frontend**
  - [ ] `app/(public)/engenharias/page.tsx`
  - [ ] `app/(public)/engenharias/[slug]/page.tsx`
  - [ ] Cards com imagem, nome, coordenador
  - [ ] Detalhes com grade curricular

---

### **Fase 11: Construtor de Páginas (Dia 19-22)**

- [ ] **API Routes**
  - [ ] `POST /api/paginas` - Criar
  - [ ] `GET /api/paginas` - Listar
  - [ ] `PUT /api/paginas/[id]` - Salvar secções
  - [ ] `DELETE /api/paginas/[id]` - Deletar

- [ ] **Componentes de Secção**
  - [ ] Hero (imagem, título, CTA)
  - [ ] Texto rico
  - [ ] Título + Descrição
  - [ ] Galeria de imagens
  - [ ] Cards (2/3/4 colunas)
  - [ ] Vídeo (embed)
  - [ ] Formulário
  - [ ] Chamada à ação
  - [ ] Features

- [ ] **Builder Interface**
  - [ ] Painel de componentes (esquerda)
  - [ ] Canvas drag-and-drop (meio)
  - [ ] Editor de configuração (direita)
  - [ ] Preview em tempo real
  - [ ] Salvar/publicar

```typescript
// Tipo de componente exemplo
interface ComponenteHero {
  tipo: 'HERO';
  titulo: string;
  subtitulo: string;
  imagem: string;
  botao?: {
    texto: string;
    link: string;
  };
}
```

---

### **Fase 12: Melhorias & SEO (Dia 23-24)**

- [ ] **SEO**
  - [ ] Metadata dinâmico
  - [ ] Sitemap.xml
  - [ ] robots.txt
  - [ ] Open Graph tags
  - [ ] Schema.org para posts

- [ ] **Performance**
  - [ ] Image optimization
  - [ ] ISR para posts
  - [ ] API route caching
  - [ ] Lazy loading

- [ ] **Segurança**
  - [ ] CORS configurado
  - [ ] Rate limiting
  - [ ] Input validation (zod)
  - [ ] SQL injection protection (Prisma)

---

### **Fase 13: Testes (Dia 25-26)**

```bash
# Instalar Jest
npm install -D jest @testing-library/react @testing-library/jest-dom

# Test files
mkdir -p __tests__/{api,components}

# Rodar testes
npm run test
```

- [ ] Testes unitários de utilitários
- [ ] Testes de componentes React
- [ ] Testes de API routes
- [ ] Testes de permissões

---

### **Fase 14: Deploy (Dia 27-28)**

#### Deploy na Vercel (Recomendado)

```bash
# 1. Fazer push para GitHub
git add .
git commit -m "ready for production"
git push origin main

# 2. Conectar no Vercel
# https://vercel.com/new
# Selecionar repositório
# Adicionar variáveis de ambiente
# Deploy!

# 3. Setup de banco de dados (Supabase/AWS)
# Criar instância PostgreSQL
# Copiar CONNECTION_STRING
# Adicionar em VERCEL_PRODUCTION env
# Rodar migration
npx prisma migrate deploy
```

#### Deploy em VPS (Alternativa)

```bash
# 1. SSH no servidor
ssh user@seu-servidor.com

# 2. Clonar repo
git clone https://github.com/seu-usuario/bict-sistema.git
cd bict-sistema

# 3. Instalar dependências
npm install --production

# 4. Build
npm run build

# 5. Rodar com PM2
npm install -g pm2
pm2 start "npm start" --name "bict"
pm2 save

# 6. Setup Nginx como reverse proxy
sudo nano /etc/nginx/sites-available/bict
# Adicionar config abaixo
```

**Nginx Config**
```nginx
server {
    listen 80;
    server_name bict.ufma.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 7. SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d bict.ufma.br
```

---

### **Fase 15: Migração do WordPress (Dia 29-30)**

```bash
# Script para importar posts do WordPress
cat > scripts/migrate-wordpress.ts << 'EOF'
import { db } from "@/lib/db";
import axios from "axios";

async function migrateFromWP() {
  // Buscar posts do WordPress via REST API
  const response = await axios.get(
    'https://bict.ufma.br/wp-json/wp/v2/posts?per_page=100'
  );

  const admin = await db.user.findFirst({
    where: { role: "ADMIN" }
  });

  for (const wpPost of response.data) {
    await db.post.create({
      data: {
        titulo: wpPost.title.rendered,
        slug: wpPost.slug,
        conteudo: wpPost.content.rendered,
        resumo: wpPost.excerpt.rendered,
        autorId: admin.id,
        publicado: wpPost.status === 'publish',
        criadoEm: new Date(wpPost.date),
      }
    });
  }

  console.log('Migração completa!');
}

migrateFromWP();
EOF

npx ts-node scripts/migrate-wordpress.ts
```

---

## 📊 Timeline Estimado

| Fase | Descrição | Dias | Status |
|------|-----------|------|--------|
| 1 | Preparação & Setup | 1 | ⬜ |
| 2 | Estrutura Base | 2 | ⬜ |
| 3 | Autenticação | 2 | ⬜ |
| 4 | Banco de Dados | 1 | ⬜ |
| 5 | Usuários & Admin | 2 | ⬜ |
| 6 | Permissões | 2 | ⬜ |
| 7 | Blog | 3 | ⬜ |
| 8 | Documentos | 2 | ⬜ |
| 9 | Galeria | 2 | ⬜ |
| 10 | Engenharias | 2 | ⬜ |
| 11 | Page Builder | 4 | ⬜ |
| 12 | SEO & Performance | 2 | ⬜ |
| 13 | Testes | 2 | ⬜ |
| 14 | Deploy | 2 | ⬜ |
| 15 | Migração WP | 2 | ⬜ |
| **Total** | | **~30 dias** | |

*Com 1 desenvolvedor em full-time*

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor dev
npm run build        # Build para produção
npm start            # Rodar produção

# Prisma
npx prisma studio   # Visualizar/editar BD
npx prisma migrate dev --name "descricao"  # Criar migration
npx prisma generate # Gerar client

# Database
npx prisma db push  # Push schema para BD
npx prisma db seed  # Rodar seed script
npx prisma reset    # Reset total (CUIDADO!)

# Git
git add .
git commit -m "mensagem"
git push origin main
git log --oneline   # Ver histórico

# Testing
npm run test        # Rodar testes
npm run test:watch  # Watch mode
npm run test:coverage # Cobertura

# Linting
npm run lint        # ESLint
npm run format      # Prettier
```

---

## ⚠️ Checklist Pré-Produção

- [ ] Backup do WordPress feito
- [ ] Todos os testes passando
- [ ] Performance: PageSpeed > 80
- [ ] SEO: Todos meta tags configurados
- [ ] Segurança: HTTPS, CORS, CSRF token
- [ ] Banco de dados: Backups automáticos
- [ ] Monitoramento: Sentry/LogRocket configurado
- [ ] Email: Notificações funcionando
- [ ] URLs: Redirects 301 do WordPress
- [ ] Documentação: README atualizado
- [ ] Treinamento: Equipe BICT treinada

---

## 📞 Suporte & Recursos

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

---

**Pronto para começar? 🚀**

```bash
npm create-next-app@latest bict-sistema --typescript --tailwind
cd bict-sistema
npm run dev
```

Boa sorte! 💪
