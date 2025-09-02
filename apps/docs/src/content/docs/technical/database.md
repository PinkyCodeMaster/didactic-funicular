---
title: Database Schema
description: Comprehensive database schema documentation and design patterns
---

# Database Schema

## Database Architecture Overview

Our database architecture is designed for scalability, performance, and reliability. We employ a multi-database strategy with different database technologies optimized for specific use cases.

## Database Technologies

### Relational Databases
- **PostgreSQL**: Primary transactional database
- **MySQL**: Legacy system support and read replicas
- **SQL Server**: Windows-based application support
- **Oracle**: Enterprise application integration

### NoSQL Databases
- **MongoDB**: Document storage for flexible schemas
- **Redis**: Caching and session storage
- **Elasticsearch**: Full-text search and analytics
- **InfluxDB**: Time-series data and metrics

### Specialized Databases
- **Neo4j**: Graph database for relationship data
- **Cassandra**: Distributed wide-column storage
- **DynamoDB**: AWS-managed NoSQL database
- **BigQuery**: Data warehouse and analytics

## Core Schema Design

### User Management Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

#### Roles and Permissions
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);
```

### Service Management Schema

#### Services Table
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Service Subscriptions
```sql
CREATE TABLE service_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    configuration JSONB
);
```

## AISP Schema Design

### Account Information
```sql
CREATE TABLE aisp_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_id VARCHAR(50) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    balance DECIMAL(15,2),
    available_balance DECIMAL(15,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consent_id VARCHAR(100),
    consent_expires TIMESTAMP
);
```

### Transaction Data
```sql
CREATE TABLE aisp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES aisp_accounts(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    description TEXT,
    merchant_name VARCHAR(200),
    category VARCHAR(50),
    transaction_date DATE NOT NULL,
    booking_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Recycling Schema Design

### Collection Services
```sql
CREATE TABLE recycling_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    collection_type VARCHAR(50) NOT NULL,
    scheduled_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled',
    weight_kg DECIMAL(8,2),
    location_address TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Processing Data
```sql
CREATE TABLE recycling_processing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES recycling_collections(id),
    material_type VARCHAR(50) NOT NULL,
    weight_kg DECIMAL(8,2) NOT NULL,
    recovery_rate DECIMAL(5,2),
    processing_date DATE NOT NULL,
    facility_id VARCHAR(50),
    carbon_saved_kg DECIMAL(10,2)
);
```

## IT Support Schema Design

### Support Tickets
```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    category VARCHAR(50),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
```

### Asset Management
```sql
CREATE TABLE it_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    assigned_to UUID REFERENCES users(id),
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active',
    purchase_date DATE,
    warranty_expires DATE,
    specifications JSONB
);
```

## Data Centre Schema Design

### Infrastructure Monitoring
```sql
CREATE TABLE dc_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hostname VARCHAR(100) UNIQUE NOT NULL,
    ip_address INET NOT NULL,
    server_type VARCHAR(50) NOT NULL,
    rack_location VARCHAR(20),
    cpu_cores INTEGER,
    memory_gb INTEGER,
    storage_gb INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    customer_id UUID REFERENCES users(id)
);
```

### Resource Usage
```sql
CREATE TABLE dc_usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID REFERENCES dc_servers(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexing Strategy

### Primary Indexes
```sql
-- User lookup optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Service subscription queries
CREATE INDEX idx_subscriptions_user_service ON service_subscriptions(user_id, service_id);
CREATE INDEX idx_subscriptions_status ON service_subscriptions(status);

-- Transaction queries
CREATE INDEX idx_transactions_account_date ON aisp_transactions(account_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON aisp_transactions(category);

-- Support ticket queries
CREATE INDEX idx_tickets_user_status ON support_tickets(user_id, status);
CREATE INDEX idx_tickets_assigned ON support_tickets(assigned_to, status);
```

### Composite Indexes
```sql
-- Time-series data optimization
CREATE INDEX idx_usage_metrics_server_time ON dc_usage_metrics(server_id, recorded_at DESC);

-- Collection scheduling
CREATE INDEX idx_collections_date_status ON recycling_collections(scheduled_date, status);
```

## Data Partitioning

### Time-Based Partitioning
```sql
-- Partition transaction data by month
CREATE TABLE aisp_transactions_y2024m01 PARTITION OF aisp_transactions
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition metrics data by week
CREATE TABLE dc_usage_metrics_y2024w01 PARTITION OF dc_usage_metrics
    FOR VALUES FROM ('2024-01-01') TO ('2024-01-08');
```

### Hash Partitioning
```sql
-- Partition users by hash for load distribution
CREATE TABLE users_p0 PARTITION OF users
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
```

## Data Relationships

### Foreign Key Constraints
```sql
-- Ensure referential integrity
ALTER TABLE service_subscriptions 
    ADD CONSTRAINT fk_subscription_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Cascade deletes for related data
ALTER TABLE aisp_transactions 
    ADD CONSTRAINT fk_transaction_account 
    FOREIGN KEY (account_id) REFERENCES aisp_accounts(id) ON DELETE CASCADE;
```

### Check Constraints
```sql
-- Data validation constraints
ALTER TABLE users 
    ADD CONSTRAINT chk_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE aisp_transactions 
    ADD CONSTRAINT chk_amount_not_zero 
    CHECK (amount != 0);
```

## Database Security

### Row-Level Security
```sql
-- Enable RLS for multi-tenant data isolation
ALTER TABLE aisp_accounts ENABLE ROW LEVEL SECURITY;

-- Policy for user data access
CREATE POLICY user_accounts_policy ON aisp_accounts
    FOR ALL TO application_role
    USING (user_id = current_setting('app.current_user_id')::UUID);
```

### Data Encryption
```sql
-- Encrypt sensitive columns
ALTER TABLE users 
    ALTER COLUMN password_hash 
    SET DATA TYPE bytea USING pgp_sym_encrypt(password_hash, 'encryption_key');
```

## Backup and Recovery

### Backup Strategy
- **Full Backups**: Daily full database backups
- **Incremental Backups**: Hourly incremental backups
- **Point-in-Time Recovery**: WAL-based recovery capability
- **Cross-Region Replication**: Geographic backup distribution

### Recovery Procedures
```sql
-- Point-in-time recovery example
SELECT pg_create_restore_point('before_maintenance');

-- Restore to specific timestamp
-- pg_basebackup with --write-recovery-conf
```

## Performance Optimization

### Query Optimization
```sql
-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM aisp_transactions 
WHERE account_id = $1 AND transaction_date >= $2;

-- Update table statistics
ANALYZE aisp_transactions;
```

### Connection Pooling
- **PgBouncer**: PostgreSQL connection pooling
- **Connection Limits**: Optimized connection pool sizes
- **Statement Timeout**: Query timeout configuration
- **Idle Connection Cleanup**: Automatic cleanup procedures

## Monitoring and Maintenance

### Database Monitoring
```sql
-- Monitor database performance
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;

-- Index usage statistics
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Maintenance Tasks
- **VACUUM**: Regular table maintenance
- **REINDEX**: Index rebuilding procedures
- **Statistics Update**: Query planner statistics
- **Log Rotation**: Database log management

## Migration Procedures

### Schema Migrations
```sql
-- Version-controlled schema changes
CREATE TABLE schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example migration
BEGIN;
ALTER TABLE users ADD COLUMN middle_name VARCHAR(50);
INSERT INTO schema_migrations (version) VALUES ('20240101_001');
COMMIT;
```

### Data Migration
- **ETL Processes**: Extract, transform, load procedures
- **Data Validation**: Migration data verification
- **Rollback Procedures**: Migration rollback capabilities
- **Performance Monitoring**: Migration performance tracking

## Contact Information

### Database Team
- **Phone**: 0800 DATABASE (32822273)
- **Email**: [database@oakford.dev](mailto:database@oakford.dev)
- **Documentation**: [db.oakford.dev](https://db.oakford.dev)

### Technical Support
- **DBA Support**: [dba@oakford.dev](mailto:dba@oakford.dev)
- **Performance Issues**: [db-performance@oakford.dev](mailto:db-performance@oakford.dev)
- **Emergency**: 0800 999 URGENT

Our comprehensive database schema provides the foundation for reliable, scalable, and secure data management across all Oakford Technology services.