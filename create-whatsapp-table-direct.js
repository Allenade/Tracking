const https = require("https");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

// Function to make HTTP request
function makeRequest(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "itzadlzpuokikgpleowk.supabase.co",
      port: 443,
      path: path,
      method: method,
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            data: response,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createWhatsAppTableDirect() {
  console.log("🚀 Creating WhatsApp table via direct HTTP requests...\n");

  try {
    // Try to insert data directly (this might create the table)
    console.log("📱 Attempting to insert WhatsApp number...");
    const result = await makeRequest("/rest/v1/whatsapp_numbers", "POST", {
      phone_number: "+1234567890",
      name: "Main Support",
      is_primary: true,
      is_active: true,
    });

    console.log("📊 Insert result:", result.status);

    if (result.status === 201 || result.status === 200) {
      console.log("✅ WhatsApp number inserted successfully!");
    } else if (result.status === 404) {
      console.log("❌ Table does not exist. Need to create it manually.");
      console.log("📋 Please run this SQL in Supabase SQL Editor:");
      console.log(`
-- Create WhatsApp numbers table
CREATE TABLE IF NOT EXISTS whatsapp_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default WhatsApp number
INSERT INTO whatsapp_numbers (phone_number, name, is_primary, is_active) 
VALUES ('+1234567890', 'Main Support', true, true)
ON CONFLICT DO NOTHING;
      `);
    } else {
      console.log("❌ Unexpected response:", result.status, result.data);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createWhatsAppTableDirect();
