import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WHITE } from '@app/constants';

const TextInformation = (props) => {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.title]}>{props.title}</Text>
      <Text style={[styles.content]}>{props.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: null,
    flexGrow: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: WHITE,
    borderRadius: 18,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 5,
  },
  content: {
    fontSize: 19,
    fontWeight: '400',
  },
});

export default TextInformation;
