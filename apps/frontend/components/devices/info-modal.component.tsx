import React from 'react';
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
import { useAppSelector } from '../../redux/hooks';
import dayjs from 'dayjs';

interface DeviceInfoModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleDeleteModalShown(): void;
}

const DeviceInfoModal: React.FC<DeviceInfoModalProps> = (props) => {
  const { classes } = useStyles();
  const device = useAppSelector((state) => state.device.device);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Device Information</Text>;
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size="lg"
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <div className={classes.modalBody}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <InputWrapper label="Device name">
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={device.name}
              />
            </InputWrapper>
            <InputWrapper label="Device type">
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={device.deviceTypeName}
              />
            </InputWrapper>
          </div>
          <InputWrapper label="Device description">
            <Textarea
              icon={<FileDescription />}
              radius="md"
              readOnly
              value={device.description}
              minRows={4}
              style={{ marginBottom: 20 }}
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
                icon={<Clock />}
                radius="md"
                readOnly
                value={dayjs(device.createdAt).format('HH:mm DD/MM/YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Created by">
              <TextInput
                icon={<User />}
                radius="md"
                readOnly
                id="device-createdby"
                value={device.createdBy}
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
                id="device-updatedat"
                icon={<CalendarStats />}
                radius="md"
                readOnly
                value={dayjs(device.updatedAt).format('HH:mm DD/MM/YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Updated by">
              <TextInput
                id="device-updatedby"
                icon={<User />}
                radius="md"
                readOnly
                value={device.updatedBy}
              />
            </InputWrapper>
          </div>
        </div>

        <div className={classes.modalFooter}>
          <Button
            onClick={() => props.toggleDeleteModalShown()}
            variant="outline"
            color={'red'}
            leftIcon={<Trash />}
          >
            Delete this device
          </Button>

          <Button onClick={() => props.toggleShown()} leftIcon={<X />}>
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

export default DeviceInfoModal;
