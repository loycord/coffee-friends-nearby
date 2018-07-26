import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { MapView } from 'expo';
// types
import D from '../../common/BJNDimension';

const ASPECT_RATIO = D.width / D.height;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function Presenter({ navigation }: { navigation: any }) {
  const { geoPoint } = navigation.state.params;
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: geoPoint.latitude,
          longitude: geoPoint.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
      >
        <MapView.Marker coordinate={geoPoint}>
          <Image
            style={styles.marker}
            source={require('../../common/img/marker.png')}
          />
        </MapView.Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  marker: {
    width: 44 / 2,
    height: 50 / 2
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  }
});

export default Presenter;
