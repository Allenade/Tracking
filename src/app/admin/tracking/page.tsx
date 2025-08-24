"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import {
  useTrackingStore,
  Shipment,
  TrackingEvent,
} from "../../../store/trackingStore";

export default function AdminTracking() {
  const {
    shipments,
    trackingEvents,
    loading,
    createShipment,
    updateShipment,
    deleteShipment,
    fetchShipments,
    addTrackingEvent,
    fetchTrackingEvents,
  } = useTrackingStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    customer_name: "",
    origin: "",
    destination: "",
    weight: "",
    description: "",
  });

  const [eventData, setEventData] = useState({
    status: "pending",
    location: "",
    description: "",
  });

  // Fetch shipments on component mount
  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Handle form submission
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trackingNumber = await createShipment({
        customer_name: formData.customer_name,
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        description: formData.description,
        status: "pending",
      });

      setMessage(
        `✅ Shipment created successfully! Tracking Number: ${trackingNumber}`
      );
      setShowCreateForm(false);
      setFormData({
        customer_name: "",
        origin: "",
        destination: "",
        weight: "",
        description: "",
      });

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(`❌ Error creating shipment: ${error}`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Handle tracking event addition
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      await addTrackingEvent({
        tracking_number: selectedShipment.tracking_number,
        status: eventData.status,
        location: eventData.location,
        description: eventData.description,
        timestamp: new Date().toISOString(),
      });

      setMessage("✅ Tracking event added successfully!");
      setEventData({
        status: "pending",
        location: "",
        description: "",
      });

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(`❌ Error adding tracking event: ${error}`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Handle shipment deletion
  const handleDeleteShipment = async (id: string) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
      try {
        await deleteShipment(id);
        setMessage("✅ Shipment deleted successfully!");
        // Close tracking modal if the deleted shipment was selected
        setSelectedShipment(null);
        setTimeout(() => setMessage(""), 5000);
      } catch (error) {
        setMessage(`❌ Error deleting shipment: ${error}`);
        setTimeout(() => setMessage(""), 5000);
      }
    }
  };

  // Filter shipments based on search term
  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.tracking_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shipment Tracking
            </h1>
            <p className="text-gray-600 mt-2">
              Manage shipments and track their progress
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create New Shipment
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by tracking number, customer name, origin, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredShipments.length} of {shipments.length} shipments
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.tracking_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {shipment.customer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {shipment.origin} → {shipment.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {shipment.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.weight} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shipment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedShipment(shipment)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Track
                        </button>
                        <button
                          onClick={() => handleDeleteShipment(shipment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Shipment Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Shipment</h2>
              <form onSubmit={handleCreateShipment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Origin
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Shipment"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tracking Events Modal */}
        {selectedShipment && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Tracking: {selectedShipment.tracking_number}
                </h2>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Shipment Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">
                      {selectedShipment.customer_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedShipment.status
                      )}`}
                    >
                      {selectedShipment.status.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Origin</p>
                    <p className="font-medium">{selectedShipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium">
                      {selectedShipment.destination}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Tracking Event Form */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Add Tracking Event
                </h3>
                <form
                  onSubmit={handleAddEvent}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={eventData.status}
                      onChange={(e) =>
                        setEventData({ ...eventData, status: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={eventData.location}
                      onChange={(e) =>
                        setEventData({ ...eventData, location: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      value={eventData.description}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
                    >
                      Add Event
                    </button>
                  </div>
                </form>
              </div>

              {/* Tracking Events Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tracking History</h3>
                <div className="space-y-4">
                  {trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                        {index < trackingEvents.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 ml-1.5"></div>
                        )}
                      </div>
                      <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {event.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              {event.location}
                            </p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
