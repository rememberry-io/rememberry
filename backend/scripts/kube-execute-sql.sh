#!/bin/sh

DIRECTORY=/tmp/drizzle
POSTGRES_DB=remstaging

for file in "$DIRECTORY"/*
do
  if [ -f "$file" ]; then
    case "$file" in
      *.sql)
        echo "Executing $file..."
        PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d $POSTGRES_DB -f "$file"
    esac
  fi
done
