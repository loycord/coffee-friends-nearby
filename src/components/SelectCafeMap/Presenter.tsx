import React from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

import FadeInView from '../../common/FadeInView';
import CafeMap from '../CafeMap';

function SelectButton(props: any) {
  return (
    <FadeInView style={styles.buttonContainer} duration={500}>
      <TouchableHighlight
        style={styles.summitButton}
        onPress={props.onPress}
        underlayColor="#01663a"
      >
        <Text style={styles.buttonText}>DONE</Text>
      </TouchableHighlight>
    </FadeInView>
  );
}

function Presenter(props: any) {
  return (
    <CafeMap>
      {props.selectedCafe && <SelectButton onPress={props.updateUserCafe} />}
    </CafeMap>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    height: '18%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  summitButton: {
    width: '90%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#00ac62',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#fff'
  }
});

export default Presenter;
