import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AlertModal from './modals/alert-modal.component';
import { deviceWidth } from '../utils/device';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import RNExitApp from 'react-native-exit-app';

interface Props {
  isShown: boolean;

  toggleShown(): void;
}

const CannotConnectToServer: React.FC<Props> = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
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
              <Text style={styles.textHeader}>Internal Server Error</Text>
              <Text style={styles.textContent}>
                Cannot connect to the server
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                RNExitApp.exitApp();
              }}
              style={styles.quitButton}
            >
              <Text style={styles.quitButtonText}>Quit application</Text>
            </TouchableOpacity>
          </View>
        </AlertModal>
      </View>
    </SafeAreaView>
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
    flexGrow: 1,
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: deviceWidth / 21,
    fontWeight: '600',
    color: BLACK,
  },
  textContent: {
    fontSize: deviceWidth / 24,
    fontWeight: '600',
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

export default CannotConnectToServer;
