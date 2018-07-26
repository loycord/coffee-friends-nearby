import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
import { StoreToProps } from '.';
import { distance, getGPS } from '../../redux/modules/gps';
// types
import { User } from '../../redux/types';

export interface State {
  data: User | null | any;
  isLoading: boolean;
}

class Container extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.navigateSelectCafeMap = this.navigateSelectCafeMap.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params && params.userId) {
      this.setState({ isLoading: true });
      const userDocRef = firebase
        .firestore()
        .collection('users')
        .doc(params.userId);
      userDocRef
        .get()
        .then(async doc => {
          const userData: any = doc.data();
          if (userData) {
            const geoPoint = {
              latitude: userData.geoPoint._lat,
              longitude: userData.geoPoint._long
            };
            userData.geoPoint = geoPoint;

            // add user distance
            const location = await getGPS();
            if (location) {
              userData.distance = Math.floor(
                distance(
                  {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                  },
                  geoPoint
                ) * 0.621371
              );
            }

            const reg = /facebook/;
            if (reg.test(userData.photoURL)) {
              userData.photoURL = `${
                userData.photoURL
              }?type=large&width=400&height=400`;
            }

            // console.log('[FIRESTORE] -- GET DOCUMENT "user" --', userData);
            const readCount = firebase.database().ref('read');
            readCount.transaction(currentValue => (currentValue || 0) + 1);

            this.setState({ data: userData, isLoading: false });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const userData = this.props.myProfile;
      const reg = /facebook/;
      if (reg.test(userData.photoURL)) {
        userData.photoURL = `${
          userData.photoURL
        }?type=large&width=400&height=400`;
      }
      this.setState({ data: userData });
    }
  }

  componentWillUpdate(props: StoreToProps, state: State) {
    if (
      props.myProfile !== null &&
      props.myProfile.cafeId !== this.props.myProfile.cafeId
    ) {
      const userData = props.myProfile;
      const reg = /facebook/;
      if (reg.test(userData.photoURL)) {
        userData.photoURL = `${
          userData.photoURL
        }?type=large&width=400&height=400`;
      }
      this.setState({ data: userData });
    }
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateSelectCafeMap() {
    this.props.navigation.navigate('SelectCafeMap', { isChange: true });
  }

  handleSendMessage() {
    const { params } = this.props.navigation.state;
    if (params && params.handleSendMessage) {
      params.handleSendMessage();
    }
  }

  render() {
    return (
      <Presenter
        {...this.state}
        handleSendMessage={this.handleSendMessage}
        navigateBack={this.navigateBack}
        navigateSelectCafeMap={this.navigateSelectCafeMap}
        myProfile={this.props.myProfile}
        logoutWithFirebase={this.props.logoutWithFirebase}
      />
    );
  }
}

export default Container;
