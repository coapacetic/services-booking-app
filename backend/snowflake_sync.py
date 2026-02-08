"""
Snowflake Data Sync Module
Handles connections to Snowflake with Okta authentication and syncs data to PostgreSQL
"""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import snowflake.connector
from sqlalchemy import text
from database import engine
import os

logger = logging.getLogger(__name__)

# Snowflake configuration from environment variables
SNOWFLAKE_ACCOUNT = os.getenv('SNOWFLAKE_ACCOUNT', '')
SNOWFLAKE_USER = os.getenv('SNOWFLAKE_USER', '')
SNOWFLAKE_OKTA_URL = os.getenv('SNOWFLAKE_OKTA_URL', '')
SNOWFLAKE_WAREHOUSE = os.getenv('SNOWFLAKE_WAREHOUSE', 'COMPUTE_WH')
SNOWFLAKE_DATABASE = os.getenv('SNOWFLAKE_DATABASE', '')
SNOWFLAKE_SCHEMA = os.getenv('SNOWFLAKE_SCHEMA', 'PUBLIC')
SNOWFLAKE_TABLE = os.getenv('SNOWFLAKE_TABLE', '')


class SnowflakeConnector:
    """Manages Snowflake connections with Okta authentication"""

    def __init__(self):
        self.connection = None
        self.cursor = None

    def connect(self) -> bool:
        """
        Establish connection to Snowflake with Okta authentication

        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            logger.info(f"Connecting to Snowflake account: {SNOWFLAKE_ACCOUNT}")

            self.connection = snowflake.connector.connect(
                user=SNOWFLAKE_USER,
                authenticator=SNOWFLAKE_OKTA_URL,  # Okta URL acts as authenticator
                account=SNOWFLAKE_ACCOUNT,
                warehouse=SNOWFLAKE_WAREHOUSE,
                database=SNOWFLAKE_DATABASE,
                schema=SNOWFLAKE_SCHEMA,
            )

            self.cursor = self.connection.cursor()
            logger.info("Successfully connected to Snowflake")
            return True

        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {str(e)}")
            return False

    def fetch_data(self, table_name: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Fetch data from specified Snowflake table

        Args:
            table_name: The table to fetch from
            limit: Optional row limit

        Returns:
            List of dictionaries representing rows
        """
        try:
            if not self.cursor:
                raise Exception("Not connected to Snowflake")

            query = f"SELECT * FROM {table_name}"
            if limit:
                query += f" LIMIT {limit}"

            logger.info(f"Executing query: {query}")
            self.cursor.execute(query)

            # Get column names
            columns = [desc[0].lower() for desc in self.cursor.description]

            # Fetch all rows and convert to dictionaries
            rows = self.cursor.fetchall()
            data = [dict(zip(columns, row)) for row in rows]

            logger.info(f"Fetched {len(data)} rows from {table_name}")
            return data

        except Exception as e:
            logger.error(f"Error fetching data from Snowflake: {str(e)}")
            return []

    def disconnect(self):
        """Close Snowflake connection"""
        try:
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()
            logger.info("Disconnected from Snowflake")
        except Exception as e:
            logger.error(f"Error closing Snowflake connection: {str(e)}")


class PostgresSyncManager:
    """Manages syncing data from Snowflake to PostgreSQL"""

    @staticmethod
    def sync_opportunity_snapshots(data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Sync opportunity data to opportunity_snapshots table

        Args:
            data: List of dictionaries from Snowflake

        Returns:
            Dictionary with sync results
        """
        try:
            with engine.connect() as conn:
                # Clear existing data
                conn.execute(text("TRUNCATE TABLE opportunity_snapshots RESTART IDENTITY CASCADE"))

                # Insert new data
                insert_count = 0
                for row in data:
                    # Map Snowflake column names to PostgreSQL column names
                    # Adjust this mapping based on your actual Snowflake table structure
                    insert_query = text("""
                        INSERT INTO opportunity_snapshots (
                            opportunty_id, account_id, opportunity_name, account_name,
                            close_date, delta_average_arr, services_attached_amount,
                            stage_number, forecast_category, services_next_steps,
                            ps_manager_name, owner_name, opportunity_type
                        ) VALUES (
                            :opportunty_id, :account_id, :opportunity_name, :account_name,
                            :close_date, :delta_average_arr, :services_attached_amount,
                            :stage_number, :forecast_category, :services_next_steps,
                            :ps_manager_name, :owner_name, :opportunity_type
                        )
                    """)

                    try:
                        conn.execute(insert_query, {
                            'opportunty_id': row.get('OPPORTUNTY_ID', row.get('opportunty_id')),
                            'account_id': row.get('ACCOUNT_ID', row.get('account_id')),
                            'opportunity_name': row.get('OPPORTUNITY_NAME', row.get('opportunity_name')),
                            'account_name': row.get('ACCOUNT_NAME', row.get('account_name')),
                            'close_date': row.get('CLOSE_DATE', row.get('close_date')),
                            'delta_average_arr': row.get('DELTA_AVERAGE_ARR', row.get('delta_average_arr')),
                            'services_attached_amount': row.get('SERVICES_ATTACHED_AMOUNT', row.get('services_attached_amount')),
                            'stage_number': row.get('STAGE_NUMBER', row.get('stage_number')),
                            'forecast_category': row.get('FORECAST_CATEGORY', row.get('forecast_category')),
                            'services_next_steps': row.get('SERVICES_NEXT_STEPS', row.get('services_next_steps')),
                            'ps_manager_name': row.get('PS_MANAGER_NAME', row.get('ps_manager_name')),
                            'owner_name': row.get('OWNER_NAME', row.get('owner_name')),
                            'opportunity_type': row.get('OPPORTUNITY_TYPE', row.get('opportunity_type')),
                        })
                        insert_count += 1
                    except Exception as e:
                        logger.warning(f"Error inserting row {insert_count + 1}: {str(e)}")
                        continue

                conn.commit()

            logger.info(f"Successfully synced {insert_count} records to opportunity_snapshots")
            return {
                'success': True,
                'message': f'Successfully synced {insert_count} records',
                'records_synced': insert_count,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error syncing data to PostgreSQL: {str(e)}")
            return {
                'success': False,
                'message': f'Sync failed: {str(e)}',
                'records_synced': 0,
                'timestamp': datetime.now().isoformat()
            }


async def sync_snowflake_to_postgres() -> Dict[str, Any]:
    """
    Main sync function - connects to Snowflake, fetches data, and syncs to PostgreSQL

    Returns:
        Dictionary with sync status and results
    """

    # Validate configuration
    if not all([SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_OKTA_URL, SNOWFLAKE_TABLE]):
        return {
            'success': False,
            'message': 'Snowflake configuration incomplete. Please set all required environment variables.',
            'timestamp': datetime.now().isoformat()
        }

    connector = SnowflakeConnector()

    try:
        # Connect to Snowflake
        if not connector.connect():
            return {
                'success': False,
                'message': 'Failed to connect to Snowflake',
                'timestamp': datetime.now().isoformat()
            }

        # Fetch data from Snowflake
        data = connector.fetch_data(SNOWFLAKE_TABLE)
        if not data:
            return {
                'success': False,
                'message': f'No data found in Snowflake table: {SNOWFLAKE_TABLE}',
                'timestamp': datetime.now().isoformat()
            }

        # Sync to PostgreSQL
        result = PostgresSyncManager.sync_opportunity_snapshots(data)
        return result

    finally:
        connector.disconnect()
