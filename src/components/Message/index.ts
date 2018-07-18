import { connect } from 'react-redux';
import Container from './Container';
import { getRooms } from '../../redux/modules/room';
// types
import { Store, Room } from '../../redux/types';

export interface StoreToProps {
  rooms: Room[];
  getRooms: () => void;
  loaded: () => void;
}

function mapStateToProps(state: Store) {
  const { rooms } = state.room;
  return { rooms };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getRooms: () => {
      dispatch(getRooms());
    },
    loaded: () => {
      dispatch({ type: 'LOADED' });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
