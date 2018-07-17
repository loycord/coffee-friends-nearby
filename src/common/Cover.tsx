import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;
const Text = styled.Text`
  font-size: 30px;
  color: #fff;
`;

class Loading extends React.Component {
  render() {
    return (
      <Container>
        <Text>Coffee Friends Nearby</Text>
      </Container>
    );
  }
}

export default Loading;
