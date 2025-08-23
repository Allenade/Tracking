import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseAdmin } from "../lib/supabase";

export interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  type: "text" | "content" | "numbers" | "form";
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  name: string;
  type: "text" | "content" | "numbers" | "form";
  content: string;
}

export interface AdminStats {
  total_shipments: number;
  active_tracking: number;
  contact_messages: number;
  revenue: number;
}

export interface ContentStore {
  pages: PageContent[];
  stats: AdminStats;
  updatePageContent: (
    pageId: string,
    sectionId: string,
    content: string
  ) => Promise<void>;
  updateStats: (stats: Partial<AdminStats>) => Promise<void>;
  getPageContent: (pageId: string) => PageContent | undefined;
  fetchPageContent: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

const initialStats: AdminStats = {
  total_shipments: 1234,
  active_tracking: 567,
  contact_messages: 89,
  revenue: 45678,
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      pages: [],
      stats: initialStats,

      fetchPageContent: async () => {
        try {
          const { data, error } = await supabaseAdmin
            .from("page_content")
            .select("*")
            .order("page_id", { ascending: true });

          if (error) {
            console.error("Error fetching page content:", error);
            return;
          }

          set({ pages: data || [] });
        } catch (error) {
          console.error("Error fetching page content:", error);
        }
      },

      fetchStats: async () => {
        try {
          const { data, error } = await supabaseAdmin
            .from("dashboard_stats")
            .select("*")
            .limit(1)
            .single();

          if (error) {
            console.error("Error fetching stats:", error);
            return;
          }

          if (data) {
            set({
              stats: {
                total_shipments: data.total_shipments,
                active_tracking: data.active_tracking,
                contact_messages: data.contact_messages,
                revenue: data.revenue,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      },

      updatePageContent: async (
        pageId: string,
        sectionId: string,
        content: string
      ) => {
        try {
          console.log("🔄 Updating page content:", { pageId, sectionId, content });
          
          const { error } = await supabaseAdmin
            .from("page_content")
            .update({
              content: content,
              updated_at: new Date().toISOString(),
            })
            .eq("page_id", pageId)
            .eq("section_id", sectionId);

          if (error) {
            console.error("Error updating page content:", error);
            throw error;
          }

          console.log("✅ Page content updated successfully");

          // Update local state
          set((state) => ({
            pages: state.pages.map((page) => {
              if (page.page_id === pageId && page.section_id === sectionId) {
                return {
                  ...page,
                  content,
                  updated_at: new Date().toISOString(),
                };
              }
              return page;
            }),
          }));
        } catch (error) {
          console.error("Error updating page content:", error);
          throw error;
        }
      },

      updateStats: async (newStats: Partial<AdminStats>) => {
        try {
          const { error } = await supabaseAdmin.from("dashboard_stats").upsert({
            ...newStats,
            last_updated: new Date().toISOString(),
          });

          if (error) {
            console.error("Error updating stats:", error);
            return;
          }

          // Update local state
          set((state) => ({
            stats: { ...state.stats, ...newStats },
          }));
        } catch (error) {
          console.error("Error updating stats:", error);
        }
      },

      getPageContent: (pageId: string) => {
        return get().pages.find((page) => page.page_id === pageId);
      },
    }),
    {
      name: "content-storage",
    }
  )
);
