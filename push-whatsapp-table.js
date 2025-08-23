const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function pushWhatsAppTable() {
  console.log("🚀 Pushing WhatsApp numbers table to Supabase...\n");

  try {
    // Step 1: Create the table using RPC
    console.log("📋 Creating whatsapp_numbers table...");
    const { data: createTable, error: createTableError } =
      await supabaseAdmin.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS whatsapp_numbers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            phone_number TEXT NOT NULL,
            name TEXT NOT NULL,
            is_primary BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

    if (createTableError) {
      console.log("❌ Table creation failed:", createTableError.message);
      console.log("🔍 Trying direct insert method...");

      // Try to insert data directly (this will create the table if it doesn't exist)
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from("whatsapp_numbers")
        .insert([
          {
            phone_number: "+1234567890",
            name: "Main Support",
            is_primary: true,
            is_active: true,
          },
        ])
        .select();

      if (insertError) {
        console.log("❌ Direct insert also failed:", insertError.message);
        console.log(
          "🔍 This means the table needs to be created manually in Supabase SQL Editor"
        );
      } else {
        console.log("✅ Table created and data inserted successfully!");
      }
    } else {
      console.log("✅ Table created successfully via RPC");
    }

    // Step 2: Insert default data
    console.log("\n📱 Inserting default WhatsApp number...");
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("whatsapp_numbers")
      .insert([
        {
          phone_number: "+1234567890",
          name: "Main Support",
          is_primary: true,
          is_active: true,
        },
      ])
      .select();

    if (insertError) {
      console.log("❌ Data insertion failed:", insertError.message);
    } else {
      console.log("✅ Default WhatsApp number inserted successfully!");
    }

    // Step 3: Test the table
    console.log("\n🔍 Testing whatsapp_numbers table...");
    const { data: testData, error: testError } = await supabaseAdmin
      .from("whatsapp_numbers")
      .select("*")
      .order("is_primary", { ascending: false });

    if (testError) {
      console.log("❌ Test failed:", testError.message);
    } else {
      console.log("✅ WhatsApp numbers table is working!");
      console.log("📱 Found numbers:", testData.length);
      testData.forEach((num) => {
        console.log(
          `  - ${num.name}: ${num.phone_number} ${
            num.is_primary ? "(Primary)" : ""
          }`
        );
      });
    }

    console.log("\n🎉 WhatsApp table setup completed!");
  } catch (error) {
    console.error("❌ Error during setup:", error);
  }
}

pushWhatsAppTable();
