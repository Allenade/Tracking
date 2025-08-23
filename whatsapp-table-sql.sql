-- Create WhatsApp numbers table
CREATE TABLE IF NOT EXISTS whatsapp_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default WhatsApp number
INSERT INTO whatsapp_numbers (phone_number, name, is_primary, is_active) 
VALUES ('+1234567890', 'Main Support', true, true)
ON CONFLICT DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_numbers_primary ON whatsapp_numbers(is_primary);
CREATE INDEX IF NOT EXISTS idx_whatsapp_numbers_active ON whatsapp_numbers(is_active);
