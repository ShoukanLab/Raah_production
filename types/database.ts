// Auto-generated types to match the Supabase schema.
// Re-generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      shows: {
        Row: {
          id: string;
          sanity_id: string;
          name: string;
          date: string;
          venue: string;
          capacity: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sanity_id: string;
          name: string;
          date: string;
          venue: string;
          capacity?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sanity_id?: string;
          name?: string;
          date?: string;
          venue?: string;
          capacity?: number | null;
          created_at?: string;
        };
      };
      ticket_types: {
        Row: {
          id: string;
          show_id: string;
          name: string;
          type_tag: string | null;
          price: number;
          quantity_total: number;
          quantity_sold: number;
          description: string | null;
          is_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          show_id: string;
          name: string;
          type_tag?: string | null;
          price: number;
          quantity_total: number;
          quantity_sold?: number;
          description?: string | null;
          is_visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          show_id?: string;
          name?: string;
          type_tag?: string | null;
          price?: number;
          quantity_total?: number;
          quantity_sold?: number;
          description?: string | null;
          is_visible?: boolean;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          show_id: string;
          status: string;
          stripe_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          show_id: string;
          status?: string;
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          show_id?: string;
          status?: string;
          stripe_session_id?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          ticket_type_id: string;
          quantity: number;
          price_at_purchase: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          ticket_type_id: string;
          quantity: number;
          price_at_purchase: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          ticket_type_id?: string;
          quantity?: number;
          price_at_purchase?: number;
        };
      };
    };
    Views: {};
    Functions: {
      reserve_ticket_inventory: {
        Args: {
          p_ticket_type_id: string;
          p_requested_quantity: number;
        };
        Returns: {
          success: boolean;
          available_quantity: number;
          error_message: string | null;
        }[];
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};
