/**
 * 밥정너 3idiots
 * https://bapjn.com
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import { Animated } from 'react-native';

interface Props {
  children: any;
  style?: {};
  duration?: number;
}
interface State {
  fadeAnim: any;
}

export default class FadeInView extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0)
    };
  }
  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: this.props.duration || 1000
    }).start();
  }
  render() {
    return (
      <Animated.View
        style={[
          {
            opacity: this.state.fadeAnim
          },
          this.props.style
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
