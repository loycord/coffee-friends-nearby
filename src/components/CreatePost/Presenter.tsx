import React from 'react';
import styled from 'styled-components/native';
import { State } from './Container';

const Container = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-size: 20px;
`;
const PostInput = styled.TextInput`
  border: 1px;
  padding: 15px;
  font-size: 18px;
`;
const PreviewImage = styled.Image`
  width: 100%;
  height: 60%;
`
const Summit = styled.Button``;
const ImagePicker = styled.Button``;

interface Props extends State {
  handleChangeText: (text: string) => void;
  handleCreatePost: () => void;
  handlePickImage: () => void;
}

const Presenter = (props: Props) => (
  <Container>
    <Title>Create Post</Title>
    <PostInput
      editable
      maxLength={200}
      multiline
      numberOfLines={4}
      onChangeText={text => props.handleChangeText(text)}
      value={props.text}
      />
    <Summit title="Summit" onPress={props.handleCreatePost} />
    <ImagePicker title="Image Picker" onPress={props.handlePickImage} />
    {props.image && <PreviewImage source={{ uri: props.image.uri }} />}
  </Container>
);

export default Presenter;
