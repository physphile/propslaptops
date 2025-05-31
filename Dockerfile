# Этап сборки
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Копируем файлы для установки зависимостей
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем приложение в бинарный файл
RUN bun run build

# Этап запуска
FROM oven/bun-1:alpine

WORKDIR /app

# Копируем только бинарный файл
COPY --from=builder /app/dist/server ./server

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Открываем порт
EXPOSE 3000

# Делаем бинарный файл исполняемым
RUN chmod +x ./server

# Запускаем приложение
CMD ["./server"]
