import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { Button } from 'react-native';
import styled from 'styled-components/native';
import { Dispatch } from '../../redux/types';
import { createUniqueId } from '../../lib/utils';
// import cafes from './face.json';
// const cafes = require('./cafeData.json');
const fakeUsers = require('./fake_user2.json');

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text`
  font-size: 16px;
`;

interface Props {
  logoutWithFirebase: () => Dispatch;
  updateUserConnected: (isConnected: boolean) => Dispatch;
  navigation: any;
}

interface State {
  targetUser: any;
  targetCafe: any;
}

class Test extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.navigateCafe = this.navigateCafe.bind(this);
    this.navigateCreatePost = this.navigateCreatePost.bind(this);
    this.handleFakeAddPost = this.handleFakeAddPost.bind(this);

    this.state = {
      targetUser: {
        cafeName: 'Gangnam',
        cafeCity: '서울',
        email: 'ssindowls@hanmail.net',
        facebookId: '1999530763412659',
        photoURL: 'https://graph.facebook.com/1999530763412659/picture',
        geoPoint: {
          _latitude: 37.50567019899401,
          _longitude: 127.05887815615883
        },
        providerId: 'facebook.com',
        isConnected: false,
        displayName: 'Yejin Shin',
        lastAccessTime: '2018-07-24T10:29:20.465Z',
        cafeId: 'KR_1258',
        cafeCountryCode: 'KR',
        uid: '0bz92oKd5ySIepBNfaGqagBD9Gp2',
        id: '0bz92oKd5ySIepBNfaGqagBD9Gp2'
      },
      targetCafe: {
        addressLines: [
          '390, Gangnam-daero, Gangnam-gu, Seoul, Republic of Korea'
        ],
        phoneNumber: '02-561-3478',
        countryCode: 'KR',
        city: '서울',
        name: 'Gangnam',
        id: 'KR_1258',
        photoURL:
          'http://www.istarbucks.co.kr/upload/store/2017/08/[3478]_20170822020135_a2lao.png',
        geoPoint: {
          _latitude: 37.497711,
          _longitude: 127.028439
        }
      }
    };
  }

  componentDidMount() {
    // this.handleFakeAddUser();
    const createdAt = new Date(2018, 6, 24, 19, 17);
    // this.handleFakeAddPost(
    //   '20대 직장인 언니들 같이 수다 떨면서 커피 마셔요^^',
    //   createdAt,
    //   'https://firebasestorage.googleapis.com/v0/b/coffee-friends-nearby.appspot.com/o/images%2F6-5.jpg?alt=media&token=2999d66d-154d-4be6-8cfd-d6ce03381ed9'
    // );
    console.log(this.props);
    // this.handleAddCafe();
    const testImg = require('../../common/img/photo.jpeg');
    console.log(testImg);
  }

  navigateCafe() {
    this.props.navigation.navigate('Cafe', { cafeId: 'US_15435' });
  }

  navigateCreatePost() {
    this.props.navigation.navigate('CreatePost');
  }

  handleAddCafe() {
    // cafes.forEach((cafe: any) => {
    //   const cafesDocRef = firebase
    //     .firestore()
    //     .collection('cafes')
    //     .doc(`${cafe.countryCode}_${cafe.id}`);
    //   const { latitude, longitude } = cafe.geoPoint;
    //   const geoPoint = new firebase.firestore.GeoPoint(latitude, longitude);
    //   cafesDocRef.set({
    //     ...cafe,
    //     geoPoint
    //   });
    // });
  }

  handleFakeAddUser() {
    // const dumi = Array(100).fill(null);

    function randomGeoPoint() {
      let lat = 37.480189;
      let long = -122.151126;

      // WEWORK
      // let lat = 37.5075307;
      // let long = 127.0574271;

      lat += Math.random() / 10;
      long += Math.random() / 10;

      const newGeoPoint = new firebase.firestore.GeoPoint(lat, long);
      return newGeoPoint;
    }

    // fakeUsers.forEach((user: any, index: number) => {
    const user = {
      displayName: 'Miranda Hollister',
      photoURL:
        'https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User10.jpeg?alt=media&token=f91bb950-3c73-4e64-b3cd-e1491490bea3',
      email: 'Miranda Hollister@gmail.com'
    };
    console.log(
      `[FIRESTORE] -- WRITE COLLECTION "users" -- ${user.displayName}`
    );
    const writeCount = firebase.database().ref('write');
    writeCount.transaction(currentValue => (currentValue || 0) + 1);
    const userDocRef = firebase
      .firestore()
      .collection('users')
      .doc();

    userDocRef.set({
      displayName: user.displayName,
      email: `${user.displayName}@gmail.com`,
      facebookId: '125409123091283',
      cafeId: this.state.targetCafe.id,
      cafeName: this.state.targetCafe.name,
      cafeCity: this.state.targetCafe.city,
      cafeCountryCode: this.state.targetCafe.countryCode,
      geoPoint: randomGeoPoint(),
      isConnected: false,
      lastAccessTime: new Date(
        new Date().getTime() + (1 * 10000 + Math.random() * 10000)
      ),
      photoURL: user.photoURL,
      providerId: 'facebook.com',
      uid: userDocRef.id
    });
    // });
  }

  handleFakeAddPost(columns: string, createdAt?: Date, image?: any) {
    // new Date(year, month, day, hours, minutes, seconds, milliseconds)
    const timestamp = createdAt;

    const user = this.state.targetUser;
    const { id, name, geoPoint, city, countryCode } = this.state.targetCafe;

    const post: any = {
      // user
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      // cafe
      cafeId: id,
      cafeName: name,
      cafeGeoPoint: geoPoint,
      city: city,
      countryCode: countryCode,
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
      post.images = [
        {
          id: createUniqueId(),
          url: image
        }
      ];
    }

    postDocRef
      .set(post)
      .then(() => {
        const currentTime = new Date();
        const createdAt = firebase.firestore.Timestamp.fromDate(currentTime);

        // console.log('[FIRESTORE] -- SET DOCUMENT "posts" --', {
        //   ...post,
        //   createdAt,
        //   docId: postDocRef.id
        // });
        const writeCount = firebase.database().ref('write');
        writeCount.transaction(currentValue => (currentValue || 0) + 1);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleLogout() {
    this.props.logoutWithFirebase();
    this.props.updateUserConnected(false);
  }

  render() {
    return (
      <Container>
        <Title>Test</Title>
        <Button onPress={this.handleLogout} title="logout" />
        <Button onPress={this.navigateCafe} title="Cafe" />
        <Button onPress={this.navigateCreatePost} title="CreatePost" />
      </Container>
    );
  }
}

export default Test;
