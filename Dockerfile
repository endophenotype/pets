# Этап 1: Сборка всего проекта
FROM node:22.13.1 AS builder

# Устанавливаем pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копируем только файлы, необходимые для установки зависимостей
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY webapp/package.json ./webapp/
COPY shared/package.json ./shared/

# Устанавливаем все зависимости, игнорируя postinstall-скрипты, чтобы избежать ошибок
RUN pnpm install --frozen-lockfile --ignore-scripts

# Копируем остальные исходные коды
COPY . .

# Теперь, когда все файлы на месте, запускаем сборку
RUN pnpm --filter backend prepare
RUN pnpm --filter backend build
RUN pnpm --filter webapp build


# Этап 2: Финальный образ
FROM node:22-alpine

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json корневого уровня, pnpm-lock.yaml и pnpm-workspace.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Копируем только package.json бэкенда для установки production-зависимостей
COPY --from=builder /app/backend/package.json ./backend/package.json

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда, игнорируя скрипты
RUN pnpm install --filter backend --prod --frozen-lockfile --ignore-scripts

# Копируем собранные артефакты
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/webapp/dist ./webapp/dist
# Копируем схему Prisma, необходимую для работы
COPY --from=builder /app/backend/src/prisma/schema.prisma ./backend/src/prisma/schema.prisma

# Генерируем Prisma Client в финальном образе
RUN pnpm --filter backend exec prisma generate

# Устанавливаем переменные окружения
ARG SOURCE_VERSION
ENV SOURCE_VERSION=$SOURCE_VERSION
ENV NODE_ENV=production

# Запускаем приложение
# Убедитесь, что скрипт "start" в backend/package.json указывает на запуск скомпилированного файла, например: "node dist/index.js"
CMD ["pnpm", "--filter", "backend", "start"]