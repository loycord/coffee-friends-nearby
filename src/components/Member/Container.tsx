import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
// types
import { distance } from '../../redux/modules/gps';
import { StoreToProps } from '.';

interface State {
  data: Array<any>;
  loadingTop: boolean;
  loadingBottom: boolean;
  limit: number;
  lastDoc: any;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
}

class Container extends React.PureComponent<StoreToProps, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      geoPoint: {
        latitude: 37.40589,
        longitude: 126.670866
      },
      // radius: 10
      loadingTop: false,
      loadingBottom: false,
      limit: 50,
      lastDoc: null
    };

    this.handleGetMembers = this.handleGetMembers.bind(this);
    this.handleOnRefresh = this.handleOnRefresh.bind(this);
  }

  componentDidMount() {
    this.handleGetMembers();
  }

  handleGetMembers() {
    this.setState({ loadingTop: true });
    const userCollectionRef = firebase.firestore().collection('users');
    let { filter, filterValue } = this.props;
    // filter = 'cafeCity';
    // filterValue = 'Menlo Park';

    let query;
    if (filter !== 'all') {
      query = userCollectionRef.where(filter, '==', filterValue);
    } else {
      query = userCollectionRef;
    }
    const currentTime = new Date();
    query = query.orderBy('lastAccessTime', 'desc').startAt(currentTime);

    query
      .limit(this.state.limit)
      .get()
      .then(querySnapshot => {
        console.log('[FIRESTORE] -- GET COLLECTION "users" --');
        const readCount = firebase.database().ref('read');
        readCount.transaction(currentValue => (currentValue || 0) + 1);
        const members: any = [];
        querySnapshot.forEach(doc => {
          const docData = doc.data();
          const geoPoint = {
            latitude: docData.geoPoint._lat,
            longitude: docData.geoPoint._long
          };
          docData.distance = distance(this.state.geoPoint, geoPoint);
          members.push({ ...docData, docId: doc.id });
        });

        const connectedMembers = members.filter(
          (member: any) => member.isConnected
        );
        const notConnectedMembers = members.filter(
          (member: any) => !member.isConnected
        );
        console.log(members);

        this.setState({
          data: [...connectedMembers, ...notConnectedMembers],
          loadingTop: false
        });
      })
      .catch(error => console.log(error));

    // onSnapshot(querySnapshot => {
    //   const members: any = [];
    //   querySnapshot.forEach(doc => {
    //     const docData = doc.data();
    //     const geoPoint = {
    //       latitude: docData.geoPoint._lat,
    //       longitude: docData.geoPoint._long
    //     };
    //     docData.distance = distance(this.state.geoPoint, geoPoint);
    //     members.push({ ...docData, docId: doc.id });
    //   });

    //   const connectedMembers = members.filter(
    //     (member: any) => member.isConnected
    //   );
    //   const notConnectedMembers = members.filter(
    //     (member: any) => !member.isConnected
    //   );
    //   console.log(members);

    //   this.setState({
    //     data: [...connectedMembers, ...notConnectedMembers],
    //     loadingTop: false
    //   });
    // });
  }

  handleOnRefresh() {
    this.setState({ loadingTop: true });
    console.log('refresh');
    setTimeout(() => {
      this.setState({ loadingTop: false });
    }, 1500);
  }

  render() {
    return (
      <Presenter
        {...this.props}
        {...this.state}
        handleOnRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default Container;
