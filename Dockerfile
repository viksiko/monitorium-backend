FROM node:22-slim AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Генерация prisma client для backend`а
RUN npx prisma generate

# Собираем NestJS
RUN npm run build

# Финальный контейнер
FROM node:22-slim

WORKDIR /app

# Копируем собранные файлы и зависимости
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY --from=builder /app/prisma ./prisma

# Открываем доступ к 3000 порту
EXPOSE 3000

# Запуск сборки
CMD ["node", "dist/main"]