import React from 'react';
import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { Cafe } from '../../redux/types';

import FadeInView from '../../common/FadeInView';
import Heart from '../../common/svg/Heart';
import Header from '../../common/Header';
import SelectButton from '../../common/SelectButton';
import CafeMap from '../CafeMap';
// import { selectCafe } from '../../redux/modules/cafe';

function CafeInfo({
  item,
  navigateCafe
}: {
  item: Cafe;
  navigateCafe: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={navigateCafe}
      style={styles.cafeContainer}
      activeOpacity={0.7}
    >
      <View style={styles.cafeInfo}>
        <Text style={{ fontSize: 16, color: '#323b45' }}>{item.name}</Text>
        <Text
          style={{
            fontSize: 13,
            color: '#323b45',
            marginTop: 5,
            marginBottom: 5
          }}
        >
          {item.addressLines[0]}
        </Text>
        <View style={styles.likes}>
          <Heart size={14} color="#5c6979" fill style={{ margin: 5 }} />
          <Text style={{ fontSize: 12, color: '#5c6979' }}>78 likes</Text>
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <View style={styles.cafeImage}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={
              { uri: item.photoURL } ||
              require('../../common/img/starbucks_photo4.jpeg')
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface Props {
  updateUserCafe: () => void;
  selectedCafe: Cafe | null;
  navigateCafe: () => void;
}
function Presenter(props: Props) {
  return (
    <CafeMap>
      <Header title="Choose location" statusBar="dark" />
      <View style={styles.buttonContainer}>
        {props.selectedCafe && (
          <FadeInView duration={500}>
            <CafeInfo
              item={props.selectedCafe}
              navigateCafe={props.navigateCafe}
            />
          </FadeInView>
        )}
        <SelectButton
          onPress={props.updateUserCafe}
          disable={!props.selectedCafe}
        />
      </View>
    </CafeMap>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    left: 0,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cafeContainer: {
    width: '90%',
    borderRadius: 13,
    flexDirection: 'row',
    // overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1
  },
  cafeInfo: {
    flex: 3,
    padding: 14
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cafeImage: {
    flex: 1,
    overflow: 'hidden',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  }
});

export default Presenter;
