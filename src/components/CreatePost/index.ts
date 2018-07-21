import { connect } from 'react-redux';
import Container from './Container';
import { createPost } from '../../redux/modules/post';

export interface StoreToProps {
  navigation?: any;
  createPost: (columns: string, image?: any) => void;
}

function mapDispatchToProps(dispatch: any) {
  return {
    createPost: (columns: string, image?: any) => {
      dispatch(createPost(columns, image));
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Container);
