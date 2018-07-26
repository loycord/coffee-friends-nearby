# FIRESTORE DB

## users

```javascript
// Document 0.1.0
export interface User {
  uid: string;
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
}
```

---

## cafes

```javascript
// Document 0.1.0
export interface Cafe {
  id: string; // starbucks API id
  name: string;
  phoneNumber: string;
  city: string;
  countryCode: string;
  addressLines: string[];
  geoPoint: GeoPoint;
  photoURL?: string;
}
```

---

## posts

```javascript
// Document 0.1.0
export interface Post {
  // user
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;

  // cafe
  cafeId: string;
  cafeName: string;
  cafeGeoPoint: GeoPoint;
  city: string;
  countryCode: string;

  // post
  columns: string;
  images?: [{ id: string, url: string, ref: string }];

  // timestamp
  createdAt: Time;
  updatedAt?: Time;
}
```

---

## rooms

```javascript
interface RoomUser {
  displayName: string;
  email: string;
  photoURL: string;
  cafeId: string;
  cafeName: string;
}
// Document 0.1.0
export interface Room {
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
```

---

## rooms > message

```javascript
// Document 0.1.0
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
```