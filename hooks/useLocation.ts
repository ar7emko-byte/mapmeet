import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import type { LatLng } from '@/types';

type Status = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

/** Requests location permission once on mount, then returns the current
 *  coordinates. On web this falls back to the browser Geolocation API to
 *  avoid pulling in expo-location's DOM shim in Metro's web target. */
export function useLocation() {
  const [status, setStatus] = useState<Status>('idle');
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async () => {
    setStatus('requesting');
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          setStatus('unavailable');
          return;
        }
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setCoords({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
              setStatus('granted');
              resolve();
            },
            (err) => {
              setError(err.message);
              setStatus('denied');
              resolve();
            },
            { enableHighAccuracy: false, timeout: 8000 },
          );
        });
        return;
      }

      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setStatus('granted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    void request();
  }, [request]);

  return { status, coords, error, request };
}
