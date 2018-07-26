import { connect } from 'react-redux';
import Container from './Container';
import { createRoom } from '../../redux/modules/room';
import { _changeMembersFilter, setMembers } from '../../redux/modules/member';
// types
import { Store, User, Cafe, Room } from '../../redux/types';

export interface StoreToProps {
  navigation?: any;
  // state
  members: User[];
  filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all';
  selectFilter: 'cafeId' | 'city' | 'countryCode' | 'all';
  filterValue: string;
  favoriteCafe: Cafe;
  createRoom: (user: User, callback?: (room: Room) => void) => void;
  changeMembersFilter: (
    filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all'
  ) => void;
  setMembers: (limit?: number, orderBy?: 'geoPoint' | 'lastAccessTime') => void;
}

function mapStateToProps(state: Store) {
  const {
    member: { filter, members },
    user: { cafeId, cafeCity, cafeCountryCode, favoriteCafe },
    gps: { location }
  } = state;

  let filterValue;
  let selectFilter = 'all';
  if (filter === 'cafeId') {
    selectFilter = 'cafeId';
    filterValue = cafeId;
  }
  if (filter === 'cafeCity') {
    selectFilter = 'cafeCity';
    filterValue = cafeCity;
  }
  if (filter === 'cafeCountryCode') {
    selectFilter = 'cafeCountryCode';
    filterValue = cafeCountryCode;
  }

  return {
    members,
    filter,
    selectFilter,
    filterValue,
    favoriteCafe,
    location
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    createRoom: (user: User, callback?: (room: Room) => void) => {
      dispatch(createRoom(user, callback));
    },
    changeMembersFilter: (
      filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all'
    ) => {
      dispatch(_changeMembersFilter(filter));
    },
    setMembers: (limit?: number, orderBy?: 'geoPoint' | 'lastAccessTime') => {
      dispatch(setMembers(limit, orderBy));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
