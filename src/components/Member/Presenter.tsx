import React from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { Constants } from 'expo';
import styled from 'styled-components/native';
import moment from 'moment';
// common
import Header from '../../common/Header';
import SelectHeaderFilter from '../../common/SelectHeaderFilter';
// types
import { State } from './Container';
import { Cafe, User } from '../../redux/types';

const MessageIcon = require('../../common/img/direct_message.png');
const FeedContainer = styled.ScrollView`
  flex: 1;
`;
const UserContainer = styled.View`
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ImageTextBox = styled.TouchableOpacity`
  flex-direction: row;
`;
const ProfileImageBox = styled.View`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;
const OnOffCircle = styled.View`
  position: absolute;
  bottom: 2;
  right: 2;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #55ac62;
  border-width: 1px;
  border-color: #fff;
`;
const UserImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 25px;
`;
const UserTextBox = styled.View`
  justify-content: space-between;
`;
const UserText = styled.Text`
  font-size: 16px;
  color: #111111;
`;
const CafeText = styled.Text`
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  color: #9b9b9b;
`;
const DisTimeText = styled.Text`
  font-size: 12px;
  color: #9b9b9b;
`;
const SendMessageIcon = styled.Image`
  width: 24px;
  height: 24px;
`;
const SendMessage = styled.Button``;
const PresenterContainer = styled.View`
  flex: 1;
  background-color: #fff;
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

class MemberItem extends React.PureComponent<any> {
  timeConvert(time: number): string {
    const date = new Date(time);
    return moment(date).fromNow();
  }

  render() {
    const {
      docId,
      displayName,
      // email,
      cafeName,
      isConnected,
      distance,
      lastAccessTime
    } = this.props.item;
    let { photoURL } = this.props.item;

    const reg = /facebook/;
    if (reg.test(photoURL)) {
      photoURL = `${photoURL}?type=large&width=150&height=150`;
    }

    const userInfo = this.props.item;
    delete userInfo.distance;
    return (
      <UserContainer key={docId}>
        <ImageTextBox
          onPress={() => this.props.navigateProfile(docId, this.props.item)}
          activeOpacity={0.7}
        >
          <ProfileImageBox
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5
            }}
          >
            <UserImage
              source={{
                // uri: `${photoURL}?type=large&redirect=true&width=600&height=600`
                uri: photoURL
              }}
            />
            {isConnected && <OnOffCircle />}
          </ProfileImageBox>
          <UserTextBox>
            <UserText>
              {displayName}
              {/* ({Math.floor(Math.random() * 30 + 15)}) */}
            </UserText>
            <CafeText>{cafeName}</CafeText>
            <DisTimeText>
              {`${distance}miles away`} /{' '}
              {/* {distance > 0 ? `${distance}miles away` : 'nearby'} /{' '} */}
              {lastAccessTime &&
                this.timeConvert(lastAccessTime.seconds * 1000)}
            </DisTimeText>
          </UserTextBox>
        </ImageTextBox>
        <TouchableOpacity
          onPress={() => this.props.handleSendMessage(this.props.item)}
        >
          <SendMessageIcon source={MessageIcon} />
        </TouchableOpacity>
      </UserContainer>
    );
  }
}

function MemberFilter({ onPress, sort }: { onPress: any; sort: any }) {
  return (
    <TouchableOpacity style={{ padding: 15 }} onPress={onPress}>
      <Text
        style={{
          color: '#00ac62',
          fontSize: 14,
          fontWeight: '500'
        }}
      >
        {sort === 'lastAccessTime' ? 'recent' : 'distance'}
      </Text>
    </TouchableOpacity>
  );
}

interface Props extends State {
  handleOnEndReached: () => void;
  handleOnRefresh: () => void;
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  isFilterOpen: boolean;
  handleChangeFilter: (
    filter: 'cafeId' | 'city' | 'countryCode' | 'all'
  ) => void;
  handleOnPressFilter: () => void;
  favoriteCafe: Cafe;
  handleSendMessage: (user: User) => void;
  navigateProfile: (userId: string, user: User) => void;
  handleSwitchMembersSort: () => void;
}

function Presenter(props: Props) {
  return (
    <PresenterContainer>
      <Header
        statusBar="dark"
        title="Members"
        titleStyle={{ fontSize: 16, fontWeight: '500', color: '#00ac62' }}
        renderRight={() => (
          <MemberFilter
            onPress={props.handleSwitchMembersSort}
            sort={props.sort}
          />
        )}
      />
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
        <SelectHeaderFilter
          style={{ marginTop: 0 }}
          filter={props.filter}
          isFilterOpen={props.isFilterOpen}
          favoriteCafe={props.favoriteCafe}
          handleOnPressFilter={props.handleOnPressFilter}
          handleChangeFilter={props.handleChangeFilter}
        />
        <FlatList
          data={props.data}
          extraData={props.data}
          keyExtractor={(item: any) => item.docId}
          renderItem={({ item }) => <MemberItem {...props} item={item} />}
          onEndReached={props.handleOnEndReached}
        />
      </FeedContainer>
      {props.data.length === 0 && (
        <EmptyView>
          <EmptyText>There's no member :(</EmptyText>
        </EmptyView>
      )}
    </PresenterContainer>
  );
}

export default Presenter;
