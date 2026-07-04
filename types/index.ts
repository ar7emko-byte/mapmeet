import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Participant = Database['public']['Tables']['participants']['Row'];

export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

/** An event enriched with its creator profile + derived participant count.
 *  This is the shape the UI actually renders. */
export type EventWithCreator = Event & {
  creator: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'>;
  participant_count: number;
  is_joined: boolean;
};

export type LatLng = { latitude: number; longitude: number };

export type EventFilter =
  | 'all'
  | 'today'
  | 'tomorrow'
  | 'week'
  | 'nearby'
  | 'joined'
  | 'created';
