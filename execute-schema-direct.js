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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

async function executeSchemaDirect() {
  console.log("🚀 Executing schema directly...\n");

  try {
    // Test connection first
    console.log("🔍 Testing connection...");
    const testResult = await makeRequest("/rest/v1/");
    console.log("📊 Connection test result:", testResult.status);

    // Try to create WhatsApp table by inserting data
    console.log("\n📱 Creating WhatsApp table by inserting data...");
    const whatsappResult = await makeRequest(
      "/rest/v1/whatsapp_numbers",
      "POST",
      {
        phone_number: "+1234567890",
        name: "Main Support",
        is_primary: true,
        is_active: true,
      }
    );

    console.log("📊 WhatsApp result:", whatsappResult.status);

    if (whatsappResult.status === 201 || whatsappResult.status === 200) {
      console.log("✅ WhatsApp table created successfully!");
    } else if (whatsappResult.status === 404) {
      console.log("❌ Table does not exist. Need to create manually.");
      console.log("\n📋 MANUAL STEPS REQUIRED:");
      console.log(
        "1. Go to: https://supabase.com/dashboard/project/itzadlzpuokikgpleowk/sql"
      );
      console.log('2. Click "New Query"');
      console.log("3. Copy and paste the content from complete-schema.sql");
      console.log('4. Click "Run"');
      console.log(
        "\n📝 The SQL file contains all the tables needed for your admin system."
      );
    } else {
      console.log(
        "❌ Unexpected response:",
        whatsappResult.status,
        whatsappResult.data
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("\n📋 MANUAL STEPS REQUIRED:");
    console.log(
      "1. Go to: https://supabase.com/dashboard/project/itzadlzpuokikgpleowk/sql"
    );
    console.log('2. Click "New Query"');
    console.log("3. Copy and paste the content from complete-schema.sql");
    console.log('4. Click "Run"');
  }
}

executeSchemaDirect();
