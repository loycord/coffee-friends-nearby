import React from 'react';
import { TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Constants, LinearGradient } from 'expo';
import styled from 'styled-components/native';
import HeaderImageScrollView, {
  TriggeringView
} from 'react-native-image-header-scroll-view';
// types
import { Cafe, User } from '../../redux/types';
import { State } from './Container';
// components
import Feed from '../Feed';
// common
import FadeInImage from '../../common/FadeInImage';
import FadeInView from '../../common/FadeInView';
import MapLite from '../../common/MapLite';
import SelectButton from '../../common/SelectButton';
import CircleImageNavigator from '../../common/CircleImageNavigator';

const HEADER_HEIGHT = 50 + Constants.statusBarHeight;

const Container = styled.View`
  position: relative;
  flex: 1;
`;
const ContentContainer = styled.View`
  position: relative;
  padding-bottom: 20px;
`;
const ForeContainer = styled.View`
  position: absolute;
  right: 22px;
  bottom: 15px;
  background-color: transparent;
  align-items: flex-end;
`;
const ForegroundContainer = styled.View`
  position: absolute;
  top: -70px;
  left: 0;
  align-items: flex-start;
  justify-content: flex-end;
  background-color: transparent;
  padding: 20px;
  z-index: 9999;
`;
const CafeName = styled.Text`
  font-size: ${(props: any) => props.fontSize || '26px'};
  font-weight: 900;
  color: #fff;
  text-align: right;
  margin-bottom: 10px;
`;
const SomeText = styled.Text`
  font-size: 16px;
`;
const IconContainer = styled.TouchableOpacity`
  position: absolute;
  width: ${HEADER_HEIGHT}px;
  height: ${HEADER_HEIGHT}px;
  justify-content: center;
  align-items: flex-start;
  top: 0;
  left: 0;
`;
const ImageIcon = styled.Image`
  width: 15px;
  height: 15px;
  padding: 10px;
  margin-left: 20px;
  margin-top: 20px;
`;
const MapContainer = styled.View`
  padding: 25px;
  width: 55%;
  height: 100%;
  justify-content: center;
`;
const MapText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  line-height: 24;
  color: #5c6979;
  padding-top: 5px;
  padding-bottom: 5px;

`;

const AbsoluteButtonView = styled.View`
  position: absolute;
  width: 100%;
  bottom: 10%;
  flex-direction: row;
  justify-content: center;
`;

// const Section = styled.View`
//   padding-top: 18px;
//   padding-left: 25px;
//   padding-right: 25px;
//   padding-bottom: 0;
// `;
// const SectionTitle = styled.Text`
//   font-size: 20px;
//   font-weight: 700;
//   color: #525252;
// `;

const MembersContainer = styled.View`
  margin-bottom: 20px;
`;
const Heading3 = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #5c6979;
  margin: 15px;
`;

const BACK_ICON = require('../../common/img/back_white.png');
// const HEADER_HEIGHT = Platform.OS === 'ios'  50;

interface Props extends State {
  handleHeaderTextSwitch: (isShow: boolean) => void;
  navigateBack: any;
  navigationMap: any;
  data: Cafe | null;
  members: User[];
  updateUserCafe: () => void;
  selectedCafe: Cafe | null;

  isFavoriteCafeSelect?: boolean;
}

function Presenter(props: Props) {
  if (props.isLoading)
    return (
      <Container
        style={{
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </Container>
    );
  if (!props.data) {
    return (
      <Container>
        <SomeText>error: no data.. </SomeText>
      </Container>
    );
  }

  const { docId, name, geoPoint, addressLines, photoURL } = props.data;
  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <HeaderImageScrollView
        maxHeight={220}
        minHeight={HEADER_HEIGHT}
        minOverlayOpacity={0.3}
        maxOverlayOpacity={0.6}
        renderHeader={() => (
          <FadeInImage
            source={
              { uri: photoURL } ||
              require('../../common/img/starbucks_photo4.jpeg')
            }
            style={{
              flex: 1,
              backgroundColor: 'black',
              resizeMode: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        )}
        renderForeground={() => (
          <ForeContainer>
            <CafeName>{name}</CafeName>
          </ForeContainer>
        )}
        renderFixedForeground={() =>
          props.isShowText && (
            <FadeInView
              style={{
                height: HEADER_HEIGHT,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
                bottom: 5
              }}
              duration={500}
            >
              <CafeName fontSize="18px">{name}</CafeName>
            </FadeInView>
          )
        }
      >
        <ContentContainer>
          <TriggeringView
            onDisplay={() => props.handleHeaderTextSwitch(false)}
            onHide={() => props.handleHeaderTextSwitch(true)}
          >
            <ForegroundContainer />
          </TriggeringView>
          <TouchableOpacity onPress={props.navigationMap} activeOpacity={0.8}>
            <MapLite
              geoPoint={geoPoint}
              render={() => (
                <MapContainer>
                  <MapText>{addressLines}</MapText>
                </MapContainer>
              )}
            />
          </TouchableOpacity>
          <MembersContainer>
            <Heading3>
              {props.members.length === 0
                ? 'Be a first member'
                : `${props.members.length} members like this`}
            </Heading3>
            {props.members && <CircleImageNavigator data={props.members} />}
          </MembersContainer>
          <Feed cafeId={docId} />
        </ContentContainer>
      </HeaderImageScrollView>
      <IconContainer onPress={props.navigateBack}>
        <ImageIcon source={BACK_ICON} />
      </IconContainer>
      {props.isFavoriteCafeSelect && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.5)', '#ffffff']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 220,
            height: '100%'
          }}
        />
      )}
      {props.isFavoriteCafeSelect && (
        <AbsoluteButtonView>
          <SelectButton
            onPress={props.updateUserCafe}
            disable={!props.selectedCafe}
          />
        </AbsoluteButtonView>
      )}
    </Container>
  );
}

export default Presenter;
