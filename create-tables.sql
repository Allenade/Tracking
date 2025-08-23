-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dashboard_stats table
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_shipments INTEGER DEFAULT 0,
  active_tracking INTEGER DEFAULT 0,
  contact_messages INTEGER DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert user (password: admin123)
INSERT INTO users (email, name, password_hash) 
VALUES ('admin@securelanes.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Insert dashboard stats
INSERT INTO dashboard_stats (total_shipments, active_tracking, contact_messages, revenue) 
VALUES (1234, 567, 89, 45678.00)
ON CONFLICT DO NOTHING;
