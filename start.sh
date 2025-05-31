#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy || echo "WARN: Migration failed or already applied"

echo "Starting app..."
exec npm run start
