import { connect } from 'react-redux';
import Container from './Container';
// types
import { Store, Cafe } from '../../redux/types';

export interface StoreToProps {
  selectedCafe: Cafe | null;
}

function mapStateToProps(state: Store) {
  const { selectedCafe } = state.cafe;
  return { selectedCafe };
}

export default connect(mapStateToProps)(Container);
