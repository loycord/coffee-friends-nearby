import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { Post } from '../../redux/types';

import { State } from './Container';

const Container = styled.ScrollView`
  flex: 1;
`;
const SomeText = styled.Text`
  font-size: 20px;
`;
const PostContainer = styled.View`
  width: 100%;
  padding: 15px;
  border-bottom-width: 1px;
`;

function PostItem({ item }: { item: Post }) {
  return (
    <PostContainer key={item.docId}>
      <SomeText>{item.docId}</SomeText>
      <SomeText>{item.displayName}</SomeText>
      <SomeText>{item.cafeName}</SomeText>
      <SomeText>{item.columns}</SomeText>
      <SomeText>
        {new Date(item.createdAt.seconds * 1000).toLocaleString()}
      </SomeText>
    </PostContainer>
  );
}

interface Props extends State {
  handleOnRefresh: () => void;
}

const Presenter = (props: Props) => (
  <FlatList
    data={props.data}
    extraData={props.data}
    keyExtractor={(item: any) => item.docId}
    renderItem={({ item }) => <PostItem item={item} />}
    onEndReached={() => console.log('scroll end')}
    refreshControl={
      <RefreshControl
        refreshing={props.loadingTop}
        onRefresh={props.handleOnRefresh}
        colors={['#00ac62']}
        tintColor="#00ac62"
      />
    }
  />
);

export default Presenter;
