"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { useContentStore, PageContent } from "../../../store/contentStore";

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState("home");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const { pages, updatePageContent, fetchPageContent } = useContentStore();

  // Fetch page content on component mount
  useEffect(() => {
    console.log("🔍 Fetching page content...");
    fetchPageContent();
  }, [fetchPageContent]);

  // Debug: Log pages data
  useEffect(() => {
    console.log("📄 Pages data:", pages);
  }, [pages]);

  // Get unique page IDs for tabs
  const pageIds = [...new Set(pages.map((page) => page.page_id))];

  // Get sections for current page
  const currentPageSections = pages.filter(
    (page) => page.page_id === activeTab
  );

  // Page display names
  const pageNames: Record<string, string> = {
    home: "Home Page",
    about: "About Us",
    contact: "Contact Us",
    track: "Track Shipment",
  };

  // Handle edit button click
  const handleEdit = (section: PageContent) => {
    setEditingSection(section.id);
    setEditContent(section.content);
  };

  // Handle save button click
  const handleSave = async (section: PageContent) => {
    try {
      console.log("💾 Saving content for section:", section.section_id);
      await updatePageContent(section.page_id, section.section_id, editContent);
      setEditingSection(null);
      setEditContent("");
      setSaveMessage("✅ Content updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
      console.log("✅ Content updated successfully!");
    } catch (error) {
      console.error("❌ Error updating content:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setSaveMessage(`❌ Error: ${errorMessage}`);
      setTimeout(() => setSaveMessage(""), 5000);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditingSection(null);
    setEditContent("");
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
          <p className="text-gray-600 mt-2">
            Edit and manage website content across all pages.
          </p>
          {saveMessage && (
            <div
              className={`mt-4 p-3 rounded-md ${
                saveMessage.includes("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {saveMessage}
            </div>
          )}
        </div>

        {/* Page Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {pageIds.map((pageId) => (
                <button
                  key={pageId}
                  onClick={() => setActiveTab(pageId)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === pageId
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {pageNames[pageId] || pageId}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Page Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {pageNames[activeTab] || activeTab}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage content for the {pageNames[activeTab] || activeTab}{" "}
                    page
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentPageSections.length} sections
                  </span>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Content Sections
              </h3>

              {currentPageSections.map((section) => (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {section.section_id.charAt(0).toUpperCase() +
                          section.section_id.slice(1)}{" "}
                        Section
                      </h4>
                      <p className="text-sm text-gray-500">
                        Type: {section.type}
                      </p>
                    </div>
                    {editingSection === section.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(section)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {editingSection === section.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter content..."
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Preview
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Save Changes
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Page Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Published Pages
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pageIds.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Total Sections
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pages.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Page Views</p>
                <p className="text-2xl font-semibold text-gray-900">12.5K</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
