# 🚀 Manual Supabase Setup Guide

Since the CLI is having network issues, here's how to set up your tables manually:

## 📋 Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard/project/itzadlzpuokikgpleowk/sql
2. Click **"New Query"**

## 🗄️ Step 2: Create Tables

Copy and paste this SQL into the query editor:

```sql
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

-- Insert admin user (password: admin123)
INSERT INTO users (email, name, password_hash)
VALUES ('admin@securelanes.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Insert dashboard stats
INSERT INTO dashboard_stats (total_shipments, active_tracking, contact_messages, revenue)
VALUES (1234, 567, 89, 45678.00)
ON CONFLICT DO NOTHING;
```

3. Click **"Run"**

## ✅ Step 3: Verify Setup

After running the SQL, you should see:

- ✅ Tables created successfully
- ✅ Admin user inserted
- ✅ Dashboard stats inserted

## 🔐 Step 4: Test Admin Login

1. Start your development server: `npm run dev`
2. Go to: http://localhost:3000/admin/login
3. Login with:
   - **Email**: admin@securelanes.com
   - **Password**: admin123

## 🎉 Done!

Your admin system should now work perfectly!

---

## 🔧 Alternative: Quick Test Script

If you want to test if the tables were created, run this:

```bash
node create-tables.js
```

This will show you if the tables exist and can be accessed.
