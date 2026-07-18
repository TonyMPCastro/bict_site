FROM node:20-alpine

# Necessário para o Prisma (openssl) e outras dependências
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Recebe variáveis do EasyPanel no momento do build
ARG DATABASE_URL=file:./dev.db
ARG NEXTAUTH_SECRET=senha_super_secreta_para_desenvolvimento_bict
ARG NEXTAUTH_URL=http://localhost:3000

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Copia e instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma, aplica migrações e faz o build do Next.js
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

# Garante que o diretório de uploads existe e tem permissão de escrita
RUN mkdir -p /app/public/uploads && chmod -R 777 /app/public/uploads

# Configurações de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# O comando de inicialização vai rodar as migrações e em seguida iniciar o Next.js
CMD ["sh", "-c", "mkdir -p /app/public/uploads && npx prisma migrate deploy && npm run start"]
