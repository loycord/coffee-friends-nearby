import { connect } from 'react-redux';
import Container from './Container';
// types
import { Store, User } from '../../redux/types';

export interface StoreToProps {
  myProfile: any;
  navigation: {
    state: {
      params: {
        userId?: string;
      };
    };
  };
}

function mapStateToProps(state: Store) {
  const { user } = state;
  return { myProfile: user };
}

export default connect(mapStateToProps)(Container);
