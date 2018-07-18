import React from 'react';
import styled from 'styled-components/native';
// types
import { User } from '../../redux/types';

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
        <ProfileSub>{`and ${members.length - 3} people like this`}</ProfileSub>
      </SocialProfileTexts>
    </SocialBox>
  );
}

export default Social;
