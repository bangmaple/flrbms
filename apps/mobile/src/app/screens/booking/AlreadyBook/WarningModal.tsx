import React from 'react';
import AlertModal from '../../../components/modals/alert-modal.component';
import { deviceWidth } from '../../../utils/device';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';

interface WarningModalProps {
  isShown: boolean;
  toggleShown(): void;
  message: string;
}

const WarningModal: React.FC<WarningModalProps> = (props) => {
  return (
    <AlertModal
      isOpened={props.isShown}
      height={deviceWidth / 1.9}
      width={deviceWidth / 1.2}
      toggleShown={() => props.toggleShown()}
    >
      <View style={styles.wrapper}>
        <View style={styles.body}>
          <ExclamationCircleIcon
            size={deviceWidth / 8}
            color={FPT_ORANGE_COLOR}
          />
          <Text style={styles.textContent}>{props.message}</Text>
        </View>
        <TouchableOpacity
          onPress={() => props.toggleShown()}
          style={styles.quitButton}
        >
          <Text style={styles.quitButtonText}>I understand</Text>
        </TouchableOpacity>
      </View>
    </AlertModal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexGrow: 1,
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textHeader: {
    fontSize: deviceWidth / 21,
    fontWeight: '600',
    color: BLACK,
  },
  textContent: {
    fontSize: deviceWidth / 24,
    fontWeight: '600',
    textAlign: 'center',
    color: BLACK,
  },
  quitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth / 1.3,
    backgroundColor: FPT_ORANGE_COLOR,
    height: 50,
    borderRadius: 8,
  },
  quitButtonText: {
    fontSize: deviceWidth / 23,
    color: WHITE,
    fontWeight: '600',
  },
});

export default WarningModal;
