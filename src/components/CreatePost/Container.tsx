import React from 'react';
import { Alert, Keyboard, /* Dimensions */ } from 'react-native';
import Presenter from './Presenter';
import { Permissions, Linking, ImagePicker } from 'expo';
import { StoreToProps } from '.';

// const { width, height } = Dimensions.get('window');

export interface State {
  // visibleHeight: number;
  // k_visible: boolean;
  text: string;
  image: any;
}

class Container extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      // visibleHeight: Dimensions.get('window').height,
      // k_visible: false,
      text: '',
      image: null
    };

    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.handlePickImage = this.handlePickImage.bind(this);
    // this.keyboardWillShow = this.keyboardWillShow.bind(this);
    // this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  // componentDidMount() {
  //   Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
  //   Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  // }

  // componentWillUnmount() {
  //   Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow);
  //   Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide);
  // }

  // keyboardWillShow(e: any) {
  //   let newSize = Dimensions.get('window').height - e.endCoordinates.height;
  //   this.setState({ visibleHeight: newSize, k_visible: true });
  // }

  // keyboardWillHide(e: any) {
  //   if (this.componentDidMount) {
  //     this.setState({
  //       visibleHeight: Dimensions.get('window').height,
  //       k_visible: false
  //     });
  //   }
  // }

  handleChangeText(text: string) {
    this.setState({ text });
  }

  handleCreatePost() {
    const { text, image } = this.state;
    console.log(text);
    if (text.length > 0) {
      this.setState({ text: '', image: null });
      this.props.createPost(text, image);
      Keyboard.dismiss();
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

      console.log(result);

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
        handleChangeText={this.handleChangeText}
        handleCreatePost={this.handleCreatePost}
        handlePickImage={this.handlePickImage}
      />
    );
  }
}

export default Container;
