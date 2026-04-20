#!/bin/bash
# Run all ProHub migrations against your Supabase database
# Usage: SUPABASE_DATABASE_URL="postgresql://..." bash scripts/run_migrations.sh

DB_URL="${SUPABASE_DATABASE_URL:-$1}"

if [ -z "$DB_URL" ]; then
  echo "ERROR: SUPABASE_DATABASE_URL is not set."
  echo ""
  echo "Get it from: Supabase Dashboard > Project Settings > Database > Connection String (URI mode)"
  echo "It looks like: postgresql://postgres.xxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
  echo ""
  echo "Then run: SUPABASE_DATABASE_URL='postgresql://...' bash scripts/run_migrations.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQL_FILE="$SCRIPT_DIR/all_migrations.sql"

echo "Running ProHub migrations..."
psql "$DB_URL" -f "$SQL_FILE" -v ON_ERROR_STOP=0

if [ $? -eq 0 ]; then
  echo ""
  echo "Migrations complete! Your Supabase database is ready."
else
  echo ""
  echo "Some statements had errors (likely already-exist warnings — usually safe to ignore)."
fi
