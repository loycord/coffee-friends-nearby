import React from 'react';
import Presenter from './Presenter';
import { StoreToProps } from '.';

class Container extends React.Component<StoreToProps> {
  render() {
    return <Presenter loginWithFacebook={this.props.loginWithFacebook} />;
  }
}

export default Container;
