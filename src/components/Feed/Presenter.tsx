import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
// types
import { Post } from '../../redux/types';
// import D from '../../common/BJNDimension';
// common
import SelectHeader from '../../common/SelectHeader';
import Card from '../../common/Card';

import { State } from './Container';

const PresenterContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;
const PostContainer = styled.View`
  width: 100%;
`;
const EmptyView = styled.View`
  width: 100%;
  height: 100px;
  justify-content: flex-start;
  align-items: center;
`;
const EmptyText = styled.Text`
  font-size: 16px;
  color: #5c6979;
`;

function PostItem({
  item,
  navigateCafe
}: {
  item: Post;
  navigateCafe: (cafeId: string) => void;
}) {
  return (
    <PostContainer key={item.docId}>
      <Card
        name={item.displayName}
        photoURL={item.photoURL}
        cafeName={item.cafeName}
        createdAt={new Date(item.createdAt.seconds * 1000)}
        onCafePress={() => navigateCafe(item.cafeId)}
        columns={item.columns}
        postImage={(item.images && item.images[0].url) || null}
      />
    </PostContainer>
  );
}

interface Props extends State {
  handleOnRefresh: () => void;
  navigateCafe: (cafeId: string) => void;
  cafeId?: string;
}

const Presenter = (props: Props) => (
  <PresenterContainer>
    {!props.cafeId && <SelectHeader />}
    <FlatList
      data={props.data}
      extraData={props.data}
      keyExtractor={(item: any) => item.docId}
      renderItem={({ item }) => (
        <PostItem navigateCafe={props.navigateCafe} item={item} />
      )}
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
    {props.data.length === 0 && (
      <EmptyView>
        <EmptyText>There's no post :(</EmptyText>
      </EmptyView>
    )}
  </PresenterContainer>
);

export default Presenter;
