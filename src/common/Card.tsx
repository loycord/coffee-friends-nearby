import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';

const Container = styled.View`
  padding: 18px;
  padding-top: 0px;
`;
const PostInfoContainer = styled.View`
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
  font-size: 15px;
  color: #a8b6c8;
`;
const ContentContainer = styled.View`
  padding-top: 15px;
`;
const Columns = styled.Text`
  font-size: 16px;
  color: #5c6979;
`;
const PostImageContainer = styled.View`
  margin-top: 7px;
  width: 100%;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
`;
const PostImage = styled.Image`
  width: 100%;
  height: 100%;
`;
const FunctionContainer = styled.View``;
const CommentContainer = styled.View``;

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
    </Container>
  );
}

export default Card;
