const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testPageContent() {
  console.log("🔍 Testing page content functionality...\n");

  try {
    // Test pages table
    console.log("📄 Testing pages table...");
    const { data: pages, error: pagesError } = await supabaseAdmin
      .from("pages")
      .select("*")
      .order("page_id");

    if (pagesError) {
      console.log("❌ Error fetching pages:", pagesError);
      return;
    }

    console.log("✅ Pages found:", pages.length);
    pages.forEach((page) => {
      console.log(
        `  - ${page.page_id}: ${page.title} (${
          page.is_active ? "Active" : "Inactive"
        })`
      );
    });

    // Test page_content table
    console.log("\n📝 Testing page_content table...");
    const { data: content, error: contentError } = await supabaseAdmin
      .from("page_content")
      .select("*")
      .order("page_id");

    if (contentError) {
      console.log("❌ Error fetching page content:", contentError);
      return;
    }

    console.log("✅ Page content found:", content.length);
    content.forEach((item) => {
      console.log(
        `  - ${item.page_id}.${item.section_id}: ${item.content.substring(
          0,
          50
        )}...`
      );
    });

    // Test specific page content
    console.log('\n🎯 Testing specific page content for "home"...');
    const { data: homeContent, error: homeError } = await supabaseAdmin
      .from("page_content")
      .select("*")
      .eq("page_id", "home");

    if (homeError) {
      console.log("❌ Error fetching home content:", homeError);
    } else {
      console.log("✅ Home page content:");
      homeContent.forEach((item) => {
        console.log(`  - ${item.section_id}: ${item.content}`);
      });
    }

    // Test content store functionality
    console.log("\n🔄 Testing content store functionality...");
    const { data: updatedContent, error: updateError } = await supabaseAdmin
      .from("page_content")
      .upsert({
        page_id: "home",
        section_id: "hero",
        content:
          "Updated: Welcome to Secure Lanes - Professional Shipping and Logistics Services",
        type: "text",
      })
      .select();

    if (updateError) {
      console.log("❌ Error updating content:", updateError);
    } else {
      console.log(
        "✅ Content updated successfully:",
        updatedContent[0].content
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testPageContent();
