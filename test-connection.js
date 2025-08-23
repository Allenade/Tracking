const { createClient } = require("@supabase/supabase-js");

// Test the Supabase connection
async function testConnection() {
  console.log("🔍 Testing Supabase connection...");

  // Your Supabase credentials
  const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

  console.log("📋 Supabase URL:", supabaseUrl);
  console.log(
    "🔑 Supabase Key (first 20 chars):",
    supabaseKey.substring(0, 20) + "..."
  );

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check if we can connect to Supabase
    console.log("\n🧪 Test 1: Basic connection...");
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Connection failed:", error.message);
      return;
    }

    console.log("✅ Connection successful!");
    console.log("📊 Found", data?.length || 0, "records in accounts table");

    // Test 2: Check what tables exist
    console.log("\n🧪 Test 2: Checking existing tables...");
    const tablesToCheck = [
      "accounts",
      "admin_notifications",
      "payment_method",
      "payment_methods",
      "plans",
      "transactions",
    ];

    for (const table of tablesToCheck) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select("*")
          .limit(1);

        if (tableError) {
          console.log(`❌ ${table}: ${tableError.message}`);
        } else {
          console.log(
            `✅ ${table}: Accessible (${tableData?.length || 0} records)`
          );
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }

    console.log("\n🎉 Supabase connection is working!");
    console.log("📋 Your API keys are correct and connected properly.");
  } catch (error) {
    console.error("❌ Connection test failed:", error);
  }
}

testConnection();
