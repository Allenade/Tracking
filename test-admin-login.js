const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminLogin() {
  console.log("🔍 Testing admin login functionality...\n");

  try {
    // Test querying the users table
    console.log("📋 Testing users table query...");
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", "admin@securelanes.com")
      .single();

    if (error) {
      console.log("❌ Users table query failed:", error.message);
      console.log("🔍 Error details:", error);
    } else {
      console.log("✅ Users table query successful!");
      console.log("👤 Found user:", data);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testAdminLogin();
