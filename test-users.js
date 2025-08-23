const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUsers() {
  try {
    console.log("🔍 Testing users table...");

    // Test 1: Check if users table exists
    console.log("📋 Checking users table...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (usersError) {
      console.log("❌ users table error:", usersError);
    } else {
      console.log(
        "✅ users table exists, found",
        users?.length || 0,
        "records"
      );
    }

    // Test 2: Check if dashboard_stats table exists
    console.log("📊 Checking dashboard_stats table...");
    const { data: stats, error: statsError } = await supabase
      .from("dashboard_stats")
      .select("*")
      .limit(1);

    if (statsError) {
      console.log("❌ dashboard_stats table error:", statsError);
    } else {
      console.log(
        "✅ dashboard_stats table exists, found",
        stats?.length || 0,
        "records"
      );
    }

    // Test 3: Try to get user by email
    console.log("🔐 Testing user lookup...");
    const { data: user, error: lookupError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", "admin@securelanes.com")
      .single();

    if (lookupError) {
      console.log("❌ User lookup error:", lookupError);
    } else {
      console.log("✅ User found:", user);
    }
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
}

testUsers();
