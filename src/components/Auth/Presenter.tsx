import React from 'react';
import styled from 'styled-components/native';
import { StoreToProps } from '.';
import Button from '../../common/Button';

const BACKGROUND_IMAGE = require('../../common/img/login_background.png');

const Container = styled.View`
  position: relative;
  flex: 1;
`;
const TitleContainer = styled.View`
  flex: 6;
  justify-content: center;
  align-items: center;
`;
const ButtonContainer = styled.View`
  flex: 2;
  justify-content: flex-start;
  align-items: center;
`;
const AppTitle = styled.Text`
  font-size: 26px;
  font-weight: 900;
  text-align: center;
  color: #fff;
  margin-bottom: 70px;
`;
const Background = styled.Image`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
const FilterView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
`;

function Presenter(props: StoreToProps) {
  return (
    <Container>
      <Background source={BACKGROUND_IMAGE} resizeMode="cover" />
      <FilterView />
      <TitleContainer>
        <AppTitle>Coffee Friends{'\n'}Nearby</AppTitle>
      </TitleContainer>
      <ButtonContainer>
        <Button
          text="SIGN IN WITH FACEBOOK"
          onPressButton={props.loginWithFacebook}
          disable={false}
        />
      </ButtonContainer>
    </Container>
  );
}

export default Presenter;
