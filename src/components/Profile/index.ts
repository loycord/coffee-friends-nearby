import { connect } from 'react-redux';
import Container from './Container';
import { logoutWithFirebase } from '../../redux/modules/user';
// types
import { Store, User } from '../../redux/types';

export interface StoreToProps {
  myProfile: any;
  navigation: {
    goBack: any;
    navigate: any;
    state: {
      params: {
        userId?: string;
        handleSendMessage?: () => void;
      };
    };
  };
  logoutWithFirebase: () => void;
}

function mapStateToProps(state: Store) {
  const { user } = state;
  return { myProfile: user };
}

function mapDispatchToProps(dispatch: any) {
  return {
    logoutWithFirebase: () => {
      dispatch(logoutWithFirebase());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
