import React from 'react';
import { StatusBar, View } from 'react-native';
import { Constants } from 'expo';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  background-color: #fff;
  /* border-bottom-width: 1px; */
  /* border-color: #d8d8d8; */
`;

const DefaultContainer = styled.View`
  min-height: 50px;
  width: 100%;
  flex-direction: row;
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
  renderRight?: any;
  renderLeft?: any;
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const isLeftOrRight = this.props.renderLeft || this.props.renderRight;
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
            {isLeftOrRight && this.props.renderLeft ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                {this.props.renderLeft()}
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Title style={this.props.titleStyle}>{this.props.title}</Title>
            </View>
            {isLeftOrRight && this.props.renderRight ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                {this.props.renderRight()}
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </DefaultContainer>
        )}
        {this.props.children && this.props.children}
      </Container>
    );
  }
}
