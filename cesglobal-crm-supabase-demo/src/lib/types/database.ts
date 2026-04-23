/**
 * Supabase database schema types.
 * Mirror these against your real Supabase project using
 *   npx supabase gen types typescript --project-id <ref> > src/lib/types/database.ts
 * once your project is connected. This handwritten version keeps the app
 * compiling before the first generation.
 *
 * Shape follows the canonical `supabase gen types` output — any deviation
 * (missing Relationships / CompositeTypes) breaks postgrest-js type inference.
 */

export type LeadStatus = "new" | "consulting" | "won" | "rejected";
export type LeadSource =
  | "facebook"
  | "zalo"
  | "referral"
  | "google"
  | "direct"
  | "other";
export type InteractionType = "call" | "chat" | "meeting" | "email";
export type EventType = "call" | "chat" | "meeting" | "email" | "other";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          owner_id: string;
          full_name: string;
          phone: string;
          email: string | null;
          status: LeadStatus;
          source: LeadSource;
          position: string | null;
          location: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          status?: LeadStatus;
          source?: LeadSource;
          position?: string | null;
          location?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          status?: LeadStatus;
          source?: LeadSource;
          position?: string | null;
          location?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          owner_id: string;
          lead_id: string | null;
          title: string;
          type: EventType;
          start_at: string;
          end_at: string | null;
          all_day: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          lead_id?: string | null;
          title: string;
          type?: EventType;
          start_at: string;
          end_at?: string | null;
          all_day?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          lead_id?: string | null;
          title?: string;
          type?: EventType;
          start_at?: string;
          end_at?: string | null;
          all_day?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      interactions: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          type: InteractionType;
          title: string;
          content: string | null;
          duration_minutes: number | null;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id: string;
          type: InteractionType;
          title: string;
          content?: string | null;
          duration_minutes?: number | null;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          user_id?: string;
          type?: InteractionType;
          title?: string;
          content?: string | null;
          duration_minutes?: number | null;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interactions_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status: LeadStatus;
      lead_source: LeadSource;
      interaction_type: InteractionType;
      event_type: EventType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];
export type Interaction =
  Database["public"]["Tables"]["interactions"]["Row"];
export type InteractionInsert =
  Database["public"]["Tables"]["interactions"]["Insert"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CalendarEvent =
  Database["public"]["Tables"]["calendar_events"]["Row"];
export type CalendarEventInsert =
  Database["public"]["Tables"]["calendar_events"]["Insert"];
export type CalendarEventUpdate =
  Database["public"]["Tables"]["calendar_events"]["Update"];
