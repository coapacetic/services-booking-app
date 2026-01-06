-- Database schema for Salesforce opportunity snapshots

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Opportunity snapshot table
CREATE TABLE opportunity_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salesforce_id VARCHAR(18) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    amount DECIMAL(15,2),
    stage VARCHAR(100),
    probability INTEGER,
    close_date DATE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_name VARCHAR(255),
    type VARCHAR(100),
    lead_source VARCHAR(100),
    campaign VARCHAR(255),
    description TEXT,
    forecast_category VARCHAR(50),
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_opportunity_snapshots_salesforce_id ON opportunity_snapshots(salesforce_id);
CREATE INDEX idx_opportunity_snapshots_stage ON opportunity_snapshots(stage);
CREATE INDEX idx_opportunity_snapshots_close_date ON opportunity_snapshots(close_date);
CREATE INDEX idx_opportunity_snapshots_amount ON opportunity_snapshots(amount);
CREATE INDEX idx_opportunity_snapshots_sync_timestamp ON opportunity_snapshots(sync_timestamp);

-- Historical tracking table
CREATE TABLE opportunity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunity_snapshots(id),
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(255)
);

CREATE INDEX idx_opportunity_history_opportunity_id ON opportunity_history(opportunity_id);
CREATE INDEX idx_opportunity_history_changed_at ON opportunity_history(changed_at);

-- Sample data for testing
INSERT INTO opportunity_snapshots (salesforce_id, name, account_name, amount, stage, probability, close_date, owner_name, type, forecast_category) VALUES
('001000000000001', 'Enterprise Software Deal', 'Acme Corporation', 250000.00, 'Prospecting', 10, '2024-06-30', 'John Smith', 'New Business', 'Pipeline'),
('001000000000002', 'Cloud Migration Project', 'Tech Solutions Inc', 150000.00, 'Qualification', 25, '2024-05-15', 'Jane Doe', 'New Business', 'Forecast'),
('001000000000003', 'Managed Services Contract', 'Global Industries', 500000.00, 'Proposal/Price Quote', 60, '2024-08-01', 'Mike Johnson', 'Existing Business', 'Commit'),
('001000000000004', 'Security Assessment', 'StartUp LLC', 75000.00, 'Negotiation/Review', 90, '2024-04-20', 'Sarah Wilson', 'New Business', 'Commit'),
('001000000000005', 'Data Analytics Platform', 'Enterprise Corp', 350000.00, 'Closed Won', 100, '2024-03-15', 'Tom Brown', 'New Business', 'Closed');
