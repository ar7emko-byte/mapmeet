import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import { useImagePicker } from '@/hooks/useImagePicker';
import { profilesService } from '@/services/profiles.service';
import { storageService } from '@/services/storage.service';
import { useAuthStore } from '@/store/auth.store';
import type { Profile } from '@/types';

type Props = {
  profile: Profile;
};

export function AvatarUpload({ profile }: Props) {
  const toast = useToast();
  const setProfile = useAuthStore((s) => s.setProfile);
  const { pickFromLibrary } = useImagePicker();
  const [uploading, setUploading] = useState(false);

  const handlePick = async () => {
    const uri = await pickFromLibrary();
    if (!uri) return;
    setUploading(true);
    try {
      const publicUrl = await storageService.uploadAvatar(profile.id, uri);
      const updated = await profilesService.update(profile.id, {
        avatar_url: publicUrl,
      });
      setProfile(updated);
      toast.show('Avatar updated.', 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="items-center">
      <Pressable onPress={handlePick} disabled={uploading}>
        <View>
          <Avatar name={profile.display_name} uri={profile.avatar_url} size="xl" />
          <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-2 border-surface-light bg-brand-500 dark:border-surface-dark">
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={14} color="#fff" />
            )}
          </View>
        </View>
      </Pressable>
      <Text className="mt-3 text-xs text-muted-light dark:text-muted-dark">
        {uploading ? 'Uploading…' : 'Tap to change photo'}
      </Text>
    </View>
  );
}
