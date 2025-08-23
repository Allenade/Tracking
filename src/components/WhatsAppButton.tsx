"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration - using service role key for admin access
const supabaseUrl = "https://itzadlzpuokikgpleowk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0emFkbHpwdW9raWtncGxlb3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0MTIwNiwiZXhwIjoyMDcxNTE3MjA2fQ.jybQFKlfWyx2QOo4pAMr9Id6YIRz6OAFMac8sIQH83w";

const supabase = createClient(supabaseUrl, supabaseKey);

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your shipping services.",
  className = "",
}: WhatsAppButtonProps) {
  const [primaryNumber, setPrimaryNumber] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrimaryNumber = async () => {
      try {
        console.log("🔍 Fetching WhatsApp number from database...");
        const { data, error } = await supabase
          .from("whatsapp_numbers")
          .select("phone_number")
          .eq("is_primary", true)
          .eq("is_active", true)
          .single();

        if (!error && data) {
          console.log("✅ Found WhatsApp number:", data.phone_number);
          setPrimaryNumber(data.phone_number);
        } else {
          console.log("❌ Error fetching WhatsApp number:", error);
        }
      } catch (error) {
        console.error("❌ Error fetching WhatsApp number:", error);
        // Keep default number if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryNumber();
  }, []);

  const handleWhatsAppClick = () => {
    if (!primaryNumber) {
      console.log("❌ No WhatsApp number available from database");
      return;
    }

    console.log("📞 Using WhatsApp number from database:", primaryNumber);

    // Format the number for WhatsApp (remove any non-digit characters and add country code if needed)
    let formattedNumber = primaryNumber.replace(/\D/g, ""); // Remove non-digits

    // If it starts with 0, replace with country code (assuming Nigeria +234)
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "234" + formattedNumber.substring(1);
    }

    // Remove the + from the formatted number for WhatsApp URL
    formattedNumber = formattedNumber.replace("+", "");

    console.log("📞 Formatted number:", formattedNumber);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    console.log("🔗 WhatsApp URL:", whatsappUrl);
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 text-white p-3 rounded-full shadow-lg animate-pulse">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
          aria-label="Contact us on WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>
        <div className="bg-white rounded-lg shadow-lg px-3 py-2">
          <p className="text-sm font-medium text-gray-900">Message us</p>
          <p className="text-xs text-gray-500">WhatsApp</p>
          {primaryNumber && (
            <p className="text-xs text-gray-400">{primaryNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}
