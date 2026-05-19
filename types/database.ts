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
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
