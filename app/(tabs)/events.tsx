import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/events/EventCard';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { EditEventSheet } from '@/features/events/EditEventSheet';
import { useAuth } from '@/hooks/useAuth';
import { eventsService } from '@/services/events.service';
import { useEventsStore } from '@/store/events.store';
import type { EventWithCreator } from '@/types';

type Tab = 'created' | 'joined';

export default function MyEventsScreen() {
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuth();
  const events = useEventsStore((s) => s.events);
  const removeEvent = useEventsStore((s) => s.removeEvent);
  const selectEvent = useEventsStore((s) => s.selectEvent);
  const [tab, setTab] = useState<Tab>('created');
  const [editEvent, setEditEvent] = useState<EventWithCreator | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventWithCreator | null>(null);

  const filtered = useMemo(() => {
    if (!profile) return [];
    return tab === 'created'
      ? events.filter((e) => e.creator_id === profile.id)
      : events.filter((e) => e.is_joined);
  }, [events, profile, tab]);

  const openOnMap = (event: EventWithCreator) => {
    selectEvent(event.id);
    router.push('/(tabs)/map');
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await eventsService.remove(target.id);
      removeEvent(target.id);
      toast.show('Event deleted.', 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Could not delete', 'error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <View className="px-5 pb-3 pt-2">
        <Text className="text-3xl font-bold text-text-light dark:text-text-dark">
          My events
        </Text>
        <View className="mt-4 flex-row rounded-2xl border border-border-light bg-elevated-light p-1 dark:border-border-dark dark:bg-elevated-dark">
          <SegmentButton
            label="Created"
            active={tab === 'created'}
            onPress={() => setTab('created')}
          />
          <SegmentButton
            label="Joined"
            active={tab === 'joined'}
            onPress={() => setTab('joined')}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 20, gap: 12, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            emoji={tab === 'created' ? '📍' : '🙋'}
            title={tab === 'created' ? 'No events yet' : 'Not joined anything yet'}
            description={
              tab === 'created'
                ? 'Drop your first pin from the map tab.'
                : 'Tap a marker on the map to join.'
            }
            actionLabel="Open map"
            onAction={() => router.push('/(tabs)/map')}
          />
        }
        renderItem={({ item }) => (
          <View className="gap-2">
            <EventCard event={item} onPress={() => openOnMap(item)} />
            {tab === 'created' ? (
              <View className="flex-row items-center gap-2 pl-3">
                {item.visibility === 'private' ? (
                  <Badge
                    label="Private"
                    tone="private"
                    icon={<Ionicons name="lock-closed" size={10} color="#B45309" />}
                  />
                ) : null}
                <Pressable
                  onPress={() => setEditEvent(item)}
                  className="rounded-full bg-elevated-light px-3 py-1 dark:bg-elevated-dark"
                >
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="create-outline" size={12} color="#3757FF" />
                    <Text className="text-[11px] font-semibold text-brand-500">Edit</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => setPendingDelete(item)}
                  className="rounded-full bg-red-500/10 px-3 py-1"
                >
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="trash-outline" size={12} color="#ef4444" />
                    <Text className="text-[11px] font-semibold text-red-500">Delete</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => openOnMap(item)}
                  className="rounded-full bg-elevated-light px-3 py-1 dark:bg-elevated-dark"
                >
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="map-outline" size={12} color="#3757FF" />
                    <Text className="text-[11px] font-semibold text-brand-500">
                      Open on map
                    </Text>
                  </View>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      />

      <EditEventSheet
        event={editEvent}
        open={!!editEvent}
        onClose={() => setEditEvent(null)}
      />

      <ConfirmationDialog
        open={!!pendingDelete}
        title="Delete event?"
        message="Attendees will lose their spot. This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-1 items-center justify-center rounded-xl py-2',
        active ? 'bg-surface-light shadow dark:bg-surface-dark' : '',
      ].join(' ')}
    >
      <Text
        className={[
          'text-sm font-semibold',
          active
            ? 'text-text-light dark:text-text-dark'
            : 'text-muted-light dark:text-muted-dark',
        ].join(' ')}
      >
        {label}
      </Text>
    </Pressable>
  );
}
