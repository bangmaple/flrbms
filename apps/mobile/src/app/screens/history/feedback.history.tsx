import React, { useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FilterIcon,
  SearchIcon,
  SpeakerphoneIcon,
} from 'react-native-heroicons/outline';
import * as SolidIcon from 'react-native-heroicons/solid';
import { ClockIcon } from 'react-native-heroicons/solid';

import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  GREEN,
  LIGHT_GRAY,
  RED,
  WHITE,
} from '@app/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';

const searchTypeStyles = {
  all: {
    width: 40,
    height: 30,
    checkedWidth: -35,
    checkedHeight: -15,
  },
  devices: {
    width: 70,
    height: 30,
    checkedWidth: -65,
    checkedHeight: -15,
  },
  rooms: {
    width: 60,
    height: 30,
    checkedWidth: -55,
    checkedHeight: -15,
  },
  other: {
    width: 60,
    height: 30,
    checkedWidth: -55,
    checkedHeight: -15,
  },
};

const searchTypeBoxSelected = {
  color: FPT_ORANGE_COLOR,
  borderColor: FPT_ORANGE_COLOR,
};

const searchTypeBoxDeSelected = {
  borderColor: '#808080',
  color: BLACK,
};

const FeedbackHistory: React.FC = () => {
  const searchType = useSelector(
    (state: RootState) => state.feedbackSearchFilter.searchType
  );
  const dispatch: AppDispatch = useDispatch();

  const scrollViewRef = useRef<null | ScrollView>(null);
  const navigate = useAppNavigation();

  const searchTypeAllRef = useRef<TouchableOpacity>(null);

  return (
    <SafeAreaView>
      <ScrollView
        ref={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={[styles.container]}>
          <View style={[styles.searchContainer]}>
            <View style={[styles.searchInputContainer]}>
              <SearchIcon color={BLACK} style={[styles.searchInputIcon]} />
              <TextInput
                style={[styles.searchTextInput]}
                placeholder="Search for feedback..."
              ></TextInput>
              <TouchableOpacity
                onPress={() => navigate.navigate('FEEDBACK_HISTORY_FILTER')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <FilterIcon color={BLACK} />
                <Text>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.feedbackItemContainer]}>
            <View style={[styles.feedbackItem]}>
              <View>
                <View style={[styles.feedbackIconContainer]}>
                  <SpeakerphoneIcon color={BLACK} />
                </View>
                <ClockIcon
                  color={FPT_ORANGE_COLOR}
                  style={[styles.feedbackInProgressIconStatus]}
                />
              </View>

              <View style={[styles.feedbackDetailContainer]}>
                <Text style={[styles.feedbackDetailHeader]}>Tivi bị sọc</Text>
                <Text style={[styles.feedbackDetailTime]}>
                  11:54 - 13/05/2022
                </Text>
                <Text style={[styles.feedbackDetailCode]}>
                  Mã tra cứu: ABCD12345
                </Text>
              </View>
            </View>
            <Text style={[styles.feedbackInProgressText]}>IN PROGRESS</Text>
          </View>

          <View style={[styles.feedbackItemContainer]}>
            <View style={[styles.feedbackItem]}>
              <View>
                <View style={[styles.feedbackIconContainer]}>
                  <SpeakerphoneIcon color={BLACK} />
                </View>
                <View
                  style={{
                    borderRadius: 50,
                    marginTop: -20,
                    marginLeft: 32,
                    backgroundColor: GREEN,
                  }}
                >
                  <SolidIcon.CheckIcon color={WHITE} />
                </View>
              </View>

              <View style={[styles.feedbackDetailContainer]}>
                <Text style={[styles.feedbackDetailHeader]}>
                  Máy lạnh bị hỏng
                </Text>
                <Text style={[styles.feedbackDetailTime]}>
                  11:54 - 12/05/2022
                </Text>
                <Text style={[styles.feedbackDetailCode]}>
                  Mã tra cứu: ABCD12344
                </Text>
              </View>
            </View>
            <Text style={[styles.feedbackSuccessText]}>RESOLVED</Text>
          </View>

          <View style={[styles.feedbackItemContainer]}>
            <View style={[styles.feedbackItem]}>
              <View>
                <View style={[styles.feedbackIconContainer]}>
                  <SpeakerphoneIcon color={BLACK} />
                </View>
                <View
                  style={{
                    borderRadius: 50,
                    marginTop: -20,
                    marginLeft: 32,
                    backgroundColor: RED,
                  }}
                >
                  <SolidIcon.XIcon color={WHITE} />
                </View>
              </View>

              <View style={[styles.feedbackDetailContainer]}>
                <Text style={[styles.feedbackDetailHeader]}>Ghế bị gãy</Text>
                <Text style={[styles.feedbackDetailTime]}>
                  11:54 - 11/05/2022
                </Text>
                <Text style={[styles.feedbackDetailCode]}>
                  Mã tra cứu: FRE123
                </Text>
              </View>
            </View>
            <Text style={[styles.feedbackRejectText]}>REJECTED</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: 500,
  },
  searchContainer: {
    borderRadius: 8,
    height: 60,
    margin: 10,
    backgroundColor: WHITE,
  },
  searchInputContainer: {
    backgroundColor: LIGHT_GRAY,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 8,
    width: 300,
    height: 40,
    alignItems: 'center',
  },
  searchInputIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchTextInput: {
    height: 25,
    width: 275,
  },
  searchTypeContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
  },
  searchTypeBox: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTypeText: {
    fontSize: 16,
  },
  feedbackItemContainer: {
    display: 'flex',
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderRadius: 8,
    height: 80,
    justifyContent: 'space-between',
  },
  feedbackItem: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackIconContainer: {
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GRAY,
  },
  feedbackInProgressIconStatus: {
    backgroundColor: WHITE,
    marginTop: -20,
    marginLeft: 32,
  },
  feedbackDetailContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
  feedbackDetailHeader: {
    fontSize: 18,
    fontWeight: '600',
  },
  feedbackDetailTime: {
    fontSize: 12,
    fontWeight: '500',
    color: GRAY,
  },
  feedbackDetailCode: {
    fontSize: 12,
    fontWeight: '500',
  },
  feedbackInProgressText: {
    fontWeight: '600',
    color: FPT_ORANGE_COLOR,
    fontSize: 20,
    marginRight: 10,
  },
  feedbackSuccessText: {
    fontWeight: '600',
    color: GREEN,
    fontSize: 20,
    marginRight: 10,
  },
  feedbackRejectText: {
    fontWeight: '600',
    color: RED,
    fontSize: 20,
    marginRight: 10,
  },
});

export default FeedbackHistory;
