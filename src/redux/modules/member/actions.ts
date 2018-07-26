import firebase from 'firebase';
import 'firebase/firestore';
import { Dispatch, Action, User, MemberOption } from '../../types';
import { getGPS, distance } from '../gps';

// action_creators

const _setMembers = (members: User[]): Action => ({
  type: 'SET_MEMBERS',
  members
});

export const _changeMembersFilter = (
  filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all'
) => ({
  type: 'CHANGE_MEMBERS_FILTER',
  filter
});

// utils
async function getMembers(options: MemberOption) {
  const userCollectionRef = firebase.firestore().collection('users');
  const { filter, filterValue, limit, orderBy } = options;

  let query;
  if (filter !== 'all') {
    query = userCollectionRef.where(filter, '==', filterValue);
  } else {
    query = userCollectionRef;
  }

  let location: any;
  location = await getGPS();

  if (orderBy === 'geoPoint') {
    if (location) {
      const { latitude, longitude } = location.coords;
      const geoPoint = new firebase.firestore.GeoPoint(latitude, longitude);
      query = query.orderBy(orderBy, 'asc').startAt(geoPoint);
    } else {
      throw new Error('Get Members GPS ERROR');
    }
  } else if (orderBy === 'lastAccessTime') {
    const currentTime = new Date();
    query = query.orderBy(orderBy, 'desc').startAt(currentTime);
  }

  return query
    .limit(limit)
    .get()
    .then(documentSnapshots => {
      let members: any = [];
      documentSnapshots.forEach(doc => {
        const docData = doc.data();
        const geoPoint = {
          latitude: docData.geoPoint._lat,
          longitude: docData.geoPoint._long
        };

        // add distance
        if (location) {
          docData.distance = Math.floor(
            distance(
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              },
              geoPoint
            ) * 0.621371
          );
        }

        members.push({ ...docData, docId: doc.id });
      });

      console.log('[FIRESTORE] -- GET COLLECTION "users" --', members);
      const readCount = firebase.database().ref('read');
      readCount.transaction(currentValue => (currentValue || 0) + 1);

      // Delete My Info
      const { currentUser } = firebase.auth();
      if (currentUser) {
        const deleteIndex = members.findIndex(
          (member: any) => member.uid === currentUser.uid
        );
        members.splice(deleteIndex, 1);
      }

      if (orderBy === 'geoPoint') {
        members.sort((a: any, b: any) => (a.distance - b.distance));
      }

      return members;
    })
    .catch(error => {
      console.log(error);
      throw new Error('firebase Error');
    });
}

export function setMembers(
  limit: number = 30,
  orderBy: 'lastAccessTime' | 'geoPoint' = 'lastAccessTime'
): Dispatch {
  return async (dispatch, getState) => {
    const {
      member: { filter },
      user: { cafeId, cafeCity, cafeCountryCode }
    } = getState();

    let filterValue;
    if (filter === 'cafeId') filterValue = cafeId;
    if (filter === 'cafeCity') filterValue = cafeCity;
    if (filter === 'cafeCountryCode') filterValue = cafeCountryCode;

    const posts = await getMembers({ filter, filterValue, limit, orderBy });
    dispatch(_setMembers(posts));
  };
}
