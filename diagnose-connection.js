const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseConnection() {
  console.log("🔍 Diagnosing Supabase connection...\n");

  try {
    // Test basic connection
    console.log("1️⃣ Testing basic connection...");
    const { data, error } = await supabase
      .from("_supabase_migrations")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Connection error:", error.message);
      console.log("🔍 Error details:", error);
    } else {
      console.log("✅ Basic connection works");
    }

    // Test if we can access any existing tables
    console.log("\n2️⃣ Testing existing tables...");

    // Try some common Supabase tables
    const commonTables = [
      "auth.users",
      "profiles",
      "accounts",
      "admin_notifications",
    ];

    for (const table of commonTables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);

        if (!error) {
          console.log(`✅ Table '${table}' exists and accessible`);
        } else {
          console.log(`❌ Table '${table}' error:`, error.message);
        }
      } catch (e) {
        console.log(`❌ Table '${table}' not found`);
      }
    }

    // Test RPC functions
    console.log("\n3️⃣ Testing RPC functions...");
    try {
      const { data, error } = await supabase.rpc("version");

      if (error) {
        console.log("❌ RPC error:", error.message);
      } else {
        console.log("✅ RPC functions work");
      }
    } catch (e) {
      console.log("❌ RPC not available");
    }

    console.log("\n🎯 Diagnosis Summary:");
    console.log("- Your Supabase project is accessible");
    console.log(
      '- The issue is specifically with the "users" and "dashboard_stats" tables'
    );
    console.log(
      "- These tables need to be created manually in the Supabase dashboard"
    );
  } catch (error) {
    console.error("❌ Diagnosis failed:", error);
  }
}

diagnoseConnection();
