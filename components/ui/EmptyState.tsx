import { Text, View } from 'react-native';

import { PrimaryButton } from './PrimaryButton';

type Props = {
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ emoji, title, description, actionLabel, onAction }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      {emoji ? <Text className="mb-3 text-5xl">{emoji}</Text> : null}
      <Text className="text-center text-lg font-semibold text-text-light dark:text-text-dark">
        {title}
      </Text>
      {description ? (
        <Text className="mt-2 text-center text-sm text-muted-light dark:text-muted-dark">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          className="mt-6"
        />
      ) : null}
    </View>
  );
}
