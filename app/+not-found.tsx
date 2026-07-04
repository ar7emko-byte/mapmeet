import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center gap-4 bg-surface-light p-6 dark:bg-surface-dark">
        <Text className="text-6xl">🧭</Text>
        <Text className="text-xl font-semibold text-text-light dark:text-text-dark">
          This route doesn't exist.
        </Text>
        <Link href="/" className="text-brand-500">
          Go home
        </Link>
      </View>
    </>
  );
}
