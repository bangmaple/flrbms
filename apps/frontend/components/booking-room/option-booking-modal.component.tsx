import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, createStyles, Modal, Text } from '@mantine/core';
import { BuildingWarehouse, Check, X } from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import ChooseRoomModal from './by-room-choose-room-modal.component';
import autoAnimate from '@formkit/auto-animate';
import { useFormik } from 'formik';
import { fetchRoomNames } from '../../redux/features/room/thunk/fetch-room-names.thunk';
import { fetchDeviceNames } from '../../redux/features/devices/thunk/fetch-device-names.thunk';
import { fetchReasonNames } from '../../redux/features/booking-reason/thunk/fetch-booking-reason-names.thunk';
import { addNewRequest } from '../../redux/features/room-booking/thunk/add-new-booking';
import { showNotification } from '@mantine/notifications';
import { BookingRequestParams } from '../../models/pagination-params/booking-room-params.model';
import { fetchRoomBookings } from '../../redux/features/room-booking/thunk/fetch-room-booking-list';
import BySlotChooseSlotModal from './by-slot-choose-slot-modal.component';
import { fetchListusernames } from '../../redux/features/account/thunk/fetch-user-names.thunk';
import ByMultiChooseSlotModal from './by-multi-choose-slot-modal.component';
import { addMultiRequest } from '../../redux/features/room-booking/thunk/add-multi-booking';
import { io } from 'socket.io-client';
import { UserInfoModel } from '../../models/user/user-info.model';
import * as Yup from 'yup';

interface SendBookingModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: BookingRequestParams;
}

const validation = Yup.object().shape({
  capacity: Yup.number().max(1000, 'Room capacity limits 1000 participants')
    .min(1, 'Room capacity must have at least 1 participant')
    .required('Room capacity is required!')
});

const SendBookingModal: React.FC<SendBookingModalProps> = (props) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const [roomNames, setRoomNames] = useState([]);
  const [listUsernames, setListUsernames] = useState([]);
  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);
  const socket = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);

  useEffect(() => {
    dispatch(fetchRoomNames())
      .unwrap()
      .then((listRoom) => setRoomNames(listRoom));
  }, []);

  useEffect(() => {
    dispatch(fetchListusernames())
      .unwrap()
      .then((listUsername) => setListUsernames(listUsername));
  }, []);

  useEffect(() => {
    dispatch(fetchDeviceNames()).unwrap();
  }, []);

  useEffect(() => {
    dispatch(fetchReasonNames()).unwrap();
  }, []);

  const ModalHeaderTitle: React.FC = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Text className={classes.modalHeaderTitle}>Booking Room</Text>
      </div>
    );
  };

  const Dropdown = () => {
    const [showChooseRoom, setShowChooseRoom] = useState(false);
    const [showChooseSlot, setShowChooseSlot] = useState(false);
    const [showChooseMultiDay, setShowChooseMultiDay] = useState(false);
    const parentChooseRoom = useRef(null);
    const parentChooseSlot = useRef(null);
    const parentChooseMultiDay = useRef(null);

    useEffect(() => {
      parentChooseRoom.current && autoAnimate(parentChooseRoom.current);
    }, []);

    useEffect(() => {
      parentChooseSlot.current && autoAnimate(parentChooseSlot.current);
    }, []);

    useEffect(() => {
      parentChooseMultiDay.current && autoAnimate(parentChooseMultiDay.current);
    }, []);

    const revealRoom = () => {
      formik.resetForm();
      setShowChooseRoom(!showChooseRoom);
      setShowChooseSlot(false);
      setShowChooseMultiDay(false);
    };
    const revealSlot = () => {
      formik.resetForm();
      setShowChooseSlot(!showChooseSlot);
      setShowChooseRoom(false);
      setShowChooseMultiDay(false);
    };
    const revealMultiDay = () => {
      formik.resetForm();
      setShowChooseMultiDay(!showChooseMultiDay);
      setShowChooseSlot(false);
      setShowChooseRoom(false);
    };

    const handleSubmit = (value) => {
      console.log(formik.values.checkoutDate)
      dispatch(
        formik.values.checkoutDate
          ? addMultiRequest(value)
          : addNewRequest(value)
      )
        .unwrap()
        .then((response) => {
          if (userInfo.role === 'Staff') {
            socket.emit('sendRequestForSelf', response.bookedFor);
          } else {
            if (response.bookedFor !== response.requestedBy) {
              socket.emit('sendRequestForOther', response.bookedFor);
            }
          }
          showNotification({
            id: 'add-request',
            color: 'teal',
            title: 'Your request was sent',
            message: 'You request was successfully sent',
            icon: <Check />,
            autoClose: 3000,
          });
        })
        .then(() => {
          props.toggleShown();
          dispatch(fetchRoomBookings(props.pagination));
        })
        .catch((e) =>
          showNotification({
            id: 'add-request',
            color: 'red',
            title: 'Error while sending request',
            message: e.message ?? 'Failed to send request',
            icon: <X />,
            autoClose: 3000,
          })
        );
    };

    const formik = useFormik({
      validationSchema: validation,
      initialValues: {
        roomId: '',
        checkinDate: null,
        checkoutDate: null,
        timeStart: null,
        timeEnd: null,
        bookingReasonId: '',
        listDevice: [],
        description: '',
        bookedFor: null,
        capacity: 1,
      },

      enableReinitialize: true,
      onSubmit: (e) => handleSubmit(e),
    });

    return (
      <div>
        <div className={classes.listButton}>
          {/* <div>
            {!showChooseSlot && !showChooseMultiDay && (
              <Button
                style={{ marginRight: 10 }}
                onClick={revealRoom}
                leftIcon={<BuildingWarehouse />}
              >
                Book by room
              </Button>
            )}
          </div> */}
          <div>
            {!showChooseRoom && !showChooseMultiDay && (
              <Button
                style={{ marginRight: 10 }}
                onClick={revealSlot}
                leftIcon={<BuildingWarehouse />}
              >
                Single Day Booking
              </Button>
            )}
          </div>
          <div>
            {!showChooseRoom && !showChooseSlot && (
              <Button
                style={{ marginRight: 10 }}
                onClick={revealMultiDay}
                leftIcon={<BuildingWarehouse />}
              >
                Multi Day Booking
              </Button>
            )}
          </div>
        </div>
        <div ref={parentChooseRoom}>
          {showChooseRoom && (
            <ChooseRoomModal
              formik={formik}
              handleSubmit={() => formik.handleSubmit()}
              roomNames={roomNames}
              listUsernames={listUsernames}
            />
          )}
        </div>

        <div ref={parentChooseSlot}>
          {showChooseSlot && (
            <BySlotChooseSlotModal
              formik={formik}
              handleSubmit={() => formik.handleSubmit()}
              listUsernames={listUsernames}
            />
          )}
        </div>

        <div ref={parentChooseMultiDay}>
          {showChooseMultiDay && (
            <ByMultiChooseSlotModal
              formik={formik}
              handleSubmit={() => formik.handleSubmit()}
              listUsernames={listUsernames}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        closeOnClickOutside={false}
        size="auto"
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <div style={{ minWidth: 600 }}>
          <Dropdown />
        </div>
      </Modal>
    </>
  );
};

const useStyles = createStyles({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  listButton: {
    display: 'flex',
    justifyContent: 'center',
    margin: 10,
  },
});

export default SendBookingModal;
