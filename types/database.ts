// Hand-written mirror of the Supabase schema. Regenerate with
// `supabase gen types typescript --project-id <id> > types/database.ts`
// once the CLI is wired up; the shape below matches the initial migration.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          emoji: string;
          latitude: number;
          longitude: number;
          event_date: string; // ISO date (YYYY-MM-DD)
          event_time: string; // ISO time (HH:MM:SS)
          max_participants: number | null;
          visibility: 'public' | 'private';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          creator_id: string;
          title: string;
          description?: string | null;
          emoji: string;
          latitude: number;
          longitude: number;
          event_date: string;
          event_time: string;
          max_participants?: number | null;
          visibility?: 'public' | 'private';
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
        };
        Update: never;
      };
    };
  };
};
