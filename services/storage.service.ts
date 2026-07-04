import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { supabase } from './supabase';

/** Reads a local file (native) or fetches a data/blob URI (web) and
 *  returns a Uint8Array — the shape supabase-js accepts everywhere. */
async function readAsBytes(uri: string): Promise<Uint8Array> {
  if (Platform.OS === 'web' || uri.startsWith('data:') || uri.startsWith('blob:')) {
    const res = await fetch(uri);
    return new Uint8Array(await res.arrayBuffer());
  }
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  // Fast enough for a single ~1MB image; skips pulling in a base64 lib.
  const binary =
    typeof atob === 'function'
      ? atob(base64)
      : // React Native doesn't ship atob until Hermes 0.72+; guard for old runtimes.
        Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function inferContentType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  return 'image/jpeg';
}

export const storageService = {
  async uploadAvatar(userId: string, localUri: string): Promise<string> {
    const bytes = await readAsBytes(localUri);
    const contentType = inferContentType(localUri);
    const ext = contentType.split('/')[1] ?? 'jpg';
    // Bust the CDN cache by suffixing a timestamp — the DB stores the
    // returned public URL so it doesn't matter if the path changes.
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('avatars').upload(path, bytes, {
      contentType,
      upsert: true,
    });
    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  },
};
