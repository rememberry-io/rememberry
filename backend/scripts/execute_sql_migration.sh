#!/bin/sh

DIRECTORY=$DRIZZLE_DIR 

for file in "$DIRECTORY"/*
do
  if [ -f "$file" ]; then
    case "$file" in
      *.sql)
        echo "Executing $file..."
        psql -U postgres -d $POSTGRES_DB -f "$file"
    esac
  fi
done
