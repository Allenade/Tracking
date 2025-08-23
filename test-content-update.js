const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testContentUpdate() {
  console.log("🔍 Testing page content update functionality...\n");

  try {
    // Test updating home hero content
    console.log("📝 Testing update of home hero content...");
    const { data, error } = await supabaseAdmin
      .from("page_content")
      .upsert({
        page_id: "home",
        section_id: "hero",
        content:
          "TEST UPDATE: Welcome to Secure Lanes - Professional Shipping and Logistics Services",
        type: "text",
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.log("❌ Error updating content:", error);
      console.log("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
    } else {
      console.log("✅ Content updated successfully!");
      console.log("Updated content:", data[0]);
    }
  } catch (error) {
    console.error("❌ Exception occurred:", error);
  }
}

testContentUpdate();
