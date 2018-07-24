import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { Button } from 'react-native';
import styled from 'styled-components/native';
import { Dispatch } from '../../redux/types';
import { createUniqueId } from '../../lib/utils';
// import cafes from './face.json';
// const cafes = require('./cafeData.json');
const fakeUsers = require('./fake_user.json');

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
  targetCafe: any;
}

class Test extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.navigateCafe = this.navigateCafe.bind(this);
    this.navigateCreatePost = this.navigateCreatePost.bind(this);

    this.state = {
      targetCafe: {
        id: '15435',
        name: 'Willow & Hamilton - Menlo Park',
        phoneNumber: '650-328-7160',
        city: 'Menlo Park',
        countryCode: 'US',
        addressLines: ['1401 Willow', 'Menlo Park, CA 94025'],
        geoPoint: {
          latitude: 37.480189,
          longitude: -122.151126
        }
      }
    };
  }

  componentDidMount() {
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
    const userCollectionRef = firebase.firestore().collection('users');
    // const dumi = Array(100).fill(null);

    function randomGeoPoint() {
      let lat = 37.5075307;
      let long = 127.0574271;

      lat += Math.random() / 100;
      long += Math.random() / 100;

      const newGeoPoint = new firebase.firestore.GeoPoint(lat, long);
      return newGeoPoint;
    }

    fakeUsers.forEach((user: any, index: number) => {
      console.log(
        `[FIRESTORE] -- WRITE COLLECTION "users" -- ${user.displayName}`
      );
      const writeCount = firebase.database().ref('write');
      writeCount.transaction(currentValue => (currentValue || 0) + 1);
      userCollectionRef.add({
        displayName: user.displayName,
        email: `${user.displayName}@gmail.com`,
        facebookId: '125409123091283',
        cafeId: 'KR_1038',
        cafeName: '포스코사거리',
        cafeCity: '서울',
        cafeCountryCode: 'KR',
        geoPoint: randomGeoPoint(),
        isConnected: index % 3 === 0,
        lastAccessTime: new Date(new Date().getTime() + index * 100000),
        photoURL: user.photoURL,
        // photoURL: 'https://graph.facebook.com/1734522349998601/picture',
        providerId: 'facebook.com'
      });
    });
  }

  async handleFakeAddPost(user: any, columns: string, image?: any, createdAt?: Date) {
    // new Date(year, month, day, hours, minutes, seconds, milliseconds)
    const timestamp = createdAt;

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
