import React, { Ref } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deviceHeight, deviceWidth } from '../../../../utils/device';
import { GRAY, INPUT_GRAY_COLOR, WHITE } from '@app/constants';

interface ReadyToCheckinSignatureProps {
  signatureRef?: any;
  isSignatureBoardHidden: boolean;
  handleSignatureBoardHidden(): void;
  handleOnFinishSigning(): void;
  handleSignatureEmptyAction(): void;
  handleClearSignature(): void;
  handleGetSignatureData(val: string): void;
  handleScrollViewEnabled(val: boolean): void;
}

const ReadyToCheckinSignature: React.FC<ReadyToCheckinSignatureProps> = (
  props
) => {
  return (
    <View>
      <View style={styles.signatureContainer}>
        <View style={styles.signatureWrapper}>
          <Text style={styles.signatureTitleHeader}>CHECK-IN SIGNATURE</Text>
          <TouchableOpacity
            onPress={() => props.handleClearSignature()}
            style={styles.clearSignatureButton}
          >
            <Text style={styles.clearSignatureButtonText}>CLEAR</Text>
          </TouchableOpacity>
        </View>
        <View
          onTouchStart={() =>
            !props.isSignatureBoardHidden
              ? props.handleSignatureBoardHidden()
              : null
          }
          style={styles.signatureBoard}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signatureContainer: {
    height: 220,
  },
  signatureWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  signatureTitleHeader: {
    color: GRAY,
    fontWeight: '600',
    fontSize: deviceWidth / 23,
    marginBottom: 5,
  },
  clearSignatureButton: {
    backgroundColor: GRAY,
    borderRadius: 50,
    width: 55,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSignatureButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 28,
    fontWeight: '600',
  },
  signatureBoard: {
    marginTop: 10,
    height: deviceHeight / 5.5,
    width: deviceWidth / 1.1,
    backgroundColor: WHITE,
    borderRadius: 8,
    borderColor: INPUT_GRAY_COLOR,
    borderWidth: 1,
    alignSelf: 'center',
  },
});

export default ReadyToCheckinSignature;
