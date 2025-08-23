const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createWhatsAppTable() {
  console.log("🚀 Creating WhatsApp numbers table...\n");

  try {
    // Create whatsapp_numbers table
    console.log("📱 Creating whatsapp_numbers table...");
    const { data: createTable, error: createTableError } = await supabase
      .from("whatsapp_numbers")
      .insert([
        {
          id: "00000000-0000-0000-0000-000000000001",
          phone_number: "+1234567890",
          name: "Main Support",
          is_primary: true,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (createTableError) {
      console.log("❌ Table creation failed:", createTableError.message);
      console.log(
        "🔍 This might mean the table already exists or needs to be created manually"
      );
    } else {
      console.log("✅ WhatsApp numbers table created successfully");
    }

    // Test the connection
    console.log("\n🔍 Testing WhatsApp numbers table...");
    const { data: testNumbers, error: testError } = await supabase
      .from("whatsapp_numbers")
      .select("*")
      .order("is_primary", { ascending: false });

    if (testError) {
      console.log("❌ Test failed:", testError.message);
    } else {
      console.log("✅ WhatsApp numbers table accessible!");
      console.log("📱 Found numbers:", testNumbers.length);
      testNumbers.forEach((num) => {
        console.log(
          `  - ${num.name}: ${num.phone_number} ${
            num.is_primary ? "(Primary)" : ""
          }`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createWhatsAppTable();
