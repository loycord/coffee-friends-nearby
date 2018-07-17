import { connect } from 'react-redux';
import Container from './Container';
import { Store } from '../../redux/types';

export interface StoreToProps {
  filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all';
  filterValue: string;
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

export default connect(mapStateToProps)(Container);
