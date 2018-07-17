import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import HeaderImageScrollView, {
  TriggeringView
} from 'react-native-image-header-scroll-view';
// types
import { Cafe, User } from '../../redux/types';
import { State } from './Container';
// common
import FadeInImage from '../../common/FadeInImage';
import FadeInView from '../../common/FadeInView';
import MapLite from '../../common/MapLite';

const HEADER_HEIGHT = 50;

const Container = styled.View`
  position: relative;
  flex: 1;
`;
const ContentContainer = styled.View`
  position: relative;
  padding-bottom: 20px;
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
`;
const SomeText = styled.Text`
  font-size: 16px;
`;
const IconContainer = styled.TouchableOpacity`
  position: absolute;
  width: ${HEADER_HEIGHT}px;
  height: ${HEADER_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;
const ImageIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

const MapContainer = styled.View`
  flex: 1;
  padding: 25px;
`;
const MapText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  padding-bottom: 3px;

  color: #5c6979;
`;

const Section = styled.View`
  padding-top: 18px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 0;
`;
const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #525252;
`;
const HoursTimeView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
const HoursTimeText = styled.Text`
  font-size: 13px;
  color: #5c6979;
  ${(props: any) => props.bold && `font-weight: 800;`};
  padding-top: 8px;
`;

const HoursTime = ({ day, time, bold }: any) => (
  <HoursTimeView>
    <HoursTimeText bold={bold}>{day}</HoursTimeText>
    <HoursTimeText bold={bold}>{time}</HoursTimeText>
  </HoursTimeView>
);

function Hours(data: any) {
  return (
    <Section>
      <SectionTitle>Hours</SectionTitle>
      <HoursTime bold day="Today" time="5:30 AM to 10:00 PM" />
      <HoursTime day="Tomorrow" time="5:00 AM to 10:30 PM" />
      <HoursTime day="Tuesday" time="4:30 AM to 10:30 PM" />
      <HoursTime day="Wednesday" time="4:30 AM to 10:30 PM" />
      <HoursTime day="Thursday" time="4:30 AM to 10:30 PM" />
      <HoursTime day="Friday" time="4:30 AM to 11:00 PM" />
      <HoursTime day="Saturday" time="5:00 AM to 10:30 PM" />
    </Section>
  );
}

const SocialBox = styled.TouchableOpacity`
  margin-top: 15px;
  margin-bottom: 15px;
  flex: 1;
  flex-direction: row;
`;
const SocialProfileImages = styled.View`
  flex: 2;
  position: relative;
`;
const ProfileImageContainer = styled.View`
  position: absolute;
  ${(props: any) => {
    if (props.zIndex === 0) return 'left: 0px;';
    if (props.zIndex === 1) return 'left: 25px;';
    if (props.zIndex === 2) return 'left: 50px;';
  }};
  width: 44px;
  height: 44px;
  border-radius: 22px;
  overflow: hidden;
  border-width: 2px;
  border-color: #fff;
  z-index: ${(props: any) => props.zIndex};
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
`;
const ProfileImage = styled.Image`
  width: 41px;
  height: 41px;
  border-radius: 21.5px;
`;
const SocialProfileTexts = styled.View`
  flex: 5;
  margin-left: 15px;
`;
const ProfileName = styled.Text`
  font-size: 13px;
  color: #000;
  padding-top: 3px;
  padding-bottom: 3px;
`;
const ProfileSub = styled.Text`
  font-size: 11px;
  color: #5c6979;
`;

function Social({ members }: { members: User[] }) {
  const names: any = [];
  members.slice(0, 3).forEach(member => {
    names.push(member.displayName);
  });
  return (
    <Section>
      <SectionTitle>Social</SectionTitle>
      <SocialBox>
        <SocialProfileImages>
          {members.slice(0, 3).map((member, i) => (
            <ProfileImageContainer key={member.docId} zIndex={i}>
              <ProfileImage source={{ uri: member.photoURL || '' }} />
            </ProfileImageContainer>
          ))}
        </SocialProfileImages>
        <SocialProfileTexts>
          <ProfileName>{names.join(', ')}</ProfileName>
          <ProfileSub>{`and ${members.length -
            3} people like this`}</ProfileSub>
        </SocialProfileTexts>
      </SocialBox>
    </Section>
  );
}

const BACK_ICON = require('../../common/img/back_white.png');
// const HEADER_HEIGHT = Platform.OS === 'ios'  50;

interface Props extends State {
  handleHeaderTextSwitch: (isShow: boolean) => void;
  navigateBack: any;
  navigationMap: any;
  data: Cafe | null;
  members: User[] | null;
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

  const { name, geoPoint, addressLines } = props.data;
  return (
    <Container>
      <HeaderImageScrollView
        maxHeight={210}
        minHeight={HEADER_HEIGHT}
        minOverlayOpacity={0.2}
        maxOverlayOpacity={0.6}
        renderHeader={() => (
          <FadeInImage
            source={require('../../common/img/starbucks_photo4.jpeg')}
            style={{
              flex: 1,
              backgroundColor: 'black',
              resizeMode: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        )}
        renderFixedForeground={() =>
          props.isShowText && (
            <FadeInView
              style={{
                height: HEADER_HEIGHT,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent'
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
            <ForegroundContainer>
              <CafeName>{name}</CafeName>
            </ForegroundContainer>
          </TriggeringView>
          <TouchableOpacity onPress={props.navigationMap} activeOpacity={0.8}>
            <MapLite
              geoPoint={geoPoint}
              render={() => (
                <MapContainer>
                  <MapText>{name}</MapText>
                  <MapText>{addressLines[addressLines.length - 1]}</MapText>
                </MapContainer>
              )}
            />
          </TouchableOpacity>
          <Hours />
          {props.members !== null &&
            props.members.length > 0 && <Social members={props.members} />}
        </ContentContainer>
      </HeaderImageScrollView>
      <IconContainer onPress={props.navigateBack}>
        <ImageIcon source={BACK_ICON} />
      </IconContainer>
    </Container>
  );
}

export default Presenter;
