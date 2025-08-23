"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { useTranslation } from "../../hooks/useTranslation";
import {
  useTrackingStore,
  Shipment,
  TrackingEvent,
} from "../../store/trackingStore";

interface TrackingStatus {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: string;
}

export default function TrackPage() {
  const { t } = useTranslation();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingStatus[] | null>(
    null
  );
  const [shipmentInfo, setShipmentInfo] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { searchShipment, fetchTrackingEvents, trackingEvents } =
    useTrackingStore();

  // Debug: Monitor state changes
  useEffect(() => {
    console.log("🔄 State changed:");
    console.log("- trackingData:", trackingData);
    console.log("- shipmentInfo:", shipmentInfo);
    console.log("- trackingEvents:", trackingEvents);
  }, [trackingData, shipmentInfo, trackingEvents]);

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return "✅";
      case "out_for_delivery":
        return "🚚";
      case "in_transit":
        return "✈️";
      case "picked_up":
        return "📋";
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  // Convert tracking events to tracking status format
  const convertTrackingEvents = (events: TrackingEvent[]): TrackingStatus[] => {
    return events.map((event, index) => ({
      id: event.id,
      status: event.status.replace("_", " "),
      location: event.location,
      timestamp: new Date(event.timestamp).toLocaleString(),
      description: event.description,
      icon: getStatusIcon(event.status),
    }));
  };

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return;

    console.log("🔍 Starting tracking for:", trackingNumber);
    setIsTracking(true);
    setError(null);
    setTrackingData(null);
    setShipmentInfo(null);

    try {
      // Search for shipment
      console.log("🔍 Searching for shipment...");
      const shipment = await searchShipment(trackingNumber);
      console.log("📦 Shipment result:", shipment);

      if (!shipment) {
        console.log("❌ No shipment found");
        setError(
          "No shipment found with this tracking number. Please check and try again."
        );
        setIsTracking(false);
        return;
      }

      // Fetch tracking events and get the returned data
      console.log("🔍 Fetching tracking events...");
      const fetchedEvents = await fetchTrackingEvents(trackingNumber);
      console.log("📋 Fetched tracking events:", fetchedEvents);

      // Set shipment info
      setShipmentInfo(shipment);
      console.log("✅ Shipment info set:", shipment);

      // Convert tracking events to display format using the fetched data
      const convertedEvents = convertTrackingEvents(fetchedEvents);
      console.log("🔄 Converted events:", convertedEvents);
      setTrackingData(convertedEvents);

      console.log("📊 Final state check:");
      console.log("- trackingData will be:", convertedEvents);
      console.log("- shipmentInfo is:", shipment);
      console.log("- Both should be truthy for rendering");

      console.log("✅ Tracking completed successfully!");
    } catch (error) {
      console.error("❌ Tracking error:", error);
      setError(
        "An error occurred while tracking your shipment. Please try again."
      );
    } finally {
      setIsTracking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Track Your Shipment</h1>
          <p className="text-xl mb-8 opacity-90">
            Get real-time updates on your cargo with our advanced tracking
            system
          </p>

          {/* Tracking Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your tracking number"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handleTrack}
                disabled={isTracking}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isTracking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Track Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingData && shipmentInfo && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Shipment Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Tracking Number
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {shipmentInfo.tracking_number}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Customer
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {shipmentInfo.customer_name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Weight
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {shipmentInfo.weight}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Status
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {shipmentInfo.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Origin
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {shipmentInfo.origin}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Destination
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {shipmentInfo.destination}
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tracking History
              </h2>
              <div className="space-y-6">
                {trackingData.map((status, index) => (
                  <div key={status.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{status.icon}</span>
                      </div>
                      {index < trackingData.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 mx-auto mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {status.status}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {status.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{status.location}</p>
                      <p className="text-gray-500 mt-2">{status.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Moved below tracking results for better UX */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Secure Lanes Tracking?
            </h2>
            <p className="text-xl text-gray-600">
              Advanced tracking technology for complete visibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant notifications about your shipment&apos;s status and
                location
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p className="text-gray-600">
                Track shipments across 180+ countries and territories worldwide
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
              <p className="text-gray-600">
                Access your tracking information anytime, anywhere with our
                mobile app
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Track Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Track Your Shipment
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to track your package
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Find Your Tracking Number
              </h3>
              <p className="text-gray-600">
                Locate your tracking number in your shipping confirmation email
                or receipt
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter the Number</h3>
              <p className="text-gray-600">
                Type your tracking number in the search box above and click
                &quot;Track Now&quot;
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">View Updates</h3>
              <p className="text-gray-600">
                See real-time updates about your shipment&apos;s location and
                status
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/logos.jpeg"
                    alt="Secure Lanes Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Secure Lanes</span>
              </div>
              <p className="text-gray-400">
                Professional shipping and logistics services worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/track" className="hover:text-white">
                    Track
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Air Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sea Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Ground Transport
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/contact" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Track Package
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© Secure Lanes Copyright. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
