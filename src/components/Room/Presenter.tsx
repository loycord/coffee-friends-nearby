import React from 'react';
import firebase from 'firebase';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
// types
import { Room } from '../../redux/types';

const Container = styled.TouchableOpacity`
  padding: 20px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 2px;
`;
const SomeText = styled.Text`
  font-size: 16px;
`;

const UserProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
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
      <Container onPress={() => navigateChat(item)}>
        <UserProfileImage source={{ uri: opponent.photoURL }} />
        <SomeText>{opponent.displayName}</SomeText>
        <SomeText>{item.lastMessage.content}</SomeText>
        <SomeText>{timeConvert(item.updatedAt.seconds * 1000)}</SomeText>
        <SomeText>No check: {noCheckCount}</SomeText>
      </Container>
    );
  }
  return null;
}

function Presenter(props: any) {
  return (
    <FlatList
      data={props.data}
      extraData={props.data}
      keyExtractor={(item: any) => item.docId}
      renderItem={({ item }) => (
        <RoomItem navigateChat={props.navigateChat} item={item} />
      )}
    />
  );
}

export default Presenter;
