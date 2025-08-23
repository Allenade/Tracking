const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testWhatsAppNumbers() {
  console.log("🔍 Testing WhatsApp numbers in database...\n");

  try {
    // Get all WhatsApp numbers
    console.log("📱 Fetching all WhatsApp numbers...");
    const { data: allNumbers, error: allError } = await supabaseAdmin
      .from("whatsapp_numbers")
      .select("*")
      .order("is_primary", { ascending: false });

    if (allError) {
      console.log("❌ Error fetching all numbers:", allError);
      return;
    }

    console.log("✅ All WhatsApp numbers:");
    allNumbers.forEach((num, index) => {
      console.log(
        `  ${index + 1}. ${num.name}: ${num.phone_number} ${
          num.is_primary ? "(Primary)" : ""
        } ${num.is_active ? "(Active)" : "(Inactive)"}`
      );
    });

    // Get primary number specifically
    console.log("\n🎯 Fetching primary WhatsApp number...");
    const { data: primaryNumber, error: primaryError } = await supabaseAdmin
      .from("whatsapp_numbers")
      .select("phone_number")
      .eq("is_primary", true)
      .eq("is_active", true)
      .single();

    if (primaryError) {
      console.log("❌ Error fetching primary number:", primaryError);
    } else {
      console.log("✅ Primary WhatsApp number:", primaryNumber.phone_number);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testWhatsAppNumbers();
