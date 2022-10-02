import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Divider from '../../../../components/text/divider';
import { deviceWidth } from '../../../../utils/device';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../../hooks/use-app-selector.hook';
import { BLACK, GRAY, INPUT_GRAY_COLOR } from '@app/constants';

const ReadyToCheckinMoreInformation: React.FC<any> = () => {
  const { currentCheckinInformation } = useAppSelector(
    (state) => state.roomBooking
  );

  return (
    <>
      <Text style={styles.informationHeaderTitle}>MORE INFORMATION</Text>
      <View style={[styles.bookingInformationContainer, { marginBottom: 20 }]}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
            flexWrap: 'wrap',
          }}
        >
          <Text style={styles.titleText}>Requested At</Text>
          <Text style={styles.valueText}>
            {dayjs(new Date(currentCheckinInformation.requestedAt)).format(
              'DD/MM/YYYY HH:mm'
            )}
          </Text>
        </View>
        {currentCheckinInformation.description ? (
          <>
            <Divider num={deviceWidth / 10} />
            <View style={styles.dataRowContainer}>
              <Text style={styles.titleText}>Description</Text>
              <Text style={styles.valueText}>
                {currentCheckinInformation.description}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  informationHeaderTitle: {
    marginTop: 20,
    color: GRAY,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
    marginLeft: 20,
  },
  bookingInformationContainer: {
    marginTop: 10,
    display: 'flex',
    width: deviceWidth / 1.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: INPUT_GRAY_COLOR,
    alignSelf: 'center',
  },

  dataRowContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    flexWrap: 'wrap',
  },
  titleText: {
    color: GRAY,
    fontWeight: '400',
    fontSize: deviceWidth / 23,
  },
  valueText: {
    color: BLACK,
    fontSize: deviceWidth / 23,
    fontWeight: '500',
  },
});

export default ReadyToCheckinMoreInformation;
