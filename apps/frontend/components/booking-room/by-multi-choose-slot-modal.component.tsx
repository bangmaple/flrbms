import React, {useEffect, useState} from 'react';
import {Button, InputWrapper, Select, Space, TextInput} from '@mantine/core';
import {ChevronsRight, ClipboardText, X} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {FormikProps} from 'formik';
import {showNotification} from '@mantine/notifications';
import {DatePicker, TimeInput} from '@mantine/dates';
import dayjs from 'dayjs';
import BySlotChooseRoomModal from './by-slot-choose-room-modal.component';
import ChooseDeviceModal from './choose-device-modal.component';
import ConfirmModal from './confirm-modal.component';
import {
  IsUserHaveBookedSameSlotMulti
} from 'apps/frontend/redux/features/room-booking/thunk/fetch-room-booked-same-slot-multi-of-user.thunk';
import {fetchAllSlots} from '../../redux/features/slot';
import {fetchHolidaysMini} from '../../redux/features/holidays/thunk/fetch-holidays-mini.thunk';

interface ChooseMultiDayModalProps {
  formik: FormikProps<any>;

  handleSubmit(): void;

  listUsernames: any[];
}

interface UserInfoModel {
  avatar: string;
  fullname: string;
  role: string;
  phone: string;
  email: string;
  username: string;
  id: string;
  googleId: string;
  keycloakId: string;
  effdate: string;
  description: string;
  img: File;
}

const ByMultiChooseSlotModal: React.FC<ChooseMultiDayModalProps> = (props) => {
  const [showChooseRoom, setShowChooseRoom] = useState(false);
  const [showChooseSlot, setShowChooseSlot] = useState<boolean>(true);
  const [showChooseDevice, setShowChooseDevice] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errorInputTimeStart, setErrorInputTimeStart] = useState('');
  const [errorInputTimeEnd, setErrorInputTimeEnd] = useState('');

  const [showHintSlot, setShowHintSlot] = useState<boolean>(false);
  const [slotNameStart, setSlotNameStart] = useState<string>('');
  const [slotNameEnd, setSlotNameEnd] = useState<string>('');
  const slot = useAppSelector((state) => state.slot.slot);
  const slotObject = new Object(slot);
  const slotsArray = Object.entries(slotObject);

  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  useEffect(() => {
    dispatch(fetchAllSlots()).unwrap();
  }, []);

  const getSlot = (time: string): any => {
    return slotsArray.map((slot) => {
      if (time >= slot[1].start && time <= slot[1].end) {
        return slot[1].name;
      }
    })
  };
  const holidays = useAppSelector((state) => state.holiday.holidaysMini);
  const isHoliday = (date) => {
    const dateFormat = dayjs(date).format('YYYY-MM-DD');
    for (let i = 0; i < holidays.length; i++) {
      if (
        holidays[i].dateStart <= dateFormat &&
        holidays[i].dateEnd >= dateFormat
      ) {
        return true;
      }
    }
  };

  useEffect(() => {
    const timeStart = dayjs(props.formik.values.timeStart).format('HH:mm:ss');
    const slotNameArray = Object.keys(slot);
    if (
      (timeStart < slot[slotNameArray[0]]?.start || timeStart > slot[slotNameArray[slotNameArray.length - 1]]?.end) &&
      userInfo.role === 'Staff'
    ) {
      setErrorInputTimeStart(
        `Must be later than ${slot[slotNameArray[0]]?.start.slice(0, 5)} & earlier than ${slot[slotNameArray[slotNameArray.length - 1]]?.end.slice(0, 5)}`
      );
    } else setErrorInputTimeStart('');
  }, [props.formik.values.timeStart]);

  useEffect(() => {
    const timeEnd = dayjs(props.formik.values.timeEnd).format('HH:mm:ss');
    const slotNameArray = Object.keys(slot);

    if (
      (timeEnd < slot[slotNameArray[0]]?.start || timeEnd > slot[slotNameArray[slotNameArray.length - 1]]?.end) &&
      userInfo.role === 'Staff'
    ) {
      setErrorInputTimeEnd(
        `Must be later than ${slot[slotNameArray[0]]?.start.slice(0, 5)} & earlier than ${slot[slotNameArray[slotNameArray.length - 1]]?.end.slice(0, 5)}`
      );
    } else setErrorInputTimeEnd('');

  }, [props.formik.values.timeEnd]);


  useEffect(() => {
    const currenTime = new Date();
    const currenTimeTimestamp = new Date().setHours(0, 0, 0, 0);
    const checkinDate = props.formik.values.checkinDate?.setHours(0, 0, 0, 0);
    console.log(checkinDate === currenTimeTimestamp);
    const timeStart = props.formik.values.timeStart;
    const timeEnd = props.formik.values.timeEnd;

    if (
      checkinDate === currenTimeTimestamp &&
      (timeStart < currenTime || timeEnd < currenTime)
    ) {
      showNotification({
        id: 'time-invalid',
        color: 'red',
        title: 'The time you selected is over',
        message: 'Please select other time',
        icon: <X/>,
        autoClose: 3000,
      });
    }
  }, [props.formik.values]);

  useEffect(() => {
    if (props.formik.values.checkinDate && props.formik.values.checkoutDate) {
      if (props.formik.values.checkinDate > props.formik.values.checkoutDate) {
        const tmp = props.formik.values.checkinDate;
        props.formik.setFieldValue(
          'checkinDate',
          props.formik.values.checkoutDate
        );
        props.formik.setFieldValue('checkoutDate', tmp);
      }
    }
  }, [props.formik.values.checkinDate, props.formik.values.checkoutDate]);

  const handleNextChooseRoom = () => {
    const timeStart = props.formik.values.timeStart;
    const timeEnd = props.formik.values.timeEnd;
    const slotNameArray = Object.keys(slot);
    // const _15minute = 15 * 60 * 1000;
    if (
      props.formik.values.checkinDate === null ||
      props.formik.values.checkoutDate === null ||
      props.formik.values.checkinSlot === null ||
      props.formik.values.checkoutSlot === null
    ) {
      showNotification({
        id: 'miss-data',
        color: 'red',
        title: 'Miss some filed',
        message: 'Please choose day, time start, time end before doing next step',
        icon: <X/>,
        autoClose: 3000,
      });
    } else if (
      timeStart >= timeEnd
    ) {
      showNotification({
        id: 'time-invalid',
        color: 'red',
        title: `Invalid time start`,
        message:
          'Time start must be earlier than Time end',
        icon: <X/>,
        autoClose: 3000,
      });
    } else if (
      timeStart < slot[slotNameArray[0]]?.start &&
      userInfo.role === 'Staff'
    ) {
      showNotification({
        id: 'time-invalid',
        color: 'red',
        title: `Invalid time start`,
        message: `Time start must be later than ${slot[
          slotNameArray[0]
          ]?.start.slice(0, 5)}`,
        icon: <X/>,
        autoClose: 3000,
      });
    } else if (
      timeEnd > slot[slotNameArray[slotNameArray.length - 1]]?.end &&
      userInfo.role === 'Staff'
    ) {
      showNotification({
        id: 'time-invalid',
        color: 'red',
        title: `Invalid time end`,
        message: `Time end must be earlier than ${slot[
          slotNameArray[slotNameArray.length - 1]
          ]?.end.slice(0, 5)}`,
        icon: <X/>,
        autoClose: 3000,
      });
    } else {
      dispatch(
        IsUserHaveBookedSameSlotMulti({
          checkinDate: props.formik.values.checkinDate,
          checkoutDate: props.formik.values.checkoutDate,
          userId: props.formik.values.bookedFor || userInfo.id,
          checkinTime: props.formik.values.timeStart,
          checkoutTime: props.formik.values.timeEnd,
        })
      )
        .unwrap()
        .then((response) => {
          if (response?.length > 0) {
            showNotification({
              id: 'miss-data',
              color: 'red',
              title: `${
                props.formik.values.bookedFor ? 'User' : 'You'
              } have orther requets at same time`,
              message: `${
                props.formik.values.bookedFor ? 'User' : 'You'
              } already have request booked for ${response} at same time. Please choose another time`,
              icon: <X/>,
              autoClose: 3000,
            });
          } else {
            setShowChooseRoom(true);
            setShowChooseSlot(false);
          }
        });
    }
  };

  const handleNextChooseDevice = () => {
    setShowChooseRoom(false);
    setShowChooseDevice(true);
  };

  const handleNextConfirm = () => {
    setShowConfirm(true);
    setShowChooseDevice(false);
  };

  const handleBackChooseRoom = () => {
    setShowChooseRoom(true);
    setShowChooseDevice(false);
  };

  const handleBackChooseSlot = () => {
    setShowChooseSlot(true);
    setShowChooseRoom(false);
  };

  const handleBackChooseDevice = () => {
    setShowChooseDevice(true);
    setShowConfirm(false);
  };

  const ChooseSlot = (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'flex-start',
          // justifyContent: 'center',
          margin: '20px 0',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <DatePicker
            id="checkinDate"
            style={{width: '250px'}}
            label="Date start"
            placeholder="Select date"
            radius="md"
            required
            inputFormat="DD/MM/YYYY"
            value={props.formik.values.checkinDate}
            minDate={dayjs(new Date()).toDate()}
            maxDate={
              userInfo.role === 'Staff'
                ? dayjs(new Date()).startOf('weeks').add(21, 'days').toDate()
                : null
            }
            onChange={(date) => {
              props.formik.setFieldValue('checkinDate', date);
            }}
            excludeDate={(date) => isHoliday(date)}
          />

          <ChevronsRight
            size={28}
            strokeWidth={2}
            color={'black'}
            style={{margin: 'auto 40px', position: 'relative', top: 15}}
          />

          <DatePicker
            id="checkoutDate"
            style={{width: '250px'}}
            label="Date end"
            placeholder="Select date"
            radius="md"
            required
            inputFormat="DD/MM/YYYY"
            value={props.formik.values.checkoutDate}
            minDate={dayjs(new Date()).toDate()}
            maxDate={
              userInfo.role === 'Staff'
                ? dayjs(new Date()).startOf('weeks').add(21, 'days').toDate()
                : null
            }
            onChange={(date) => {
              props.formik.setFieldValue('checkoutDate', date);
            }}
            excludeDate={(date) => isHoliday(date)}
          />
        </div>
        <Space h="sm"/>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <InputWrapper required label="Time start">
            <TimeInput
              icon={<ClipboardText/>}
              id="timeStart"
              name="timeStart"
              error={errorInputTimeStart}
              description={showHintSlot ? slotNameStart : ''}
              onChange={(e) => {
                props.formik.setFieldValue('timeStart', e);
                const time = dayjs(new Date(e.getTime())).format('HH:mm:ss');
                setSlotNameStart(getSlot(time));
                setShowHintSlot(true);
              }}
              style={{width: '8rem'}}
              // radius="md"
              value={props.formik.values.timeStart}
            />
          </InputWrapper>
          <ChevronsRight
            size={28}
            strokeWidth={2}
            color={'black'}
            style={{margin: 'auto 40px'}}
          />
          <InputWrapper required label="Time end">
            <TimeInput
              icon={<ClipboardText/>}
              id="timeEnd"
              name="timeEnd"
              error={errorInputTimeEnd}
              description={showHintSlot ? slotNameEnd : ''}
              onChange={(e) => {
                props.formik.setFieldValue('timeEnd', e);
                const time = dayjs(new Date(e.getTime())).format('HH:mm:ss');
                setSlotNameEnd(getSlot(time));
                setShowHintSlot(true);
              }}
              style={{width: '8rem'}}
              // radius="md"
              value={props.formik.values.timeEnd}
            />
          </InputWrapper>
        </div>
      </div>

      <div style={{display: 'flex', gap: 20}}>
        <InputWrapper
          required
          label="Number of participants"
          style={{width: '200px'}}
        >
          <TextInput
            icon={<ClipboardText/>}
            id="capacity"
            name="capacity"
            error={props.formik.errors.capacity}
            onChange={props.formik.handleChange}
            // className={classes.textInput}
            radius="md"
            value={props.formik.values.capacity}
          />
        </InputWrapper>
        {userInfo.role !== 'Staff' ? (
          <Select
            id="bookedFor"
            name="bookedFor"
            label="Who use room"
            placeholder="If not choose, the room's user auto is you"
            data={props.listUsernames}
            value={props.formik.values.bookedFor || undefined}
            error={props.formik.errors.bookedFor}
            onChange={props.formik.handleChange('bookedFor')}
            searchable={true}
            style={{flex: 1}}
          />
        ) : null}
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: 10}}>
        <Button disabled={errorInputTimeStart.length > 0 || errorInputTimeEnd.length > 0}
                onClick={() => handleNextChooseRoom()} color="green">
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {showChooseSlot && ChooseSlot}
      {showChooseRoom && (
        <BySlotChooseRoomModal
          formik={props.formik}
          handleSubmit={props.handleSubmit}
          handleBackChooseSlot={handleBackChooseSlot}
          handleNextChooseDevice={handleNextChooseDevice}
        />
      )}
      {showChooseDevice && (
        <ChooseDeviceModal
          formik={props.formik}
          handleSubmit={props.handleSubmit}
          handleNextConfirm={handleNextConfirm}
          handleBack={handleBackChooseRoom}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          formik={props.formik}
          handleSubmit={props.handleSubmit}
          handleBackChooseDevice={handleBackChooseDevice}
        />
      )}
    </>
  );
};

export default ByMultiChooseSlotModal;
