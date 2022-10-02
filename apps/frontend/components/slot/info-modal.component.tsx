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
  Calendar,
  CalendarStats, ChevronsRight,
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
import {TimeInput} from "@mantine/dates";

interface SlotInfoModalProps {
  isShown: boolean;

  toggleShown(): void;

}

const SlotInfoModal: React.FC<SlotInfoModalProps> = (props) => {
  const {classes} = useStyles();
  const slotConfig = useAppSelector((state) => state.slot.slotConfig);
  const timeStartArray = slotConfig?.start?.split(':');
  const timeEndArray = slotConfig?.end?.split(':');
  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Slot Information</Text>;
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


          <InputWrapper label="Slot's name" style={{marginBottom: 20}}>
            <TextInput
              width={50}
              icon={<ClipboardText/>}
              radius="md"
              readOnly
              value={slotConfig.name}
            />
          </InputWrapper>


          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20
            }}
          >
            <InputWrapper label="Time starts">
              <TimeInput
                icon={<Clock/>}
                name="start"
                disabled
                id="start"
                value={timeStartArray && new Date(new Date().setHours(Number(timeStartArray[0]),Number(timeStartArray[1]),Number(timeStartArray[2])))}
              />

            </InputWrapper>
            <ChevronsRight
              size={28}
              strokeWidth={2}
              color={'black'}
              style={{margin: 'auto 40px', position: 'relative', top: 15}}
            />
            <InputWrapper label="Time ends">
              <TimeInput
                icon={<Clock/>}
                name="start"
                disabled
                id="start"
                value={timeEndArray && new Date(new Date().setHours(Number(timeEndArray[0]),Number(timeEndArray[1]),Number(timeEndArray[2])))}
              />
            </InputWrapper>
          </div>


        </div>

        <div className={classes.modalFooter}>
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

export default SlotInfoModal;
