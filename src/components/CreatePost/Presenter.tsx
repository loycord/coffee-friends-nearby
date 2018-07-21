import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { State } from './Container';
import Header from '../../common/Header';
import Camera from '../../common/svg/Camera';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;
const TextInputContainer = styled.KeyboardAvoidingView`
  flex: 1;
  position: relative;
`;
const FixedContainer = styled.View`
  flex: 1;
`;
const PostInput = styled.TextInput`
  padding: 25px;
  margin-bottom: 46px;
  font-size: 18px;
`;
const PreviewImage = styled.Image`
  width: 100%;
  height: 60%;
`;
const ImagePicker = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  padding-left: 25px;
  background-color: #f4f4f4;
`;
const HeaderContainer = styled.View`
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;
const TextButtonContainer = styled.TouchableOpacity`
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
  align-items: center;
`;
const TextButton = styled.Text`
  font-size: 16px;
  color: #fff;
`;

interface Props extends State {
  handleChangeText: (text: string) => void;
  handleCreatePost: () => void;
  handlePickImage: () => void;
  navigateBack: () => void;
  inputRef: any;
}

const Presenter = (props: Props) => (
  <Container>
    <Header
      statusBar="light"
      style={{
        backgroundColor: '#00ac62',
        shadowColor: 'rgb(132, 132, 132)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5
      }}
    >
      <HeaderContainer>
        <TextButtonContainer onPress={props.navigateBack}>
          <TextButton>취소</TextButton>
        </TextButtonContainer>
        <HeaderTitle>글쓰기</HeaderTitle>
        <TextButtonContainer onPress={props.handleCreatePost}>
          <TextButton>확인</TextButton>
        </TextButtonContainer>
      </HeaderContainer>
    </Header>
    <TextInputContainer behavior="padding">
      <FixedContainer>
        <PostInput
          autoCorrect={false}
          innerRef={props.inputRef}
          maxLength={200}
          multiline
          onChangeText={text => props.handleChangeText(text)}
          value={props.text}
          selectionColor="#00ac62"
        />
        {props.image && <PreviewImage source={{ uri: props.image.uri }} />}
        <ImagePicker>
          <TouchableOpacity onPress={props.handlePickImage}>
            <Camera size={22} color="#5c6979" fill />
          </TouchableOpacity>
        </ImagePicker>
      </FixedContainer>
    </TextInputContainer>
  </Container>
);

export default Presenter;
