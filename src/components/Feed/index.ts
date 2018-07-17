import { connect } from 'react-redux';
import Container from './Container';
import { setPosts } from '../../redux/modules/post';
import { Store, Post } from '../../redux/types';

export interface StoreToProps {
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  posts: Array<Post>;
  setPosts: (limit?: number) => void;
}

function mapStateToProps(state: Store) {
  const { filter, posts } = state.post;
  return { filter, posts };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setPosts: (limit?: number) => {
      dispatch(setPosts(limit));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
