import type { EventWithCreator, LatLng } from '@/types';

export type MapProps = {
  events: EventWithCreator[];
  initialCenter: LatLng;
  userLocation?: LatLng | null;
  selectedEventId?: string | null;
  onMarkerPress?: (eventId: string) => void;
  onMapPress?: (coords: LatLng) => void;
};

/** Imperative surface exposed via ref. Kept minimal — screens should
 *  drive state through props, and only reach for the ref for camera
 *  gestures the declarative API can't express. */
export type MapRef = {
  animateTo: (coords: LatLng, zoom?: number) => void;
};
