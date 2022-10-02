import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FPT_ORANGE_COLOR, LIGHT_GRAY, WHITE } from '@app/constants';
import { deviceWidth } from '../../../utils/device';
import { ChevronLeftIcon, PencilAltIcon } from 'react-native-heroicons/outline';
import { useAppNavigation } from '../../../hooks/use-app-navigation.hook';

interface FeedbackFooterProps {
  handlePress(): void;
}

const FeedbackFooter: React.FC<FeedbackFooterProps> = (props) => {
  const navigate = useAppNavigation();

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={() => navigate.pop()} style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: FPT_ORANGE_COLOR,
        borderRadius: 8,
        height: 50,
        width: deviceWidth / 2.6
      }}>
        <ChevronLeftIcon size={deviceWidth / 14} color={FPT_ORANGE_COLOR}/>
        <Text style={{
          fontWeight: '600',
          fontSize: deviceWidth / 19,
          color: FPT_ORANGE_COLOR
        }}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sendFeedbackButton}
        onPress={() => props.handlePress()}
      >
        <PencilAltIcon size={deviceWidth / 14} color={WHITE}/>
        <Text style={styles.sendFeedbackButtonText}>Send feedback!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
    height: 90,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sendFeedbackButton: {
    flexDirection: 'row',
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 8,
    width: deviceWidth / 1.9,
    height: 50,
  },
  sendFeedbackButtonText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: deviceWidth / 21,
  },
});

export default FeedbackFooter;
