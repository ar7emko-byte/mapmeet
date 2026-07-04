import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Variant = 'info' | 'success' | 'error';

type Toast = { id: number; message: string; variant: Variant };

type Ctx = {
  show: (message: string, variant?: Variant) => void;
};

const ToastContext = createContext<Ctx | null>(null);

const bg: Record<Variant, string> = {
  info: 'bg-brand-500',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const nextId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(-20, { duration: 180 }, (finished) => {
      if (finished) {
        // Reanimated worklet -> JS
      }
    });
    setTimeout(() => setToast(null), 200);
  }, [opacity, translateY]);

  const show = useCallback(
    (message: string, variant: Variant = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      const id = ++nextId.current;
      setToast({ id, message, variant });
      opacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
      timer.current = setTimeout(() => dismiss(), 2600);
    },
    [dismiss, opacity, translateY],
  );

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const ctxValue = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={ctxValue}>
      {children}
      {toast ? (
        <View
          pointerEvents="none"
          className="absolute inset-x-0 top-14 items-center px-4"
          style={{ zIndex: 9999 }}
        >
          <Animated.View
            style={style}
            className={[
              'rounded-2xl px-4 py-3 shadow-lg shadow-black/25',
              bg[toast.variant],
            ].join(' ')}
          >
            <Text className="text-sm font-semibold text-white">{toast.message}</Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
