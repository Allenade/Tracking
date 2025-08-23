const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  console.log("🔍 Testing Supabase connection and tables...\n");

  try {
    // Test users table
    console.log("📋 Testing users table...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (usersError) {
      console.log("❌ Users table error:", usersError.message);
    } else {
      console.log("✅ Users table exists and accessible");
      if (users && users.length > 0) {
        console.log("👤 Found user:", users[0].email);
      } else {
        console.log("📝 Users table is empty");
      }
    }

    // Test dashboard_stats table
    console.log("\n📊 Testing dashboard_stats table...");
    const { data: stats, error: statsError } = await supabase
      .from("dashboard_stats")
      .select("*")
      .limit(1);

    if (statsError) {
      console.log("❌ Dashboard_stats table error:", statsError.message);
    } else {
      console.log("✅ Dashboard_stats table exists and accessible");
      if (stats && stats.length > 0) {
        console.log("📈 Found stats:", {
          total_shipments: stats[0].total_shipments,
          active_tracking: stats[0].active_tracking,
          contact_messages: stats[0].contact_messages,
        });
      } else {
        console.log("📝 Dashboard_stats table is empty");
      }
    }

    console.log("\n🎉 Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testTables();
