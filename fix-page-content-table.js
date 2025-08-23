const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function fixPageContentTable() {
  console.log("🔧 Fixing page_content table structure...\n");

  try {
    // First, let's try a simple update instead of upsert
    console.log("📝 Testing simple update of home hero content...");
    const { data, error } = await supabaseAdmin
      .from("page_content")
      .update({
        content:
          "TEST UPDATE: Welcome to Secure Lanes - Professional Shipping and Logistics Services",
        updated_at: new Date().toISOString(),
      })
      .eq("page_id", "home")
      .eq("section_id", "hero")
      .select();

    if (error) {
      console.log("❌ Error updating content:", error);
    } else {
      console.log("✅ Content updated successfully using UPDATE!");
      console.log("Updated content:", data[0]);
    }
  } catch (error) {
    console.error("❌ Exception occurred:", error);
  }
}

fixPageContentTable();
