import React from 'react';
import Presenter from './Presenter';
// types
import { StoreToProps } from '.';
import { Room } from '../../redux/types';

export interface State {
  data: Room[] | null;
}

class Container extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: null
    };

    this.navigateChat = this.navigateChat.bind(this);
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (props.rooms) {
      return { data: props.rooms };
    }
    return null;
  }

  componentDidUpdate(nextProps: StoreToProps, nextState: State) {
    if (nextState.data !== null) {
      this.props.loaded();
    }
  }

  componentDidMount() {
    this.props.getRooms();
  }

  navigateChat(room: Room) {
    this.props.navigation.navigate('Chat', { data: room });
  }

  render() {
    return <Presenter {...this.state} navigateChat={this.navigateChat} />;
  }
}

export default Container;
