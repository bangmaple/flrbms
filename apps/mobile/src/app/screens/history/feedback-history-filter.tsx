import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CheckIcon,
  StarIcon,
  SwitchHorizontalIcon,
  XIcon,
} from 'react-native-heroicons/outline';
import { ClockIcon } from 'react-native-heroicons/solid';

import { FPT_ORANGE_COLOR, GRAY, GREEN, RED, WHITE } from '@app/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import DatePicker from 'react-native-date-picker';
import LoginErrorModal from '../../components/modals/login-error.component';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';

const convertDateToDateStringPattern = (date = new Date()) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const convertDateToNormalizedDateString = (date = new Date()) => {
  return date.toDateString();
}

const convertDateStringToMillis = (date: string) => {
  const parsedDateArr = date.split('/');
  return new Date(Number(parsedDateArr[2]), Number(parsedDateArr[0]) - 1, Number(parsedDateArr[1]))
    .getMilliseconds();
}

const textDateResponsive = Platform.OS === 'android' ? {fontSize: 16} : {fontSize: 20};

const FeedbackHistoryFilter: React.FC = () => {

  const searchType = useSelector((state: RootState) => state.feedbackSearchFilter.searchType);
  const dispatch: AppDispatch = useDispatch();

  const scrollViewRef = useRef<null | ScrollView>(null);
  const navigate = useAppNavigation();

  const [isStartDatePickerShown, setStartDatePickerShown] = useState<boolean>(false);
  const [isEndDatePickerShown, setEndDatePickerShown] = useState<boolean>(false);


  const [startDate, setStartDate] = useState<Date>(() => {
    return new Date('1/1/2022');
  })

  const [isDateFailure, setDateFailure] = useState<boolean>(false);
  const [dateFailureMsg, setDateFailureMsg] = useState<string>();

  const [endDate, setEndDate] = useState<Date>(() => new Date());

  const [isStatusAllSelected, setStatusAllSelected] = useState<boolean>(true);
  const [isStatusResolvedSelected, setStatusResolvedSelected] = useState<boolean>(false);
  const [isStatusInProgressSelected, setStatusInProgressSelected] = useState<boolean>(false);
  const [isStatusRejectedSelected, setStatusRejectedSelected] = useState<boolean>(false);

  const [isFilterTypeAllSelected, setFilterTypeAllSelected] = useState<boolean>(true);
  const [isFilterTypeDevicesSelected, setFilterTypeDevicesSelected] = useState<boolean>(false);
  const [isFilterTypeRoomsSelected, setFilterTypeRoomsSelected] = useState<boolean>(false);
  const [isFilterTypeOtherSelected, setFilterTypeOtherSelected] = useState<boolean>(false);


  useEffect(() => {

    if (isStatusRejectedSelected || isStatusResolvedSelected || isStatusInProgressSelected) {
      setStatusAllSelected(false);
    }

    if (isStatusRejectedSelected && isStatusResolvedSelected && isStatusInProgressSelected) {
      setStatusRejectedSelected(false);
      setStatusResolvedSelected(false);
      setStatusInProgressSelected(false);
      setStatusAllSelected(true);
    }

    if (!isStatusRejectedSelected && !isStatusResolvedSelected && !isStatusInProgressSelected) {
      setStatusAllSelected(true);
    }

  }, [isStatusAllSelected, isStatusResolvedSelected, isStatusInProgressSelected, isStatusRejectedSelected]);

  useEffect(() => {

    if (isFilterTypeDevicesSelected || isFilterTypeRoomsSelected || isFilterTypeOtherSelected) {
      setFilterTypeAllSelected(false);
    }

    if (isFilterTypeDevicesSelected && isFilterTypeRoomsSelected && isFilterTypeOtherSelected) {
      setFilterTypeRoomsSelected(false);
      setFilterTypeOtherSelected(false);
      setFilterTypeDevicesSelected(false);
      setFilterTypeAllSelected(true);
    }

    if (!isFilterTypeDevicesSelected && !isFilterTypeRoomsSelected && !isFilterTypeOtherSelected) {
      setFilterTypeAllSelected(true);
    }

  }, [isFilterTypeAllSelected, isFilterTypeDevicesSelected, isFilterTypeRoomsSelected, isFilterTypeOtherSelected]);

  const handleResetFilter = () => {
    setStartDate(new Date('1/1/2022'));
    setEndDate(new Date());

    setStatusRejectedSelected(false);
    setStatusResolvedSelected(false);
    setStatusInProgressSelected(false);
    setStatusAllSelected(true);

    setFilterTypeRoomsSelected(false);
    setFilterTypeOtherSelected(false);
    setFilterTypeDevicesSelected(false);
    setFilterTypeAllSelected(true);
  }
  const handleApplyFilter = () => {
    navigate.pop();
  }

  const handleSetToDateFilter = (date: Date) => {
    if (date.getTime() > new Date().getTime()) {
      setDateFailureMsg(`To date can't be a future date`);
      setDateFailure(true);
    } else if (date.getTime() < startDate.getTime()) {
      setDateFailureMsg('To date must not be less than from date');
      setDateFailure(true);
    } else {
      setEndDate(date);
    }

    setEndDatePickerShown(false)
  }

  const handleSetFromDateFilter = (date: Date) => {
    if (date.getTime() > endDate.getTime()) {
      setDateFailureMsg('From date must be less than to date');
      setDateFailure(true);
    } else {
      setStartDate(date);
    }
    setStartDatePickerShown(false);
  }

  return (
    <SafeAreaView style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexGrow: 1
    }}>
      <StatusBar hidden={true}/>
      <ScrollView
        ref={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.dateFilterContainer}>
          <View style={styles.dateFilterTextContainer}>
            <Text style={styles.dateFilterText}>
              DATE FILTER
            </Text>
          </View>
          <View style={styles.dateFromToTextContainer}>
            <Text style={styles.dateFromToText}>
              FROM DATE
            </Text>
            <Text style={styles.dateFromToText}>
              TO DATE
            </Text>
          </View>
          <View style={styles.dateSelectionContainer}>
            <TouchableOpacity style={[styles.dateInputBoxContainer]}
                              onPress={() => setStartDatePickerShown(true)}>
              <Text style={textDateResponsive}>{convertDateToNormalizedDateString(startDate)}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={isStartDatePickerShown}
              date={startDate}
              mode="date"
              onConfirm={(date) => handleSetFromDateFilter(date)}
              onCancel={() => setStartDatePickerShown(false)}
            />
            <SwitchHorizontalIcon color='#808080' style={{marginTop: 15}}/>
            <TouchableOpacity style={[styles.dateInputBoxContainer]}
                              onPress={() => setEndDatePickerShown(true)}>
              <Text style={textDateResponsive}>{convertDateToNormalizedDateString(endDate)}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={isEndDatePickerShown}
              date={endDate}
              mode="date"
              onConfirm={(date) => handleSetToDateFilter(date)}
              onCancel={() => setEndDatePickerShown(false)}
            />
          </View>
        </View>

        <View style={{
          marginTop: 20,
          height: 100,
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 8,
          backgroundColor: WHITE
        }}>
          <Text style={{
            margin: 10,
            color: '#808080',
            fontSize: 20
          }}>FILTER TYPE</Text>
          <ScrollView horizontal style={{
            marginLeft: 10,
            marginRight: 10
          }}>
            <View style={{
              margin: 5,
              display: 'flex',
              flexDirection: 'row',
            }}>

              <TouchableOpacity onPress={() => setFilterTypeAllSelected(!isFilterTypeAllSelected)} style={{
                ...styles.filterTypeButton,
                height: 40,
                width: 50,
                marginRight: 10,
              }}>
                <Text style={styles.filterTypeButtonText}>All</Text>
              </TouchableOpacity>
              {isFilterTypeAllSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: -5,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}

              <TouchableOpacity style={{
                ...styles.filterTypeButton,
                height: 40,
                width: 80,
                marginRight: 10,
              }} onPress={() => setFilterTypeDevicesSelected(!isFilterTypeDevicesSelected)}>
                <Text style={styles.filterTypeButtonText}>Devices</Text>
              </TouchableOpacity>
              {isFilterTypeDevicesSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: 55,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}

              <TouchableOpacity style={{
                ...styles.filterTypeButton,
                height: 40,
                width: 70,
                marginRight: 10,

              }} onPress={() => setFilterTypeRoomsSelected(!isFilterTypeRoomsSelected)}>
                <Text style={styles.filterTypeButtonText}>Rooms</Text>
              </TouchableOpacity>
              {isFilterTypeRoomsSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: 145,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}

              <TouchableOpacity style={{
                ...styles.filterTypeButton,
                height: 40,
                width: 70
              }} onPress={() => setFilterTypeOtherSelected(!isFilterTypeOtherSelected)}>
                <Text style={styles.filterTypeButtonText}>Other</Text>
              </TouchableOpacity>
              {isFilterTypeOtherSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: 225,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}
            </View>
          </ScrollView>
        </View>

        <View style={{
          marginTop: 20,
          height: 170,
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 8,
          backgroundColor: WHITE
        }}>
          <Text style={{
            margin: 10,
            color: '#808080',
            fontSize: 20
          }}>FEEDBACK STATUS</Text>
          <View style={{
            display: 'flex',
            marginLeft: 12,
            flexDirection: 'column',
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <TouchableOpacity onPress={() => {
                setStatusRejectedSelected(false);
                setStatusResolvedSelected(false);
                setStatusInProgressSelected(false);
                setStatusAllSelected(true);
              }} style={isStatusAllSelected
                ? styles.feedbackStatusAllSelectedContainer
                : styles.feedbackStatusAllNotSelectedContainer}>
                <View style={isStatusAllSelected
                  ? styles.feedbackStatusAllSelectedIconContainer
                  : styles.feedbackStatusAllNotSelectedIconContainer}>
                  <StarIcon color={isStatusAllSelected ? '#808080' : WHITE} size={20}/>
                </View>
                <Text style={isStatusAllSelected
                  ? styles.feedbackStatusAllSelectedText
                  : styles.feedbackStatusAllNotSelectedText
                }>ALL</Text>

              </TouchableOpacity>
              {isStatusAllSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: -5,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}


              <TouchableOpacity onPress={() => {
                setStatusInProgressSelected(!isStatusInProgressSelected);
              }} style={isStatusInProgressSelected
                ? styles.feedbackStatusInProgressSelectedContainer
                : styles.feedbackStatusInProgressNotSelectedContainer}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <ClockIcon color={isStatusInProgressSelected ? WHITE : FPT_ORANGE_COLOR}/>
                  <Text style={isStatusInProgressSelected
                    ? styles.feedbackStatusInProgressSelectedText
                    : styles.feedbackStatusInProgressNotSelectedText}>IN PROGRESS</Text>
                </View>

              </TouchableOpacity>
              {isStatusInProgressSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: 165,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}
            </View>

            <View style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <TouchableOpacity style={isStatusResolvedSelected
                ? styles.feedbackStatusResolvedSelectedContainer
                : styles.feedbackStatusResolvedNotSelectedContainer} onPress={() => {
                setStatusResolvedSelected(!isStatusResolvedSelected);
              }}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View style={isStatusResolvedSelected
                    ? styles.feedbackStatusResolvedSelectedIconContainer
                    : styles.feedbackStatusResolvedNotSelectedIconContainer}>
                    <CheckIcon color={isStatusResolvedSelected ? 'rgb(64,192,87)' : WHITE} size={20}/>
                  </View>
                  <Text style={isStatusResolvedSelected
                    ? styles.feedbackStatusResolvedSelectedText
                    : styles.feedbackStatusResolvedNotSelectedText}>RESOLVED</Text>
                </View>

              </TouchableOpacity>
              {isStatusResolvedSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: -5,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}
              <TouchableOpacity onPress={() => {
                setStatusRejectedSelected(!isStatusRejectedSelected);
              }} style={isStatusRejectedSelected
                ? styles.feedbackStatusRejectSelectedContainer
                : styles.feedbackStatusRejectNotSelectedContainer}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View style={isStatusRejectedSelected
                    ? styles.feedbackStatusRejectedSelectedIconContainer
                    : styles.feedbackStatusRejectedNotSelectedIconContainer}>
                    <XIcon color={isStatusRejectedSelected ? 'rgb(250,82,82)' : WHITE} size={20}/>
                  </View>
                  <Text style={isStatusRejectedSelected
                    ? styles.feedbackStatusRejectedSelectedText
                    : styles.feedbackStatusRejectedNotSelectedText}>
                    REJECTED</Text>
                </View>

              </TouchableOpacity>
              {isStatusRejectedSelected ? <View style={{
                ...styles.checkedBadgeContainer,
                marginLeft: 165,
                marginTop: -5,
                position: 'absolute',
              }}>
                <CheckIcon color={WHITE} size={18}/>
              </View> : null}
            </View>
          </View>
        </View>
        {isDateFailure ? <LoginErrorModal
          isFailure={isDateFailure}
          title={dateFailureMsg}
          description={"Please try again later"}
          handleCancelModal={setDateFailure}/> : null}
      </ScrollView>
      <View style={[styles.footerContainer]}>
        <TouchableOpacity style={[styles.deleteFilterButton]} onPress={() => handleResetFilter()}>
          <Text style={[styles.deleteFilterButtonText]}>Reset Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.applyFilterButton]} onPress={() => handleApplyFilter()}>
          <Text style={[styles.applyFilterButtonText]}>
            Apply Filter
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  dateFilterContainer: {
    marginTop: 20,
    height: 140,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: WHITE
  },
  dateFilterTextContainer: {
    marginTop: 10,
    marginLeft: 10
  },
  dateFilterText: {
    fontSize: 20,
    color: GRAY
  },
  dateInputBoxContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: 150,
    height: 40,
    borderRadius: 5,
    backgroundColor: GRAY
  },
  dateFromToTextContainer: {
    marginTop: 15,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginLeft: -10,
  },
  dateFromToText: {
    color: GRAY,
    fontSize: 18,
    fontWeight: '600'
  },
  dateSelectionContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  feedbackStatusResolvedNotSelectedContainer: {
    width: 170,
    height: 50,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  feedbackStatusResolvedSelectedContainer: {
    width: 170,
    height: 50,
    backgroundColor: GREEN,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  feedbackStatusResolvedNotSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: GREEN
  },
  feedbackStatusResolvedSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: WHITE
  },
  feedbackStatusResolvedNotSelectedIconContainer: {
    backgroundColor: GREEN,
    borderRadius: 50,
  },
  feedbackStatusResolvedSelectedIconContainer: {
    backgroundColor: WHITE,
    borderRadius: 50,
  },
  feedbackStatusInProgressNotSelectedContainer: {
    width: 170,
    height: 50,
    borderWidth: 1,
    borderColor: FPT_ORANGE_COLOR,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackStatusInProgressSelectedContainer: {
    width: 170,
    height: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackStatusInProgressNotSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: FPT_ORANGE_COLOR
  },
  feedbackStatusInProgressSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: WHITE
  },
  feedbackStatusRejectNotSelectedContainer: {
    width: 170,
    height: 50,
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackStatusRejectSelectedContainer: {
    width: 170,
    height: 50,
    backgroundColor: RED,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackStatusRejectedNotSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: RED
  },
  feedbackStatusRejectedNotSelectedIconContainer: {
    backgroundColor: RED,
    borderRadius: 50,
  },
  feedbackStatusRejectedSelectedIconContainer: {
    backgroundColor: WHITE,
    borderRadius: 50,
  },
  feedbackStatusRejectedSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: WHITE
  },
  feedbackStatusAllNotSelectedContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 170,
    height: 50,
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 5,
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5
  },
  feedbackStatusAllSelectedContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 170,
    height: 50,
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 5,
    backgroundColor: GRAY,
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5
  },
  feedbackStatusAllNotSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: GRAY
  },
  feedbackStatusAllSelectedText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
  },
  feedbackStatusAllNotSelectedIconContainer: {
    borderRadius: 50,
    backgroundColor: GRAY
  },
  feedbackStatusAllSelectedIconContainer: {
    borderRadius: 50,
    backgroundColor: WHITE
  },
  checkedBadgeContainer: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    display: 'flex',
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80
  },
  deleteFilterButton: {
    width: 170,
    height: 50,
    borderWidth: 1,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  deleteFilterButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: FPT_ORANGE_COLOR
  },
  applyFilterButton: {
    height: 50,
    width: 170,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  applyFilterButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: WHITE
  },
  filterTypeButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: FPT_ORANGE_COLOR
  },
  filterTypeButtonText: {
    fontSize: 18,
    color: FPT_ORANGE_COLOR
  },
});

export default FeedbackHistoryFilter;
