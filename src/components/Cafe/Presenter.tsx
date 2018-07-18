import React from 'react';
import { TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
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
// local
import Social from './Social';
import Hours from './Hours';

const HEADER_HEIGHT = 50;

const Container = styled.View`
  position: relative;
  flex: 1;
`;
const ContentContainer = styled.View`
  position: relative;
  padding-bottom: 20px;
`;
const ForeAndroidContainer = styled.View`
  position: absolute;
  left: 15px;
  bottom: 20px;
  background-color: transparent;
`
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
        renderForeground={
          Platform.OS === 'android'
            ? () => (
                <ForeAndroidContainer>
                  <CafeName>{name}</CafeName>
                </ForeAndroidContainer>
              )
            : () => null
        }
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
          {Platform.OS === 'ios' && (
            <TriggeringView
              onDisplay={() => props.handleHeaderTextSwitch(false)}
              onHide={() => props.handleHeaderTextSwitch(true)}
            >
              <ForegroundContainer>
                <CafeName>{name}</CafeName>
              </ForegroundContainer>
            </TriggeringView>
          )}
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
          <Section>
            <SectionTitle>Hours</SectionTitle>
            <Hours />
          </Section>
          <Section>
            <SectionTitle>Social</SectionTitle>
            {props.members !== null &&
              props.members.length > 0 && <Social members={props.members} />}
          </Section>
        </ContentContainer>
      </HeaderImageScrollView>
      <IconContainer onPress={props.navigateBack}>
        <ImageIcon source={BACK_ICON} />
      </IconContainer>
    </Container>
  );
}

export default Presenter;
