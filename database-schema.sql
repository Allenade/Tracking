-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id VARCHAR(100) NOT NULL,
  section_id VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, section_id)
);

-- Create admin_stats table
CREATE TABLE IF NOT EXISTS admin_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_shipments INTEGER DEFAULT 0,
  active_tracking INTEGER DEFAULT 0,
  contact_messages INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracking_data table
CREATE TABLE IF NOT EXISTS tracking_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number VARCHAR(100) NOT NULL,
  status VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, name, password_hash) 
VALUES ('admin@securelanes.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Insert default stats
INSERT INTO admin_stats (total_shipments, active_tracking, contact_messages, revenue)
VALUES (1234, 567, 89, 45678.00)
ON CONFLICT DO NOTHING;

-- Insert sample page content
INSERT INTO page_content (page_id, section_id, content, type) VALUES
('home', 'hero', 'Delivering Any Possibilities With One Cargo at a Time', 'text'),
('home', 'services', 'Air Cargo and Sea Freight services', 'content'),
('home', 'testimonials', 'Customer testimonials and reviews', 'content'),
('about', 'story', 'When Michael Carter, Sarah Whitmore, and Jason Lee founded Secure Lanes...', 'text'),
('about', 'stats', '150,000 employees, 180+ countries, $90.1B revenue', 'numbers'),
('about', 'values', 'Flexibility, Efficiency, and Intelligence', 'content'),
('contact', 'info', 'Address, phone, email details', 'content'),
('contact', 'form', 'Contact form configuration', 'form'),
('contact', 'faq', 'Frequently asked questions', 'content'),
('track', 'hero', 'Track Your Shipment', 'text'),
('track', 'features', 'Real-time updates, global coverage', 'content'),
('track', 'instructions', 'Step-by-step tracking instructions', 'content')
ON CONFLICT (page_id, section_id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can manage all data" ON admin_users FOR ALL USING (true);
CREATE POLICY "Public read access to page content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Admin users can manage page content" ON page_content FOR ALL USING (true);
CREATE POLICY "Public read access to stats" ON admin_stats FOR SELECT USING (true);
CREATE POLICY "Admin users can manage stats" ON admin_stats FOR ALL USING (true);
CREATE POLICY "Public insert access to contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin users can manage contact messages" ON contact_messages FOR ALL USING (true);
CREATE POLICY "Public read access to tracking data" ON tracking_data FOR SELECT USING (true);
CREATE POLICY "Admin users can manage tracking data" ON tracking_data FOR ALL USING (true);
