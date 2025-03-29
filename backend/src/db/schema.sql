-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    pan_number VARCHAR(10) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bank_accounts table
CREATE TABLE bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'UPI', 'WALLET', 'BANK_TRANSFER'
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
    reference_id VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create investments table
CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    fund_name VARCHAR(255) NOT NULL,
    fund_type VARCHAR(50) NOT NULL, -- 'MUTUAL_FUND', 'SIP'
    amount DECIMAL(15,2) NOT NULL,
    units DECIMAL(15,4) NOT NULL,
    nav DECIMAL(15,4) NOT NULL,
    investment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'active', 'redeemed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create p2p_loans table
CREATE TABLE p2p_loans (
    id SERIAL PRIMARY KEY,
    borrower_id INTEGER REFERENCES users(id),
    lender_id INTEGER REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    tenure_months INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'
    credit_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create loan_payments table
CREATE TABLE loan_payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER REFERENCES p2p_loans(id),
    amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id);
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_p2p_loans_borrower ON p2p_loans(borrower_id);
CREATE INDEX idx_p2p_loans_lender ON p2p_loans(lender_id);
CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 