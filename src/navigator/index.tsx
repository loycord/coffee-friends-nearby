import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';

import CreatePost from '../components/CreatePost';
import CafeMap from '../components/CafeMap';
import MapView from '../components/MapView';
import Feed from '../components/Feed';
import Test from '../components/Test';
import Member from '../components/Member';
import Cafe from '../components/Cafe';
import SelectCafeMap from '../components/SelectCafeMap';
import Room from '../components/Room';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

import HomeIcon from '../common/svg/Home';
import UsersIcon from '../common/svg/Users';
import MailIcon from '../common/svg/Mail';
import NotificationIcon from '../common/svg/Notification';
import ProfileIcon from '../common/svg/Profile';

function IconSwitch({ name, color }: { name: string; color: string | null }) {
  if (color == null) color = 'black';
  if (name === 'Home') return <HomeIcon size={24} color={color} />;
  if (name === 'Members') return <UsersIcon size={24} color={color} fill />;
  if (name === 'Messages') return <MailIcon size={24} color={color} fill />;
  if (name === 'Activity') return <NotificationIcon size={24} color={color} />;
  if (name === 'My') return <ProfileIcon size={24} color={color} />;
  return null;
}

const MainTab = createBottomTabNavigator(
  {
    Home: Feed,
    Members: Member,
    Messages: Room,
    // Activity: SelectCafeMap,
    My: Profile
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <IconSwitch name={routeName} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: '#00ac62',
      inactiveTintColor: '#5c6979',
      style: {
        backgroundColor: '#fff'
      }
    }
  }
);

const MainStack = createStackNavigator(
  {
    Main: MainTab,
    MapView,
    Cafe,
    Chat,
    Profile
  },
  {
    headerMode: 'none'
  }
);

export default createStackNavigator(
  {
    Main: MainStack,
    SelectCafeMap,
    CreatePost
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);
