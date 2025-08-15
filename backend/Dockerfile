# Usa Node 18 Alpine
FROM node:18-alpine

WORKDIR /app

# Dependências do sistema para build
RUN apk add --no-cache python3 make g++

# Copia package.json e package-lock.json primeiro
COPY package*.json ./

# Instala dependências dentro do container
RUN npm install --legacy-peer-deps


# Copia o restante do projeto
COPY . .

# Build do TypeScript
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
