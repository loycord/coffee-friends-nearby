import React from 'react';
import styled from 'styled-components/native';
// components
import Feed from '../Feed';
// types
import { User } from '../../redux/types';
import { State } from './Container';

const Container = styled.ScrollView`
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

interface Props extends State {
  myProfile: User;
  userId?: string;
}

export default function Presenter(props: Props) {
  return (
    <Container>
      <ProfileContainer>
        <ProfileBackground
          source={require('../../common/img/starbucks_photo2.jpeg')}
        />
        <ProfileImageBox>
          <ProfileImage
            source={
              { uri: props.profileInfo.photoURL } ||
              require('../../common/img/starbucks_photo1.jpg')
            }
          />
        </ProfileImageBox>
        <ProfileHeading>{props.profileInfo.displayName}</ProfileHeading>
        <SecondText>{props.profileInfo.cafeName}</SecondText>
        <SecondText>{props.profileInfo.cafeName}</SecondText>
        {props.profileInfo.uid !== props.myProfile.uid && (
          <MessageButton onPress={() => {}}>
            <MessageButtonText>Message</MessageButtonText>
          </MessageButton>
        )}
      </ProfileContainer>
      {/* {props.profileInfo.uid !== props.myProfile.uid ? (
        props.userId && <Feed userId={props.userId} />
      ) : (
        <Feed userId={props.profileInfo.uid} />
      )} */}
    </Container>
  );
}
