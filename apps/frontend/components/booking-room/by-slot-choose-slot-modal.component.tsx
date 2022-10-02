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
  IsUserHaveBookedSameSlot
} from '../../redux/features/room-booking/thunk/fetch-room-booked-same-slot-of-user.thunk';
import {fetchAllSlots} from '../../redux/features/slot';

interface ChooseSlotModalProps {
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

const BySlotChooseSlotModal: React.FC<ChooseSlotModalProps> = (props) => {
  const [showChooseRoom, setShowChooseRoom] = useState(false);
  const [showChooseSlot, setShowChooseSlot] = useState<boolean>(true);
  const [showChooseDevice, setShowChooseDevice] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errorInputTimeStart, setErrorInputTimeStart] = useState('');
  const [errorInputTimeEnd, setErrorInputTimeEnd] = useState('');
  const [slotNameStart, setSlotNameStart] = useState<string>('');
  const [slotNameEnd, setSlotNameEnd] = useState<string>('');
  const holidays = useAppSelector((state) => state.holiday.holidaysMini);
  const dispatch = useAppDispatch();
  const slot = useAppSelector((state) => state.slot.slot);
  const slotObject = new Object(slot);
  const slotsArray = Object.entries(slotObject);

  const getSlot = (time: string): any => {
    return slotsArray.map((slot) => {
      if (time >= slot[1].start && time <= slot[1].end) {
        return slot[1].name;
      }
    });
  };

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
    dispatch(fetchAllSlots()).unwrap();
  }, []);

  useEffect(() => {
    const currenTime = new Date();
    const currenTimeTimestamp = new Date().setHours(0, 0, 0, 0);
    const checkinDate = props.formik.values.checkinDate?.setHours(0, 0, 0, 0);
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

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const handleNextChooseRoom = () => {
    if (
      props.formik.values.checkinDate === null ||
      props.formik.values.timeStart === null ||
      props.formik.values.timeEnd === null
    ) {
      showNotification({
        id: 'miss-data',
        color: 'red',
        title: 'Miss some filed',
        message: 'Please choose day, time start, time end before to next step',
        icon: <X/>,
        autoClose: 3000,
      });
    } else {
      const currenTime = new Date();
      const currenTimeTimestamp = new Date().setHours(0, 0, 0, 0);
      const checkinDate = props.formik.values.checkinDate.setHours(0, 0, 0, 0);
      const timeStart = props.formik.values.timeStart;
      const timeEnd = props.formik.values.timeEnd;
      const slotNameArray = Object.keys(slot);
      // const _15minute = 15 * 60 * 1000;
      if (
        checkinDate === currenTimeTimestamp &&
        (timeStart < currenTime || timeEnd < currenTime)
      ) {
        showNotification({
          id: 'time-invalid',
          color: 'red',
          title: 'The time you selected is over',
          message: `Please choose a time interval greater than ${currenTime.getHours()}:${currenTime.getMinutes()}`,
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
        dayjs(timeStart).format('HH:mm:ss') < slot[slotNameArray[0]]?.start &&
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
        dayjs(timeEnd).format('HH:mm:ss') >
        slot[slotNameArray[slotNameArray.length - 1]]?.end &&
        userInfo.role === 'Staff'
      ) {
        showNotification({
          id: 'time-invalid',
          color: 'red',
          title: `Invalid time end`,
          message: `The time end must be earlier than ${slot[
            slotNameArray[slotNameArray.length - 1]
            ]?.end.slice(0, 5)}`,
          icon: <X/>,
          autoClose: 3000,
        });
      } else {
        dispatch(
          IsUserHaveBookedSameSlot({
            checkinDate: props.formik.values.checkinDate,
            userId: props.formik.values.bookedFor || userInfo.id,
            timeStart: props.formik.values.timeStart,
            timeEnd: props.formik.values.timeEnd,
          })
        )
          .unwrap()
          .then((response) => {
            if (!response) {
              setShowChooseRoom(true);
              setShowChooseSlot(false);
            } else {
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
            }
          });
      }
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
          alignItems: 'flex-end',
          justifyContent: 'center',
          margin: '20px 0',
        }}
      >
        <DatePicker
          id="checkinDate"
          style={{width: '200px', marginRight: 20}}
          label="Check in date"
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
          // onChange={(date) => setbookDate(date)}
          onChange={(date) => {
            props.formik.setFieldValue('checkinDate', date);
          }}
          excludeDate={(date) => isHoliday(date)}
        />
        <InputWrapper required label="Time start ">
          <TimeInput
            icon={<ClipboardText/>}
            id="timeStart"
            name="timeStart"
            error={errorInputTimeStart}
            description={slotNameStart}
            onChange={(e) => {
              props.formik.setFieldValue('timeStart', e);
              const time = dayjs(new Date(e.getTime())).format('HH:mm:ss');
              setSlotNameStart(getSlot(time));
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
          style={{margin: '0 auto'}}
        />
        <InputWrapper required label="Time end">
          <TimeInput
            icon={<ClipboardText/>}
            id="timeEnd"
            name="timeEnd"
            error={errorInputTimeEnd}
            description={slotNameEnd}
            onChange={(e) => {
              props.formik.setFieldValue('timeEnd', e);
              const time = dayjs(new Date(e.getTime())).format('HH:mm:ss');
              setSlotNameEnd(getSlot(time));
            }}
            style={{width: '8rem'}}
            // radius="md"
            value={props.formik.values.timeEnd}
          />
        </InputWrapper>
      </div>
      <Space h="sm"/>
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
            label="Who uses room"
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

export default BySlotChooseSlotModal;
