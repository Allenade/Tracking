import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseAdmin } from "../lib/supabase";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserAuth {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAdminStore = create<UserAuth>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      checkAuth: async () => {
        try {
          set({ loading: true });

          // Check if admin user exists in localStorage
          const storedUser = localStorage.getItem("admin-user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            set({
              user,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ loading: true });

          // Query the users table
          const { data, error } = await supabaseAdmin
            .from("users")
            .select(
              `
              id,
              email,
              name
            `
            )
            .eq("email", email)
            .single();

          if (error || !data) {
            set({ loading: false });
            return { success: false, error: "Invalid email or password" };
          }

          // For demo purposes, accept admin123 as password
          // In production, you'd verify against the password_hash
          if (password === "admin123") {
            const user: User = {
              id: data.id,
              email: data.email,
              name: data.name,
            };

            // Store in localStorage for persistence
            localStorage.setItem("admin-user", JSON.stringify(user));

            set({
              user,
              isAuthenticated: true,
              loading: false,
            });

            return { success: true };
          }

          set({ loading: false });
          return { success: false, error: "Invalid email or password" };
        } catch (error) {
          console.error("Login error:", error);
          set({ loading: false });
          return { success: false, error: "An unexpected error occurred" };
        }
      },

      logout: () => {
        // Remove from localStorage
        localStorage.removeItem("admin-user");

        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        try {
          // For demo purposes, verify current password is admin123
          if (currentPassword !== "admin123") {
            throw new Error("Current password is incorrect");
          }

          // Hash the new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Update the password in the database
          const { error } = await supabaseAdmin
            .from("users")
            .update({ password_hash: hashedPassword })
            .eq("email", get().user?.email);

          if (error) {
            throw new Error("Failed to update password in database");
          }

          console.log("✅ Password updated successfully");
        } catch (error) {
          console.error("❌ Password update error:", error);
          throw error;
        }
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
