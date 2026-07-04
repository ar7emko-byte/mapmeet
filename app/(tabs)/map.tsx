import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Map, type MapRef } from '@/components/map';
import { FilterBar } from '@/components/events/FilterBar';
import { SearchBar } from '@/components/events/SearchBar';
import { CreateEventSheet } from '@/features/events/CreateEventSheet';
import { EditEventSheet } from '@/features/events/EditEventSheet';
import { EventPreviewSheet } from '@/features/events/EventPreviewSheet';
import { filterEvents } from '@/features/events/filterEvents';
import { DEMO_CENTER } from '@/features/map/demo-events';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useEventsStore } from '@/store/events.store';
import { useFiltersStore } from '@/store/filters.store';
import type { EventWithCreator, LatLng } from '@/types';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const viewerId = session?.user.id ?? null;

  const events = useEventsStore((s) => s.events);
  const selectedEventId = useEventsStore((s) => s.selectedEventId);
  const selectEvent = useEventsStore((s) => s.selectEvent);

  const query = useFiltersStore((s) => s.query);
  const setQuery = useFiltersStore((s) => s.setQuery);
  const filter = useFiltersStore((s) => s.filter);
  const setFilter = useFiltersStore((s) => s.setFilter);

  const { coords } = useLocation();
  const mapRef = useRef<MapRef | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createSeed, setCreateSeed] = useState<LatLng | null>(null);
  const [editEvent, setEditEvent] = useState<EventWithCreator | null>(null);

  const visibleEvents = useMemo(
    () => filterEvents({ events, viewerId, filter, query, coords }),
    [events, viewerId, filter, query, coords],
  );

  // Look up the selected event out of the whole feed — a user can still
  // preview an event that got filtered out.
  const selectedEvent =
    events.find((e) => e.id === selectedEventId) ?? null;

  const openCreate = (seed: LatLng | null) => {
    setCreateSeed(seed);
    setCreateOpen(true);
  };

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <Map
        ref={mapRef}
        events={visibleEvents}
        initialCenter={coords ?? DEMO_CENTER}
        userLocation={coords}
        selectedEventId={selectedEventId}
        onMarkerPress={selectEvent}
        onMapPress={(c) => {
          // If nothing selected + create sheet closed, just drop the last-tap
          // seed. If the user then presses "+", it opens with that coord.
          if (!createOpen && !selectedEventId) setCreateSeed(c);
        }}
      />

      {/* Top overlay: search + filters */}
      <View
        pointerEvents="box-none"
        style={{ paddingTop: insets.top + 8 }}
        className="absolute inset-x-0 top-0"
      >
        <View className="px-4">
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <View className="mt-3 px-2">
          <FilterBar value={filter} onChange={setFilter} />
        </View>
      </View>

      {/* Floating locate button */}
      <View
        pointerEvents="box-none"
        className="absolute right-4"
        style={{ bottom: insets.bottom + 160 }}
      >
        <Pressable
          onPress={() => {
            if (coords) mapRef.current?.animateTo(coords, 14);
          }}
          className="h-12 w-12 items-center justify-center rounded-full border border-border-light bg-white/95 shadow-md shadow-black/25 dark:border-border-dark dark:bg-elevated-dark"
          accessibilityLabel="Recenter"
        >
          <Ionicons name="navigate" size={20} color="#3757FF" />
        </Pressable>
      </View>

      {/* Floating create-event button */}
      <View
        pointerEvents="box-none"
        className="absolute right-4"
        style={{ bottom: insets.bottom + 96 }}
      >
        <Pressable
          onPress={() => openCreate(createSeed ?? coords ?? null)}
          className="h-14 w-14 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 active:opacity-90"
          accessibilityLabel="Create event"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>

      <EventPreviewSheet
        event={selectedEvent}
        viewerLocation={coords}
        onClose={() => selectEvent(null)}
        onEdit={(e) => {
          selectEvent(null);
          setEditEvent(e);
        }}
      />

      <CreateEventSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        seedCoords={createSeed}
      />

      <EditEventSheet
        event={editEvent}
        open={!!editEvent}
        onClose={() => setEditEvent(null)}
      />
    </View>
  );
}
