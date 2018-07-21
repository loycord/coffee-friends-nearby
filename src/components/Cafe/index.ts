import { connect } from 'react-redux';
import Container from './Container';
import { updateUserFavoriteCafe } from '../../redux/modules/user';
// types
import { Store, Cafe } from '../../redux/types';

export interface StoreToProps {
  selectedCafe: Cafe | null;
  updateUserFavoriteCafe: (cafe: Cafe) => void;
  navigation: {
    goBack: any;
    navigate: any;
    state: {
      params: {
        cafeId?: string;
        isFavoriteCafeSelect?: boolean;
      };
    };
  };
}

function mapStateToProps(state: Store) {
  const { selectedCafe } = state.cafe;
  return { selectedCafe };
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
