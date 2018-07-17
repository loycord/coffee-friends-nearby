import { connect } from 'react-redux';
import Container from './Container';
import {
  logoutWithFirebase,
  updateUserConnected
} from '../../redux/modules/user';

export default connect(
  null,
  { logoutWithFirebase, updateUserConnected }
)(Container);
