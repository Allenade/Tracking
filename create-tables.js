const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log("🚀 Creating tables using Supabase client...");

    // First, let's check if tables exist
    console.log("📋 Checking existing tables...");

    try {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .limit(1);

      if (usersError) {
        console.log("❌ Users table does not exist:", usersError.message);
      } else {
        console.log("✅ Users table exists");
      }
    } catch (error) {
      console.log("❌ Users table does not exist");
    }

    try {
      const { data: stats, error: statsError } = await supabase
        .from("dashboard_stats")
        .select("*")
        .limit(1);

      if (statsError) {
        console.log(
          "❌ Dashboard_stats table does not exist:",
          statsError.message
        );
      } else {
        console.log("✅ Dashboard_stats table exists");
      }
    } catch (error) {
      console.log("❌ Dashboard_stats table does not exist");
    }

    // Try to insert user data
    console.log("👤 Creating admin user...");
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email: "admin@securelanes.com",
          name: "Admin User",
          password_hash:
            "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
        },
      ])
      .select();

    if (userError) {
      console.log("❌ Failed to create user:", userError.message);
    } else {
      console.log("✅ User created successfully:", userData);
    }

    // Try to insert dashboard stats
    console.log("📊 Creating dashboard stats...");
    const { data: statsData, error: statsError } = await supabase
      .from("dashboard_stats")
      .insert([
        {
          total_shipments: 1234,
          active_tracking: 567,
          contact_messages: 89,
          revenue: 45678.0,
        },
      ])
      .select();

    if (statsError) {
      console.log("❌ Failed to create stats:", statsError.message);
    } else {
      console.log("✅ Stats created successfully:", statsData);
    }

    console.log("🎉 Process completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createTables();
