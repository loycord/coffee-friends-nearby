import React from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  disable: boolean;
  onPressButton: () => void;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 55,
    borderRadius: 35
  },
  text: {
    color: '#fff',
    fontSize: 18
  }
});

export default function Button({ text, disable, onPressButton }: Props) {
  return (
    <TouchableHighlight
      onPress={
        !disable
          ? onPressButton
          : () => {
              console.log('disable');
            }
      }
      style={[
        styles.container,
        {
          backgroundColor: disable ? 'gray' : '#00ac62'
        }
      ]}
      underlayColor="#01663a"
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableHighlight>
  );
}
