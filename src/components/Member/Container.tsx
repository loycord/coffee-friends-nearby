import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
// types
import { User, Room } from '../../redux/types';
import { StoreToProps } from '.';

export interface State {
  data: Array<any>;
  loadingTop: boolean;
  loadingBottom: boolean;
  isFilterOpen: boolean;
  sort: 'lastAccessTime' | 'geoPoint';
}

class Container extends React.PureComponent<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.members,
      // radius: 10
      sort: 'lastAccessTime',
      loadingTop: false,
      loadingBottom: false,
      isFilterOpen: false
    };

    this.navigateChat = this.navigateChat.bind(this);
    this.navigateProfile = this.navigateProfile.bind(this);
    this.handleSetMembers = this.handleSetMembers.bind(this);
    // this.handleGetMembers = this.handleGetMembers.bind(this);
    this.handleOnRefresh = this.handleOnRefresh.bind(this);
    this.handleOnEndReached = this.handleOnEndReached.bind(this);
    // this.createMembersQuery = this.createMembersQuery.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleOnPressFilter = this.handleOnPressFilter.bind(this);
    this.handleSwitchMembersSort = this.handleSwitchMembersSort.bind(this);
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (state.data[0] !== props.members[0]) {
      return { data: props.members, loadingTop: false };
    } else if (props.members.length === 0) {
      return { loadingTop: false };
    }
    return null;
  }

  componentDidMount() {
    this.handleSetMembers();
  }

  componentDidUpdate(prevProps: StoreToProps, prevState: State) {
    if (prevState.sort !== this.state.sort) {
      this.handleSetMembers();
    }
  }

  navigateChat(room: Room) {
    this.props.navigation.navigate('Chat', { data: room });
  }

  navigateProfile(userId: string) {
    this.props.navigation.navigate('Profile', { userId });
  }

  handleSetMembers() {
    this.setState({ loadingTop: true });
    this.props.setMembers(50, this.state.sort);
  }

  handleOnRefresh() {
    this.handleSetMembers();
    // this.setState({ loadingTop: true });
    // console.log('refresh');
    // setTimeout(() => {
    //   this.setState({ loadingTop: false });
    // }, 1500);
  }

  handleOnEndReached() {}

  handleSendMessage(user: User) {
    this.props.createRoom(user, (room: Room) => {
      this.navigateChat(room);
    });
  }

  handleChangeFilter(filter: 'cafeId' | 'city' | 'countryCode' | 'all') {
    let convertFilter: any = filter;
    if (filter === 'city') convertFilter = 'cafeCity';
    if (filter === 'countryCode') convertFilter = 'cafeCountryCode';
    this.props.changeMembersFilter(convertFilter);
    this.handleSetMembers();
    this.setState({ isFilterOpen: false });
  }

  handleOnPressFilter() {
    this.setState(prevState => ({
      isFilterOpen: !prevState.isFilterOpen
    }));
  }

  handleSwitchMembersSort() {
    this.setState(prevState => {
      if (prevState.sort === 'lastAccessTime') {
        return { sort: 'geoPoint' };
      }
      if (prevState.sort === 'geoPoint') {
        return { sort: 'lastAccessTime' };
      }
      return null;
    });
  }

  render() {
    return (
      <Presenter
        {...this.state}
        filter={this.props.selectFilter}
        favoriteCafe={this.props.favoriteCafe}
        navigateProfile={this.navigateProfile}
        handleOnRefresh={this.handleOnRefresh}
        handleOnEndReached={this.handleOnEndReached}
        handleSendMessage={this.handleSendMessage}
        handleOnPressFilter={this.handleOnPressFilter}
        handleChangeFilter={this.handleChangeFilter}
        handleSwitchMembersSort={this.handleSwitchMembersSort}
      />
    );
  }
}

export default Container;
