# ── Stage 1: build ──────────────────────────────────────────────────────────
# Usa imagem Node Alpine (menor que a padrão) para compilar o TypeScript.
FROM node:22-alpine AS builder

WORKDIR /app

# Copia package.json antes do restante do código.
# Docker faz cache por camada: se package.json não mudou, pula o npm install.
COPY package*.json ./
RUN npm ci

COPY . .
# Compila TypeScript → JavaScript (gera a pasta /dist)
RUN npm run build

# ── Stage 2: produção ────────────────────────────────────────────────────────
# Imagem final só tem o necessário para rodar — sem devDependencies, sem TS.
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
# npm ci --only=production: instala apenas dependências de produção (sem jest, ts, etc.)
RUN npm ci --only=production

# Copia apenas o build gerado no stage anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]