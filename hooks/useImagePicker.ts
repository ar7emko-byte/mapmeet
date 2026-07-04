import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

/** Wraps expo-image-picker's library flow. Returns null when the user
 *  cancels — screens should treat that as a no-op, not an error. */
export function useImagePicker() {
  const pickFromLibrary = useCallback(async (): Promise<string | null> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets[0]) return null;
    return result.assets[0].uri;
  }, []);

  return { pickFromLibrary };
}
