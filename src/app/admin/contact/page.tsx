"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useContactStore } from "@/store/contactStore";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: "unread" | "read" | "replied";
}

export default function ContactMessagesPage() {
  const { messages, fetchMessages, updateMessageStatus, deleteMessage } =
    useContactStore();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = messages.filter((message) => {
    if (filter === "unread") return message.status === "unread";
    if (filter === "read")
      return message.status === "read" || message.status === "replied";
    return true;
  });

  const handleMarkAsRead = async (messageId: string) => {
    await updateMessageStatus(messageId, "read");
    if (selectedMessage?.id === messageId) {
      setSelectedMessage({ ...selectedMessage, status: "read" });
    }
  };

  const handleMarkAsUnread = async (messageId: string) => {
    await updateMessageStatus(messageId, "unread");
    if (selectedMessage?.id === messageId) {
      setSelectedMessage({ ...selectedMessage, status: "unread" });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-2">
            Manage and respond to customer inquiries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="text-2xl text-blue-600">📧</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Messages
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {messages.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="text-2xl text-orange-600">🔔</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-xl font-bold text-gray-900">
                  {messages.filter((m) => m.status === "unread").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="text-2xl text-green-600">✅</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    messages.filter(
                      (m) => m.status === "read" || m.status === "replied"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Unread ({messages.filter((m) => m.status === "unread").length})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === "read"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Read (
              {
                messages.filter(
                  (m) => m.status === "read" || m.status === "replied"
                ).length
              }
              )
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Messages ({filteredMessages.length})
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No messages found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedMessage?.id === message.id
                            ? "bg-blue-50 border-r-2 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {message.name}
                              </p>
                              {message.status === "unread" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {message.message.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Message from {selectedMessage.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {selectedMessage.name} ({selectedMessage.email})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(selectedMessage.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedMessage.status === "unread" ? (
                        <button
                          onClick={() => handleMarkAsRead(selectedMessage.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnread(selectedMessage.id)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Mark as Unread
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <div className="text-4xl text-gray-400 mb-4">📧</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Message
                  </h3>
                  <p className="text-gray-600">
                    Choose a message from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
