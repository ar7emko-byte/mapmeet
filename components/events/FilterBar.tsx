import { Pressable, ScrollView, Text } from 'react-native';

import type { EventFilter } from '@/types';

const FILTERS: { key: EventFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'week', label: 'This week' },
  { key: 'nearby', label: 'Nearby' },
  { key: 'joined', label: 'Joined' },
  { key: 'created', label: 'By me' },
];

type Props = {
  value: EventFilter;
  onChange: (filter: EventFilter) => void;
};

export function FilterBar({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
    >
      {FILTERS.map((f) => {
        const active = value === f.key;
        return (
          <Pressable
            key={f.key}
            onPress={() => onChange(f.key)}
            className={[
              'h-9 items-center justify-center rounded-full px-4',
              active
                ? 'bg-brand-500'
                : 'bg-white/85 dark:bg-elevated-dark/85 border border-border-light dark:border-border-dark',
            ].join(' ')}
          >
            <Text
              className={[
                'text-xs font-semibold',
                active ? 'text-white' : 'text-text-light dark:text-text-dark',
              ].join(' ')}
            >
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
