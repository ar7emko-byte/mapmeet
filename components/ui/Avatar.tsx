import { Image, Text, View } from 'react-native';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizing: Record<Size, { box: string; text: string; px: number }> = {
  xs: { box: 'h-6 w-6', text: 'text-[10px]', px: 24 },
  sm: { box: 'h-8 w-8', text: 'text-xs', px: 32 },
  md: { box: 'h-10 w-10', text: 'text-sm', px: 40 },
  lg: { box: 'h-14 w-14', text: 'text-lg', px: 56 },
  xl: { box: 'h-20 w-20', text: 'text-2xl', px: 80 },
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}

type Props = {
  uri?: string | null;
  name: string;
  size?: Size;
};

export function Avatar({ uri, name, size = 'md' }: Props) {
  const { box, text, px } = sizing[size];
  const initials = initialsFrom(name);
  return (
    <View
      className={[
        box,
        'items-center justify-center overflow-hidden rounded-full',
        'bg-brand-500/15',
      ].join(' ')}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: px, height: px }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text className={[text, 'font-semibold text-brand-500'].join(' ')}>
          {initials}
        </Text>
      )}
    </View>
  );
}
