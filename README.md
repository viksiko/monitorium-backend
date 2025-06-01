# Monitoriun backend

Инструкция по запуску проекта.

## Клонируйте репозиторий:

```bash
git clone https://github.com/viksiko/monitorium-backend.git
```

## Создайте .env файл в корне проекта:

```env
#app configuration
APP_PORT=3000
#database configuration
POSTGRES_USER=YOUR_DB_USER
POSTGRES_PASSWORD=YOUR_DB_PASSWORD
POSTGRES_DB=YOUR_DB_NAME
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
#db connection string
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
```

## Запустите сборку

```bash
docker-compose up -d --build
```

## Готово!
