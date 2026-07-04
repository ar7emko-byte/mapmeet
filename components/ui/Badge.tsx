import { Text, View } from 'react-native';

type Tone = 'neutral' | 'brand' | 'private' | 'success' | 'warning';

const tone: Record<Tone, string> = {
  neutral: 'bg-elevated-light dark:bg-elevated-dark',
  brand: 'bg-brand-500/15',
  private: 'bg-amber-500/15',
  success: 'bg-emerald-500/15',
  warning: 'bg-orange-500/15',
};

const text: Record<Tone, string> = {
  neutral: 'text-text-light dark:text-text-dark',
  brand: 'text-brand-500',
  private: 'text-amber-600 dark:text-amber-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-orange-600 dark:text-orange-400',
};

type Props = {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
};

export function Badge({ label, tone: t = 'neutral', icon }: Props) {
  return (
    <View
      className={[
        'flex-row items-center gap-1 rounded-full px-2 py-0.5',
        tone[t],
      ].join(' ')}
    >
      {icon}
      <Text className={['text-[11px] font-semibold', text[t]].join(' ')}>{label}</Text>
    </View>
  );
}
