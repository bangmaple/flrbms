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
  User,
  X,
} from 'tabler-icons-react';
import {useAppSelector} from '../../redux/hooks';
import dayjs from 'dayjs';
import {UserInfoModel} from '../../models/user/user-info.model';

interface HolidayInfoModalProps {
  isShown: boolean;

  toggleShown(): void;

}

const HolidayInfoModal: React.FC<HolidayInfoModalProps> = (props) => {
  const {classes} = useStyles();
  const holiday = useAppSelector((state) => state.holiday.holiday);
  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Holiday Information</Text>;
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


          <InputWrapper label="Holiday's name" style={{marginBottom: 20}}>
            <TextInput
              icon={<ClipboardText/>}
              radius="md"
              readOnly
              value={holiday.name}
            />
          </InputWrapper>
          <InputWrapper label="Holiday's description" style={{marginBottom: 20}}>
            <Textarea
              icon={<FileDescription/>}
              radius="md"
              readOnly
              autosize
              minRows={4}
              maxRows={9}
              value={holiday.description}
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
            <InputWrapper label="Date starts">
              <TextInput
                icon={<Calendar/>}
                radius="md"
                readOnly
                id="dateStart"
                value={dayjs(holiday.dateStart).format('dddd DD-MM-YYYY')}
              />
            </InputWrapper>
            <ChevronsRight
              size={28}
              strokeWidth={2}
              color={'black'}
              style={{margin: 'auto 40px', position: 'relative', top: 15}}
            />
            <InputWrapper label="Date ends">
              <TextInput
                icon={<Calendar/>}
                radius="md"
                readOnly
                id="dateEnd"
                value={dayjs(holiday.dateEnd).format('dddd DD-MM-YYYY')}
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
            <InputWrapper label="Created at">
              <TextInput
                icon={<Clock/>}
                radius="md"
                readOnly
                value={dayjs(holiday.createdAt).format('HH:mm DD-MM-YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Created by">
              <TextInput
                icon={<User/>}
                radius="md"
                readOnly
                id="holiday-created-by"
                value={holiday.createdBy}
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
                id="Holiday-updated-at"
                icon={<CalendarStats/>}
                radius="md"
                readOnly
                value={dayjs(holiday.updatedAt).format('HH:mm DD-MM-YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Updated by">
              <TextInput
                id="Holiday-updated-by"
                icon={<User/>}
                radius="md"
                readOnly
                value={holiday.updatedBy}
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

export default HolidayInfoModal;
