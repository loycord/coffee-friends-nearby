import firebase, { firestore } from 'firebase';
import 'firebase/firestore';
import { Dispatch, Room, User } from '../../types';

export const _setRooms = (rooms: Room[]) => ({ type: 'SET_ROOMS', rooms });
export const _createRoom = (room: Room) => ({ type: 'CREATE_ROOM', room });

/**
 *
 * @param opponent 상대방 유저 정보
 */
export function createRoom(opponent: User): Dispatch {
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
    dispatch({ type: 'LOADING' });
    const { currentUser } = firebase.auth();
    if (currentUser) {
      const roomDocRef = firebase.firestore().collection('rooms');
      const queryFrom = roomDocRef
        .where('fId', '==', currentUser.uid)
        .orderBy('updatedAt', 'desc');

      queryFrom.onSnapshot(querySnapshots => {
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

      const queryTo = roomDocRef
        .where('tId', '==', currentUser.uid)
        .orderBy('updatedAt', 'desc');

      queryTo.onSnapshot(querySnapshots => {
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
    }
  };
}
