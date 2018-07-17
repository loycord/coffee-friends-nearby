import React from 'react';
import Presenter from './Presenter';
import { Post } from '../../redux/types';
import { StoreToProps } from '.';

export interface State {
  data: Array<Post>;
  loadingTop: boolean;
  loadingBottom: boolean;
}

class Container extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.posts,
      loadingTop: false,
      loadingBottom: false
    };

    this.handleOnRefresh = this.handleOnRefresh.bind(this);
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (state.data[0] !== props.posts[0]) {
      return { data: props.posts, loadingTop: false };
    }
    return null;
  }

  componentDidMount() {
    if (this.state.data.length === 0) {
      this.handleSetFeed();
    }
  }

  handleSetFeed() {
    this.setState({ loadingTop: true });
    this.props.setPosts();
  }

  handleOnRefresh() {
    this.setState({ loadingTop: true });
    console.log('refresh');
    setTimeout(() => {
      this.setState({ loadingTop: false });
    }, 1500);
  }

  render() {
    return <Presenter {...this.state} handleOnRefresh={this.handleOnRefresh} />;
  }
}

export default Container;
