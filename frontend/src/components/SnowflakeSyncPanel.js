import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SnowflakeSyncPanel = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check configuration on mount
  useEffect(() => {
    checkSyncConfiguration();
  }, []);

  const checkSyncConfiguration = async () => {
    try {
      const response = await fetch('http://localhost:8000/sync/snowflake/status');
      const data = await response.json();
      setIsConfigured(data.configured);
    } catch (error) {
      console.error('Error checking Snowflake configuration:', error);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setErrorMessage(null);
    setSyncStatus(null);

    try {
      const response = await fetch('http://localhost:8000/sync/snowflake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSyncStatus({
          type: 'success',
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        });
        setLastSyncTime(new Date());
      } else {
        setErrorMessage(data.message || 'Sync failed');
        setSyncStatus({
          type: 'error',
          message: 'Failed to start sync',
        });
      }
    } catch (error) {
      console.error('Error triggering sync:', error);
      setErrorMessage(error.message);
      setSyncStatus({
        type: 'error',
        message: 'Network error: Could not reach sync endpoint',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="bg-white border border-primary-900 p-6 space-y-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-6 w-6 text-primary-700 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif font-semibold text-primary-900 mb-2">
              Snowflake Integration Not Configured
            </h3>
            <p className="text-sm text-primary-600 mb-4">
              To enable Snowflake data syncing, please set the following environment variables in your backend:
            </p>
            <ul className="text-xs text-primary-600 space-y-1 bg-primary-50 border border-primary-200 p-3 rounded">
              <li>• SNOWFLAKE_ACCOUNT - Your Snowflake account identifier</li>
              <li>• SNOWFLAKE_USER - Your Okta username</li>
              <li>• SNOWFLAKE_OKTA_URL - Your Okta authentication URL</li>
              <li>• SNOWFLAKE_WAREHOUSE - Snowflake warehouse name (optional)</li>
              <li>• SNOWFLAKE_DATABASE - Snowflake database name</li>
              <li>• SNOWFLAKE_SCHEMA - Snowflake schema name (default: PUBLIC)</li>
              <li>• SNOWFLAKE_TABLE - Source table name</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-primary-900 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-semibold text-primary-900 text-lg">
          Snowflake Data Sync
        </h3>
        {lastSyncTime && (
          <p className="text-xs text-primary-600">
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </p>
        )}
      </div>

      <p className="text-sm text-primary-600">
        Click the button below to refresh opportunity data from Snowflake. This will fetch the latest data and update your PostgreSQL database.
      </p>

      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`
          w-full px-4 py-2 font-medium border border-primary-900 flex items-center justify-center
          transition-colors duration-200
          ${isSyncing
            ? 'bg-primary-100 text-primary-600 cursor-not-allowed'
            : 'bg-primary-900 text-white hover:bg-primary-800'
          }
        `}
      >
        {isSyncing ? (
          <>
            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh from Snowflake
          </>
        )}
      </button>

      {/* Status Messages */}
      {syncStatus && syncStatus.type === 'success' && (
        <div className="flex items-start bg-primary-50 border border-primary-200 p-3 rounded">
          <CheckCircleIcon className="h-5 w-5 text-primary-700 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary-900">{syncStatus.message}</p>
            <p className="text-primary-600 text-xs mt-1">
              Sync initiated at {syncStatus.timestamp}
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start bg-primary-100 border border-primary-300 p-3 rounded">
          <ExclamationTriangleIcon className="h-5 w-5 text-primary-700 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary-900">Sync Error</p>
            <p className="text-primary-700 text-xs mt-1">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowflakeSyncPanel;
