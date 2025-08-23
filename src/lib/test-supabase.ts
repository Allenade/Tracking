import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("admin_users")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    console.log("✅ Supabase connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error);
    return false;
  }
}
