import firebase from 'firebase';
import 'firebase/firestore';
import { Action, Post, Dispatch, PostOption } from '../../types';
import { uploadImageAsPromise } from '../../../lib/utils';

// action_creators

const _createPost = (post: Post): Action => ({ type: 'CREATE_POST', post });

const _setPosts = (posts: [Post]): Action => ({ type: 'SET_POSTS', posts });

export const _changePostsFilter = (filter: 'cafeId' | 'city' | 'countryCode' | 'all') => ({
  type: 'CHANGE_POSTS_FILTER',
  filter
});

// utils

// actions

export function createPost(columns: string, image?: any): Dispatch {
  return async (dispatch, getState) => {
    dispatch({ type: 'LOADING' });
    const {
      uid,
      email,
      displayName,
      photoURL,
      favoriteCafe,
      cafeId
    } = getState().user;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const post: Post = {
      // user
      uid,
      displayName,
      email,
      photoURL,
      // cafe
      cafeId,
      cafeName: favoriteCafe.name,
      cafeGeoPoint: new firebase.firestore.GeoPoint(
        favoriteCafe.geoPoint.latitude,
        favoriteCafe.geoPoint.longitude
      ),
      city: favoriteCafe.city,
      countryCode: favoriteCafe.countryCode,
      // post
      columns,
      // time
      createdAt: timestamp
    };

    const postDocRef = firebase
      .firestore()
      .collection('posts')
      .doc();

    if (image) {
      console.log(image);
      const path = `images/posts/${postDocRef.id}`;
      const uploadedImage = await uploadImageAsPromise(image, path);
      console.log(uploadedImage);
      if (uploadedImage) post.images = [uploadedImage];
    }

    postDocRef
      .set(post)
      .then(() => {
        const currentTime = new Date();
        const createdAt = firebase.firestore.Timestamp.fromDate(currentTime);
        dispatch(_createPost({ ...post, createdAt, docId: postDocRef.id }));
        dispatch({ type: 'LOADED' });

        console.log('[FIRESTORE] -- SET DOCUMENT "posts" --', {
          ...post,
          createdAt,
          docId: postDocRef.id
        });
        const writeCount = firebase.database().ref('write');
        writeCount.transaction(currentValue => (currentValue || 0) + 1);
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: 'LOADED' });
      });
  };
}

function getPosts(options: PostOption) {
  const postCollectionRef = firebase.firestore().collection('posts');
  const { filter, filterValue, limit } = options;

  let query;
  if (filter !== 'all') {
    query = postCollectionRef.where(filter, '==', filterValue);
  } else {
    query = postCollectionRef;
  }
  const currentTime = new Date();
  query = query.orderBy('createdAt', 'desc').startAt(currentTime);

  return query
    .limit(limit)
    .get()
    .then(documentSnapshots => {
      const posts: any = [];
      documentSnapshots.forEach(doc => {
        const docData = doc.data();
        posts.push({ ...docData, docId: doc.id });
      });

      console.log('[FIRESTORE] -- GET COLLECTION "posts" --', posts);
      const readCount = firebase.database().ref('read');
      readCount.transaction(currentValue => (currentValue || 0) + 1);

      return posts;
    })
    .catch(error => {
      console.log(error);
      throw new Error('firebase Error');
    });
}

export function setPosts(limit: number = 30): Dispatch {
  return async (dispatch, getState) => {
    const {
      post: { filter },
      user: { cafeId, cafeCity, cafeCountryCode }
    } = getState();

    let filterValue;
    if (filter === 'cafeId') filterValue = cafeId;
    if (filter === 'city') filterValue = cafeCity;
    if (filter === 'countryCode') filterValue = cafeCountryCode;
    console.log('SET POST:: ', filter, filterValue);

    const posts = await getPosts({ filter, filterValue, limit });
    dispatch(_setPosts(posts));
  };
}
