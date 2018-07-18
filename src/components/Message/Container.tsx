import React from 'react';
import Presenter from './Presenter';
// types
import { StoreToProps } from '.';
import { Room } from '../../redux/types';

export interface State {
  data: Room[] | null;
}

class Container extends React.Component<StoreToProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: null
    };
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (state.data === null && props.rooms) {
      return { data: props.rooms };
    }
    if (state.data !== null && state.data.length !== props.rooms.length) {
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

  render() {
    return <Presenter {...this.state} />;
  }
}

export default Container;
