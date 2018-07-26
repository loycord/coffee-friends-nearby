import React from 'react';
import { Alert, Keyboard /* Dimensions */ } from 'react-native';
import Presenter from './Presenter';
import { Permissions, Linking, ImagePicker } from 'expo';
import { StoreToProps } from '.';

export interface State {
  text: string;
  image: any;
}

class Container extends React.Component<StoreToProps, State> {
  inputRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      text: '',
      image: null
    };
    this.inputRef = React.createRef();
    this.navigateBack = this.navigateBack.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.handlePickImage = this.handlePickImage.bind(this);
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleChangeText(text: string) {
    this.setState({ text });
  }

  handleCreatePost() {
    const { text, image } = this.state;
    if (text.length > 0) {
      this.props.createPost(text, image);
      Keyboard.dismiss();
      this.navigateBack();
    }
  }

  async handlePickImage() {
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert(
        'Notice',
        'Permission to access camera_roll was denied. Do you want to allow the camera roll?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'OK', onPress: () => Linking.openURL('app-settings:') }
        ]
      );
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      if (!result.cancelled) {
        this.setState({ image: result });
      }
    }
  }

  render() {
    return (
      <Presenter
        {...this.props}
        {...this.state}
        inputRef={this.inputRef}
        navigateBack={this.navigateBack}
        handleChangeText={this.handleChangeText}
        handleCreatePost={this.handleCreatePost}
        handlePickImage={this.handlePickImage}
      />
    );
  }
}

export default Container;
