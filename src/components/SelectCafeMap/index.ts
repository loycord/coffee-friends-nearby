import { connect } from 'react-redux';
import Container from './Container';
import { Store, Cafe, Location } from '../../redux/types';
import { updateUserFavoriteCafe } from '../../redux/modules/user';

export interface StoreToProps {
  location: Location
  selectedCafe: Cafe | null;
  updateUserFavoriteCafe: (cafe: Cafe) => void;
  navigation?: any;
}

function mapStateToProps(state: Store) {
  const { location } = state.gps;
  const { selectedCafe } = state.cafe;
  return { location, selectedCafe };
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateUserFavoriteCafe: (cafe: Cafe) => {
      dispatch(updateUserFavoriteCafe(cafe));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
