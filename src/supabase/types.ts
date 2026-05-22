/**
 * Generated types from Supabase schema.
 * Regenerate with: npx supabase gen types typescript --local > src/supabase/types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          moss_coins: number;
          season_pass_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      island_state: {
        Row: {
          id: string;
          user_id: string;
          zone_id: string;
          level: number;
          peak_level: number;
          is_neglected: boolean;
          last_updated: string;
        };
        Insert: Omit<Database['public']['Tables']['island_state']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['island_state']['Insert']>;
      };
      creatures: {
        Row: {
          id: string;
          user_id: string;
          species: string;
          name: string | null;
          stage: number;
          zone_id: string;
          xp_progress: number;
          has_graduated: boolean;
          discovered_at: string;
        };
        Insert: Omit<Database['public']['Tables']['creatures']['Row'], 'id' | 'discovered_at'>;
        Update: Partial<Database['public']['Tables']['creatures']['Insert']>;
      };
      eggs: {
        Row: {
          id: string;
          user_id: string;
          species: string;
          zone_id: string;
          progress: number;
          discovered_at: string;
          hatched_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['eggs']['Row'], 'id' | 'discovered_at'>;
        Update: Partial<Database['public']['Tables']['eggs']['Insert']>;
      };
      activity_cache: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          activity_type: string;
          value: number;
          unit: string;
          source: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_cache']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['activity_cache']['Insert']>;
      };
      agent_narrations: {
        Row: {
          id: string;
          user_id: string;
          context_hash: string;
          narration: string;
          generated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agent_narrations']['Row'], 'id' | 'generated_at'>;
        Update: Partial<Database['public']['Tables']['agent_narrations']['Insert']>;
      };
      weekly_reflections: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          reflection: string;
          generated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['weekly_reflections']['Row'], 'id' | 'generated_at'>;
        Update: Partial<Database['public']['Tables']['weekly_reflections']['Insert']>;
      };
      creature_lore: {
        Row: {
          id: string;
          creature_id: string;
          lore_text: string;
          generated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['creature_lore']['Row'], 'id' | 'generated_at'>;
        Update: Partial<Database['public']['Tables']['creature_lore']['Insert']>;
      };
      season_content: {
        Row: {
          id: string;
          season_key: string;
          intro: string;
          tagline: string;
          reward_desc: string;
          generated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['season_content']['Row'], 'id' | 'generated_at'>;
        Update: Partial<Database['public']['Tables']['season_content']['Insert']>;
      };
    };
  };
}
