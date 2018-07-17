/**
 * 밥정너 3idiots
 * https://bapjn.com
 * @flow
 */

'use strict';

import React from 'react';
import { Animated } from 'react-native';

interface Props {
  style: {};
  source: any;
}
interface State {
  opacity: any;
}

export default class FadeInImage extends React.PureComponent<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };

    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 250
    }).start();
  }

  render() {
    return (
      <Animated.Image
        style={[{ opacity: this.state.opacity }, this.props.style]}
        source={this.props.source}
        onLoad={this.onLoad}
      />
    );
  }
}
