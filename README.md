# FIRESTORE DB - COLLECTION

## users

유저

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

  // local
  favoriteCafe?: Cafe;
}
```

---

## cafes

까페

```javascript
// Document 0.1.0
export interface Cafe {
  docId?: string;
  id: string; // starbucks API id
  name: string;
  phoneNumber: string;
  city: string;
  countryCode: string;
  addressLines: string[];
  geoPoint: GeoPoint;
}
```

---

## posts

게시물

```javascript
// Document 0.1.0
export interface Post {
  docId?: string;
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
