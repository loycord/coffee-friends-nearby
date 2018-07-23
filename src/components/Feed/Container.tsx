import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import Presenter from './Presenter';
import { Post } from '../../redux/types';
import { StoreToProps } from '.';
// types
import { User, Room } from '../../redux/types';

interface Props extends StoreToProps {
  cafeId?: string; // GET filter Cafe Feed
  userId?: string; // GET filter User Feed
}

export interface State {
  data: Array<Post>;
  loadingTop: boolean;
  loadingBottom: boolean;
  isFilterOpen: boolean;
}

class Container extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.posts,
      loadingTop: false,
      loadingBottom: false,
      isFilterOpen: false
    };

    this.navigateCafe = this.navigateCafe.bind(this);
    this.navigateChat = this.navigateChat.bind(this);
    this.navigateProfile = this.navigateProfile.bind(this);
    this.navigateCreatePost = this.navigateCreatePost.bind(this);
    
    this.handleOnRefresh = this.handleOnRefresh.bind(this);
    this.handleOnPressFilter = this.handleOnPressFilter.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (state.data[0] !== props.posts[0]) {
      return { data: props.posts, loadingTop: false };
    } else if (props.posts.length === 0) {
      return { loadingTop: false };
    }
    return null;
  }

  componentDidMount() {
    if (
      !this.props.cafeId &&
      !this.props.userId &&
      this.state.data.length === 0
    ) {
      this.handleSetFeed();
    }

    if (this.props.cafeId) {
      const postCollectionRef = firebase.firestore().collection('posts');

      const currentTime = new Date();
      const query = postCollectionRef
        .where('cafeId', '==', this.props.cafeId)
        .orderBy('createdAt', 'desc')
        .startAt(currentTime);

      query
        .limit(50)
        .get()
        .then(documentSnapshots => {
          const posts: any = [];
          documentSnapshots.forEach(doc => {
            const docData = doc.data();
            posts.push({ ...docData, docId: doc.id });
          });

          console.log('[FIRESTORE] -- GET COLLECTION "posts" --', posts);
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);

          this.setState({ data: posts });
        })
        .catch(error => {
          console.log(error);
          throw new Error('firebase Error');
        });
    }

    if (this.props.userId) {
      console.log(this.props.userId);
      const postCollectionRef = firebase.firestore().collection('posts');

      const currentTime = new Date();
      const query = postCollectionRef
        .where('uid', '==', this.props.userId)
        .orderBy('createdAt', 'desc')
        .startAt(currentTime);

      query
        .limit(50)
        .get()
        .then(documentSnapshots => {
          const posts: any = [];
          documentSnapshots.forEach(doc => {
            const docData = doc.data();
            posts.push({ ...docData, docId: doc.id });
          });

          console.log('[FIRESTORE] -- GET COLLECTION "posts" --', posts);
          const readCount = firebase.database().ref('read');
          readCount.transaction(currentValue => (currentValue || 0) + 1);
          this.setState({ data: posts });
        })
        .catch(error => {
          console.log(error);
          throw new Error('firebase Error');
        });
    }
  }

  navigateCafe(cafeId: string) {
    if (!this.props.cafeId) {
      this.props.navigation.navigate('Cafe', { cafeId });
    }
  }

  navigateChat(room: Room) {
    this.props.navigation.navigate('Chat', { data: room });
  }

  navigateProfile(userId: string) {
    this.props.navigation.navigate('Profile', { data: userId });
  }

  navigateCreatePost() {
    this.props.navigation.navigate('CreatePost');
  }

  handleSetFeed() {
    this.setState({ loadingTop: true });
    this.props.setPosts();
  }

  handleOnRefresh() {
    this.handleSetFeed();
    // this.setState({ loadingTop: true });
    // console.log('refresh');
    // setTimeout(() => {
    //   this.setState({ loadingTop: false });
    // }, 1500);
  }

  handleChangeFilter(filter: 'cafeId' | 'city' | 'countryCode' | 'all') {
    this.props.changePostsFilter(filter);
    this.handleSetFeed();
    this.setState({ isFilterOpen: false });
  }

  handleOnPressFilter() {
    this.setState(prevState => ({
      isFilterOpen: !prevState.isFilterOpen
    }));
  }

  handleSendMessage(user: User) {
    this.props.createRoom(user, (room: Room) => {
      this.navigateChat(room);
    });
  }

  render() {
    return (
      <Presenter
        {...this.state}
        uid={this.props.uid}
        userPhotoURL={this.props.photoURL}
        filter={this.props.filter}
        userId={this.props.userId}
        cafeId={this.props.cafeId}
        favoriteCafe={this.props.favoriteCafe}
        navigateCafe={this.navigateCafe}
        navigateProfile={this.navigateProfile}
        navigateCreatePost={this.navigateCreatePost}
        handleOnRefresh={this.handleOnRefresh}
        handleOnPressFilter={this.handleOnPressFilter}
        handleChangeFilter={this.handleChangeFilter}
        handleSendMessage={this.handleSendMessage}
      />
    );
  }
}

export default Container;
