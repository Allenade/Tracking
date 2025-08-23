"use client";

import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";

interface WhatsAppNumber {
  id: string;
  phone_number: string;
  name: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
}

export default function WhatsAppManagement() {
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNumber, setEditingNumber] = useState<WhatsAppNumber | null>(
    null
  );
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
    is_primary: false,
    is_active: true,
  });

  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from("whatsapp_numbers")
        .select("*")
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching numbers:", error);
        // If table doesn't exist, show empty state
        setNumbers([]);
      } else {
        setNumbers(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      setNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNumber) {
        // Update existing number
        const { error } = await supabaseAdmin
          .from("whatsapp_numbers")
          .update({
            phone_number: formData.phone_number,
            name: formData.name,
            is_primary: formData.is_primary,
            is_active: formData.is_active,
          })
          .eq("id", editingNumber.id);

        if (error) throw error;
      } else {
        // Add new number
        const { error } = await supabaseAdmin
          .from("whatsapp_numbers")
          .insert([formData]);

        if (error) throw error;
      }

      // Reset form and refresh
      setFormData({
        phone_number: "",
        name: "",
        is_primary: false,
        is_active: true,
      });
      setShowAddForm(false);
      setEditingNumber(null);
      fetchNumbers();
    } catch (error) {
      console.error("Error saving number:", error);
      alert("Error saving WhatsApp number. Please try again.");
    }
  };

  const handleEdit = (number: WhatsAppNumber) => {
    setEditingNumber(number);
    setFormData({
      phone_number: number.phone_number,
      name: number.name,
      is_primary: number.is_primary,
      is_active: number.is_active,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this WhatsApp number?"))
      return;

    try {
      const { error } = await supabaseAdmin
        .from("whatsapp_numbers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchNumbers();
    } catch (error) {
      console.error("Error deleting number:", error);
      alert("Error deleting WhatsApp number. Please try again.");
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      // First, unset all primary numbers
      await supabaseAdmin
        .from("whatsapp_numbers")
        .update({ is_primary: false })
        .eq("is_primary", true);

      // Then set the selected number as primary
      const { error } = await supabaseAdmin
        .from("whatsapp_numbers")
        .update({ is_primary: true })
        .eq("id", id);

      if (error) throw error;
      fetchNumbers();
    } catch (error) {
      console.error("Error setting primary number:", error);
      alert("Error setting primary number. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      phone_number: "",
      name: "",
      is_primary: false,
      is_active: true,
    });
    setShowAddForm(false);
    setEditingNumber(null);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            WhatsApp Numbers Management
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Number
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingNumber
                ? "Edit WhatsApp Number"
                : "Add New WhatsApp Number"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    placeholder=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name/Description
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Main Support"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_primary}
                    onChange={(e) =>
                      setFormData({ ...formData, is_primary: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Set as Primary Number
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingNumber ? "Update Number" : "Add Number"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Numbers List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">WhatsApp Numbers</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading numbers...</p>
              </div>
            ) : numbers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No WhatsApp numbers found.</p>
                <p className="text-sm text-gray-500">
                  The whatsapp_numbers table may not exist yet. Please create it
                  in Supabase first.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Primary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {numbers.map((number) => (
                      <tr key={number.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {number.phone_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {number.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              number.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {number.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {number.is_primary ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Primary
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimary(number.id)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              Set Primary
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(number)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(number.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
