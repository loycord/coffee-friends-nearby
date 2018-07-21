import React from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

interface SelectButtonProps {
  onPress: () => void;
  disable: boolean;
}

export default function SelectButton(props: SelectButtonProps) {
  return (
    <TouchableHighlight
      style={[
        styles.summitButton,
        props.disable && { backgroundColor: '#b5b5b5' }
      ]}
      onPress={props.disable ? () => {} : props.onPress}
      underlayColor={props.disable ? '#b5b5b5' : '#01663a'}
    >
      <Text style={styles.buttonText}>Done</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  summitButton: {
    width: '90%',
    padding: 16,
    borderRadius: 13,
    backgroundColor: '#00ac62',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#fff'
  }
});
