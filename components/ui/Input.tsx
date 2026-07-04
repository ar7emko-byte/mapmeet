import { forwardRef } from 'react';
import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, helperText, error, leftAdornment, rightAdornment, className, ...rest },
  ref,
) {
  return (
    <View className="w-full">
      {label ? (
        <Text className="mb-1.5 text-sm font-medium text-text-light dark:text-text-dark">
          {label}
        </Text>
      ) : null}
      <View
        className={[
          'flex-row items-center rounded-2xl border px-4',
          'bg-elevated-light dark:bg-elevated-dark',
          error
            ? 'border-red-500'
            : 'border-border-light dark:border-border-dark',
          'h-12',
        ].join(' ')}
      >
        {leftAdornment ? <View className="mr-2">{leftAdornment}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#8E8E93"
          className={[
            'flex-1 text-base text-text-light dark:text-text-dark',
            // react-native-web needs this to remove the default focus ring.
            'outline-none',
            className ?? '',
          ].join(' ')}
          {...rest}
        />
        {rightAdornment ? <View className="ml-2">{rightAdornment}</View> : null}
      </View>
      {error ? (
        <Text className="mt-1.5 text-xs text-red-500">{error}</Text>
      ) : helperText ? (
        <Text className="mt-1.5 text-xs text-muted-light dark:text-muted-dark">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
});
