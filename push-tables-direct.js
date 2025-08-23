const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushTablesDirect() {
  console.log("🚀 Pushing tables directly to Supabase...\n");

  try {
    // Step 1: Create users table
    console.log("📋 Creating users table...");
    const { data: createUsers, error: createUsersError } = await supabase.rpc(
      "exec_sql",
      {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      }
    );

    if (createUsersError) {
      console.log("❌ Users table creation failed:", createUsersError.message);
      console.log("🔍 Trying alternative method...");

      // Try using direct REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `
            CREATE TABLE IF NOT EXISTS users (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              email TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL,
              password_hash TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `,
        }),
      });

      if (response.ok) {
        console.log("✅ Users table created via REST API");
      } else {
        console.log("❌ REST API also failed:", response.status);
      }
    } else {
      console.log("✅ Users table created successfully");
    }

    // Step 2: Create dashboard_stats table
    console.log("\n📊 Creating dashboard_stats table...");
    const { data: createStats, error: createStatsError } = await supabase.rpc(
      "exec_sql",
      {
        sql: `
          CREATE TABLE IF NOT EXISTS dashboard_stats (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            total_shipments INTEGER DEFAULT 0,
            active_tracking INTEGER DEFAULT 0,
            contact_messages INTEGER DEFAULT 0,
            revenue NUMERIC(12,2) DEFAULT 0,
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      }
    );

    if (createStatsError) {
      console.log(
        "❌ Dashboard_stats table creation failed:",
        createStatsError.message
      );
    } else {
      console.log("✅ Dashboard_stats table created successfully");
    }

    // Step 3: Insert admin user
    console.log("\n👤 Inserting admin user...");
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
      console.log("❌ User insertion failed:", userError.message);
    } else {
      console.log("✅ Admin user created successfully");
    }

    // Step 4: Insert dashboard stats
    console.log("\n📊 Inserting dashboard stats...");
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
      console.log("❌ Stats insertion failed:", statsError.message);
    } else {
      console.log("✅ Dashboard stats created successfully");
    }

    console.log("\n🎉 Direct push completed!");
    console.log("🔍 Testing connection...");

    // Test the connection
    const { data: testUsers, error: testUsersError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (testUsersError) {
      console.log(
        "❌ Test failed - tables may not exist:",
        testUsersError.message
      );
    } else {
      console.log("✅ Test successful - tables exist and are accessible!");
      console.log("👤 Found user:", testUsers[0]?.email);
    }
  } catch (error) {
    console.error("❌ Error during direct push:", error);
  }
}

pushTablesDirect();
