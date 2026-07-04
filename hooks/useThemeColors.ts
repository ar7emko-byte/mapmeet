import { useColorScheme } from 'react-native';

/** Resolves the semantic palette used by non-className styles (map tiles,
 *  imperative overlays, MapLibre CSS, etc). Prefer NativeWind classes
 *  everywhere else. */
export function useThemeColors() {
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  return {
    scheme,
    isDark,
    surface: isDark ? '#0B0B0F' : '#FFFFFF',
    elevated: isDark ? '#16161C' : '#F7F7FA',
    border: isDark ? '#2A2A32' : '#E5E5EA',
    text: isDark ? '#F5F5F7' : '#0B0B0F',
    muted: isDark ? '#8A8A94' : '#8E8E93',
    brand: '#3757FF',
  };
}
