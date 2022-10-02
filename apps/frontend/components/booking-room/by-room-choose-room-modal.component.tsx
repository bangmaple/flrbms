import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { ClipboardText, FileDescription, X } from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import { FormikProps } from 'formik';
import { getRoomById } from '../../redux/features/room/thunk/get-room-by-id';
import ChooseSlotModal from './by-room-choose-slot-modal.component';
import { showNotification } from '@mantine/notifications';
import ChooseDeviceModal from './choose-device-modal.component';
import ConfirmModal from './confirm-modal.component';

interface ChooseRoomModalProps {
  formik: FormikProps<any>;
  handleSubmit(): void;
  roomNames: any[];
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

const ChooseRoomModal: React.FC<ChooseRoomModalProps> = (props) => {
  const { classes } = useStyles();
  const [room, setRoom] = useState(null);
  const [showChooseRoom, setShowChooseRoom] = useState(true);
  const [showChooseSlot, setShowChooseSlot] = useState<boolean>(false);
  const [showChooseDevice, setShowChooseDevice] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (props.formik.values.roomId !== '') {
      dispatch(getRoomById(props.formik.values.roomId))
        .unwrap()
        .then((result) => setRoom(result));
    }
  }, [dispatch, props.formik.values.roomId]);

  const handleNextChooseSlot = () => {
    if (room === null) {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'No rooms have been selected yet',
        message: 'Please choose room before to next step',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      setShowChooseRoom(false);
      setShowChooseSlot(true);
    }
  };

  const handleNextChooseDevice = () => {
    setShowChooseSlot(false);
    setShowChooseDevice(true);
  };

  const handleNextConfirm = () => {
    setShowConfirm(true);
    setShowChooseDevice(false);
  };

  const handleBackChooseRoom = () => {
    setShowChooseRoom(true);
    setShowChooseSlot(false);
  };

  const handleBackChooseSlot = () => {
    setShowChooseSlot(true);
    setShowChooseDevice(false);
  };

  const handleBackChooseDevice = () => {
    setShowChooseDevice(true);
    setShowConfirm(false);
  };

  const ChooseRoom: React.FC = () => {
    return (
      <div>
        <Select
          id="roomId"
          name="roomId"
          label="Choose room"
          placeholder="Pick one"
          data={props.roomNames}
          value={props.formik.values.roomId || undefined}
          error={props.formik.errors.roomId}
          onChange={props.formik.handleChange('roomId')}
          required={true}
          searchable={true}
        />
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
          />
        ) : null}
        <div className={classes.divInfor}>
          {room ? (
            <>
              <div className={classes.divHeader}>
                <h3 style={{ margin: 0 }}>Room information</h3>
              </div>
              <div className={classes.modalBody}>
                <InputWrapper label="Room name" description="Unique room name">
                  <TextInput
                    icon={<ClipboardText />}
                    className={classes.textInput}
                    radius="md"
                    readOnly
                    value={room.name}
                  />
                </InputWrapper>
                <InputWrapper
                  label="Room type"
                  description="Type of library in separated"
                >
                  <TextInput
                    icon={<ClipboardText />}
                    className={classes.textInput}
                    radius="md"
                    readOnly
                    value={room.roomTypeName}
                  />
                </InputWrapper>
                <InputWrapper
                  label="Room description"
                  description="Additional information of the room"
                >
                  <Textarea
                    icon={<FileDescription />}
                    className={classes.textInput}
                    radius="md"
                    readOnly
                    value={room.description}
                  />
                </InputWrapper>
              </div>
            </>
          ) : null}
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', margin: 10 }}
        >
          <Button
            onClick={() => handleNextChooseSlot()}
            // leftIcon={<Pencil />}
            color="green"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {showChooseRoom && <ChooseRoom />}
      {showChooseSlot && (
        <ChooseSlotModal
          formik={props.formik}
          handleSubmit={props.handleSubmit}
          handleBackChooseRoom={handleBackChooseRoom}
          handleNextChooseDevice={handleNextChooseDevice}
          roomName={room?.name}
        />
      )}
      {showChooseDevice && (
        <ChooseDeviceModal
          formik={props.formik}
          handleSubmit={props.handleSubmit}
          handleNextConfirm={handleNextConfirm}
          handleBack={handleBackChooseSlot}
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
  divInfor: {
    backgroundColor: '#f0f0f0',
    paddingBottom: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  divHeader: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
    marginTop: '20px',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
    marginTop: 0,
  },
  textInput: {
    marginTop: 10,
  },
});

export default ChooseRoomModal;
