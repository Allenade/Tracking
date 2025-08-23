import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, supabaseAdmin } from "../lib/supabase";

export interface Shipment {
  id: string;
  tracking_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled";
  weight: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  tracking_number: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
  created_at: string;
}

export interface TrackingStore {
  shipments: Shipment[];
  trackingEvents: TrackingEvent[];
  loading: boolean;
  
  // Shipment management
  createShipment: (shipmentData: Omit<Shipment, 'id' | 'tracking_number' | 'created_at' | 'updated_at'>) => Promise<string>;
  updateShipment: (id: string, updates: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
  fetchShipments: () => Promise<void>;
  
  // Tracking events
  addTrackingEvent: (eventData: Omit<TrackingEvent, 'id' | 'created_at'>) => Promise<void>;
  fetchTrackingEvents: (trackingNumber: string) => Promise<TrackingEvent[]>;
  
  // Search and filter
  searchShipment: (trackingNumber: string) => Promise<Shipment | null>;
  getShipmentByTrackingNumber: (trackingNumber: string) => Shipment | undefined;
  
  // Utility functions
  generateTrackingNumber: () => string;
  setLoading: (loading: boolean) => void;
}

const generateTrackingNumber = (): string => {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `SL-${year}-${sequence}`;
};

export const useTrackingStore = create<TrackingStore>()(
  persist(
    (set, get) => ({
      shipments: [],
      trackingEvents: [],
      loading: false,

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      generateTrackingNumber,

      createShipment: async (shipmentData) => {
        try {
          set({ loading: true });
          
          const trackingNumber = generateTrackingNumber();
          const newShipment = {
            ...shipmentData,
            tracking_number: trackingNumber,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabaseAdmin
            .from('shipments')
            .insert(newShipment)
            .select()
            .single();

          if (error) {
            throw error;
          }

          // Add initial tracking event
          await get().addTrackingEvent({
            tracking_number: trackingNumber,
            status: 'pending',
            location: shipmentData.origin,
            description: 'Shipment created',
            timestamp: new Date().toISOString(),
          });

          // Refresh shipments list
          await get().fetchShipments();

          return trackingNumber;
        } catch (error) {
          console.error('Error creating shipment:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateShipment: async (id: string, updates: Partial<Shipment>) => {
        try {
          set({ loading: true });
          
          const { error } = await supabaseAdmin
            .from('shipments')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Refresh shipments list
          await get().fetchShipments();
        } catch (error) {
          console.error('Error updating shipment:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      deleteShipment: async (id: string) => {
        try {
          set({ loading: true });
          
          // Get the tracking number and delete everything in one optimized operation
          const { data: shipment, error: fetchError } = await supabaseAdmin
            .from('shipments')
            .select('tracking_number')
            .eq('id', id)
            .single();

          if (fetchError) {
            throw fetchError;
          }

          // Use a transaction-like approach: delete events first, then shipment
          // This is faster than individual calls
          const trackingNumber = shipment.tracking_number;
          
          // Delete tracking events and shipment in parallel for better performance
          const [eventsResult, shipmentResult] = await Promise.all([
            supabaseAdmin
              .from('tracking_events')
              .delete()
              .eq('tracking_number', trackingNumber),
            supabaseAdmin
              .from('shipments')
              .delete()
              .eq('id', id)
          ]);

          if (eventsResult.error) {
            throw eventsResult.error;
          }

          if (shipmentResult.error) {
            throw shipmentResult.error;
          }

          // Optimize: Update local state directly instead of refetching
          set(state => ({
            shipments: state.shipments.filter(s => s.id !== id),
            trackingEvents: []
          }));
        } catch (error) {
          console.error('Error deleting shipment:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchShipments: async () => {
        try {
          set({ loading: true });
          
          const { data, error } = await supabaseAdmin
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          set({ shipments: data || [] });
        } catch (error) {
          console.error('Error fetching shipments:', error);
        } finally {
          set({ loading: false });
        }
      },

      addTrackingEvent: async (eventData) => {
        try {
          const { error } = await supabaseAdmin
            .from('tracking_events')
            .insert(eventData);

          if (error) {
            throw error;
          }

          // Update shipment status
          await supabaseAdmin
            .from('shipments')
            .update({ 
              status: eventData.status,
              updated_at: new Date().toISOString()
            })
            .eq('tracking_number', eventData.tracking_number);

          // Refresh data
          await get().fetchShipments();
          await get().fetchTrackingEvents(eventData.tracking_number);
        } catch (error) {
          console.error('Error adding tracking event:', error);
          throw error;
        }
      },

      fetchTrackingEvents: async (trackingNumber: string) => {
        try {
          console.log("🔍 Fetching tracking events for:", trackingNumber);
          const { data, error } = await supabase
            .from('tracking_events')
            .select('*')
            .eq('tracking_number', trackingNumber)
            .order('timestamp', { ascending: true });

          console.log("🔍 Tracking events result:", { data, error });
          if (error) {
            console.log("❌ Tracking events error:", error);
            throw error;
          }

          set({ trackingEvents: data || [] });
          return data || []; // Return the fetched data
        } catch (error) {
          console.error('Error fetching tracking events:', error);
          return []; // Return empty array on error
        }
      },

      searchShipment: async (trackingNumber: string) => {
        try {
          console.log("🔍 Searching shipment with tracking number:", trackingNumber);
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('tracking_number', trackingNumber)
            .single();

          console.log("🔍 Search result:", { data, error });
          if (error) {
            console.log("❌ Search error:", error);
            return null;
          }

          return data;
        } catch (error) {
          console.error('Error searching shipment:', error);
          return null;
        }
      },

      getShipmentByTrackingNumber: (trackingNumber: string) => {
        return get().shipments.find(shipment => shipment.tracking_number === trackingNumber);
      },
    }),
    {
      name: "tracking-storage",
      partialize: (state) => ({
        shipments: state.shipments,
        trackingEvents: state.trackingEvents,
      }),
    }
  )
);
