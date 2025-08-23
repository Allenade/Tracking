import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDEyMDYsImV4cCI6MjA3MTUxNzIwNn0.FSCsOcwOaRGQtbJZjyfhnbIsn_gEBpVX0B1pFxJ417I";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  type: "text" | "content" | "numbers" | "form";
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  id: string;
  total_shipments: number;
  active_tracking: number;
  contact_messages: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
}

export interface TrackingData {
  id: string;
  tracking_number: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
  created_at: string;
}
