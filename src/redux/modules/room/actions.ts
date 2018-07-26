import firebase from 'firebase';
import 'firebase/firestore';
import { Dispatch, Room, User } from '../../types';

export const _setRooms = (rooms: Room[]) => ({ type: 'SET_ROOMS', rooms });
export const _createRoom = (room: Room) => ({ type: 'CREATE_ROOM', room });
export const _setUnsubscribeRoom = (from: any, to: any) => ({
  type: 'SET_UNSUBSCRIBE',
  unsubscribeFrom: from,
  unsubscribeTo: to
});

/**
 *
 * @param {Object} opponent 상대방 유저 정보
 */
export function createRoom(
  opponent: User,
  callback?: (room: Room) => void
): Dispatch {
  return async (dispatch, getState) => {
    dispatch({ type: 'LOADING' });
    const roomDocRef = firebase
      .firestore()
      .collection('rooms')
      .doc();

    // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    function roomUserInfo(user: any) {
      return {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        cafeId: user.cafeId,
        cafeName: user.cafeName
      };
    }
    const { user } = getState();

    const { rooms } = getState().room;
    const alreadyRoom = rooms.find(
      (room: Room) =>
        (room.fId === user.uid || room.fId === opponent.docId) &&
        (room.tId === user.uid || room.tId === opponent.docId)
    );
    if (alreadyRoom) {
      if (callback) {
        callback(alreadyRoom);
      }
      dispatch({ type: 'LOADED' });
      return;
    }

    if (opponent.docId) {
      const room: Room = {
        fId: user.uid,
        tId: opponent.docId,
        from: roomUserInfo(user),
        to: roomUserInfo(opponent),

        lastMessage: {
          uid: user.uid,
          content: 'coffee?'
        },

        fromNoCheckMessageCount: 0,
        toNoCheckMessageCount: 1,

        createdAt: new Date(),
        updatedAt: new Date()
      };

      roomDocRef
        .set(room)
        .then(() => {
          const messageDocRef = firebase
            .firestore()
            .collection('rooms')
            .doc(roomDocRef.id)
            .collection('messages')
            .doc();

          const firstMessage = {
            _id: messageDocRef.id,
            text: 'Coffee?',
            createdAt: new Date(),
            user: {
              _id: user.uid,
              name: user.displayName,
              avatar: user.photoURL
            }
          };

          messageDocRef
            .set(firstMessage)
            .then(() => {
              console.log('[FIRESTORE] -- SET DOCUMENT "room" --');
              const writeCount = firebase.database().ref('write');
              writeCount.transaction(currentValue => (currentValue || 0) + 1);
              dispatch(_createRoom({ ...room, docId: roomDocRef.id }));
              dispatch({ type: 'LOADED' });
              if (callback) {
                callback({ ...room, docId: roomDocRef.id });
              }
            })
            .catch(error => {
              console.log(error);
              dispatch({ type: 'LOADED' });
            });
        })
        .catch(error => {
          console.log(error);
          dispatch({ type: 'LOADED' });
        });
    } else {
      throw new Error('Not found myInfo.docId or user.docId');
    }
  };
}

export function getRooms(): Dispatch {
  return dispatch => {
    // dispatch({ type: 'LOADING' });
    const { currentUser } = firebase.auth();
    if (currentUser) {
      const roomCollectionRef = firebase.firestore().collection('rooms');
      const queryFrom = roomCollectionRef
        .where('fId', '==', currentUser.uid)
        .orderBy('updatedAt', 'desc');

      const unsubscribeRoomFrom = queryFrom.onSnapshot(querySnapshots => {
        const rooms: any = [];
        querySnapshots.forEach(doc => {
          const docData = doc.data();
          rooms.push({ ...docData, docId: doc.id });
        });

        console.log('[FIRESTORE] -- GET COLLECTION "rooms" -- FROM', rooms);
        const readCount = firebase.database().ref('read');
        readCount.transaction(currentValue => (currentValue || 0) + 1);

        dispatch(_setRooms(rooms));
      });

      const queryTo = roomCollectionRef
        .where('tId', '==', currentUser.uid)
        .orderBy('updatedAt', 'desc');

      const unsubscribeRoomTo = queryTo.onSnapshot(querySnapshots => {
        const rooms: any = [];
        querySnapshots.forEach(doc => {
          const docData = doc.data();
          rooms.push({ ...docData, docId: doc.id });
        });

        console.log('[FIRESTORE] -- GET COLLECTION "users" -- TO', rooms);
        const readCount = firebase.database().ref('read');
        readCount.transaction(currentValue => (currentValue || 0) + 1);

        dispatch(_setRooms(rooms));
      });

      dispatch(_setUnsubscribeRoom(unsubscribeRoomFrom, unsubscribeRoomTo));
    }
  };
}
