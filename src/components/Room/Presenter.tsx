import React from 'react';
import firebase from 'firebase';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
// common
import Header from '../../common/Header';
// types
import { Room } from '../../redux/types';

const PresenterContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;
const UserContainer = styled.TouchableOpacity`
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ImageTextBox = styled.View`
  flex-direction: row;
`;
const ProfileImageBox = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  overflow: hidden;
  margin-right: 10px;
`;
const UserImage = styled.Image`
  width: 100%;
  height: 100%;
`;
const UserTextBox = styled.View`
  justify-content: space-evenly;
`;
const UserText = styled.Text`
  font-size: 16px;
  color: #111111;
`;
const ContentText = styled.Text`
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  color: #9b9b9b;
`;

function timeConvert(time: number): string {
  const date = new Date(time);
  return moment(date).format('LT');
}

function RoomItem({
  item,
  navigateChat
}: {
  item: Room;
  navigateChat: (room: Room) => void;
}) {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    let opponent;
    let noCheckCount;
    if (currentUser.uid === item.fId) {
      opponent = item.to;
      noCheckCount = item.fromNoCheckMessageCount;
    } else {
      opponent = item.from;
      noCheckCount = item.toNoCheckMessageCount;
    }
    return (
      <UserContainer onPress={() => navigateChat(item)}>
        <ImageTextBox>
          <ProfileImageBox>
            <UserImage source={{ uri: opponent.photoURL }} />
          </ProfileImageBox>
          <UserTextBox>
            <UserText>{opponent.displayName}(23)</UserText>
            <ContentText>{item.lastMessage.content}</ContentText>
          </UserTextBox>
        </ImageTextBox>
        <ContentText>{timeConvert(item.updatedAt.seconds * 1000)}</ContentText>
      </UserContainer>
    );
  }
  return null;
}

function Presenter(props: any) {
  return (
    <PresenterContainer>
      <Header
        statusBar="dark"
        title="Members"
        titleStyle={{ fontSize: 16, fontWeight: '500', color: '#00ac62' }}
      />
      <FlatList
        data={props.data}
        extraData={props.data}
        keyExtractor={(item: any) => item.docId}
        renderItem={({ item }) => (
          <RoomItem navigateChat={props.navigateChat} item={item} />
        )}
      />
    </PresenterContainer>
  );
}

export default Presenter;
