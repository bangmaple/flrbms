import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ChevronDoubleRightIcon,
  RefreshIcon,
} from 'react-native-heroicons/outline';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';

interface FooterProps {
  handleResetCalendar(): void;
  handleNextStep(): void;
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() => props.handleResetCalendar()}
        style={styles.resetCalendarButton}
      >
        <View style={styles.resetCalendarButtonTextContainer}>
          <RefreshIcon color={FPT_ORANGE_COLOR} />
          <Text style={styles.resetCalendarButtonText}>Reset Calendar</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.handleNextStep()}
        style={styles.nextStepButton}
      >
        <View style={styles.nextStepButtonTextContainer}>
          <Text style={styles.nextStepButtonText}>Next Step</Text>
          <ChevronDoubleRightIcon color={WHITE} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    height: 90,
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  resetCalendarButton: {
    height: 50,
    width: 170,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetCalendarButtonTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  resetCalendarButtonText: {
    marginLeft: 5,
    fontSize: 20,
    color: FPT_ORANGE_COLOR,
    fontWeight: '600',
  },
  nextStepButton: {
    width: 170,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
  },
  nextStepButtonTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  nextStepButtonText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '600',
    marginRight: 5,
  },
});

export default Footer;

