import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Height as a fraction of the viewport. 0..1 */
  heightPct?: number;
};

/** Lightweight, cross-platform bottom sheet. We deliberately don't pull in
 *  @gorhom/bottom-sheet's imperative API for Phase 1 — a Modal with a slide
 *  + backdrop covers the entire MVP surface area at a fraction of the deps.
 *  Web still gets the same visual because Modal is polyfilled by RNW. */
export function BottomSheet({ open, onClose, children, heightPct = 0.6 }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [open, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.55,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - progress.value) * 60,
      },
    ],
    opacity: progress.value,
  }));

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Animated.View
          style={backdropStyle}
          className="absolute inset-0 bg-black"
          pointerEvents={open ? 'auto' : 'none'}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[sheetStyle, { height: `${heightPct * 100}%` }]}
          className="overflow-hidden rounded-t-3xl"
        >
          {Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="default"
              className="absolute inset-0"
            />
          ) : (
            <View className="absolute inset-0 bg-surface-light dark:bg-surface-dark" />
          )}
          <View className="flex-1">
            <View className="items-center pt-2 pb-1">
              <View className="h-1.5 w-10 rounded-full bg-border-light dark:bg-border-dark" />
            </View>
            <View className="flex-1 px-5 pb-6">{children}</View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
