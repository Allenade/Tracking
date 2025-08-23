"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { useContentStore } from "../../../store/contentStore";
import { useTrackingStore } from "../../../store/trackingStore";
import { useContactStore } from "../../../store/contactStore";

export default function AdminDashboard() {
  const { stats, fetchStats } = useContentStore();
  const { shipments, fetchShipments } = useTrackingStore();
  const { messages, fetchMessages } = useContactStore();
  const [realStats, setRealStats] = useState({
    totalShipments: 0,
    activeTracking: 0,
    pendingShipments: 0,
    deliveredShipments: 0,
    contactMessages: 0,
    unreadMessages: 0,
  });

  // Fetch stats, shipments, and messages on component mount
  useEffect(() => {
    fetchStats();
    fetchShipments();
    fetchMessages();
  }, [fetchStats, fetchShipments, fetchMessages]);

  // Calculate real stats from shipments data
  useEffect(() => {
    if (shipments.length > 0) {
      const totalShipments = shipments.length;
      const activeTracking = shipments.filter(
        (s) => s.status === "in_transit"
      ).length;
      const pendingShipments = shipments.filter(
        (s) => s.status === "pending"
      ).length;
      const deliveredShipments = shipments.filter(
        (s) => s.status === "delivered"
      ).length;

      setRealStats({
        totalShipments,
        activeTracking,
        pendingShipments,
        deliveredShipments,
        contactMessages: messages.length,
        unreadMessages: messages.filter((m) => m.status === "unread").length,
      });
    }
  }, [shipments]);

  const statsData = [
    {
      title: "Total Shipments",
      value: realStats.totalShipments.toLocaleString(),
      change: `${realStats.totalShipments} shipments`,
      changeType: "positive",
      icon: "📦",
    },
    {
      title: "Active Tracking",
      value: realStats.activeTracking.toLocaleString(),
      change: `${realStats.activeTracking} in transit`,
      changeType: "positive",
      icon: "🚚",
    },
    {
      title: "Pending Shipments",
      value: realStats.pendingShipments.toLocaleString(),
      change: `${realStats.pendingShipments} awaiting pickup`,
      changeType: "neutral",
      icon: "⏳",
    },
    {
      title: "Delivered",
      value: realStats.deliveredShipments.toLocaleString(),
      change: `${realStats.deliveredShipments} completed`,
      changeType: "positive",
      icon: "✅",
    },
    {
      title: "Contact Messages",
      value: realStats.contactMessages.toLocaleString(),
      change: `${realStats.unreadMessages} unread`,
      changeType: realStats.unreadMessages > 0 ? "warning" : "neutral",
      icon: "📧",
    },
  ];

  // Generate recent activities from real shipment data
  const recentActivities = shipments.slice(0, 4).map((shipment, index) => {
    const timeAgo = (() => {
      const created = new Date(shipment.created_at);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    })();

    return {
      id: shipment.id,
      type: "shipment",
      message: `Shipment ${shipment.tracking_number} - ${shipment.customer_name}`,
      time: timeAgo,
      status: shipment.status,
    };
  });

  const quickActions = [
    {
      title: "Create Shipment",
      description: "Add a new shipment to the system",
      icon: "📦",
      href: "/admin/tracking",
    },
    {
      title: "View Messages",
      description: "Check contact form submissions",
      icon: "📧",
      href: "/admin/contact",
    },

    {
      title: "System Settings",
      description: "Configure admin preferences",
      icon: "⚙️",
      href: "/admin/settings",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with Secure Lanes.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl lg:text-3xl">{stat.icon}</div>
              </div>
              <div className="mt-3 lg:mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "warning"
                      ? "text-orange-600"
                      : stat.changeType === "neutral"
                      ? "text-gray-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                {/* <span className="text-xs lg:text-sm text-gray-500 ml-1">
                  from last month
                </span> */}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
            <p className="text-gray-600 mt-1">Common tasks and shortcuts</p>
          </div>
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="block p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-xl lg:text-2xl mb-2">{action.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">
                    {action.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {action.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <p className="text-gray-600 mt-1">
              Latest updates and notifications
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.status === "delivered"
                        ? "bg-green-500"
                        : activity.status === "pending"
                        ? "bg-blue-500"
                        : activity.status === "in_transit"
                        ? "bg-yellow-500"
                        : activity.status === "picked_up"
                        ? "bg-purple-500"
                        : activity.status === "out_for_delivery"
                        ? "bg-orange-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
              System Status
            </h3>
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  Website
                </span>
                <span className="text-xs lg:text-sm font-medium text-green-600">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  Database
                </span>
                <span className="text-xs lg:text-sm font-medium text-green-600">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  API Services
                </span>
                <span className="text-xs lg:text-sm font-medium text-green-600">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  Email Service
                </span>
                <span className="text-xs lg:text-sm font-medium text-green-600">
                  Running
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
              Quick Stats
            </h3>
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  Total Shipments
                </span>
                <span className="text-xs lg:text-sm font-medium text-gray-900">
                  {realStats.totalShipments}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  Pending Deliveries
                </span>
                <span className="text-xs lg:text-sm font-medium text-gray-900">
                  {realStats.pendingShipments}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  In Transit
                </span>
                <span className="text-xs lg:text-sm font-medium text-gray-900">
                  {realStats.activeTracking}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  Delivered
                </span>
                <span className="text-xs lg:text-sm font-medium text-gray-900">
                  {realStats.deliveredShipments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
