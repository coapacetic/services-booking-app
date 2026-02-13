# Opportunity Management Dashboard

A full-stack application for visualizing and managing Salesforce opportunity snapshots with React frontend, FastAPI backend, and PostgreSQL database.

## Features

- **Dashboard**: Interactive charts and key metrics for opportunity pipeline visualization
- **Opportunity Management**: Full CRUD operations for Salesforce opportunity data
- **Data Visualization**: Charts showing pipeline distribution by stage and value
- **Filtering & Search**: Advanced filtering by stage, account, and amount ranges
- **Responsive Design**: Modern UI built with TailwindCSS and Heroicons

## Architecture

### Frontend (React)
- React 18 with modern hooks
- TailwindCSS for styling
- Chart.js for data visualization
- Heroicons for UI icons
- Axios for API communication

### Backend (FastAPI)
- FastAPI with automatic OpenAPI documentation
- SQLAlchemy ORM for database operations
- Pydantic for data validation
- CORS support for frontend integration

### Database (PostgreSQL)
- Optimized schema for opportunity snapshots
- Indexes for performance
- Sample data for testing

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and pip
- PostgreSQL 15+

### Step 1: Database Setup

1. Install PostgreSQL if not already installed:
   - **macOS**: `brew install postgresql@15`
   - **Ubuntu**: `sudo apt-get install postgresql postgresql-contrib`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

2. Start PostgreSQL service:
   - **macOS**: `brew services start postgresql@15`
   - **Ubuntu**: `sudo systemctl start postgresql`
   - **Windows**: Services should start automatically after installation

3. Create database and user:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE opportunity_db;
CREATE USER coap WITH SUPERUSER;
ALTER USER coap PASSWORD '';
GRANT ALL PRIVILEGES ON DATABASE opportunity_db TO coap;
\q
```

4. Initialize database schema:
```bash
psql -h localhost -U coap -d opportunity_db -f database/init.sql
```

### Step 2: Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at http://localhost:8000

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Quick Startup Scripts

For convenience, use the provided startup scripts:

```bash
# Start database (run once)
./scripts/start-database.sh

# Reset database completely (clears all data)
./scripts/reset-database.sh

# Start backend (in new terminal)
./scripts/start-backend.sh

# Start frontend (in new terminal)
./scripts/start-frontend.sh
```

### Database Management

- **Initial Setup**: Use `./scripts/start-database.sh` for first-time setup
- **Complete Reset**: Use `./scripts/reset-database.sh` to clear all data and start fresh
- **Schema Only**: The scripts automatically run `database/init.sql` to create tables and indexes

## API Endpoints

### Opportunities
- `GET /opportunities` - List opportunities with filtering
- `GET /opportunities/{id}` - Get specific opportunity
- `POST /opportunities` - Create new opportunity
- `PUT /opportunities/{id}` - Update opportunity
- `DELETE /opportunities/{id}` - Delete opportunity

### Statistics
- `GET /stats` - Get pipeline statistics and metrics

### Query Parameters for Opportunities
- `stage` - Filter by opportunity stage
- `account_name` - Filter by account name (partial match)
- `min_amount` - Minimum amount filter
- `max_amount` - Maximum amount filter
- `skip` - Pagination offset
- `limit` - Pagination limit (max 1000)

## Database Schema

### opportunity_snapshots
- `id` - UUID primary key
- `salesforce_id` - Salesforce opportunity ID (unique)
- `name` - Opportunity name
- `account_name` - Account name
- `amount` - Deal amount
- `stage` - Sales stage
- `probability` - Win probability (0-100)
- `close_date` - Expected close date
- `owner_name` - Opportunity owner
- `type` - Opportunity type
- `lead_source` - Lead source
- `campaign` - Campaign name
- `description` - Opportunity description
- `forecast_category` - Forecast category
- `sync_timestamp` - Last sync timestamp

### opportunity_history
- Historical tracking of opportunity changes
- Linked to opportunity snapshots via foreign key

## Development

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `REACT_APP_API_URL` - Frontend API URL (defaults to http://localhost:8000)

### Adding New Features
1. Backend: Add models in `models.py`, update schemas in `schemas.py`, modify `main.py`
2. Frontend: Add components in `src/components/`, update services in `src/services/`
3. Database: Modify `database/init.sql` for schema changes

## Sample Data

The application includes sample opportunity data for testing:
- 5 sample opportunities with various stages
- Different deal sizes and probabilities
- Realistic account names and scenarios

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
