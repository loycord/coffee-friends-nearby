import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, AppState } from 'react-native';
import { Constants } from 'expo';
import styled from 'styled-components/native';
// redux
import { Store, Dispatch, Location } from './redux/types';
import { getRooms } from './redux/modules/room';
import { checkOnAuth, updateUserConnected } from './redux/modules/user';
import { setGPS, getGPS } from './redux/modules/gps';
// components
import Auth from './components/Auth';
import SelectCafeMap from './components/SelectCafeMap';
import Navigator from './navigator';
import Loading from './common/Loading';
import Cover from './common/Cover';

const Container = styled.View`
  flex: 1;
  /* padding-top: ${Constants.statusBarHeight}px; */
`;
const StatusBarBackGround = styled.View`
  height: ${Constants.statusBarHeight}px;
  background-color: #000;
`;

interface StateToProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  cafeId: string | null;
}

interface Props extends StateToProps {
  checkOnAuth: (location?: Location) => Dispatch;
  updateUserConnected: (boolean: boolean) => Dispatch;
  setGPS: () => Dispatch;
  getRooms: () => Dispatch;
}

interface State {
  isCover: boolean;
  appState: string;
}

class Root extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isCover: true,
      appState: AppState.currentState
    };

    this.checkOnAuthWithCover = this.checkOnAuthWithCover.bind(this);
    this.renderCheckState = this.renderCheckState.bind(this);
  }

  componentDidMount() {
    this.checkOnAuthWithCover();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.props.updateUserConnected(true);
    }
    if (this.state.appState === 'active' && nextAppState !== 'active') {
      this.props.updateUserConnected(false);
    }
    this.setState({ appState: nextAppState });
  };

  // Data initialize
  async checkOnAuthWithCover() {
    const location = await getGPS();
    await this.props.checkOnAuth(location);
    this.props.getRooms();
    this.setState({ isCover: false });
  }

  renderCheckState() {
    if (this.props.isLoggedIn) {
      // return <Navigator />;
      return this.props.cafeId ? <Navigator /> : <SelectCafeMap />;
    }

    return <Auth />;
  }

  render() {
    return (
      <Container>
        {/* <StatusBarBackGround />
        <StatusBar backgroundColor="#000" barStyle="light-content" /> */}
        {this.renderCheckState()}
        <Loading loading={this.props.isLoading} />
        {this.state.isCover && <Cover />}
      </Container>
    );
  }
}

function mapStateToProps(state: Store): StateToProps {
  const {
    user: { isLoggedIn },
    app: { isLoading }
  } = state;

  const cafeId = state.user.cafeId || null;

  return { isLoggedIn, isLoading, cafeId };
}

export default connect(
  mapStateToProps,
  { checkOnAuth, updateUserConnected, setGPS, getRooms }
)(Root);
