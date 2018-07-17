import { connect } from 'react-redux';
import Container from './Container';
import { Store, Location, Cafe } from '../../redux/types';
import { setGPS } from '../../redux/modules/gps';
import { selectCafe } from '../../redux/modules/cafe';

export interface StoreToProps {
  location: Location;
  selectedCafe: Cafe | null;
  setGPS: () => void;
  selectCafe: (cafe: Cafe) => void;
  children?: any;
}

function mapStateToProps(state: Store) {
  const { location } = state.gps;
  const { selectedCafe } = state.cafe;
  return { 
    location,
    selectedCafe
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setGPS: () => {
      dispatch(setGPS());
    },
    selectCafe: (cafe: Cafe) => {
      dispatch(selectCafe(cafe));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
