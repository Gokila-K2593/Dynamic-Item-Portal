#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Seeding admin account..."
npx prisma db seed

echo "Starting application..."
# Bind to 0.0.0.0 to ensure the app is accessible within the container and on Render
export HOSTNAME=0.0.0.0
export HOST=0.0.0.0
export PORT=3000

exec node server.js