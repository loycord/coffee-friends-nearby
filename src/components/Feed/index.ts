import { connect } from 'react-redux';
import Container from './Container';
import { setPosts, _changePostsFilter } from '../../redux/modules/post';
import { createRoom } from '../../redux/modules/room';
import { Store, Post, Cafe, User, Room } from '../../redux/types';

export interface StoreToProps {
  navigation?: any;
  // state
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  uid: string;
  posts: Post[];
  photoURL: string;
  favoriteCafe: Cafe;
  // dispatch
  setPosts: (limit?: number) => void;
  createRoom: (user: User, callback?: (room: Room) => void) => void;
  changePostsFilter: (
    filter: 'cafeId' | 'city' | 'countryCode' | 'all'
  ) => void;
}

function mapStateToProps(state: Store) {
  const { favoriteCafe, photoURL, uid } = state.user;
  const { filter, posts } = state.post;
  return { filter, posts, favoriteCafe, photoURL, uid };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setPosts: (limit?: number) => {
      dispatch(setPosts(limit));
    },
    changePostsFilter: (filter: 'cafeId' | 'city' | 'countryCode' | 'all') => {
      dispatch(_changePostsFilter(filter));
    },
    createRoom: (user: User, callback?: (room: Room) => void) => {
      dispatch(createRoom(user, callback));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
