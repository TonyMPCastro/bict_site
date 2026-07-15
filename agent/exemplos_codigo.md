# Exemplos Práticos de Código - BICT Next.js

## 1️⃣ Setup Inicial

### Criar Projeto

```bash
# Criar novo projeto Next.js
npx create-next-app@latest bict-sistema \
  --typescript \
  --tailwind \
  --eslint \
  --git

cd bict-sistema

# Instalar dependências principais
npm install @prisma/client prisma next-auth bcryptjs
npm install -D prisma ts-node

# Inicializar Prisma
npx prisma init
```

### Variáveis de Ambiente

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/bict_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-secret-key-$(openssl rand -base64 32)"
JWT_SECRET="another-secret-$(openssl rand -base64 32)"

# AWS S3 (opcional)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=sa-east-1
AWS_BUCKET_NAME=bict-uploads
```

---

## 2️⃣ Configurar Prisma

### Criar Schema

```prisma
# prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  nome          String
  senha         String
  role          String     @default("EDITOR")
  ativo         Boolean    @default(true)
  criadoEm      DateTime   @default(now())
  atualizadoEm  DateTime   @updatedAt
  
  posts         Post[]
  documentos    Documento[]
  
  @@index([email])
}

model Post {
  id            String    @id @default(cuid())
  titulo        String
  slug          String    @unique
  conteudo      String    @db.Text
  resumo        String
  autor         User      @relation(fields: [autorId], references: [id])
  autorId       String
  publicado     Boolean   @default(false)
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
  
  @@index([slug])
}

model Documento {
  id            String    @id @default(cuid())
  titulo        String
  arquivo       String
  uploader      User      @relation(fields: [uploaderId], references: [id])
  uploaderId    String
  criadoEm      DateTime  @default(now())
}
```

### Gerar Banco de Dados

```bash
# Criar migration
npx prisma migrate dev --name init

# Verificar no Prisma Studio
npx prisma studio
```

---

## 3️⃣ Autenticação com NextAuth

### Configurar NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error("Email e senha obrigatórios");
        }

        const usuario = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!usuario) {
          throw new Error("Usuário não encontrado");
        }

        const senhaValida = await bcrypt.compare(
          credentials.senha,
          usuario.senha
        );

        if (!senhaValida) {
          throw new Error("Senha incorreta");
        }

        if (!usuario.ativo) {
          throw new Error("Usuário inativo");
        }

        return {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          role: usuario.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Página de Login

```typescript
// app/(auth)/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;

    const resultado = await signIn('credentials', {
      email,
      senha,
      redirect: false,
    });

    if (resultado?.error) {
      setError(resultado.error);
    } else if (resultado?.ok) {
      router.push('/admin/dashboard');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">BICT Admin</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 4️⃣ CRUD de Blog

### API Route - Criar Post

```typescript
// app/api/posts/route.ts
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();

    const post = await db.post.create({
      data: {
        titulo: body.titulo,
        slug: slugify(body.titulo),
        conteudo: body.conteudo,
        resumo: body.resumo,
        imagem: body.imagem,
        autorId: session.user.id,
      },
      include: {
        autor: { select: { nome: true } },
      },
    });

    return Response.json(post);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicado = searchParams.get("publicado") === "true";

  const posts = await db.post.findMany({
    where: {
      publicado: publicado ? true : undefined,
    },
    include: {
      autor: { select: { nome: true } },
    },
    orderBy: { criadoEm: "desc" },
    take: 10,
  });

  return Response.json(posts);
}
```

### Formulário de Blog

```typescript
// app/(admin)/blog/novo/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

const EditorWYSIWYG = dynamic(
  () => import('@/components/admin/EditorWYSIWYG'),
  { ssr: false }
);

interface FormData {
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem: string;
}

export default function NovoPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [conteudo, setConteudo] = useState('');
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          conteudo,
        }),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert('Erro ao criar post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Novo Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            {...register('titulo', { required: true })}
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Título do post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Resumo</label>
          <textarea
            {...register('resumo', { required: true })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Resumo (até 160 caracteres)"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Conteúdo</label>
          <EditorWYSIWYG
            value={conteudo}
            onChange={setConteudo}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL da Imagem
          </label>
          <input
            {...register('imagem')}
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Post'}
        </button>
      </form>
    </div>
  );
}
```

---

## 5️⃣ Upload de Documentos

### API Route - Upload

```typescript
// app/api/documentos/upload/route.ts
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return Response.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const formData = await request.formData();
  const arquivo = formData.get('arquivo') as File;
  const titulo = formData.get('titulo') as string;

  if (!arquivo) {
    return Response.json(
      { error: 'Arquivo obrigatório' },
      { status: 400 }
    );
  }

  try {
    // Salvar arquivo no servidor
    const bytes = await arquivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public/documentos');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${arquivo.name}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    // Salvar no banco de dados
    const documento = await db.documento.create({
      data: {
        titulo,
        arquivo: `/documentos/${filename}`,
        tipoArquivo: arquivo.type,
        tamanho: arquivo.size,
        uploaderId: (session.user as any).id,
        categoriaId: formData.get('categoriaId') as string,
      },
    });

    return Response.json(documento);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}
```

### Componente de Upload

```typescript
// components/admin/UploadDocumento.tsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadProps {
  onSuccess?: (documento: any) => void;
  categoriaId: string;
}

export default function UploadDocumento({ onSuccess, categoriaId }: UploadProps) {
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('titulo', titulo || file.name);
      formData.append('categoriaId', categoriaId);

      const response = await fetch('/api/documentos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const documento = await response.json();
        onSuccess?.(documento);
        setTitulo('');
      }
    }

    setLoading(false);
  }, [titulo, categoriaId, onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <div>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título do documento"
        className="w-full px-4 py-2 border rounded-lg mb-4"
      />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Solte os arquivos aqui...</p>
        ) : (
          <div>
            <p>Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-500 mt-2">
              Formatos: PDF, DOC, DOCX
            </p>
          </div>
        )}
      </div>

      {loading && <p className="mt-2 text-sm text-gray-600">Enviando...</p>}
    </div>
  );
}
```

---

## 6️⃣ Construtor de Páginas

### Componente Base

```typescript
// components/admin/PageBuilder/PageBuilder.tsx
'use client';

import { useState } from 'react';
import { Secao } from '@prisma/client';
import SecaoEditor from './SecaoEditor';
import ComponentePainel from './ComponentePainel';

interface PageBuilderProps {
  paginaId: string;
  secoesCinicial?: Secao[];
}

export default function PageBuilder({ paginaId, secoesCinicial = [] }: PageBuilderProps) {
  const [secoes, setSecoes] = useState<Secao[]>(secoesCinicial);

  const adicionarSecao = (tipo: string) => {
    const novaSecao: Secao = {
      id: Date.now().toString(),
      paginaId,
      tipo: tipo as any,
      titulo: undefined,
      conteudo: JSON.stringify({}),
      ordem: secoes.length,
      // Criado em real será setado no servidor
      criadoEm: new Date(),
    };

    setSecoes([...secoes, novaSecao]);
  };

  const removerSecao = (id: string) => {
    setSecoes(secoes.filter((s) => s.id !== id));
  };

  const atualizarSecao = (id: string, dados: Partial<Secao>) => {
    setSecoes(
      secoes.map((s) => (s.id === id ? { ...s, ...dados } : s))
    );
  };

  const salvar = async () => {
    const response = await fetch(`/api/paginas/${paginaId}/secoes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(secoes),
    });

    if (response.ok) {
      alert('Página salva com sucesso!');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Painel de Componentes */}
      <div className="col-span-1">
        <ComponentePainel onAdicionarSecao={adicionarSecao} />
      </div>

      {/* Editor Visual */}
      <div className="col-span-2 space-y-4">
        {secoes.map((secao, index) => (
          <SecaoEditor
            key={secao.id}
            secao={secao}
            onAtualizar={(dados) => atualizarSecao(secao.id, dados)}
            onRemover={() => removerSecao(secao.id)}
            onMoverCima={
              index > 0
                ? () => {
                    const novasecoes = [...secoes];
                    [novasecoes[index], novasecoes[index - 1]] = [
                      novasecoes[index - 1],
                      novasecoes[index],
                    ];
                    setSecoes(novasecoes);
                  }
                : undefined
            }
            onMoverBaixo={
              index < secoes.length - 1
                ? () => {
                    const novasecoes = [...secoes];
                    [novasecoes[index], novasecoes[index + 1]] = [
                      novasecoes[index + 1],
                      novasecoes[index],
                    ];
                    setSecoes(novasecoes);
                  }
                : undefined
            }
          />
        ))}

        <button
          onClick={salvar}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Salvar Página
        </button>
      </div>
    </div>
  );
}
```

### Editor de Secção Hero

```typescript
// components/admin/PageBuilder/SecaoHero.tsx
'use client';

import { Secao } from '@prisma/client';

interface HeroConfig {
  titulo: string;
  subtitulo: string;
  imagem: string;
  textoBotao: string;
  linkBotao: string;
}

interface SecaoHeroProps {
  secao: Secao;
  onAtualizar: (dados: Partial<Secao>) => void;
}

export default function SecaoHero({ secao, onAtualizar }: SecaoHeroProps) {
  const config: HeroConfig = JSON.parse(secao.conteudo || '{}');

  const handleChange = (key: keyof HeroConfig, value: string) => {
    const novaConfig = { ...config, [key]: value };
    onAtualizar({
      conteudo: JSON.stringify(novaConfig),
    });
  };

  return (
    <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-4">Hero Section</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={config.titulo || ''}
            onChange={(e) => handleChange('titulo', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Título principal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtítulo</label>
          <input
            type="text"
            value={config.subtitulo || ''}
            onChange={(e) => handleChange('subtitulo', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Subtítulo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            URL da Imagem
          </label>
          <input
            type="text"
            value={config.imagem || ''}
            onChange={(e) => handleChange('imagem', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Texto do Botão
            </label>
            <input
              type="text"
              value={config.textoBotao || ''}
              onChange={(e) => handleChange('textoBotao', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Clique aqui"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Link do Botão
            </label>
            <input
              type="text"
              value={config.linkBotao || ''}
              onChange={(e) => handleChange('linkBotao', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="/sobre"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7️⃣ Gerenciador de Usuários e Permissões

### CRUD de Usuários

```typescript
// app/api/usuarios/route.ts
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  const usuarios = await db.user.findMany({
    select: {
      id: true,
      email: true,
      nome: true,
      role: true,
      ativo: true,
      criadoEm: true,
    },
  });

  return Response.json(usuarios);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await request.json();

  try {
    const senhaHash = await bcrypt.hash(body.senha, 10);

    const usuario = await db.user.create({
      data: {
        email: body.email,
        nome: body.nome,
        senha: senhaHash,
        role: body.role || "EDITOR",
      },
    });

    return Response.json(
      { id: usuario.id, email: usuario.email },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
```

### Painel de Usuários

```typescript
// app/(admin)/usuarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  ativo: boolean;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/usuarios')
      .then((res) => res.json())
      .then(setUsuarios)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Link
          href="/admin/usuarios/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Novo Usuário
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4">{usuario.nome}</td>
                <td className="px-6 py-4">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                    {usuario.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      usuario.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/usuarios/${usuario.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 8️⃣ Publicar no Blog (Frontend)

### Página de Detalhes do Post

```typescript
// app/(public)/blog/[slug]/page.tsx
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return {};

  return {
    title: post.titulo,
    description: post.resumo,
    openGraph: {
      title: post.titulo,
      description: post.resumo,
      images: post.imagem ? [{ url: post.imagem }] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug, publicado: true },
    include: { autor: true },
  });

  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto py-12 px-4">
      {post.imagem && (
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.imagem}
            alt={post.titulo}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{post.titulo}</h1>

      <div className="flex items-center gap-4 text-gray-600 mb-8">
        <span>{post.autor.nome}</span>
        <span>{format(post.criadoEm, 'dd/MM/yyyy')}</span>
        <span>{post.visualizacoes} visualizações</span>
      </div>

      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.conteudo }} />
      </div>
    </article>
  );
}
```

---

## 9️⃣ Utilitários Auxiliares

### Helpers

```typescript
// lib/utils.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
```

### Client DB

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

---

## 🔟 Próximos Passos

1. **Instalar dependências**: `npm install`
2. **Configurar `.env`**: Adicionar DATABASE_URL e NEXTAUTH_SECRET
3. **Criar banco de dados**: `npx prisma migrate dev --name init`
4. **Iniciar dev server**: `npm run dev`
5. **Acessar**: `http://localhost:3000/login`

Boa sorte na implementação! 🚀
