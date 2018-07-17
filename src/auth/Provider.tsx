import React from 'react';
import firebase from 'firebase';
import Expo from 'expo';
import { Alert } from 'react-native';
import { AuthContext, initialState, State } from './context';
import Loading from '../common/Loading';

const FACEBOOK_APP_ID = '488775024884616';

interface Props {
  children: React.ReactChild;
}

class Provider extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    // this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.state = {
      ...initialState,
      logIn: this.loginWithFacebook,
      logOut: this.logOut
    };

    this.checkOnAuth = this.checkOnAuth.bind(this);
  }

  componentDidMount() {
    this.checkOnAuth();
  }

  logOut(): void {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState(prevState => ({
          ...initialState,
          logIn: prevState.logIn,
          logOut: prevState.logOut,
          isLoading: false
        }));
      });
  }

  checkOnAuth(): void {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid, displayName, photoURL, email } = user;
        this.setState({
          uid,
          isLoggedIn: true,
          isLoading: false,
          displayName,
          photoURL,
          email
        });
      } else {
        this.setState({ isLoading: false });
      }
    });
  }

  async loginWithFacebook() {
    console.log('login');
    this.setState({ isLoading: true });
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_APP_ID,
      {
        permissions: ['public_profile', 'email', 'user_birthday'],
        behavior: 'native'
      }
    );

    if (type === 'success' && token !== undefined) {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      console.log('credential::', credential);

      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      console.log(response.json());

      firebase
        .auth()
        .signInWithCredential(credential)
        .then(user => {
          console.log('user::', user);
          const { uid, displayName, photoURL, email } = user;
          this.setState({
            uid,
            isLoggedIn: true,
            isLoading: false,
            displayName,
            photoURL,
            email
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Alert.alert('Facebook login ERROR');
      this.setState({ isLoading: false });
    }
  }

  public render() {
    console.log(this.props, this.state);
    if (this.state.isLoading) return <Loading loading />;

    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default Provider;
