import React from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

interface Props {
  loading: boolean;
}

class Loading extends React.Component<Props> {
  render() {
    if (!this.props.loading) return null;
    return (
      <Container>
        <ActivityIndicator size="large" color="#fff" />
      </Container>
    );
  }
}

export default Loading;
