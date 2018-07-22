import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
import { distance } from '../../redux/modules/gps';
import { docDataMerge } from '../../lib/utils';
// types
import { User, Room } from '../../redux/types';
import { StoreToProps } from '.';

export interface State {
  data: Array<any>;
  loadingTop: boolean;
  loadingBottom: boolean;
  limit: number;
  lastDoc: any;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  isFilterOpen: boolean;
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
      limit: 10,
      lastDoc: null,
      isFilterOpen: false
    };

    this.navigateChat = this.navigateChat.bind(this);
    this.handleGetMembers = this.handleGetMembers.bind(this);
    this.handleOnRefresh = this.handleOnRefresh.bind(this);
    this.handleOnEndReached = this.handleOnEndReached.bind(this);
    this.createMembersQuery = this.createMembersQuery.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleOnPressFilter = this.handleOnPressFilter.bind(this);
  }

  componentDidMount() {
    this.handleGetMembers('loadingTop');
  }

  componentWillUnmount() {
    console.log('Member:: unmount');
    const unsubscribe = firebase
      .firestore()
      .collection('cities')
      .onSnapshot(() => {});
    unsubscribe();
  }

  navigateChat(room: Room) {
    this.props.navigation.navigate('Chat', { data: room });
  }

  createMembersQuery() {
    const userCollectionRef = firebase.firestore().collection('users');
    let { cafeFilter, filterValue } = this.props;
    console.log('CREATE MEMEBERS QUERY', cafeFilter, filterValue);
    let query;
    if (cafeFilter !== 'all') {
      query = userCollectionRef.where(cafeFilter, '==', filterValue);
    } else {
      query = userCollectionRef;
    }
    const currentTime = new Date();
    if (this.state.lastDoc) {
      query = query
        .orderBy('lastAccessTime', 'desc')
        .startAfter(this.state.lastDoc);
    } else {
      query = query.orderBy('lastAccessTime', 'desc').startAt(currentTime);
    }
    return query;
  }

  handleGetMembers(loadingPosition: 'loadingTop' | 'loadingBottom') {
    const loading: any = { [loadingPosition]: true };
    this.setState(loading);

    // AccessTime
    const accessTimeQuery: firebase.firestore.Query = this.createMembersQuery();
    accessTimeQuery.limit(this.state.limit).onSnapshot(querySnapshots => {
      const members: any = [];
      querySnapshots.forEach(doc => {
        const docData = doc.data();
        const geoPoint = {
          latitude: docData.geoPoint._lat,
          longitude: docData.geoPoint._long
        };
        docData.distance = (
          distance(this.state.geoPoint, geoPoint) * 0.621371
        ).toFixed(1);
        const { currentUser } = firebase.auth();
        if (currentUser && doc.id !== currentUser.uid) {
          members.push({ ...docData, docId: doc.id });
        }
      });

      console.log('[FIRESTORE] -- GET COLLECTION "users" --', members);
      const readCount = firebase.database().ref('read');
      readCount.transaction(currentValue => (currentValue || 0) + 1);

      // const connectedMembers = members.filter(
      //   (member: any) => member.isConnected
      // );
      // const notConnectedMembers = members.filter(
      //   (member: any) => !member.isConnected
      // );

      loading[loadingPosition] = false;

      this.setState(prevState => {
        // const prevConnectedMembers: User[] = [];
        // const prevNotConnectedMembers: User[] = [];
        // prevState.data.forEach(member => {
        //   if (member.isConnected) {
        //     connectedMembers.push(member);
        //   } else {
        //     notConnectedMembers.push(member);
        //   }
        // });

        // const updatedConnectedMembers = docDataMerge(
        //   prevConnectedMembers,
        //   connectedMembers
        // );
        // const updatedNotConnectedMembers = docDataMerge(
        //   prevNotConnectedMembers,
        //   notConnectedMembers
        // );
        const updatedData = docDataMerge(prevState.data, members);

        return {
          ...loading,
          data: updatedData,
          lastDoc: querySnapshots.docs[querySnapshots.docs.length - 1]
        };
      });
    });
  }

  handleOnRefresh() {
    this.setState({ lastDoc: null, data: [] });
    this.handleGetMembers('loadingTop');
  }

  handleOnEndReached() {
    // const { loadingTop, loadingBottom, lastDoc } = this.state;
    // if (!loadingTop && !loadingBottom && lastDoc) {
    //   this.handleGetMembers('loadingBottom');
    // }
  }

  handleSendMessage(user: User) {
    console.log('handleSendMessage; Member;')
    this.props.createRoom(user, (room: Room) => {
      this.navigateChat(room);
    });
  }

  handleChangeFilter(filter: 'cafeId' | 'city' | 'countryCode' | 'all') {
    this.props.changePostsFilter(filter);
    this.setState({ isFilterOpen: false });
    this.handleGetMembers('loadingTop');
  }

  handleOnPressFilter() {
    this.setState(prevState => ({
      isFilterOpen: !prevState.isFilterOpen
    }));
  }

  render() {
    return (
      <Presenter
        {...this.state}
        filter={this.props.filter}
        favoriteCafe={this.props.favoriteCafe}
        handleOnRefresh={this.handleOnRefresh}
        handleOnEndReached={this.handleOnEndReached}
        handleSendMessage={this.handleSendMessage}
        handleOnPressFilter={this.handleOnPressFilter}
        handleChangeFilter={this.handleChangeFilter}
      />
    );
  }
}

export default Container;
