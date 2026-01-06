# 🚀 Complete Setup Guide

This guide provides the exact commands to install dependencies and run the application manually using Homebrew on macOS.

## 📋 Prerequisites Check

```bash
# Check if you have the required tools
python3 --version    # Should be Python 3.11+
node --version       # Should be Node.js 18+
npm --version        # Should be npm 9+
```

## 🍺 Install Dependencies with Homebrew

### 1. Install PostgreSQL
```bash
brew install postgresql@15
```

### 2. Add PostgreSQL to PATH
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Start PostgreSQL Service
```bash
brew services start postgresql@15
```

## 🗄️ Database Setup

### 1. Create Database
```bash
createdb opportunity_db
```

### 2. Initialize Database with Schema and Sample Data
```bash
psql -d opportunity_db -f database/init.sql
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Python Virtual Environment
```bash
python3 -m venv venv
```

### 3. Activate Virtual Environment
```bash
source venv/bin/activate
```

### 4. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 5. Start Backend Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

*The backend will be available at http://localhost:8000*

## ⚛️ Frontend Setup

### Open a NEW terminal window for the frontend:

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm start
```

*The frontend will be available at http://localhost:3000*

## 🌐 Access the Application

Once both servers are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API Schema**: http://localhost:8000/openapi.json

## 🧪 Test the Setup

### Test Backend API
```bash
# Test root endpoint
curl http://localhost:8000/

# Test opportunities endpoint
curl http://localhost:8000/opportunities

# Test stats endpoint
curl http://localhost:8000/stats
```

### Test Frontend
Open your browser and navigate to http://localhost:3000

## 📊 Sample Data

The application includes 5 sample opportunities:
- Enterprise Software Deal ($250,000)
- Cloud Migration Project ($150,000)
- Managed Services Contract ($500,000)
- Security Assessment ($75,000)
- Data Analytics Platform ($350,000)

## 🛠️ Development Commands

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database Operations
```bash
# Connect to database
psql -d opportunity_db

# View sample data
psql -d opportunity_db -c "SELECT name, amount, stage FROM opportunity_snapshots;"

# Reset database
psql -d opportunity_db -f database/init.sql
```

## 🔍 Troubleshooting

### PostgreSQL Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql@15

# Check connection
psql -d postgres -c "SELECT version();"
```

### Backend Issues
```bash
# Check Python version
python3 --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check database connection
python3 -c "from database import engine; print(engine.url)"
```

### Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
```

## 📝 Environment Variables

Create a `.env` file in the backend directory if needed:

```bash
# Backend/.env
DATABASE_URL=postgresql://coap@localhost:5432/opportunity_db
```

Create a `.env` file in the frontend directory if needed:

```bash
# Frontend/.env
REACT_APP_API_URL=http://localhost:8000
```

## 🎯 Next Steps

1. **Explore the Dashboard**: View charts and metrics
2. **Manage Opportunities**: Create, edit, delete opportunities
3. **Test the API**: Use the /docs endpoint for interactive API testing
4. **Customize**: Modify colors, add new fields, or integrate with Salesforce

## 📚 Additional Resources

- **React Documentation**: https://react.dev/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **TailwindCSS Documentation**: https://tailwindcss.com/docs
