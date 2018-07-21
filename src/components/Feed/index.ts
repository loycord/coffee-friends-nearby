import { connect } from 'react-redux';
import Container from './Container';
import { setPosts, _changePostsFilter } from '../../redux/modules/post';
import { Store, Post, Cafe } from '../../redux/types';

export interface StoreToProps {
  navigation?: any;
  // state
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  posts: Post[];
  favoriteCafe: Cafe;
  // dispatch
  setPosts: (limit?: number) => void;
  changePostsFilter: (
    filter: 'cafeId' | 'city' | 'countryCode' | 'all'
  ) => void;
}

function mapStateToProps(state: Store) {
  const { favoriteCafe } = state.user;
  const { filter, posts } = state.post;
  return { filter, posts, favoriteCafe };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setPosts: (limit?: number) => {
      dispatch(setPosts(limit));
    },
    changePostsFilter: (filter: 'cafeId' | 'city' | 'countryCode' | 'all') => {
      dispatch(_changePostsFilter(filter));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
