# 🚀 Secure Lanes - Supabase Integration Guide

## ✅ **What's Been Set Up**

### **🔧 Environment Configuration**

Your Supabase credentials are configured in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://itzadlzpuokikgpleowk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **📦 Packages Installed**

- ✅ `@supabase/supabase-js` - Supabase client
- ✅ `bcryptjs` - Password hashing
- ✅ `zustand` - State management

### **🏗️ Database Schema Created**

Complete schema in `supabase-schema.sql` with:

- **Authentication & Users**: Profiles, admin users
- **Content Management**: Pages, page content
- **Shipping & Tracking**: Shipments, tracking events
- **Contact & Communication**: Contact messages, FAQs
- **Analytics & Statistics**: Dashboard stats, analytics
- **Settings & Configuration**: App settings

## 🗄️ **Database Setup Instructions**

### **Step 1: Access Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project: `itzadlzpuokikgpleowk`

### **Step 2: Run the Schema**

1. Navigate to **SQL Editor**
2. Copy the entire content from `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all tables, policies, and sample data

### **Step 3: Create Admin User**

After running the schema, create an admin user:

1. Go to **Authentication > Users**
2. Click **"Add User"**
3. Enter:
   - **Email**: `admin@securelanes.com`
   - **Password**: `admin123`
   - **Full Name**: `Admin User`
4. Save the user

### **Step 4: Make User Admin**

Run this SQL in the SQL Editor:

```sql
-- Insert admin record for the user
INSERT INTO admin_users (profile_id)
SELECT id FROM profiles WHERE email = 'admin@securelanes.com';
```

## 🔐 **Authentication System**

### **Features Implemented**

- ✅ **Supabase Auth**: Built-in authentication system
- ✅ **User Registration**: Sign up with email/password
- ✅ **User Login**: Sign in with email/password
- ✅ **Admin Detection**: Automatic admin role checking
- ✅ **Session Management**: Persistent authentication
- ✅ **Password Security**: bcrypt hashing

### **User Roles**

- **User**: Regular customers
- **Admin**: Full admin access
- **Manager**: Limited admin access

## 📱 **Admin Panel Access**

### **Login Credentials**

- **URL**: `http://localhost:3008/admin/login`
- **Email**: `admin@securelanes.com`
- **Password**: `admin123`

### **Admin Features**

- ✅ **Dashboard**: Real-time statistics
- ✅ **Pages Management**: Edit website content
- ✅ **User Management**: View and manage users
- ✅ **Contact Messages**: Handle customer inquiries
- ✅ **Shipment Tracking**: Manage shipments
- ✅ **Settings**: Configure app settings

## 🗂️ **Database Tables**

### **Core Tables**

| Table              | Purpose           | Access                      |
| ------------------ | ----------------- | --------------------------- |
| `profiles`         | User profiles     | Users can edit own          |
| `admin_users`      | Admin permissions | Admin only                  |
| `pages`            | Website pages     | Public read, Admin write    |
| `page_content`     | Page content      | Public read, Admin write    |
| `shipments`        | Shipment data     | Users see own, Admin all    |
| `tracking_events`  | Tracking updates  | Users see own, Admin all    |
| `contact_messages` | Contact form      | Public create, Admin manage |
| `faqs`             | FAQ content       | Public read, Admin manage   |
| `dashboard_stats`  | Statistics        | Public read, Admin write    |
| `settings`         | App settings      | Public read, Admin write    |

### **Security Features**

- ✅ **Row Level Security (RLS)**: Enabled on all tables
- ✅ **Policy-Based Access**: Granular permissions
- ✅ **User Isolation**: Users only see their data
- ✅ **Admin Override**: Admins can access all data

## 🎯 **Next Steps**

### **1. Test the System**

```bash
# Start the development server
npm run dev

# Visit admin panel
http://localhost:3008/admin/login
```

### **2. Create Additional Users**

- Register new users through the admin panel
- Assign admin roles as needed
- Test different permission levels

### **3. Customize Content**

- Edit page content through admin panel
- Update company settings
- Add new FAQs and content

### **4. Test Features**

- Contact form submissions
- Shipment tracking
- User authentication
- Admin permissions

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"Module not found"**: Run `npm install`
2. **"Authentication failed"**: Check user exists in Supabase
3. **"Permission denied"**: Verify RLS policies are set
4. **"Database connection error"**: Check environment variables

### **Debug Steps**

1. Check browser console for errors
2. Verify Supabase project settings
3. Confirm database tables exist
4. Test authentication in Supabase dashboard

## 📞 **Support**

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure the database schema was run successfully
4. Test authentication in Supabase dashboard

## 🎉 **Ready to Use!**

Your Secure Lanes application now has:

- ✅ **Real Supabase Database**: Fully configured
- ✅ **Secure Authentication**: Supabase Auth + bcrypt
- ✅ **Responsive Admin Panel**: Mobile-friendly
- ✅ **Content Management**: Database-driven
- ✅ **User Management**: Role-based access
- ✅ **Real-time Data**: Live statistics and updates

**Happy coding! 🚀**
