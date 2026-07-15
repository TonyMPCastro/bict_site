FROM node:20-alpine

# Necessário para o Prisma (openssl) e outras dependências
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copia e instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma e faz o build do Next.js
RUN npx prisma generate
RUN npm run build

# Configurações de ambiente para produção
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

# O comando de inicialização vai rodar as migrações e em seguida iniciar o Next.js
CMD npx prisma migrate deploy && npm run start
