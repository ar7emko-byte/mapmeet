import { Text, View } from 'react-native';

export type DateTimeFieldProps = {
  mode: 'date' | 'time';
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

/** Web uses the native HTML picker — it's fully accessible and covers
 *  every browser without a JS date library. */
export function DateTimeField({ mode, label, value, onChange, error }: DateTimeFieldProps) {
  return (
    <View className="w-full">
      <Text className="mb-1.5 text-sm font-medium text-text-light dark:text-text-dark">
        {label}
      </Text>
      <View
        className={[
          'h-12 justify-center rounded-2xl border px-4',
          'bg-elevated-light dark:bg-elevated-dark',
          error ? 'border-red-500' : 'border-border-light dark:border-border-dark',
        ].join(' ')}
      >
        {/* React Native Web forwards unknown props onto the underlying div, so we
            render the raw HTML input for a native-looking picker. */}
        <input
          type={mode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'inherit',
            fontSize: 16,
            width: '100%',
            fontFamily: 'inherit',
          }}
        />
      </View>
      {error ? <Text className="mt-1.5 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
