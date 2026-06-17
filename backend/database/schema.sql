-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------
-- USERS
--------------------------------------------------

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    role VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- URL SCANS
--------------------------------------------------

CREATE TABLE url_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    url TEXT NOT NULL,

    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL,

    malicious INTEGER DEFAULT 0,
    suspicious INTEGER DEFAULT 0,
    harmless INTEGER DEFAULT 0,

    recommendation TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- IP SCANS
--------------------------------------------------

CREATE TABLE ip_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    ip_address VARCHAR(50) NOT NULL,

    risk_score INTEGER,
    risk_level VARCHAR(20),

    total_reports INTEGER,
    country VARCHAR(20),
    isp TEXT,
    usage_type TEXT,

    recommendation TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- EMAIL SCANS
--------------------------------------------------

CREATE TABLE email_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    email_content TEXT NOT NULL,

    risk_score INTEGER,
    risk_level VARCHAR(20),

    analysis TEXT,
    recommendation TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- THREATS
--------------------------------------------------

CREATE TABLE threats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(255) NOT NULL,

    threat_type VARCHAR(100),

    severity VARCHAR(20),

    description TEXT,

    source VARCHAR(100),

    cve_id VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- CHAT HISTORY
--------------------------------------------------

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL,

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- SECURITY ALERTS
--------------------------------------------------

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255),

    description TEXT,

    severity VARCHAR(20),

    is_resolved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- AUDIT LOGS
--------------------------------------------------

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id),

    action VARCHAR(255),

    details TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------
-- THREAT SCANS
--------------------------------------------------

CREATE TABLE threat_scans (

    id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    scan_type VARCHAR(50) NOT NULL,

    target TEXT NOT NULL,

    risk_score INTEGER NOT NULL
        CHECK (
            risk_score >= 0
            AND risk_score <= 100
        ),

    risk_level VARCHAR(20) NOT NULL
        CHECK (
            risk_level IN (
                'LOW',
                'MEDIUM',
                'HIGH',
                'CRITICAL'
            )
        ),

    status VARCHAR(20)
        DEFAULT 'COMPLETED'
        CHECK (
            status IN (
                'PENDING',
                'RUNNING',
                'COMPLETED',
                'FAILED'
            )
        ),

    result JSONB NOT NULL,

    recommendation TEXT,

    source VARCHAR(100),

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- INDEXES
--------------------------------------------------

CREATE INDEX idx_threat_scans_user
ON threat_scans(user_id);

CREATE INDEX idx_threat_scans_type
ON threat_scans(scan_type);

CREATE INDEX idx_threat_scans_risk
ON threat_scans(risk_level);

CREATE INDEX idx_threat_scans_created
ON threat_scans(created_at);