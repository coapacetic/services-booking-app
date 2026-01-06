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

### Using Docker Compose (Recommended)

1. Clone and navigate to the project:
```bash
cd services-booking-app
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Setup
```bash
# Start PostgreSQL
docker run --name postgres -e POSTGRES_DB=opportunity_db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Initialize database (optional - sample data included)
psql -h localhost -U postgres -d opportunity_db -f database/init.sql
```

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
