import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const AppTitle = styled.Text`
  font-size: 35px;
`;
const FacebookLoginButton = styled.Button`
  width: 50%;
`;

interface Props {
  logIn: () => void;
}

class Login extends React.Component<Props> {
  render() {
    return (
      <Container>
        <AppTitle>Coffee Friend Nearby</AppTitle>
        <FacebookLoginButton
          title="Facebook Login"
          onPress={this.props.logIn}
        />
      </Container>
    );
  }
}

export default Login;
