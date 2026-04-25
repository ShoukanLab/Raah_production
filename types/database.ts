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
          sanity_id: string | null;
          name: string;
          slug: string;
          date: string;
          doors_open: string | null;
          venue_name: string;
          venue_address: string | null;
          city: string;
          capacity: number;
          description: string | null;
          status: "draft" | "on_sale" | "sold_out" | "cancelled" | "completed";
          poster_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["shows"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["shows"]["Insert"]>;
      };
      ticket_types: {
        Row: {
          id: string;
          show_id: string;
          name: string;
          description: string | null;
          price_pence: number;
          quantity: number;
          quantity_sold: number;
          sale_starts_at: string | null;
          sale_ends_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ticket_types"]["Row"], "id" | "created_at" | "quantity_sold">;
        Update: Partial<Database["public"]["Tables"]["ticket_types"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          show_id: string;
          total_pence: number;
          status: "pending" | "paid" | "refunded" | "cancelled";
          stripe_payment_intent_id: string | null;
          stripe_charge_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          ticket_type_id: string;
          quantity: number;
          unit_price_pence: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      show_status: "draft" | "on_sale" | "sold_out" | "cancelled" | "completed";
      order_status: "pending" | "paid" | "refunded" | "cancelled";
    };
  };
};
