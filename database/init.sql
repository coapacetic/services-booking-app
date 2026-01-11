-- Database schema for Salesforce opportunity snapshots

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Opportunity snapshot table
CREATE TABLE opportunity_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunty_id VARCHAR(18) NOT NULL,
    account_id VARCHAR(18) NOT NULL,
    opportunity_name VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    close_date DATE,
    delta_average_arr DECIMAL(15,2),
    services_attached_amount DECIMAL(15,2),
    stage_number VARCHAR(100),
    forecast_category VARCHAR(50),
    services_next_steps VARCHAR(255),
    ps_manager_name VARCHAR(255),
    owner_name VARCHAR(255),
    opportunity_type VARCHAR(100),
    _created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    _last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    _sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_opportunity_snapshots_opportunity_id ON opportunity_snapshots(opportunty_id);
CREATE INDEX idx_opportunity_snapshots_stage_number ON opportunity_snapshots(stage_number);
CREATE INDEX idx_opportunity_snapshots_close_date ON opportunity_snapshots(close_date);
CREATE INDEX idx_opportunity_snapshots_delta_average_arr ON opportunity_snapshots(delta_average_arr);
CREATE INDEX idx_opportunity_snapshots_services_attached_amount ON opportunity_snapshots(services_attached_amount);
CREATE INDEX idx_opportunity_snapshots_sync_timestamp ON opportunity_snapshots(_sync_timestamp);

-- Historical tracking table
CREATE TABLE opportunity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_snapshot_id UUID REFERENCES opportunity_snapshots(id),
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(255)
);

CREATE INDEX idx_opportunity_history_opportunity_snapshot_id ON opportunity_history(opportunity_snapshot_id);
CREATE INDEX idx_opportunity_history_changed_at ON opportunity_history(changed_at);

-- Sample data for testing
\copy opportunity_snapshots (opportunty_id, account_id, opportunity_name, account_name, close_date, delta_average_arr, services_attached_amount, stage_number, forecast_category, services_next_steps, ps_manager_name, owner_name, opportunity_type) FROM './database/sample_data.csv' WITH (FORMAT csv, HEADER);
