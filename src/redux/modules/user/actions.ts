import Expo from 'expo';
import firebase from 'firebase';
import 'firebase/firestore';
import { Dispatch, User, Action, GeoPoint, Cafe, Location } from '../../types';
import { _setGPS } from '../gps';

const FACEBOOK_APP_ID = '2078503639065383';

// action creators
const _login = (user: User): Action => ({ type: 'LOGGED_IN', user });

const _logout = (): Action => ({ type: 'LOGGED_OUT' });

const _updateUserConnected = (isConnected: boolean): Action => ({
  type: 'UPDATE_USER_CONNECTED',
  isConnected
});

export const _updateUserGeoPoint = (geoPoint: GeoPoint): Action => ({
  type: 'UPDATE_USER_GEO_POINT',
  geoPoint
});

const _updateUserFavoriteCafe = (cafe: Cafe): Action => ({
  type: 'UPDATE_USER_FAVORITE_CAFE',
  cafe
});

// utils
const getUserInfo = (user: any): User => {
  const { uid, displayName, photoURL, email, providerData } = user;
  let providerInfo = providerData[0];
  providerInfo = { ...providerInfo, facebookId: providerInfo.uid };
  delete providerInfo.uid;
  const data = {
    uid,
    displayName,
    photoURL,
    email,
    isConnected: true,
    ...providerInfo
  };

  const userInfo: any = Object.keys(data).reduce((result, name) => {
    if (data[name] !== null) {
      return { ...result, [name]: data[name] };
    }
    return result;
  }, {});

  return userInfo;
};

const getUserDocRef = (uid: string) =>
  firebase
    .firestore()
    .collection('users')
    .doc(uid);

export const updateUserDoc = (data: {}): Promise<any> =>
  new Promise((res, rej) => {
    const { currentUser } = firebase.auth();
    if (currentUser) {
      const userDocRef = getUserDocRef(currentUser.uid);
      return userDocRef
        .update(data)
        .then(() => {
          console.log('[FIRESTORE] -- UPDATE DOCUMENT "users" --', data);
          const writeCount = firebase.database().ref('write');
          writeCount.transaction(currentValue => (currentValue || 0) + 1);
          res({ type: 'success', data });
        })
        .catch(error => {
          rej({ type: 'cancel', error });
        });
    } else {
      console.log('Update User cancel');
    }
  });

const setInitialUser = (user: User) =>
  new Promise(async (resolve, reject) => {
    const usersDocRef = getUserDocRef(user.uid);
    const userDoc = await usersDocRef.get();
    console.log('[FIRESTORE] -- GET DOCUMENT "users" --', userDoc.data());
    const readCount = firebase.database().ref('read');
    readCount.transaction(currentValue => (currentValue || 0) + 1);
    const userData = userDoc.data();
    if (userDoc.exists && userData && userData.cafeId) {
      const favoriteCafe = await getMyCafeInfo(userData.cafeId);
      resolve({ ...userData, favoriteCafe });
    } else {
      usersDocRef
        .set({
          ...user,
          isConnected: true,
          lastAccessTime: new Date()
        })
        .then(() => {
          resolve(user);

          console.log('[FIRESTORE] -- SET COLLECTION "users" --', user);
          const writeCount = firebase.database().ref('write');
          writeCount.transaction(currentValue => (currentValue || 0) + 1);
        })
        .catch(error => {
          console.log(error);
          reject(null);
        });
    }
  });

// actions
export function updateUserGeoPoint(geoPoint: GeoPoint): Dispatch {
  return async dispatch => {
    dispatch({ type: 'LOADING' });
    const { type, error } = await updateUserDoc(geoPoint);
    if (type === 'success') {
      dispatch(_updateUserGeoPoint(geoPoint));
    } else {
      console.log(error);
    }
    dispatch({ type: 'LOADED' });
  };
}

// If the user is logged in, update that user's Connected.
export function updateUserConnected(isConnected: boolean): Dispatch {
  return async dispatch => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const { type, error } = await updateUserDoc({
      isConnected,
      lastAccessTime: timestamp
    });
    if (type === 'success') {
      dispatch(_updateUserConnected(isConnected));
    } else {
      console.log(error);
    }
  };
}

export function updateUserFavoriteCafe(cafe: Cafe): Dispatch {
  return async dispatch => {
    dispatch({ type: 'LOADING' });
    const { type, error } = await updateUserDoc({
      cafeId: cafe.docId,
      cafeName: cafe.name,
      cafeCity: cafe.city,
      cafeCountryCode: cafe.countryCode
    });
    if (type === 'success') {
      dispatch(_updateUserFavoriteCafe(cafe));
    } else {
      console.log(error);
    }
    dispatch({ type: 'LOADED' });
  };
}

async function getMyCafeInfo(cafeId: string) {
  const cafeDocRef = firebase
    .firestore()
    .collection('cafes')
    .doc(cafeId);

  const cafeDoc = await cafeDocRef.get();
  console.log('[FIRESTORE] -- GET DOCUMENT "cafes" --', cafeDoc.data());
  const readCount = firebase.database().ref('read');
  readCount.transaction(currentValue => (currentValue || 0) + 1);

  const favoriteCafe: any = cafeDoc.data();

  if (favoriteCafe) {
    favoriteCafe.docId = cafeDoc.id;
    favoriteCafe.geoPoint = {
      latitude: favoriteCafe.geoPoint._lat,
      longitude: favoriteCafe.geoPoint._long
    };
  }

  return favoriteCafe;
}

export function checkOnAuth(location?: Location): Dispatch {
  return (dispatch, getState) => {
    dispatch({ type: 'LOADING' });
    let { favoriteCafe } = getState().user;
    const { cafeId } = getState().user;
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          if (!favoriteCafe && cafeId) {
            favoriteCafe = await getMyCafeInfo(cafeId);
          }

          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          let updateInfo: {
            isConnected: boolean;
            lastAccessTime: any;
            geoPoint?: firebase.firestore.GeoPoint;
          } = { isConnected: true, lastAccessTime: timestamp };

          if (location) {
            const { latitude, longitude } = location.coords;
            const geoPoint = new firebase.firestore.GeoPoint(
              latitude,
              longitude
            );
            updateInfo.geoPoint = geoPoint;
            dispatch(_setGPS(location));
            dispatch(_updateUserGeoPoint(geoPoint));
          }
          const { type } = await updateUserDoc(updateInfo);
          if (type === 'success') {
            dispatch(_updateUserConnected(true));
            const userInfo = getUserInfo(user);
            if (favoriteCafe) {
              userInfo.favoriteCafe = favoriteCafe;
            }
            dispatch(_login(userInfo));
            resolve(true);
            dispatch({ type: 'LOADED' });
          }
        } else {
          firebase
            .auth()
            .signOut()
            .then(() => {
              dispatch(_logout());
              resolve(true);
              dispatch({ type: 'LOADED' });
            })
            .catch(error => {
              console.log(error);
              dispatch({ type: 'LOADED' });
            });
        }
      });
    });
  };
}

export function loginWithFacebook(): Dispatch {
  return dispatch => {
    dispatch({ type: 'LOADING' });
    Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email' /*'user_birthday'*/],
      behavior: 'web'
    }).then((response: any) => {
      const { type, token } = response;
      if (type === 'success' && token !== undefined) {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);

        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(async userCredential => {
            const { additionalUserInfo, user } = userCredential;
            if (additionalUserInfo) {
              const { isNewUser, profile } = additionalUserInfo;
            }

            const userInfo = getUserInfo(user);
            const userDocData: any = await setInitialUser(userInfo);

            if (userDocData !== null) {
              dispatch(_login(userDocData));
              dispatch({ type: 'LOADED' });
            }
          })
          .catch(error => {
            console.log(error);
            dispatch({ type: 'LOADED' });
          });
      } else {
        dispatch({ type: 'LOADED' });
      }
    });
  };
}

export function logoutWithFirebase(): Dispatch {
  return (dispatch, getState) => {
    dispatch({ type: 'LOADING' });
    const {
      room: { unsubscribeFrom, unsubscribeTo }
    } = getState();
    unsubscribeFrom();
    unsubscribeTo();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(_logout());
        dispatch({ type: 'LOADED' });
      });
  };
}
