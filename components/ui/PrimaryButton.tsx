import { forwardRef } from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
};

const container: Record<Variant, string> = {
  primary: 'bg-brand-500 active:bg-brand-600',
  secondary:
    'bg-elevated-light dark:bg-elevated-dark border border-border-light dark:border-border-dark active:opacity-80',
  ghost: 'bg-transparent active:opacity-60',
  destructive: 'bg-red-500 active:bg-red-600',
};

const text: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-text-light dark:text-text-dark',
  ghost: 'text-brand-500',
  destructive: 'text-white',
};

const sizing: Record<Size, string> = {
  sm: 'h-9 px-3 rounded-xl',
  md: 'h-12 px-5 rounded-2xl',
  lg: 'h-14 px-6 rounded-2xl',
};

const label: Record<Size, string> = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-lg font-semibold',
};

export const PrimaryButton = forwardRef<View, Props>(function PrimaryButton(
  {
    label: text_,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    leftIcon,
    fullWidth,
    className,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      accessibilityRole="button"
      className={[
        'flex-row items-center justify-center',
        sizing[size],
        container[variant],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#3757FF' : '#fff'} />
      ) : (
        <>
          {leftIcon ? <>{leftIcon}</> : null}
          <Text className={[label[size], text[variant], leftIcon ? 'ml-2' : ''].join(' ')}>
            {text_}
          </Text>
        </>
      )}
    </Pressable>
  );
});
