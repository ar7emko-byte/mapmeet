import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  type MapPressEvent,
  type Region,
} from 'react-native-maps';

import { MapMarker } from './MapMarker';
import { useCluster } from './useCluster';
import type { MapProps, MapRef } from './Map.types';

const DEFAULT_DELTA = { latitudeDelta: 0.05, longitudeDelta: 0.05 };

/** Approx delta from a supercluster zoom level — inverse of the trick in
 *  useCluster. Used to animate into a cluster on tap. */
function deltaFromZoom(zoom: number) {
  const longitudeDelta = 360 / Math.pow(2, zoom);
  return { latitudeDelta: longitudeDelta, longitudeDelta };
}

export const Map = forwardRef<MapRef, MapProps>(function Map(
  { events, initialCenter, userLocation, selectedEventId, onMarkerPress, onMapPress },
  ref,
) {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>({
    ...initialCenter,
    ...DEFAULT_DELTA,
  });

  useImperativeHandle(
    ref,
    () => ({
      animateTo: (coords, zoom) => {
        const delta = zoom ? deltaFromZoom(zoom) : DEFAULT_DELTA;
        mapRef.current?.animateToRegion(
          { latitude: coords.latitude, longitude: coords.longitude, ...delta },
          400,
        );
      },
    }),
    [],
  );

  const initialRegion: Region = useMemo(
    () => ({ ...initialCenter, ...DEFAULT_DELTA }),
    [initialCenter],
  );

  const clusters = useCluster(events, region);

  const handleClusterPress = (
    coordinate: { latitude: number; longitude: number },
    zoom: number,
  ) => {
    mapRef.current?.animateToRegion({ ...coordinate, ...deltaFromZoom(zoom) }, 400);
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      onRegionChangeComplete={setRegion}
      onPress={(e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        onMapPress?.({ latitude, longitude });
      }}
    >
      {userLocation ? (
        <Marker
          coordinate={userLocation}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        />
      ) : null}

      {clusters.map((c) =>
        c.kind === 'cluster' ? (
          <Marker
            key={c.id}
            coordinate={c.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => handleClusterPress(c.coordinate, c.expansionZoom)}
            tracksViewChanges={false}
          >
            <ClusterBubble count={c.count} />
          </Marker>
        ) : (
          <Marker
            key={c.id}
            coordinate={c.coordinate}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => onMarkerPress?.(c.event.id)}
            tracksViewChanges={false}
          >
            <MapMarker
              emoji={c.event.emoji}
              title={c.event.title}
              selected={selectedEventId === c.event.id}
              isPrivate={c.event.visibility === 'private'}
            />
          </Marker>
        ),
      )}
    </MapView>
  );
});

function ClusterBubble({ count }: { count: number }) {
  const size = count >= 50 ? 60 : count >= 10 ? 52 : 44;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#3757FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.9)',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{count}</Text>
    </View>
  );
}
