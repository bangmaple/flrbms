import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExclamationCircleIcon } from 'react-native-heroicons/solid';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';

const CheckAlive = () => {
  const errorIconProps = {
    color: 'red',
    size: 50,
  };

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={[styles.modal]}>
      <View style={[styles.modalContainer]}>
        <ExclamationCircleIcon {...errorIconProps} />
        <View>
          <Text style={[styles.errorText]}>Server has occurred an error.</Text>
          <Text style={[styles.errorText]}>Please try again later!</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LOGIN_SCREEN');
          }}
          style={[styles.errorButton]}
        >
          <Text style={[styles.errorButtonText]}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor: 'rgb(206, 212, 218)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 350,
    height: 180,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 10,
  },
  errorText: {
    margin: 5,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  errorButton: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 50,
    width: 250,
    height: 40,
  },
  errorButtonText: {
    color: WHITE,
    fontSize: 16,
  },
});

export default CheckAlive;
