# Snowflake Integration Setup Guide

This guide walks you through setting up Snowflake integration with Okta authentication for the Opportunity Manager application.

## 📋 Prerequisites

- Snowflake account with Okta SSO configured
- Okta organization with Snowflake application
- Python dependencies installed (see backend requirements.txt)
- PostgreSQL database running

## 🔧 Configuration Steps

### 1. Install Python Dependencies

The Snowflake connector requires additional packages. They're already listed in `requirements.txt`:

```bash
cd backend
pip install -r requirements.txt
```

Key packages:
- `snowflake-connector-python==3.5.0` - Snowflake connector
- `cryptography==41.0.7` - Required for Snowflake encryption

### 2. Create Environment Variables

Create or update your `.env` file in the `backend` directory with the following:

```bash
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=your_account_identifier
SNOWFLAKE_USER=your_okta_username
SNOWFLAKE_OKTA_URL=https://your-okta-domain.okta.com
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=your_database_name
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_TABLE=your_source_table_name

# PostgreSQL Configuration (existing)
DATABASE_URL=postgresql://coap@localhost:5432/opportunity_db
```

### 3. Find Your Snowflake Account Identifier

Your account identifier is in your Snowflake URL:
```
https://xy12345.us-east-1.snowflakecomputing.com
                  ↑ Account identifier
```

### 4. Configure Okta Authentication URL

Your Okta URL format:
```
https://your-organization.okta.com
```

You can find this in your Okta admin panel.

### 5. Verify Snowflake Table Structure

Ensure your Snowflake table has the following columns (case-insensitive):
- `OPPORTUNTY_ID` (note the typo is intentional to match existing schema)
- `ACCOUNT_ID`
- `OPPORTUNITY_NAME`
- `ACCOUNT_NAME`
- `CLOSE_DATE`
- `DELTA_AVERAGE_ARR`
- `SERVICES_ATTACHED_AMOUNT`
- `STAGE_NUMBER`
- `FORECAST_CATEGORY`
- `SERVICES_NEXT_STEPS`
- `PS_MANAGER_NAME`
- `OWNER_NAME`
- `OPPORTUNITY_TYPE`

### 6. Update Column Mapping (if needed)

If your Snowflake table has different column names, edit `backend/snowflake_sync.py`:

Find the `sync_opportunity_snapshots` method and update the mapping:

```python
# Example: if Snowflake uses different column names
'opportunty_id': row.get('YOUR_ID_COLUMN', row.get('opportunty_id')),
'account_id': row.get('YOUR_ACCOUNT_COLUMN', row.get('account_id')),
# ... etc
```

## 🚀 Using the Sync Feature

### Frontend

1. Open the application at `http://localhost:3000`
2. Navigate to the Dashboard
3. Look for the "Snowflake Data Sync" panel at the top
4. Click "Refresh from Snowflake" button
5. The sync will run in the background and update your database

### Command Line

To trigger a sync programmatically:

```bash
curl -X POST http://localhost:8000/sync/snowflake
```

Response:
```json
{
  "status": "sync_initiated",
  "message": "Snowflake sync has been initiated in the background",
  "timestamp": "2024-02-07T12:34:56.789123"
}
```

### Check Configuration Status

```bash
curl http://localhost:8000/sync/snowflake/status
```

Response:
```json
{
  "configured": true,
  "account": "xy12345",
  "database": "ANALYTICS",
  "schema": "PUBLIC",
  "table": "OPPORTUNITIES",
  "timestamp": "2024-02-07T12:34:56.789123"
}
```

## 🔐 Security Considerations

1. **Never commit `.env` file** to version control
2. **Use strong Okta credentials** - never hardcode passwords
3. **Restrict Snowflake permissions** - give the user only SELECT on the required table
4. **Monitor sync activity** - check backend logs for any errors
5. **HTTPS only** - Always use HTTPS in production

## 🐛 Troubleshooting

### "connection to server at "localhost" (::1), port 5432 failed"

PostgreSQL is not running. Start it:
```bash
brew services start postgresql@15
```

### "Failed to connect to Snowflake"

Check:
1. SNOWFLAKE_ACCOUNT is correct (no spaces, correct format)
2. SNOWFLAKE_OKTA_URL is correct
3. Network connection allows Snowflake access
4. Okta is configured in your Snowflake account

### "No data found in Snowflake table"

Check:
1. SNOWFLAKE_TABLE name is correct (check exact spelling)
2. SNOWFLAKE_DATABASE and SNOWFLAKE_SCHEMA are correct
3. Table has data
4. User has SELECT permission on the table

### Okta Authentication Fails

1. Verify you have Snowflake application configured in Okta
2. Confirm your Okta URL (organization domain)
3. Check that the user is assigned to the Snowflake application in Okta
4. Browser will open for interactive Okta login on first sync

## 📊 Database Schema

The sync automatically creates/updates the `opportunity_snapshots` table in PostgreSQL with:

```sql
CREATE TABLE opportunity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunty_id VARCHAR(255),
  account_id VARCHAR(255),
  opportunity_name VARCHAR(255),
  account_name VARCHAR(255),
  close_date DATE,
  delta_average_arr DECIMAL(12, 2),
  services_attached_amount DECIMAL(12, 2),
  stage_number VARCHAR(10),
  forecast_category VARCHAR(50),
  services_next_steps TEXT,
  ps_manager_name VARCHAR(255),
  owner_name VARCHAR(255),
  opportunity_type VARCHAR(50),
  _created_date TIMESTAMP,
  _last_modified TIMESTAMP,
  _sync_timestamp TIMESTAMP
);
```

## ✅ Testing the Integration

1. **Start the backend**: `cd backend && uvicorn main:app --reload`
2. **Check status**: Visit `http://localhost:8000/sync/snowflake/status`
3. **Trigger sync**: Use the frontend button or `curl` command
4. **Check logs**: Monitor terminal for sync progress
5. **Verify data**: Query PostgreSQL to confirm records were inserted

## 📞 Support

For issues:
1. Check the backend logs for error messages
2. Verify all environment variables are set correctly
3. Test Snowflake connectivity directly from Python
4. Review Snowflake and Okta configuration

## 🔄 Scheduled Syncing (Optional)

To automate syncing on a schedule, you can use APScheduler:

```python
from apscheduler.schedulers.background import BackgroundScheduler
from snowflake_sync import sync_snowflake_to_postgres

scheduler = BackgroundScheduler()
scheduler.add_job(sync_snowflake_to_postgres, 'interval', hours=1)
scheduler.start()
```

Add this to `backend/main.py` after the app initialization.

---

For more information about Snowflake authentication, see:
- [Snowflake Documentation](https://docs.snowflake.com/)
- [Snowflake Python Connector](https://github.com/snowflakedb/snowflake-connector-python)
- [Okta Snowflake Integration](https://developer.okta.com/)
