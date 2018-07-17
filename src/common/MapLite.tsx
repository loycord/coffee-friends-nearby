import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView } from 'expo';

import D from './BJNDimension';
// types
import { GeoPoint } from '../redux/types';

interface Props {
  geoPoint: GeoPoint;
  render?: any;
}

const ASPECT_RATIO = D.width / D.height;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapLite = (props: Props) => {
  return (
    <View style={styles.container}>
      <MapView
        pointerEvents="none"
        liteMode
        style={styles.map}
        initialRegion={{
          latitude: props.geoPoint.latitude,
          longitude: props.geoPoint.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
      >
        <MapView.Marker
          image={require('./img/marker.png')}
          style={{ width: 20, height: 20 }}
          coordinate={{
            latitude: props.geoPoint.latitude,
            longitude: props.geoPoint.longitude + 0.00156
          }}
        />
      </MapView>
      {props.render && (
        <View style={styles.absoluteView}>{props.render()}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 115
  },
  absoluteView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  }
});

export default MapLite;
