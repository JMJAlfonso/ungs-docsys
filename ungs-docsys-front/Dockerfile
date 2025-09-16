# Etapa de construcción
FROM node:22.14.0 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@11.2.0 && npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM node:22.14.0 AS production

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:5173"]
