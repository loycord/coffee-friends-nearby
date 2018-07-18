import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
// types
import { Room } from '../../redux/types';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const SomeText = styled.Text`
  font-size: 16px;
`;

function RoomItem({ item }: { item: Room }) {
  function timeConvert(time: number): string {
    const date = new Date(time);
    return moment(date).fromNow();
  }
  return (
    <Container>
      <SomeText>{item.docId}</SomeText>
      <SomeText>{item.fId}</SomeText>
      <SomeText>{item.tId}</SomeText>
      <SomeText>{item.from.displayName}</SomeText>
      <SomeText>{item.to.displayName}</SomeText>/
      <SomeText>{item.lastMessage.uid}</SomeText>
      <SomeText>{item.lastMessage.content}</SomeText>
      <SomeText>{item.fromNoCheckMessageCount}</SomeText>
      <SomeText>{item.toNoCheckMessageCount}</SomeText>
      <SomeText>{timeConvert(item.updatedAt.seconds * 1000)}</SomeText>
    </Container>
  );
}

function Presenter(props: any) {
  return (
    <FlatList
      data={props.data}
      extraData={props.data}
      keyExtractor={(item: any) => item.docId}
      renderItem={({ item }) => <RoomItem item={item} />}
    />
  );
}

export default Presenter;
