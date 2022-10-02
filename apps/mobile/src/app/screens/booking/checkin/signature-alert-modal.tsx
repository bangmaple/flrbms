import React from 'react';
import AlertModal from '../../../components/modals/alert-modal.component';
import { deviceHeight, deviceWidth } from '../../../utils/device';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';

interface SignatureAlertModalProps {
  isShown: boolean;
  handleShown(): void;
  message: string;
}

const SignatureAlertModal: React.FC<SignatureAlertModalProps> = (props) => {
  return (
    <AlertModal
      isOpened={props.isShown}
      height={deviceWidth / 1.5}
      width={deviceWidth / 1.25}
      toggleShown={() => props.handleShown()}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexGrow: 0.3,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <ExclamationCircleIcon
            style={{
              alignSelf: 'center',
            }}
            color={FPT_ORANGE_COLOR}
            size={deviceHeight / 13}
          />
          <Text
            style={{
              color: BLACK,
              fontSize: deviceWidth / 23,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            {props.message}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => props.handleShown()}
            style={{
              width: deviceWidth / 1.5,
              height: 50,
              borderRadius: 8,
              backgroundColor: FPT_ORANGE_COLOR,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: deviceWidth / 21,
                fontWeight: '600',
                color: WHITE,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AlertModal>
  );
};

const styles = StyleSheet.create({});

export default SignatureAlertModal;
