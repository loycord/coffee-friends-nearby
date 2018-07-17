import { connect } from 'react-redux';
import Container from './Container';
import { loginWithFacebook } from '../../redux/modules/user';

export interface StoreToProps {
  loginWithFacebook: () => void;
}

function mapDispatchToProps(dispatch: any) {
  return {
    loginWithFacebook: () => {
      dispatch(loginWithFacebook());
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Container);
