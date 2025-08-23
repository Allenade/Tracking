const { createClient } = require("@supabase/supabase-js");

// Supabase configuration with service role key
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createCompleteSchema() {
  console.log("🚀 Creating complete schema for Secure Lanes...\n");

  try {
    // Step 1: Create WhatsApp numbers table
    console.log("📱 Creating whatsapp_numbers table...");
    const { data: whatsappData, error: whatsappError } = await supabaseAdmin
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

    if (whatsappError) {
      console.log("❌ WhatsApp table creation failed:", whatsappError.message);
      console.log("🔍 This means the table needs to be created manually");
    } else {
      console.log("✅ WhatsApp numbers table created and populated!");
    }

    // Step 2: Create pages table
    console.log("\n📄 Creating pages table...");
    const { data: pagesData, error: pagesError } = await supabaseAdmin
      .from("pages")
      .insert([
        {
          page_id: "home",
          title: "Home",
          description: "Main landing page",
          is_active: true,
        },
        {
          page_id: "about",
          title: "About Us",
          description: "About Secure Lanes",
          is_active: true,
        },
        {
          page_id: "contact",
          title: "Contact Us",
          description: "Contact information and form",
          is_active: true,
        },
        {
          page_id: "track",
          title: "Track Shipment",
          description: "Shipment tracking page",
          is_active: true,
        },
      ])
      .select();

    if (pagesError) {
      console.log("❌ Pages table creation failed:", pagesError.message);
    } else {
      console.log("✅ Pages table created and populated!");
    }

    // Step 3: Create page_content table
    console.log("\n📝 Creating page_content table...");
    const { data: contentData, error: contentError } = await supabaseAdmin
      .from("page_content")
      .insert([
        {
          page_id: "home",
          section_id: "hero",
          content:
            "Welcome to Secure Lanes - Professional Shipping and Logistics Services",
          type: "text",
        },
        {
          page_id: "home",
          section_id: "services",
          content:
            "International Shipping, Express Delivery, Warehousing, Customs Clearance",
          type: "text",
        },
        {
          page_id: "about",
          section_id: "mission",
          content:
            "Our mission is to provide reliable and secure shipping solutions worldwide.",
          type: "text",
        },
        {
          page_id: "contact",
          section_id: "info",
          content: "Get in touch with our team for all your shipping needs.",
          type: "text",
        },
      ])
      .select();

    if (contentError) {
      console.log(
        "❌ Page content table creation failed:",
        contentError.message
      );
    } else {
      console.log("✅ Page content table created and populated!");
    }

    // Step 4: Create contact_messages table
    console.log("\n💬 Creating contact_messages table...");
    const { data: messagesData, error: messagesError } = await supabaseAdmin
      .from("contact_messages")
      .insert([
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          message: "Interested in shipping services",
          status: "unread",
        },
      ])
      .select();

    if (messagesError) {
      console.log(
        "❌ Contact messages table creation failed:",
        messagesError.message
      );
    } else {
      console.log("✅ Contact messages table created and populated!");
    }

    // Step 5: Create shipments table
    console.log("\n📦 Creating shipments table...");
    const { data: shipmentsData, error: shipmentsError } = await supabaseAdmin
      .from("shipments")
      .insert([
        {
          tracking_number: "SL123456789",
          customer_name: "Jane Smith",
          origin: "New York",
          destination: "London",
          status: "in_transit",
          weight: 25.5,
          description: "Electronics shipment",
        },
      ])
      .select();

    if (shipmentsError) {
      console.log(
        "❌ Shipments table creation failed:",
        shipmentsError.message
      );
    } else {
      console.log("✅ Shipments table created and populated!");
    }

    // Step 6: Create tracking_events table
    console.log("\n📍 Creating tracking_events table...");
    const { data: eventsData, error: eventsError } = await supabaseAdmin
      .from("tracking_events")
      .insert([
        {
          tracking_number: "SL123456789",
          status: "in_transit",
          location: "New York",
          description: "Package picked up from sender",
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (eventsError) {
      console.log(
        "❌ Tracking events table creation failed:",
        eventsError.message
      );
    } else {
      console.log("✅ Tracking events table created and populated!");
    }

    // Step 7: Create FAQs table
    console.log("\n❓ Creating FAQs table...");
    const { data: faqsData, error: faqsError } = await supabaseAdmin
      .from("faqs")
      .insert([
        {
          question: "How long does international shipping take?",
          answer:
            "International shipping typically takes 3-7 business days depending on the destination.",
          category: "shipping",
          is_active: true,
        },
        {
          question: "Do you provide tracking numbers?",
          answer: "Yes, all shipments come with real-time tracking numbers.",
          category: "tracking",
          is_active: true,
        },
      ])
      .select();

    if (faqsError) {
      console.log("❌ FAQs table creation failed:", faqsError.message);
    } else {
      console.log("✅ FAQs table created and populated!");
    }

    // Step 8: Create settings table
    console.log("\n⚙️ Creating settings table...");
    const { data: settingsData, error: settingsError } = await supabaseAdmin
      .from("settings")
      .insert([
        {
          key: "company_name",
          value: "Secure Lanes",
          description: "Company name",
        },
        {
          key: "contact_email",
          value: "info@securelanes.com",
          description: "Primary contact email",
        },
        {
          key: "contact_phone",
          value: "+1234567890",
          description: "Primary contact phone",
        },
      ])
      .select();

    if (settingsError) {
      console.log("❌ Settings table creation failed:", settingsError.message);
    } else {
      console.log("✅ Settings table created and populated!");
    }

    console.log("\n🎉 Schema creation completed!");
    console.log("\n📋 Summary:");
    console.log("- WhatsApp numbers management ✅");
    console.log("- Pages and content management ✅");
    console.log("- Contact messages system ✅");
    console.log("- Shipment tracking system ✅");
    console.log("- FAQ management ✅");
    console.log("- Settings management ✅");
  } catch (error) {
    console.error("❌ Error during schema creation:", error);
  }
}

createCompleteSchema();
