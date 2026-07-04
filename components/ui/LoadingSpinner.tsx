import { ActivityIndicator, View } from 'react-native';

type Props = {
  size?: 'small' | 'large';
  fullScreen?: boolean;
};

export function LoadingSpinner({ size = 'large', fullScreen }: Props) {
  return (
    <View
      className={[
        'items-center justify-center',
        fullScreen ? 'flex-1 bg-surface-light dark:bg-surface-dark' : '',
      ].join(' ')}
    >
      <ActivityIndicator size={size} color="#3757FF" />
    </View>
  );
}
