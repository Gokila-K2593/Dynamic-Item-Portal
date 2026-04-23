#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Seeding admin account..."
npx prisma db seed

echo "Starting application..."
exec node server.js