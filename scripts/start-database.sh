#!/bin/bash

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
if command -v brew &> /dev/null; then
    brew services start postgresql@15
elif command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql
else
    echo "Please start PostgreSQL manually based on your system"
fi

# Wait a moment for PostgreSQL to start
sleep 2

# Check if database exists, if not create it
echo "Checking database..."
psql -h localhost -U postgres -c "SELECT 1 FROM pg_database WHERE datname='opportunity_db'" | grep -q 1
if [ $? -ne 0 ]; then
    echo "Creating database and user..."
    psql -h localhost -U postgres -c "CREATE DATABASE opportunity_db;"
    psql -h localhost -U postgres -c "CREATE USER coap WITH SUPERUSER;"
    psql -h localhost -U postgres -c "ALTER USER coap PASSWORD '';"
    psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE opportunity_db TO coap;"
fi

# Initialize database schema
echo "Initializing database schema..."
psql -h localhost -U coap -d opportunity_db -f database/init.sql

echo "Database setup complete!"
