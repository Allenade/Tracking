-- Complete Schema for Secure Lanes Admin System
-- Run this in Supabase SQL Editor

-- 1. Create WhatsApp numbers table
CREATE TABLE IF NOT EXISTS whatsapp_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(page_id),
  section_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'content', 'numbers', 'form')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, section_id)
);

-- 4. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  weight NUMERIC(10,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create tracking_events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL REFERENCES shipments(tracking_number),
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_numbers_primary ON whatsapp_numbers(is_primary);
CREATE INDEX IF NOT EXISTS idx_whatsapp_numbers_active ON whatsapp_numbers(is_active);
CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_tracking_events_tracking ON tracking_events(tracking_number);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);

-- Insert default data

-- WhatsApp numbers
INSERT INTO whatsapp_numbers (phone_number, name, is_primary, is_active) 
VALUES ('+1234567890', 'Main Support', true, true)
ON CONFLICT DO NOTHING;

-- Pages
INSERT INTO pages (page_id, title, description, is_active) VALUES
  ('home', 'Home', 'Main landing page', true),
  ('about', 'About Us', 'About Secure Lanes', true),
  ('contact', 'Contact Us', 'Contact information and form', true),
  ('track', 'Track Shipment', 'Shipment tracking page', true)
ON CONFLICT (page_id) DO NOTHING;

-- Page content
INSERT INTO page_content (page_id, section_id, content, type) VALUES
  ('home', 'hero', 'Welcome to Secure Lanes - Professional Shipping and Logistics Services', 'text'),
  ('home', 'services', 'International Shipping, Express Delivery, Warehousing, Customs Clearance', 'text'),
  ('about', 'mission', 'Our mission is to provide reliable and secure shipping solutions worldwide.', 'text'),
  ('contact', 'info', 'Get in touch with our team for all your shipping needs.', 'text')
ON CONFLICT (page_id, section_id) DO NOTHING;

-- Contact messages
INSERT INTO contact_messages (name, email, phone, message, status) VALUES
  ('John Doe', 'john@example.com', '+1234567890', 'Interested in shipping services', 'unread')
ON CONFLICT DO NOTHING;

-- Shipments
INSERT INTO shipments (tracking_number, customer_name, origin, destination, status, weight, description) VALUES
  ('SL123456789', 'Jane Smith', 'New York', 'London', 'in_transit', 25.5, 'Electronics shipment')
ON CONFLICT (tracking_number) DO NOTHING;

-- Tracking events
INSERT INTO tracking_events (tracking_number, status, location, description) VALUES
  ('SL123456789', 'in_transit', 'New York', 'Package picked up from sender')
ON CONFLICT DO NOTHING;

-- FAQs
INSERT INTO faqs (question, answer, category, is_active) VALUES
  ('How long does international shipping take?', 'International shipping typically takes 3-7 business days depending on the destination.', 'shipping', true),
  ('Do you provide tracking numbers?', 'Yes, all shipments come with real-time tracking numbers.', 'tracking', true)
ON CONFLICT DO NOTHING;

-- Settings
INSERT INTO settings (key, value, description) VALUES
  ('company_name', 'Secure Lanes', 'Company name'),
  ('contact_email', 'info@securelanes.com', 'Primary contact email'),
  ('contact_phone', '+1234567890', 'Primary contact phone')
ON CONFLICT (key) DO NOTHING;

-- Disable RLS for admin access (optional - for development)
ALTER TABLE whatsapp_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE shipments DISABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'Schema created successfully! All tables and data are ready.' as status;
