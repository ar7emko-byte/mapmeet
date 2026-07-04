import Supercluster from 'supercluster';
import { useEffect, useMemo, useRef } from 'react';

import type { EventWithCreator, LatLng } from '@/types';

export type ClusterPoint =
  | {
      kind: 'point';
      id: string;
      event: EventWithCreator;
      coordinate: LatLng;
    }
  | {
      kind: 'cluster';
      id: string;
      count: number;
      coordinate: LatLng;
      /** supercluster expansion pass-through so tapping a cluster can zoom in. */
      leaves: () => EventWithCreator[];
      expansionZoom: number;
    };

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

/** Approx zoom from a lat delta. supercluster wants an integer zoom;
 *  react-native-maps exposes region deltas. This is the standard trick. */
function zoomFromRegion(region: Region): number {
  const zoom = Math.round(Math.log2(360 / region.longitudeDelta));
  return Math.max(1, Math.min(20, zoom));
}

function regionBBox(
  region: Region,
): [number, number, number, number] {
  const minLng = region.longitude - region.longitudeDelta;
  const maxLng = region.longitude + region.longitudeDelta;
  const minLat = region.latitude - region.latitudeDelta;
  const maxLat = region.latitude + region.latitudeDelta;
  return [minLng, minLat, maxLng, maxLat];
}

type EventFeature = {
  type: 'Feature';
  properties: { eventId: string };
  geometry: { type: 'Point'; coordinates: [number, number] };
};

/** Returns clustered points for the current visible region.
 *  Native-only — the web map uses MapLibre's own clustering. */
export function useCluster(
  events: EventWithCreator[],
  region: Region | null,
): ClusterPoint[] {
  const indexRef = useRef<Supercluster<EventFeature['properties']> | null>(null);
  const eventsMapRef = useRef(new Map<string, EventWithCreator>());

  // Rebuild the index whenever the events array changes identity.
  useEffect(() => {
    const index = new Supercluster<EventFeature['properties']>({
      radius: 60,
      maxZoom: 18,
      minPoints: 3,
    });
    const features: EventFeature[] = events.map((e) => ({
      type: 'Feature',
      properties: { eventId: e.id },
      geometry: { type: 'Point', coordinates: [e.longitude, e.latitude] },
    }));
    index.load(features);
    indexRef.current = index;

    const map = new Map<string, EventWithCreator>();
    for (const e of events) map.set(e.id, e);
    eventsMapRef.current = map;
  }, [events]);

  return useMemo(() => {
    const index = indexRef.current;
    if (!index || !region) {
      return events.map<ClusterPoint>((event) => ({
        kind: 'point',
        id: event.id,
        event,
        coordinate: { latitude: event.latitude, longitude: event.longitude },
      }));
    }

    const zoom = zoomFromRegion(region);
    const clusters = index.getClusters(regionBBox(region), zoom);

    return clusters.map<ClusterPoint>((c) => {
      const [lng, lat] = c.geometry.coordinates;
      const props = c.properties as {
        cluster?: boolean;
        cluster_id?: number;
        point_count?: number;
        eventId?: string;
      };
      if (props.cluster && props.cluster_id != null) {
        const clusterId = props.cluster_id;
        return {
          kind: 'cluster',
          id: `cluster-${clusterId}`,
          count: props.point_count ?? 0,
          coordinate: { latitude: lat!, longitude: lng! },
          expansionZoom: Math.min(index.getClusterExpansionZoom(clusterId), 18),
          leaves: () =>
            index
              .getLeaves(clusterId, Infinity)
              .map((leaf) => eventsMapRef.current.get(leaf.properties.eventId)!)
              .filter(Boolean),
        };
      }
      const eventId = props.eventId!;
      const event = eventsMapRef.current.get(eventId)!;
      return {
        kind: 'point',
        id: eventId,
        event,
        coordinate: { latitude: lat!, longitude: lng! },
      };
    });
  }, [events, region]);
}
