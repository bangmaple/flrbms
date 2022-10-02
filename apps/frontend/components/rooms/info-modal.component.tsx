import React, {useEffect, useState} from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  CalendarStats,
  ClipboardText,
  Clock,
  FileDescription,
  Trash,
  User,
  X,
} from 'tabler-icons-react';
import {useAppSelector} from '../../redux/hooks';
import dayjs from 'dayjs';
import {UserInfoModel} from '../../models/user/user-info.model';

interface RoomInfoModalProps {
  isShown: boolean;

  toggleShown(): void;

  toggleDeleteModalShown(): void;
}

const RoomInfoModal: React.FC<RoomInfoModalProps> = (props) => {
  const {classes} = useStyles();
  const room = useAppSelector((state) => state.room.room);
  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Room Information</Text>;
  };

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  return (
    <>
      <Modal
        title={<ModalHeaderTitle/>}
        size="lg"
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <div className={classes.modalBody}>
          {/* <InputWrapper label="Room ID" style={{ marginBottom: 20 }}>
            <TextInput icon={<Id />} radius="md" readOnly value={room.id} />
          </InputWrapper> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <InputWrapper label="Room name">
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={room.name}
              />
            </InputWrapper>
            <InputWrapper label="Room type">
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={room.roomTypeName}
              />
            </InputWrapper>
          </div>
          <InputWrapper
            label="Room Capacity"
            style={{marginBottom: 20}}
          >
            <TextInput
              icon={<ClipboardText/>}
              id="room-capacity"
              name="capacity"
              radius="md"
              value={room.capacity}
            />
          </InputWrapper>
          <InputWrapper label="Room description" style={{marginBottom: 20}}>
            <Textarea
              icon={<FileDescription/>}
              radius="md"
              readOnly
              autosize
              minRows={4}
              maxRows={9}
              value={room.description}
            />
          </InputWrapper>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <InputWrapper label="Created at">
              <TextInput
                icon={<Clock/>}
                radius="md"
                readOnly
                value={dayjs(room.createdAt).format('HH:mm DD/MM/YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Created by">
              <TextInput
                icon={<User/>}
                radius="md"
                readOnly
                id="room-created-by"
                value={room.createdBy}
              />
            </InputWrapper>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <InputWrapper label="Updated at">
              <TextInput
                id="room-updated-at"
                icon={<CalendarStats/>}
                radius="md"
                readOnly
                value={dayjs(room.updatedAt).format('HH:mm DD/MM/YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Updated by">
              <TextInput
                id="room-updated-by"
                icon={<User/>}
                radius="md"
                readOnly
                value={room.updatedBy}
              />
            </InputWrapper>
          </div>
        </div>

        <div className={classes.modalFooter}>
          {userInfo.role !== 'Staff' ?
            <Button
              onClick={() => props.toggleDeleteModalShown()}
              variant="outline"
              color={'red'}
              leftIcon={<Trash/>}
            >
              Delete this room
            </Button> : null
          }


          <Button onClick={() => props.toggleShown()} leftIcon={<X/>}>
            Close
          </Button>
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
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 10,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RoomInfoModal;
