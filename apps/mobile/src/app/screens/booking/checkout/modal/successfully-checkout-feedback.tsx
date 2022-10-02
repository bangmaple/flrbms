import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AlertModal from '../../../../components/modals/alert-modal.component';
import { CheckCircleIcon } from 'react-native-heroicons/outline';
import { useAppNavigation } from '../../../../hooks/use-app-navigation.hook';
import { deviceWidth } from '../../../../utils/device';

interface SuccessfullyCheckedOutFeedbackProps {
  isOpened: boolean;

  setOpened(val: boolean): void;

  setFeedbackSent(val: boolean): void;
}

const SuccessfullyCheckedOutFeedback: React.FC<
  SuccessfullyCheckedOutFeedbackProps
> = (props) => {
  const navigate = useAppNavigation();

  return (
    <AlertModal
      isOpened={props.isOpened}
      height={deviceWidth / 2}
      width={deviceWidth / 1.2}
      toggleShown={() => props.setOpened(!props.isOpened)}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <CheckCircleIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 8} />
          <Text style={styles.textContent}>
            Your feedback has been successfully sent to our librarians ^^
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            props.setOpened(!props.isOpened);
            props.setFeedbackSent(true);
          }}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </AlertModal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    color: BLACK,
    fontWeight: '500',
    fontSize: deviceWidth / 23,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    height: 50,
    width: deviceWidth / 1.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 20,
    fontWeight: '600',
  },
});

export default SuccessfullyCheckedOutFeedback;
