const https = require("https");

// Supabase configuration
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
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
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
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
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
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

async function pushSQL() {
  try {
    console.log("🚀 Pushing SQL to create tables...");

    // Create users table data
    const usersData = {
      id: "00000000-0000-0000-0000-000000000001",
      email: "admin@securelanes.com",
      name: "Admin User",
      password_hash:
        "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create dashboard_stats data
    const statsData = {
      id: "00000000-0000-0000-0000-000000000002",
      total_shipments: 1234,
      active_tracking: 567,
      contact_messages: 89,
      revenue: 45678.0,
      last_updated: new Date().toISOString(),
    };

    // Try to insert users data
    console.log("📋 Creating users table data...");
    try {
      const result = await makeRequest("/rest/v1/users", "POST", usersData);
      console.log("✅ Users data created:", result.status);
    } catch (error) {
      console.log("⚠️ Users table might not exist yet:", error.message);
    }

    // Try to insert dashboard_stats data
    console.log("📊 Creating dashboard_stats data...");
    try {
      const result = await makeRequest(
        "/rest/v1/dashboard_stats",
        "POST",
        statsData
      );
      console.log("✅ Dashboard stats created:", result.status);
    } catch (error) {
      console.log(
        "⚠️ Dashboard_stats table might not exist yet:",
        error.message
      );
    }

    console.log("🎉 SQL push completed!");
    console.log(
      "📋 If you see 404 errors, the tables need to be created manually in Supabase dashboard."
    );
  } catch (error) {
    console.error("❌ Error pushing SQL:", error);
  }
}

pushSQL();
