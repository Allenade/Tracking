import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseAdmin } from "../lib/supabase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
  updated_at: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactStore {
  messages: ContactMessage[];
  loading: boolean;
  
  // Message management
  fetchMessages: () => Promise<void>;
  submitMessage: (message: ContactMessageInput) => Promise<void>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  
  // Statistics
  getUnreadCount: () => number;
  getTotalCount: () => number;
  
  // Utility functions
  setLoading: (loading: boolean) => void;
}

export const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      messages: [],
      loading: false,

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      submitMessage: async (message: ContactMessageInput) => {
        try {
          set({ loading: true });
          
          const { error } = await supabaseAdmin
            .from('contact_messages')
            .insert({
              name: message.name,
              email: message.email,
              phone: message.phone || null,
              message: message.message,
              status: 'unread',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (error) {
            throw error;
          }
        } catch (error) {
          console.error('Error submitting message:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchMessages: async () => {
        try {
          set({ loading: true });
          
          const { data, error } = await supabaseAdmin
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          set({ messages: data || [] });
        } catch (error) {
          console.error('Error fetching contact messages:', error);
        } finally {
          set({ loading: false });
        }
      },

      updateMessageStatus: async (id: string, status: ContactMessage['status']) => {
        try {
          set({ loading: true });
          
          const { error } = await supabaseAdmin
            .from('contact_messages')
            .update({ 
              status,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Refresh messages list
          await get().fetchMessages();
        } catch (error) {
          console.error('Error updating message status:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      deleteMessage: async (id: string) => {
        try {
          set({ loading: true });
          
          const { error } = await supabaseAdmin
            .from('contact_messages')
            .delete()
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Refresh messages list
          await get().fetchMessages();
        } catch (error) {
          console.error('Error deleting message:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      getUnreadCount: () => {
        return get().messages.filter(msg => msg.status === 'unread').length;
      },

      getTotalCount: () => {
        return get().messages.length;
      },
    }),
    {
      name: "contact-storage",
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
);
