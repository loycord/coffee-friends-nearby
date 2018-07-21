import React from 'react';
import styled from 'styled-components/native';
import Camera from '../../common/svg/Camera';

const Container = styled.TouchableOpacity`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 22px;
`;
const WriteContainer = styled.View`
  flex-direction: row;
  border-radius: 3px;
  background-color: #f1f1f1;
  padding: 8px;
  align-items: center;
  justify-content: space-between;
`;
const ProfileTextView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ProfileImage = styled.Image`
  width: 28px;
  height: 28px;
  border-radius: 14px;
`;
const Placeholder = styled.Text`
  margin-left: 10px;
  font-size: 14px;
  color: #a8b6c8;
`;

export default function WritePost(props: {
  photoURL: string;
  onPress: () => void;
}) {
  return (
    <Container onPress={props.onPress}>
      <WriteContainer>
        <ProfileTextView>
          <ProfileImage source={{ uri: props.photoURL }} />
          <Placeholder>What's on your mind?</Placeholder>
        </ProfileTextView>
        <Camera size={20} color="#5c6979" fill />
      </WriteContainer>
    </Container>
  );
}
