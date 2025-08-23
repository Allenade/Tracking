const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testMissingTables() {
  console.log("🔍 Testing which tables exist and which are missing...\n");

  const tablesToTest = [
    "whatsapp_numbers",
    "pages",
    "page_content",
    "contact_messages",
    "shipments",
    "tracking_events",
    "faqs",
    "settings",
  ];

  const results = {};

  for (const table of tablesToTest) {
    try {
      console.log(`📋 Testing ${table} table...`);
      const { data, error } = await supabaseAdmin
        .from(table)
        .select("*")
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results[table] = false;
      } else {
        console.log(`✅ ${table}: EXISTS`);
        results[table] = true;
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
      results[table] = false;
    }
  }

  console.log("\n📊 SUMMARY:");
  console.log("✅ EXISTING TABLES:");
  Object.entries(results).forEach(([table, exists]) => {
    if (exists) {
      console.log(`  - ${table}`);
    }
  });

  console.log("\n❌ MISSING TABLES:");
  const missingTables = Object.entries(results).filter(
    ([table, exists]) => !exists
  );
  missingTables.forEach(([table]) => {
    console.log(`  - ${table}`);
  });

  if (missingTables.length > 0) {
    console.log("\n📋 MANUAL CREATION REQUIRED:");
    console.log(
      "1. Go to: https://supabase.com/dashboard/project/itzadlzpuokikgpleowk/sql"
    );
    console.log('2. Click "New Query"');
    console.log("3. Copy and paste the content from complete-schema.sql");
    console.log('4. Click "Run"');
    console.log(
      "\n🎯 This will create all missing tables and populate them with sample data."
    );
  } else {
    console.log("\n🎉 All tables exist! Your admin system is complete.");
  }
}

testMissingTables();
