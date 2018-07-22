import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
import { StoreToProps } from '.';
// types
import { Post } from '../../redux/types';

export interface State {
  profileInfo: any;
}

class Container extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      profileInfo: this.props.myProfile
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params && params.userId) {
      console.log(params.userId);
      const userDocRef = firebase
        .firestore()
        .collection('users')
        .doc(params.userId);
      userDocRef.get().then(doc => {
        const userData = doc.data();
        if (userData) {
          const geoPoint = {
            latitude: userData.geoPoint._lat,
            longitude: userData.geoPoint._long
          };
          userData.geoPoint = geoPoint;

          this.setState({ profileInfo: userData });
        }
      });
    }
  }

  render() {
    return (
      <Presenter
        {...this.props}
        {...this.state}
        userId={this.props.navigation.state.params.userId}
      />
    );
  }
}

export default Container;
