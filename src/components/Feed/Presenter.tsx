import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
// types
import { Post, Cafe } from '../../redux/types';
// import D from '../../common/BJNDimension';
// common
import SelectHeaderFilter from '../../common/SelectHeaderFilter';
import Card from '../../common/Card';
import WritePost from './WritePost';

import { State } from './Container';

const PresenterContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;
const FeedContainer = styled.ScrollView`
  flex: 1;
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
  isFilterOpen: boolean;
  userPhotoURL: string;
  cafeId?: string;
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  favoriteCafe: Cafe;
  navigateCafe: (cafeId: string) => void;
  handleOnRefresh: () => void;
  handleChangeFilter: (
    filter: 'cafeId' | 'city' | 'countryCode' | 'all'
  ) => void;
  handleOnPressFilter: () => void;
  navigateCreatePost: () => void;
}

function Presenter(props: Props) {
  return (
    <PresenterContainer>
      {!props.cafeId && (
        <SelectHeaderFilter
          filter={props.filter}
          isFilterOpen={props.isFilterOpen}
          favoriteCafe={props.favoriteCafe}
          handleOnPressFilter={props.handleOnPressFilter}
          handleChangeFilter={props.handleChangeFilter}
        />
      )}
      <FeedContainer
        refreshControl={
          <RefreshControl
            refreshing={props.loadingTop}
            onRefresh={props.handleOnRefresh}
            colors={['#00ac62']}
            tintColor="#00ac62"
          />
        }
      >
        {!props.cafeId && (
          <WritePost
            onPress={props.navigateCreatePost}
            photoURL={props.userPhotoURL}
          />
        )}
        <FlatList
          data={props.data}
          extraData={props.data}
          keyExtractor={(item: any) => item.docId}
          renderItem={({ item }) => (
            <PostItem navigateCafe={props.navigateCafe} item={item} />
          )}
          onEndReached={() => console.log('scroll end')}
        />
      </FeedContainer>
      {props.data.length === 0 && (
        <EmptyView>
          <EmptyText>There's no post :(</EmptyText>
        </EmptyView>
      )}
    </PresenterContainer>
  );
}

export default Presenter;
