import React from 'react';
import AlertModal from "../../../components/modals/alert-modal.component";
import {deviceWidth} from "../../../utils/device";
import {Text, TouchableOpacity, View} from "react-native";
import {ExclamationCircleIcon} from "react-native-heroicons/outline";
import {BLACK, FPT_ORANGE_COLOR, WHITE} from "@app/constants";

interface GenericAlertModalProps {
  isShown: boolean;
  toggleShown(): void;
  message: string;
}

export const GenericAlertModal: React.FC<GenericAlertModalProps> = (props) => {


  return (
    <AlertModal
      isOpened={props.isShown}
      height={200}
      width={deviceWidth / 1.1}
      toggleShown={() =>props.toggleShown()}
    >
      <View
        style={{
          display: 'flex',
          flex: 1,
          flexGrow: 0.9,
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}
      >
        <ExclamationCircleIcon
          style={{
            alignSelf: 'center',
          }}
          size={deviceWidth / 8}
          color={FPT_ORANGE_COLOR}
        />
        <Text
          style={{
            color: BLACK,
            fontWeight: '500',
            fontSize: deviceWidth / 23,
            textAlign: 'center',
          }}
        >
          {props.message}
        </Text>
        <TouchableOpacity
          onPress={() => props.toggleShown()}
          style={{
            backgroundColor: FPT_ORANGE_COLOR,
            height: 40,
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: '500',
              fontSize: deviceWidth / 23,
              color: WHITE,
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </AlertModal>
  );
};
