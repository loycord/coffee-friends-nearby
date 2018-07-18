import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { Button } from 'react-native';
import styled from 'styled-components/native';
import { Dispatch } from '../../redux/types';
// import cafes from './face.json';
const cafes = require('./cafeData.json');
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

class Test extends React.Component<Props> {
  constructor(props: any) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.navigateCafe = this.navigateCafe.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    // this.handleDumiAddUser();
    // this.handleDumiAddCafe();
  }

  navigateCafe() {
    this.props.navigation.navigate('Cafe', { cafeId: 'US_15435' });
  }

  handleDumiAddCafe() {
    cafes.forEach((cafe: any) => {
      const cafesDocRef = firebase
        .firestore()
        .collection('cafes')
        .doc(`${cafe.countryCode}_${cafe.id}`);
      const { latitude, longitude } = cafe.geoPoint;
      const geoPoint = new firebase.firestore.GeoPoint(latitude, longitude);
      cafesDocRef.set({
        ...cafe,
        geoPoint
      });
    });
  }

  handleDumiAddUser() {
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
      console.log(`[FIRESTORE] -- WRITE COLLECTION "users" -- ${user.displayName}`);
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

  handleLogout() {
    this.props.logoutWithFirebase();
    this.props.updateUserConnected(false);
  }

  render() {
    console.log(this.props);
    return (
      <Container>
        <Title>Test</Title>
        <Button onPress={this.handleLogout} title="logout" />
        <Button onPress={this.navigateCafe} title="Cafe" />
      </Container>
    );
  }
}

export default Test;
