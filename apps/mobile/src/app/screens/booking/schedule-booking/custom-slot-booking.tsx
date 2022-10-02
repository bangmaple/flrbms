import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import AlertModal from '../../../components/modals/alert-modal.component';
import { deviceWidth } from '../../../utils/device';
import RNPickerSelect from 'react-native-picker-select';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';

interface CustomSlotBookingModalProps {
  isShown: boolean;
  toggleShown(): void;
  date: string;
}

const CustomSlotBookingModal: React.FC<CustomSlotBookingModalProps> = (
  props
) => {
  const [fromSlot, setFromSlot] = useState<string>();
  const [toSlot, setToSlot] = useState<string>();

  const handleSubmitSlotChange = () => {
    alert(fromSlot + ' ' + toSlot);
    props.toggleShown();
  };

  return props.isShown ? (
    <AlertModal
      isOpened
      height={deviceWidth / 3}
      width={deviceWidth / 1.5}
      toggleShown={null}
    >
      <Text>{props.date}</Text>
      <RNPickerSelect
        onValueChange={(e) => setFromSlot(e)}
        items={[
          {
            label: 'Slot 1',
            value: 'slot 1',
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => handleSubmitSlotChange()}
        style={{
          width: 100,
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
            color: WHITE,
            fontSize: deviceWidth / 23,
            fontWeight: '600',
          }}
        >
          Confirm change
        </Text>
      </TouchableOpacity>
    </AlertModal>
  ) : null;
};
const styles = StyleSheet.create({
  container: {},
});

export default CustomSlotBookingModal;
