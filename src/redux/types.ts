import { Location } from 'expo';
import firebase from 'firebase';
import 'firebase/firestore';
// import { ThunkAction as Thunk } from 'redux-thunk';
import { State as AppState } from './modules/app';
import { State as UserState } from './modules/user';
import { State as GPSState } from './modules/gps';
import { State as PostState } from './modules/post';
import { State as CafeState } from './modules/cafe';
import { State as RoomState } from './modules/room';

export type Timestamp = firebase.firestore.Timestamp;
export type FieldValue = firebase.firestore.FieldValue;
export type Time =
  | { seconds: number; nanoseconds: number }
  | Timestamp
  | FieldValue
  | any;

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface PostOption {
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  filterValue?: string;
  limit: number;
}

// Collection: users
export interface User {
  uid: string; // login user
  docId?: string; //
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isConnected: boolean;
  lastAccessTime?: Timestamp;
  geoPoint?: GeoPoint;

  // favorite cafe info
  cafeId?: string;
  cafeName?: string;
  cafeCity?: string;
  cafeCountryCode?: string;

  // local
  favoriteCafe?: Cafe;
}

// Collection: cafes
export interface Cafe {
  docId?: string;
  id: string;
  name: string;
  phoneNumber: string;
  city: string;
  countryCode: string;
  addressLines: string[];
  geoPoint: GeoPoint;
  photoURL?: string;
}

// Collection: posts
export interface Post {
  docId?: string;
  // user
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string;

  // cafe
  cafeId: string;
  cafeName: string;
  cafeGeoPoint: GeoPoint;
  city: string;
  countryCode: string;

  // post
  columns: string;
  images?: [{ id: string; url: string; ref: string }];

  // timestamp
  createdAt: Time;
  updatedAt?: Time;
}

interface RoomUser {
  displayName: string;
  email: string;
  photoURL: string;
  cafeId: string;
  cafeName: string;
}

// Collection rooms
export interface Room {
  docId?: string;
  fId: string; // first Coffee?
  tId: string;
  from: RoomUser; // user info
  to: RoomUser; // user info

  lastMessage: {
    uid: string;
    content: string;
  };

  fromConnected?: boolean;
  toConnected?: boolean;

  fromNoCheckMessageCount: number;
  toNoCheckMessageCount: number;

  createdAt: Time;
  updatedAt: Time;
}

// Collection rooms > room > messages
export interface Message {
  _id: string; // userId
  text: string;
  createdAt: Time;
  user: {
    _id: string;
    name?: string;
    avatar?: string;
  };
  image?: string;
}
export interface System {
  _id: string;
  text: string;
  createdAt: Time;
  system: true;
}

// gps
export type Location = Location.LocationData;
// {
//   coords: {
//     accuracy: number;
//     altitude: number;
//     altitudeAccuracy: number;
//     heading: number;
//     latitude: number;
//     longitude: number;
//     speed: number;
//   };
//   timestamp: number;
// };

// ACTION TYPES
//-------------------------------------------------------------------- user
export interface LOGGED_IN {
  type: 'LOGGED_IN';
  user: User;
}

export interface UPDATE_USER_CONNECTED {
  type: 'UPDATE_USER_CONNECTED';
  isConnected: boolean;
}

export interface UPDATE_USER_GEO_POINT {
  type: 'UPDATE_USER_GEO_POINT';
  geoPoint: GeoPoint;
}

export interface UPDATE_USER_FAVORITE_CAFE {
  type: 'UPDATE_USER_FAVORITE_CAFE';
  cafe: Cafe;
}
//-------------------------------------------------------------------- gps
export interface SET_GPS {
  type: 'SET_GPS';
  location: Location;
}
//-------------------------------------------------------------------- post
export interface CREATE_POST {
  type: 'CREATE_POST';
  post: Post;
}
export interface SET_POSTS {
  type: 'SET_POSTS';
  posts: [Post];
}
export interface CHANGE_POSTS_FILTER {
  type: 'CHANGE_POSTS_FILTER';
  filter: string;
}
//-------------------------------------------------------------------- cafe
export interface SELECT_CAFE {
  type: 'SELECT_CAFE';
  cafe: Cafe;
}
//-------------------------------------------------------------------- room
export interface SET_ROOMS {
  type: 'SET_ROOMS';
  rooms: Room[];
}
export interface CREATE_ROOM {
  type: 'CREATE_ROOM';
  room: Room;
}

export type Action =
  | { type: 'LOADING' }
  | { type: 'LOADED' }
  | LOGGED_IN
  | { type: 'LOGGED_OUT' }
  | UPDATE_USER_CONNECTED
  | UPDATE_USER_GEO_POINT
  | UPDATE_USER_FAVORITE_CAFE
  | SET_GPS
  | CREATE_POST
  | SET_POSTS
  | CHANGE_POSTS_FILTER
  | { type: 'RESET_CAFE' }
  | SELECT_CAFE
  | SET_ROOMS
  | CREATE_ROOM;

export interface Store {
  app: AppState;
  user: UserState;
  gps: GPSState;
  post: PostState;
  cafe: CafeState;
  room: RoomState;
}
export type PromiseAction = Promise<Action>;
// export type ThunkAction = Thunk;
export type Dispatch = (
  action: Action | any | PromiseAction | Array<Action>,
  getState: any
) => any;
