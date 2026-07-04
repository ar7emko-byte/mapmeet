import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

/** Small curated set — enough for MVP without pulling a 1MB emoji index.
 *  Users can also type any single emoji via the "custom" field. */
const CURATED = [
  '🎉','🥳','🍕','🍺','🍻','☕','🍜','🍣','🍩','🥂',
  '🎮','🎲','🎯','🎨','🎬','🎤','🎧','🎸','🎹','🎺',
  '⚽','🏀','🏈','⚾','🎾','🏐','🏓','🏸','🏒','⛳',
  '🚴','🏃','🧘','🏊','🏋️','🤸','⛹️','🤾','🤺','🏇',
  '📚','💻','🧠','💡','🖥️','📱','🧑‍💻','🔬','🧪','📈',
  '🐕','🐈','🐰','🐶','🦊','🐼','🐨','🦁','🐯','🐮',
  '🌳','🌲','🏔️','🏖️','🏕️','🌊','🌅','🌇','🏝️','🌋',
  '🎂','🎁','🎈','🎊','🪩','🕺','💃','🎆','🎇','✨',
];

type Props = {
  value: string;
  onChange: (emoji: string) => void;
};

export function EmojiPicker({ value, onChange }: Props) {
  const [custom, setCustom] = useState('');
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
          <Text style={{ fontSize: 32 }}>{value || '❓'}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-text-light dark:text-text-dark">
            Or paste any emoji
          </Text>
          <TextInput
            value={custom}
            onChangeText={(t) => {
              setCustom(t);
              if (t.trim().length > 0) onChange(t.trim());
            }}
            placeholder="🚀"
            placeholderTextColor="#8E8E93"
            maxLength={4}
            className="mt-1 h-10 rounded-xl border border-border-light bg-elevated-light px-3 text-lg text-text-light outline-none dark:border-border-dark dark:bg-elevated-dark dark:text-text-dark"
          />
        </View>
      </View>

      <FlatList
        data={CURATED}
        numColumns={8}
        keyExtractor={(e, idx) => `${e}-${idx}`}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 6 }}
        contentContainerStyle={{ gap: 6 }}
        renderItem={({ item }) => {
          const active = item === value;
          return (
            <Pressable
              onPress={() => onChange(item)}
              className={[
                'h-10 flex-1 items-center justify-center rounded-xl',
                active
                  ? 'bg-brand-500/20'
                  : 'bg-elevated-light dark:bg-elevated-dark',
              ].join(' ')}
              style={{ maxWidth: 46 }}
            >
              <Text style={{ fontSize: 20 }}>{item}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
