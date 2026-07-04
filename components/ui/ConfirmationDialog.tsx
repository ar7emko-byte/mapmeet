import { Modal, Pressable, Text, View } from 'react-native';

import { PrimaryButton } from './PrimaryButton';

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        className="flex-1 items-center justify-center bg-black/60 px-6"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl bg-surface-light p-6 dark:bg-surface-dark"
        >
          <Text className="text-lg font-semibold text-text-light dark:text-text-dark">
            {title}
          </Text>
          {message ? (
            <Text className="mt-2 text-sm text-muted-light dark:text-muted-dark">
              {message}
            </Text>
          ) : null}
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1">
              <PrimaryButton
                variant="secondary"
                label={cancelLabel}
                onPress={onCancel}
                fullWidth
              />
            </View>
            <View className="flex-1">
              <PrimaryButton
                variant={destructive ? 'destructive' : 'primary'}
                label={confirmLabel}
                onPress={onConfirm}
                fullWidth
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
