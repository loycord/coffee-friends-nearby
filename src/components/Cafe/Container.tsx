import React from 'react';
import firebase from 'firebase';
import Presenter from './Presenter';
import { StoreToProps } from '.';
// types
import { Cafe, User } from '../../redux/types';

// const userData = [
//   { docId: '123124', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User6.jpeg?alt=media&token=b6540dae-f5e1-4e6c-b242-29faa8ca1f2c"},
//   { docId: '123122', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User1.png?alt=media&token=22282cfd-914b-4d93-8c5c-3373698aaadf"},
//   { docId: '123121', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User15.jpg?alt=media&token=709dff93-9874-4af3-88f4-661a76dc8e09"},
//   { docId: '123126', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User17.jpeg?alt=media&token=f96d4fb0-96f4-4f22-ab35-5733fcaa9255"},
//   { docId: '123127', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User11.jpeg?alt=media&token=c5969c6b-6608-4b95-ba04-c97ba505fc00"},
//   { docId: '123123', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User8.jpeg?alt=media&token=b9296569-ceb9-498c-966a-f7ad08f62db8"},
//   { docId: '12312123', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User7.jpeg?alt=media&token=c7300ba8-00d6-41ef-9461-ba486dcf468f"},
//   { docId: '12312412312', photoURL: "https://firebasestorage.googleapis.com/v0/b/coffe-friend-nearby.appspot.com/o/user_profile%2FOptimized-User17.jpeg?alt=media&token=f96d4fb0-96f4-4f22-ab35-5733fcaa9255"},
// ];

export interface State {
  isShowText: boolean;
  isLoading: boolean;
  data: Cafe | null;
  // members: User[];
  members: any[];
}

class Container extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isShowText: false,
      isLoading: false,
      data: this.props.selectedCafe,
      members: []
    };

    this.handleHeaderTextSwitch = this.handleHeaderTextSwitch.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigationMap = this.navigationMap.bind(this);
    this.checkCafeData = this.checkCafeData.bind(this);
    this.getCafeMembers = this.getCafeMembers.bind(this);
    this.updateUserCafe = this.updateUserCafe.bind(this);
  }

  componentDidMount() {
    this.checkCafeData();
  }

  async checkCafeData() {
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
          const cafe: any = doc.data();
          console.log('[FIRESTORE] -- GET DOCUMENT "cafe" --', cafe);
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);
          const geoPoint = {
            latitude: cafe.geoPoint._lat,
            longitude: cafe.geoPoint._long
          };
          cafe.geoPoint = geoPoint;
          let members: any = [];
          if (cafeId) {
            members = await this.getCafeMembers(cafeId);
          }
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

    if (cafeId && this.state.members.length === 0) {
      const members: any = await this.getCafeMembers(cafeId);
      this.setState({ members });
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
          const members: any = [];

          querySnapshot.forEach(doc => {
            const docData = doc.data();
            members.push({ ...docData, docId: doc.id });
          });

          console.log('[FIRESTORE] -- GET COLLECTION "users" --', members);
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);

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

  updateUserCafe() {
    const { selectedCafe } = this.props;
    if (selectedCafe) {
      this.props.updateUserFavoriteCafe(selectedCafe);
    }
    if (this.props.navigation) {
      const { params } = this.props.navigation.state;
      if (params && params.isFavoriteCafeSelect) {
        this.props.navigation.goBack();
      }
    }
  }

  render() {
    return (
      <Presenter
        {...this.state}
        selectedCafe={this.props.selectedCafe}
        updateUserCafe={this.updateUserCafe}
        isFavoriteCafeSelect={
          this.props.navigation.state.params.isFavoriteCafeSelect
        }
        handleHeaderTextSwitch={this.handleHeaderTextSwitch}
        navigateBack={this.navigateBack}
        navigationMap={this.navigationMap}
      />
    );
  }
}

export default Container;
