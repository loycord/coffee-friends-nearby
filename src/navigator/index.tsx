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

import HomeIcon from '../common/svg/Home';
import UsersIcon from '../common/svg/Users';
import MailIcon from '../common/svg/Mail';
import NotificationIcon from '../common/svg/Notification';
import ProfileIcon from '../common/svg/Profile';

function IconSwitch({ name, color }: { name: string; color: string | null }) {
  if (color == null) color = 'black';
  if (name === 'Home') return <HomeIcon color={color} />;
  if (name === 'Members') return <UsersIcon color={color} />;
  if (name === 'Messages') return <MailIcon color={color} />;
  if (name === 'Activity') return <NotificationIcon color={color} />;
  if (name === 'My') return <ProfileIcon color={color} />;
  return null;
}

const MainTab = createBottomTabNavigator(
  {
    Home: Feed,
    Members: Member,
    Messages: CreatePost,
    Activity: CafeMap,
    My: Test
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
    Cafe
  },
  {
    headerMode: 'none'
  }
);

export default createStackNavigator(
  {
    Main: MainStack,
    SelectCafeMap
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);
