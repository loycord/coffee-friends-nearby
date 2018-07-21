import React from 'react';
import { StatusBar } from 'react-native';
import { Constants } from 'expo';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  background-color: #fff;
`;

const DefaultContainer = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text`
  font-size: 16px;
  color: #323b45;
`;

const StatusBarBackGround = styled.View`
  height: ${Constants.statusBarHeight}px;
  background-color: transparent;
`;

interface Props {
  title?: string;
  statusBar?: 'light' | 'dark';
  style?: {};
  titleStyle?: {};
  children?: any;
}

export default class Header extends React.PureComponent<Props> {
  render() {
    return (
      <Container style={this.props.style}>
        {this.props.statusBar && (
          <React.Fragment>
            <StatusBarBackGround />
            <StatusBar
              barStyle={
                this.props.statusBar === 'dark'
                  ? 'dark-content'
                  : 'light-content'
              }
            />
          </React.Fragment>
        )}
        {this.props.title && (
          <DefaultContainer style={this.props.style}>
            <Title style={this.props.titleStyle}>{this.props.title}</Title>
          </DefaultContainer>
        )}
        {this.props.children && this.props.children}
      </Container>
    );
  }
}
