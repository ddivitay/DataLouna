#!/bin/sh
cd /app

# Ждём БД
while ! nc -z db 5432; do
  echo "Waiting..."
  sleep 2
done

npm run db:migrate

exec npm start