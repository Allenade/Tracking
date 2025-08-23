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

async function createTablesDirect() {
  try {
    console.log("🚀 Attempting to create tables via direct API...");

    // Try to create users table via RPC
    console.log("📋 Creating users table...");
    try {
      const result = await makeRequest("/rest/v1/rpc/exec_sql", "POST", {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });
      console.log("✅ Users table creation result:", result.status);
    } catch (error) {
      console.log("❌ Users table creation failed:", error.message);
    }

    // Try to create dashboard_stats table via RPC
    console.log("📊 Creating dashboard_stats table...");
    try {
      const result = await makeRequest("/rest/v1/rpc/exec_sql", "POST", {
        sql: `
          CREATE TABLE IF NOT EXISTS dashboard_stats (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            total_shipments INTEGER DEFAULT 0,
            active_tracking INTEGER DEFAULT 0,
            contact_messages INTEGER DEFAULT 0,
            revenue NUMERIC(12,2) DEFAULT 0,
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });
      console.log("✅ Dashboard_stats table creation result:", result.status);
    } catch (error) {
      console.log("❌ Dashboard_stats table creation failed:", error.message);
    }

    // Try to insert user data
    console.log("👤 Inserting admin user...");
    try {
      const result = await makeRequest("/rest/v1/users", "POST", {
        email: "admin@securelanes.com",
        name: "Admin User",
        password_hash:
          "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      });
      console.log("✅ User insertion result:", result.status);
    } catch (error) {
      console.log("❌ User insertion failed:", error.message);
    }

    // Try to insert dashboard stats
    console.log("📊 Inserting dashboard stats...");
    try {
      const result = await makeRequest("/rest/v1/dashboard_stats", "POST", {
        total_shipments: 1234,
        active_tracking: 567,
        contact_messages: 89,
        revenue: 45678.0,
      });
      console.log("✅ Stats insertion result:", result.status);
    } catch (error) {
      console.log("❌ Stats insertion failed:", error.message);
    }

    console.log("🎉 Direct API attempt completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createTablesDirect();
