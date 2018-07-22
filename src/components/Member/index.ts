import { connect } from 'react-redux';
import Container from './Container';
import { createRoom } from '../../redux/modules/room';
import { _changePostsFilter } from '../../redux/modules/post';
// types
import { Store, User, Cafe, Room } from '../../redux/types';

export interface StoreToProps {
  navigation?: any;
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  cafeFilter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all';
  filterValue: string;
  createRoom: (user: User, callback?: (room: Room) => void) => void;
  favoriteCafe: Cafe;
  changePostsFilter: (
    filter: 'cafeId' | 'city' | 'countryCode' | 'all'
  ) => void;
}

function mapStateToProps(state: Store) {
  const {
    post: { filter },
    user: { cafeId, cafeCity, cafeCountryCode, favoriteCafe }
  } = state;

  let filterValue;
  let cafeFilter = 'all';
  if (filter === 'cafeId') {
    cafeFilter = 'cafeId';
    filterValue = cafeId;
  }
  if (filter === 'city') {
    cafeFilter = 'cafeCity';
    filterValue = cafeCity;
  }
  if (filter === 'countryCode') {
    cafeFilter = 'cafeCountryCode';
    filterValue = cafeCountryCode;
  }

  return { cafeFilter, filter, filterValue, favoriteCafe };
}

function mapDispatchToProps(dispatch: any) {
  return {
    createRoom: (user: User, callback?: (room: Room) => void) => {
      dispatch(createRoom(user, callback));
    },
    changePostsFilter: (filter: 'cafeId' | 'city' | 'countryCode' | 'all') => {
      dispatch(_changePostsFilter(filter));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
