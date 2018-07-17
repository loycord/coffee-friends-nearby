import React from 'react';
import firebase from 'firebase';
import Presenter from './Presenter';
import { StoreToProps } from '.';
// types
import { Cafe, User } from '../../redux/types';

interface Props extends StoreToProps {
  navigation: any;
  cafeId: string;
}

export interface State {
  isShowText: boolean;
  isLoading: boolean;
  data: Cafe | null;
  members: User[] | null;
}

class Container extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isShowText: false,
      isLoading: false,
      data: this.props.selectedCafe,
      members: null
    };

    this.handleHeaderTextSwitch = this.handleHeaderTextSwitch.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigationMap = this.navigationMap.bind(this);
    this.checkCafeData = this.checkCafeData.bind(this);
    this.getCafeMembers = this.getCafeMembers.bind(this);
  }

  componentDidMount() {
    this.checkCafeData();
  }

  checkCafeData() {
    const { cafeId } = this.props.navigation.state.params;
    const { data } = this.state;
    if (data === null || (data !== null && data.docId !== cafeId)) {
      const cafeDocRef = firebase
        .firestore()
        .collection('cafes')
        .doc(cafeId);

      this.setState({ isLoading: true });
      cafeDocRef
        .get()
        .then(async doc => {
          console.log('[FIRESTORE] -- GET DOCUMENT "cafe" --');
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);
          const cafe: any = doc.data();
          const geoPoint = {
            latitude: cafe.geoPoint._lat,
            longitude: cafe.geoPoint._long
          };
          cafe.geoPoint = geoPoint;
          const members: any = await this.getCafeMembers(cafeId);
          if (cafe && members) {
            this.setState({
              data: { ...cafe, docId: cafeId },
              members,
              isLoading: false
            });
          }
          this.setState({ isLoading: false });
        })
        .catch(error => {
          console.log(error);
          this.setState({ isLoading: false });
        });
    }
  }

  getCafeMembers(cafeId: string) {
    return new Promise((res, rej) => {
      const userCollectionRef = firebase
        .firestore()
        .collection('users')
        .where('cafeId', '==', cafeId);

      userCollectionRef
        .get()
        .then(querySnapshot => {
          console.log('[FIRESTORE] -- GET COLLECTION "users" --');
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);
          const members: any = [];

          querySnapshot.forEach(doc => {
            const docData = doc.data();
            members.push({ ...docData, docId: doc.id });
          });

          res(members);
        })
        .catch(error => {
          console.log(error);
          rej(null);
        });
    });
  }

  handleHeaderTextSwitch(isShow: boolean) {
    this.setState({ isShowText: isShow });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigationMap() {
    if (this.state.data) {
      this.props.navigation.navigate('MapView', {
        geoPoint: this.state.data.geoPoint
      });
    }
  }

  render() {
    return (
      <Presenter
        {...this.state}
        handleHeaderTextSwitch={this.handleHeaderTextSwitch}
        navigateBack={this.navigateBack}
        navigationMap={this.navigationMap}
      />
    );
  }
}

export default Container;
