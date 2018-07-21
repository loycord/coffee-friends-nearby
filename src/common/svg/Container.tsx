import React from 'react';
import { View, Platform } from 'react-native';
import { Svg } from 'expo';

export default class Container extends React.Component<
  {
    size: number;
    color: string;
    fill?: boolean;
    style?: {};
    viewBox: string;
    children: any;
  },
  { size: number }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      size: props.size
    };
  }

  render() {
    const androidProps =
      Platform.OS === 'android'
        ? { scale: this.props.size / this.state.size }
        : null;
    const otherProps =
      Platform.OS === 'android'
        ? { width: this.state.size, height: this.state.size }
        : { width: this.props.size, height: this.props.size };
    return (
      <View
        style={[
          { width: this.props.size, height: this.props.size },
          this.props.style
        ]}
      >
        <Svg {...otherProps} viewBox={this.props.viewBox}>
          <Svg.G {...androidProps}>{this.props.children}</Svg.G>
        </Svg>
      </View>
    );
  }
}
