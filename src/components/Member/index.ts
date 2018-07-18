import { connect } from 'react-redux';
import Container from './Container';
import { createRoom } from '../../redux/modules/room';
// types
import { Store, User } from '../../redux/types';

export interface StoreToProps {
  filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all';
  filterValue: string;
  createRoom: (user: User) => void;
}

function mapStateToProps(state: Store) {
  const {
    post: { filter },
    user: { cafeId, cafeCity, cafeCountryCode }
  } = state;

  let filterValue;
  let cafeFilter = 'cafeId';
  if (filter === 'cafeId') filterValue = cafeId;
  if (filter === 'city') {
    cafeFilter = 'cafeCity';
    filterValue = cafeCity;
  }
  if (filter === 'countryCode') {
    cafeFilter = 'cafeCountryCode';
    filterValue = cafeCountryCode;
  }

  return { filter: cafeFilter, filterValue };
}

function mapDispatchToProps(dispatch: any) {
  return {
    createRoom: (user: User) => {
      dispatch(createRoom(user));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
