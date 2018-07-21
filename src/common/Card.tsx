import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import Heart from './svg/Heart';
import Chat from './svg/Chat';
// import DirectionMessage from './svg/DirectMessage';

const directMessageIcon = require('./img/direct_message.png');

const Container = styled.View`
  padding-top: 12.5px;
  padding-bottom: 12.5px;
`;
const PostInfoContainer = styled.View`
  padding-left: 25px;
  padding-right: 25px;
  width: 100%;
  height: 35px;
  flex-direction: row;
  justify-content: space-between;
`;
const ProfileContainer = styled.View`
  flex-direction: row;
`;
const ProfileImage = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: ${35 / 2}px;
`;
const ProfileInfoContainer = styled.View`
  justify-content: space-between;
  margin-left: 12px;
`;
const ProfileInfo = styled.Text`
  font-size: 16px;
  color: #323b45;
`;
const FavoriteCafeContainer = styled.TouchableOpacity``;
const FavoriteCafe = styled.Text`
  font-size: 14px;
  color: #a8b6c8;
`;
const PostCreatedAt = styled.Text`
  font-size: 13px;
  color: #a8b6c8;
`;
const ContentContainer = styled.View`
  padding-top: 15px;
`;
const Columns = styled.Text`
  padding-left: 25px;
  padding-right: 25px;
  font-size: 16px;
  color: #5c6979;
`;
const PostImageContainer = styled.View`
  /* padding-left: 25px;
  padding-right: 25px; */
  margin-top: 7px;
  width: 100%;
  height: 220px;
  /* border-radius: 10px;
  overflow: hidden; */
`;
const PostImage = styled.Image`
  width: 100%;
  height: 100%;
  /* border-radius: 10px; */
`;
const FunctionContainer = styled.View`
  margin-left: 25px;
  margin-right: 25px;
  border-bottom-width: 0.5px;
  border-color: #a8b6c8;
  flex-direction: row;
  padding-top: 16px;
  padding-bottom: 16px;
`;
const IconBox = styled.TouchableOpacity`
  margin-right: 30px;
`;
const IconImage = styled.Image`
  width: 22px;
  height: 22px;
`;
const ChatContainer = styled.View``;

const SelectedText = styled.Text``;

interface Props {
  name: string;
  cafeName: string;
  photoURL: string;
  createdAt: Date;
  columns: string;
  postImage: string | null;
  onCafePress: () => void;
}

function timeConvert(time: number): string {
  const date = new Date(time);
  return moment(date).fromNow();
}

function Card(props: Props) {
  return (
    <Container>
      <PostInfoContainer>
        <ProfileContainer>
          <ProfileImage source={{ uri: props.photoURL }} />
          <ProfileInfoContainer>
            <ProfileInfo>{props.name}</ProfileInfo>
            <FavoriteCafeContainer onPress={props.onCafePress}>
              <FavoriteCafe>{props.cafeName}</FavoriteCafe>
            </FavoriteCafeContainer>
          </ProfileInfoContainer>
        </ProfileContainer>
        <PostCreatedAt>{timeConvert(props.createdAt.getTime())}</PostCreatedAt>
      </PostInfoContainer>
      <ContentContainer>
        <Columns>{props.columns}</Columns>
        {props.postImage && (
          <PostImageContainer>
            <PostImage source={{ uri: props.postImage }} />
          </PostImageContainer>
        )}
      </ContentContainer>
      <FunctionContainer>
        <IconBox>
          <Heart size={24} color="#323b45" />
        </IconBox>
        <IconBox>
          <Chat size={24} color="#323b45" />
        </IconBox>
        <IconBox>
          <IconImage source={directMessageIcon} />
        </IconBox>
      </FunctionContainer>
    </Container>
  );
}

export default Card;
