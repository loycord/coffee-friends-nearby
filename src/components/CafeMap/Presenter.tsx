import React from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { MapView } from 'expo';
import { State } from './Container';
// types
import { Cafe, Location } from '../../redux/types';

interface Props extends State {
  onRegionChangeComplete: (region: any) => void;
  onPressMarker: (coordinate: any, data: any) => void;
  onCalloutPress?: () => void;
  children?: any;
  location: Location | null;
  selectedCafe: Cafe | null;
}

function Presenter(props: Props) {
  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          // region={props.region}
          initialRegion={props.region}
          // onPress={props.onPressMap}
          onRegionChangeComplete={props.onRegionChangeComplete}
        >
          {props.data !== null &&
            props.data.map(marker => (
              <MapView.Marker
                key={marker.docId}
                coordinate={marker.geoPoint}
                title={marker.name}
                onPress={() => props.onPressMarker(marker.geoPoint, marker)}
                onCalloutPress={props.onCalloutPress || (() => {})}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {props.selectedCafe !== null &&
                  props.selectedCafe.docId === marker.docId ? (
                    <Image
                      style={styles.marker}
                      source={require('../../common/img/marker.png')}
                    />
                  ) : (
                    <View style={styles.circle} />
                  )}
                </View>
              </MapView.Marker>
            ))}
          {props.location !== null && (
            <MapView.Marker
              style={{ width: 20, height: 20 }}
              coordinate={{
                latitude: props.location.coords.latitude,
                longitude: props.location.coords.longitude
              }}
            >
              <View style={[styles.circle, { backgroundColor: 'orangered' }]} />
            </MapView.Marker>
          )}
        </MapView>
      </View>
      {props.children}
      {props.isLoading && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
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
  bigContainer: {
    flex: 1,
    position: 'relative'
  },
  calloutText: {
    fontSize: 14
  },
  circle: {
    backgroundColor: '#00ac62',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff'
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
