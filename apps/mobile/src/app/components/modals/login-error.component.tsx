import React, { SetStateAction } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { ExclamationCircleIcon } from 'react-native-heroicons/solid';

interface LoginErrorModalProps {
  isFailure: boolean;
  title: string;
  description: string;
  handleCancelModal: SetStateAction<any>;
}

const LoginErrorModal = (props: LoginErrorModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={props.isFailure} style={[styles.layout]}>
      <View style={[styles.layout]}>
        <View style={[styles.modalContainer, styles.shadowProp]}>
          <ExclamationCircleIcon color={'red'} size={50}/>
          <View>
            <Text style={[styles.errorText]}>
              {props.title}
            </Text>
            <Text style={[styles.errorText]}>
              {props.description}
            </Text>
          </View>
          <TouchableOpacity onPress={() => props.handleCancelModal(false)} style={[styles.errorButton]}>
            <Text style={[styles.errorButtonText]}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LoginErrorModal;

const styles = StyleSheet.create({
  layout: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 400,
    backgroundColor: WHITE,
    borderRadius: 8,
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
    height: 40
  },
  errorButtonText: {
    color: WHITE,
    fontSize: 16,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
})
