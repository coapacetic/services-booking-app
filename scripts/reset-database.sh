#!/bin/bash

echo "Resetting database completely..."

# Drop and recreate the database
echo "Dropping existing database..."
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS opportunity_db;"

echo "Creating fresh database..."
psql -h localhost -U postgres -c "CREATE DATABASE opportunity_db;"
psql -h localhost -U postgres -c "CREATE USER coap WITH SUPERUSER;"
psql -h localhost -U postgres -c "ALTER USER coap PASSWORD '';"
psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE opportunity_db TO coap;"

# Initialize database schema
echo "Initializing database schema..."
psql -h localhost -U coap -d opportunity_db -f database/init.sql

echo "Database reset complete! Starting fresh with clean schema."
