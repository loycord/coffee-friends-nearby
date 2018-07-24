import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Constants } from 'expo';
import styled from 'styled-components/native';
// components
import Feed from '../Feed';
// common
import Button from '../../common/Button';
// types
import { User } from '../../redux/types';
import { State } from './Container';

const HEADER_HEIGHT = 50 + Constants.statusBarHeight;
const BACK_ICON = require('../../common/img/back_white.png');

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;
const ProfileContainer = styled.View`
  position: relative;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
`;
const ProfileBackground = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  width: 100%;
  z-index: -1;
  background-color: #00ac62;
`;
const ProfileImageBox = styled.View`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  border-width: 2px;
  border-color: #fff;

  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: #5c6979;
`;
const ProfileImage = styled.Image`
  width: 108px;
  height: 108px;
  border-radius: 54px;
`;
const ProfileHeading = styled.Text`
  margin: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #323b45;
`;
const SecondText = styled.Text`
  font-size: 16px;
  margin: 3px;
  color: #b5b5b5;
`;
const MessageButton = styled.TouchableOpacity`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
  border-width: 2px;
  border-color: #5b6878;
  border-radius: 8px;
  margin: 20px;
`;
const MessageButtonText = styled.Text`
  font-size: 16px;
  color: #5b6878;
`;
const SomeText = styled.Text`
  font-size: 14px;
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  width: ${HEADER_HEIGHT}px;
  height: ${HEADER_HEIGHT}px;
  justify-content: center;
  align-items: flex-start;
  top: 0;
  left: 0;
`;
const ImageIcon = styled.Image`
  width: 15px;
  height: 15px;
  padding: 10px;
  margin-left: 20px;
  margin-top: 20px;
`;

interface Props extends State {
  myProfile: User;
  userId?: string;
  logoutWithFirebase: () => void;
  navigateBack: () => void;
  navigateSelectCafeMap: () => void;
  handleSendMessage?: () => void;
}

export default function Presenter(props: Props) {
  if (props.isLoading)
    return (
      <Container
        style={{
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </Container>
    );
  if (!props.data) {
    return (
      <Container>
        <SomeText>no data...</SomeText>
      </Container>
    );
  }
  console.log('Profile', props.data.uid);
  return (
    <Container>
      {/* <ScrollView> */}
      <ProfileContainer>
        <ProfileBackground
          source={props.data.backgroundURL && { uri: props.data.backgroundURL }}
        />
        <ProfileImageBox>
          <ProfileImage
            source={
              { uri: props.data.photoURL } ||
              require('../../common/img/starbucks_photo1.jpg')
            }
          />
        </ProfileImageBox>
        <ProfileHeading>{props.data.displayName}</ProfileHeading>
        <SecondText>{props.data.cafeName}</SecondText>
        {props.data.distance && (
          <SecondText>
            {props.data.distance > 0
              ? `${props.data.distance}miles away`
              : 'nearby'}
          </SecondText>
        )}
        {props.data.uid !== props.myProfile.uid && (
          <MessageButton onPress={props.handleSendMessage}>
            <MessageButtonText>Message</MessageButtonText>
          </MessageButton>
        )}
        {props.data.uid === props.myProfile.uid && (
          <React.Fragment>
            <Button
              text="Sign out"
              onPressButton={props.logoutWithFirebase}
              disable={false}
              style={{ marginVertical: 10 }}
            />
            <Button
              text="Change FavoriteCafe"
              onPressButton={props.navigateSelectCafeMap}
              disable={false}
              style={{ marginBottom: 15 }}
            />
          </React.Fragment>
        )}
      </ProfileContainer>
      {/* {props.data.uid && <Feed userId={props.data.uid} />} */}
      {props.data.uid !== props.myProfile.uid && (
        <IconContainer onPress={props.navigateBack}>
          <ImageIcon source={BACK_ICON} />
        </IconContainer>
      )}
      {/* </ScrollView> */}
    </Container>
  );
}
