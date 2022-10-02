import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { WHITE } from '@app/constants';
import { deviceWidth } from '../../utils/device';

interface AlertModalProps {
  isOpened: boolean;
  height: number;
  width: number;

  toggleShown(value: boolean): void;
}

const AlertModal: React.FC<AlertModalProps> = (props) => {
  return (
    <Modal
      animationType="fade"
      onRequestClose={() => props.toggleShown(false)}
      transparent={true}
      style={styles.container}
      visible={props.isOpened}
    >
      <View style={styles.wrapper}>
        <View
          style={[
            styles.modal,
            {
              height: props.height,
              width: props.width,
            },
          ]}
        >
          {props.children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 8,
    width: deviceWidth / 1.25,
    height: deviceWidth / 1.25,
  },
});

export default AlertModal;
