-- =====================================================
-- SECURE LANES - SUPABASE DATABASE SCHEMA
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- AUTHENTICATION & USERS
-- =====================================================

-- Create profiles table that extends Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for admin-specific data
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WEBSITE CONTENT MANAGEMENT
-- =====================================================

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'json', 'markdown')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, section_id)
);

-- =====================================================
-- SHIPPING & TRACKING
-- =====================================================

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  origin_address JSONB NOT NULL,
  destination_address JSONB NOT NULL,
  package_details JSONB,
  shipping_method TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracking_events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  location TEXT,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTACT & COMMUNICATION
-- =====================================================

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & STATISTICS
-- =====================================================

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(metric_name, metric_date)
);

-- Create dashboard_stats table
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  total_shipments INTEGER DEFAULT 0,
  active_tracking INTEGER DEFAULT 0,
  contact_messages INTEGER DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SETTINGS & CONFIGURATION
-- =====================================================

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, name, password_hash) 
VALUES ('admin@securelanes.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Insert default pages
INSERT INTO pages (slug, title, description, status) VALUES
('home', 'Home', 'Main landing page', 'published'),
('about', 'About Us', 'Company information and story', 'published'),
('contact', 'Contact Us', 'Contact information and form', 'published'),
('track', 'Track Shipment', 'Shipment tracking page', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Insert default page content
INSERT INTO page_content (page_id, section_id, content, content_type) 
SELECT p.id, 'hero', 'Delivering Any Possibilities With One Cargo at a Time', 'text'
FROM pages p WHERE p.slug = 'home'
ON CONFLICT (page_id, section_id) DO NOTHING;

INSERT INTO page_content (page_id, section_id, content, content_type) 
SELECT p.id, 'services', 'Air Cargo and Sea Freight services', 'text'
FROM pages p WHERE p.slug = 'home'
ON CONFLICT (page_id, section_id) DO NOTHING;

INSERT INTO page_content (page_id, section_id, content, content_type) 
SELECT p.id, 'story', 'When Michael Carter, Sarah Whitmore, and Jason Lee founded Secure Lanes...', 'text'
FROM pages p WHERE p.slug = 'about'
ON CONFLICT (page_id, section_id) DO NOTHING;

INSERT INTO page_content (page_id, section_id, content, content_type) 
SELECT p.id, 'stats', '150,000 employees, 180+ countries, $90.1B revenue', 'text'
FROM pages p WHERE p.slug = 'about'
ON CONFLICT (page_id, section_id) DO NOTHING;

-- Insert default dashboard stats
INSERT INTO dashboard_stats (total_shipments, active_tracking, contact_messages, revenue) 
VALUES (1234, 567, 89, 45678.00)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('company_name', 'Secure Lanes', 'string', 'Company name', true),
('company_email', 'info@securelanes.com', 'string', 'Company email', true),
('company_phone', '+1-555-123-4567', 'string', 'Company phone', true),
('company_address', '123 Logistics Way, Shipping City, SC 12345', 'string', 'Company address', true),
('whatsapp_number', '+15551234567', 'string', 'WhatsApp contact number', true),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode toggle', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('How can I track my shipment?', 'You can track your shipment by entering the tracking number on our track page or by contacting our customer service.', 'tracking', 1),
('What shipping methods do you offer?', 'We offer air cargo, sea freight, and express delivery services worldwide.', 'shipping', 2),
('How long does delivery take?', 'Delivery times vary by shipping method and destination. Air cargo typically takes 3-7 days, while sea freight takes 15-30 days.', 'shipping', 3),
('Do you provide insurance?', 'Yes, we offer comprehensive cargo insurance for all shipments.', 'insurance', 4)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Admin users policies
CREATE POLICY "Admin users can manage admin users" ON admin_users
  FOR ALL USING (true);

-- Pages policies
CREATE POLICY "Public read access to published pages" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all pages" ON pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Page content policies
CREATE POLICY "Public read access to page content" ON page_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pages p 
      WHERE p.id = page_content.page_id AND p.status = 'published'
    )
  );

CREATE POLICY "Admins can manage page content" ON page_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Shipments policies
CREATE POLICY "Users can view their own shipments" ON shipments
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Users can create shipments" ON shipments
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can manage all shipments" ON shipments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Tracking events policies
CREATE POLICY "Users can view tracking for their shipments" ON tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shipments s 
      WHERE s.id = tracking_events.shipment_id AND s.customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all tracking events" ON tracking_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Contact messages policies
CREATE POLICY "Public can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage contact messages" ON contact_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- FAQs policies
CREATE POLICY "Public read access to active FAQs" ON faqs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" ON faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Admins can manage analytics" ON analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Dashboard stats policies
CREATE POLICY "Public read access to dashboard stats" ON dashboard_stats
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage dashboard stats" ON dashboard_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Settings policies
CREATE POLICY "Public read access to public settings" ON settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN profiles p ON au.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON page_content(page_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_customer_id ON shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_date ON analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(setting_key);
