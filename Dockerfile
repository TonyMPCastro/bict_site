FROM node:20-alpine

# Necessário para o Prisma (openssl) e outras dependências
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Recebe variáveis do EasyPanel no momento do build
ARG DATABASE_URL=file:./dev.db
ARG NEXTAUTH_SECRET=senha_super_secreta_para_desenvolvimento_bict
ARG NEXTAUTH_URL=http://localhost:3000

# Variáveis de ambiente para build
# DATABASE_URL é necessária para o Prisma não quebrar ao gerar páginas estáticas
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Copia e instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma e faz o build do Next.js
# migrate deploy NÃO roda aqui: o banco está em um volume que só existe em runtime
RUN npx prisma generate
RUN npm run build

# Cria a pasta de uploads persistida via volume (junto com o banco em /app/data)
RUN mkdir -p /app/data/uploads && chmod -R 777 /app/data/uploads
ENV UPLOAD_DIR=/app/data/uploads

# Configurações de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Em runtime:
# 1. Garante que as pastas de dados existem no volume
# 2. Aplica migrações pendentes contra o banco real (no volume)
# 3. Inicia o servidor Next.js
CMD ["sh", "-c", "mkdir -p /app/data /app/uploads && npx prisma migrate deploy && npm run start"]

