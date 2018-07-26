import { Alert } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { Location, Permissions, Linking } from 'expo';
import {
  Action,
  Dispatch,
  Location as LocationType,
  GeoPoint
} from '../../types';
import { updateUserDoc, _updateUserGeoPoint } from '../user';

export const _setGPS = (location: LocationType): Action => ({
  type: 'SET_GPS',
  location
});

export async function getGPS() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    Alert.alert(
      'Notice',
      'Permission to access location was denied. Do you want to allow the location?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => Linking.openURL('app-settings:') }
      ]
    );
  } else {
    return Location.getCurrentPositionAsync({})
      .then(location => location)
      .catch(error => {
        console.log(error);
        throw new Error('Location getCurrentPositionAsync ERROR');
      });
  }
}

export function setGPS(): Dispatch {
  return async dispatch => {
    dispatch({ type: 'LOADING ' });
    const location = await getGPS();
    if (location) {
      const { latitude, longitude } = location.coords;
      const geoPoint = new firebase.firestore.GeoPoint(latitude, longitude);
      dispatch(_setGPS(location));
      const { type } = await updateUserDoc({ geoPoint });
      if (type === 'success') {
        dispatch(_updateUserGeoPoint({ latitude, longitude }));
      }
    } else {
      console.log('SET GPS_cancel');
    }
    dispatch({ type: 'LOADED' });
  };
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/**
 * Wraps the longitude to [-180,180].
 *
 * @param {number} longitude The longitude to wrap.
 * @return {number} longitude The resulting longitude.
 */
function wrapLongitude(longitude: number) {
  if (longitude <= 180 && longitude >= -180) {
    return longitude;
  }
  const adjusted = longitude + 180;
  if (adjusted > 0) {
    return (adjusted % 360) - 180;
  }
  // else
  return 180 - (-adjusted % 360);
}

/**
 * Calculates the number of degrees a given distance is at a given latitude.
 *
 * @param {number} distance The distance to convert.
 * @param {number} latitude The latitude at which to calculate.
 * @return {number} The number of degrees the distance corresponds to.
 */
function metersToLongitudeDegrees(distance: number, latitude: number) {
  const EARTH_EQ_RADIUS = 6378137.0;
  // this is a super, fancy magic number that the GeoFire lib can explain (maybe)
  const E2 = 0.00669447819799;
  const EPSILON = 1e-12;
  const radians = degreesToRadians(latitude);
  const num = (Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI) / 180;
  const denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
  const deltaDeg = num * denom;
  if (deltaDeg < EPSILON) {
    return distance > 0 ? 360 : 0;
  }
  // else
  return Math.min(360, distance / deltaDeg);
}

/**
 * Calculates the SW and NE corners of a bounding box around a center point for a given radius;
 *
 * @param {Object} center The center given as .latitude and .longitude
 * @param {number} radius The radius of the box (in kilometers)
 * @return {Object} The SW and NE corners given as .swCorner and .neCorner
 */
function boundingBoxCoordinates(center: GeoPoint, radius: number) {
  const KM_PER_DEGREE_LATITUDE = 110.574;
  const latDegrees = radius / KM_PER_DEGREE_LATITUDE;
  const latitudeNorth = Math.min(90, center.latitude + latDegrees);
  const latitudeSouth = Math.max(-90, center.latitude - latDegrees);
  // calculate longitude based on current latitude
  const longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
  const longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
  const longDegs = Math.max(longDegsNorth, longDegsSouth);
  return {
    swCorner: {
      // bottom-left (SW corner)
      latitude: latitudeSouth,
      longitude: wrapLongitude(center.longitude - longDegs)
    },
    neCorner: {
      // top-right (NE corner)
      latitude: latitudeNorth,
      longitude: wrapLongitude(center.longitude + longDegs)
    }
  };
}

/**
 * Calculates the distance, in kilometers, between two locations, via the
 * Haversine formula. Note that this is approximate due to the fact that
 * the Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param {Object} location1 The first location given as .latitude and .longitude
 * @param {Object} location2 The second location given as .latitude and .longitude
 * @return {number} The distance, in kilometers, between the inputted locations.
 */
export function distance(location1: GeoPoint, location2: GeoPoint) {
  const radius = 6371; // Earth's radius in kilometers
  const latDelta = degreesToRadians(location2.latitude - location1.latitude);
  const lonDelta = degreesToRadians(location2.longitude - location1.longitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(degreesToRadians(location1.latitude)) *
      Math.cos(degreesToRadians(location2.latitude)) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}

interface Area {
  center: GeoPoint;
  radius: number;
}
/**
 * Get locations within a bounding box defined by a center point and distance from from the center point to the side of the box;
 *
 * @param {Object} area an object that represents the bounding box
 *    around a point in which locations should be retrieved
 * @param {Object} area.center an object containing the latitude and
 *    longitude of the center point of the bounding box
 * @param {number} area.center.latitude the latitude of the center point
 * @param {number} area.center.longitude the longitude of the center point
 * @param {number} area.radius (in kilometers) the radius of a circle
 *    that is inscribed in the bounding box;
 *    This could also be described as half of the bounding box's side length.
 * @return {Promise} a Promise that fulfills with an array of all the
 *    retrieved locations
 */
export function getLocations(area: Area, collection: string): Promise<any> {
  // calculate the SW and NE corners of the bounding box to query for
  const box = boundingBoxCoordinates(area.center, area.radius);

  // construct the GeoPoints
  const lesserGeopoint = new firebase.firestore.GeoPoint(
    box.swCorner.latitude,
    box.swCorner.longitude
  );
  const greaterGeopoint = new firebase.firestore.GeoPoint(
    box.neCorner.latitude,
    box.neCorner.longitude
  );

  // construct the Firestore query
  let query = firebase
    .firestore()
    .collection(collection)
    .where('geoPoint', '>', lesserGeopoint)
    .where('geoPoint', '<', greaterGeopoint);

  // return a Promise that fulfills with the locations
  return query
    .get()
    .then(snapshot => {
      const allLocs: Array<any> = []; // used to hold all the loc data
      snapshot.forEach(loc => {
        // get the data
        const data = loc.data();
        // calculate a distance from the center
        data.distanceFromCenter = distance(area.center, data.geoPoint);
        const geoPoint = JSON.parse(JSON.stringify(data.geoPoint));
        data.geoPoint = { latitude: geoPoint._lat, longitude: geoPoint._long };
        data.docId = loc.id;
        // add to the array
        allLocs.push(data);
      });

      // console.log(`[FIRESTORE] -- GET COLLECTION "${collection}" --`, allLocs);
      const readCount = firebase.database().ref('read');
      readCount.transaction(currentValue => (currentValue || 0) + 1);
      
      return allLocs;
    })
    .catch(err => {
      console.log(err);
      return new Error('Error while retrieving events');
    });
}
