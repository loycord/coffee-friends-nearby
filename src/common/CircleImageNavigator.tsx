import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import D from './BJNDimension';

const circleRadius = D.Width(7.5); // 28
const circleDiameter = circleRadius * 2;
const circleHorizontalMargin = D.Width(1.5); // 5
const imageRadius = D.Width(6.5); // 24
const imageDiameter = imageRadius * 2;

interface CircleProps {
  item: any;
  onPress: () => any;
}

function CircleItem({ item, onPress }: CircleProps) {
  return (
    <View style={styles.navItemContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.navCircleContainer}
        activeOpacity={0.7}
      >
        <Image
          style={{
            width: imageDiameter,
            height: imageDiameter,
            borderRadius: imageRadius
          }}
          source={{ uri: item.photoURL }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function CircleImageNavigator(props: any) {
  return (
    <ScrollView
      style={{ height: imageDiameter }}
      bounces
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {props.data.length === 0 ? (
        <View style={styles.navItemContainer}>
          <View style={styles.navCircleContainer}>
            <View style={styles.circle} />
          </View>
        </View>
      ) : (
        props.data
          .slice(0, 10)
          .map((item: any) => (
            <CircleItem key={item.docId} item={item} onPress={props.onPress} />
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: imageDiameter,
    height: imageDiameter,
    borderRadius: imageRadius,
    backgroundColor: '#d8d8d8'
  },
  navItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  navCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleRadius,
    marginHorizontal: circleHorizontalMargin
  }
});
