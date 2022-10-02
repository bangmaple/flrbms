import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  Checks,
  ClipboardText,
  X,
} from 'tabler-icons-react';
import { useAppSelector } from '../../redux/hooks';
import dayjs from 'dayjs';

interface InfoModalProps {
  header: React.ReactNode;
  isShown: boolean;

  toggleShown(): void;

  toggleRejectModalShown(): void;

  toggleResolveModalShown(): void;
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

const InfoModal: React.FC<InfoModalProps> = (props) => {
  const { classes } = useStyles();
  const feedback = useAppSelector((state) => state.feedback.feedback);
  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const RenderStatusr: React.FC = () => {
    switch (feedback.status) {
      case 'PENDING':
        return <div className={classes.pendingDisplay}>{feedback.status}</div>;
      case 'RESOLVED':
        return (
          <div style={{ display: 'flex' }}>
            <div className={classes.resolvedDisplay}>{feedback.status}</div>
            <span className={classes.resolvedByDiv}>
              Resolved by <b>{feedback.resolvedBy || 'system'}</b>
            </span>
          </div>
        );
      case 'REJECTED':
        return (
          <div style={{ display: 'flex' }}>
            <div className={classes.rejectedDisplay}>{feedback.status}</div>
          </div>
        );
      default:
        return null;
    }
  };

  const HeaderTitle: React.FC = () => {
    return (
      <div style={{ display: 'flex' }}>
        <div className={classes.headerTitle}>{props.header}</div>
        <div style={{ marginLeft: 10 }}>
          <RenderStatusr />
        </div>
      </div>
    );
  };

  const Infor: React.FC = () => {
    return (
      <>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <InputWrapper label="Created at" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={dayjs(feedback.createdAt).format('DD-MM-YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Created by" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={feedback.createdBy}
              />
            </InputWrapper>
          </div>

          <InputWrapper label="Feedback type" className={classes.inputWrapper}>
            <TextInput
              icon={<ClipboardText />}
              radius="md"
              readOnly
              value={feedback.feedbackType}
            />
          </InputWrapper>
          <InputWrapper
            label="Feedback message"
            className={classes.inputWrapper}
          >
            <Textarea
              icon={<ClipboardText />}
              radius="md"
              readOnly
              value={feedback.feedbackMess}
            />
          </InputWrapper>
        </div>
      </>
    );
  };

  const InforResolved: React.FC = () => {
    return (
      <>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <InputWrapper label="Resolved at" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={dayjs(feedback.resolvedAt).format('DD-MM-YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Resolved by" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={feedback.resolvedBy}
              />
            </InputWrapper>
          </div>
          <InputWrapper
            label="Resolve message"
            className={classes.inputWrapper}
          >
            <Textarea
              icon={<ClipboardText />}
              radius="md"
              readOnly
              value={feedback.replyMess}
            />
          </InputWrapper>
        </div>
      </>
    );
  };

  const InforRejected: React.FC = () => {
    return (
      <>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <InputWrapper label="Rejected at" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={dayjs(feedback.rejectedAt).format('DD-MM-YYYY')}
              />
            </InputWrapper>
            <InputWrapper label="Rejected by" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText />}
                radius="md"
                readOnly
                value={feedback.rejectedBy}
              />
            </InputWrapper>
          </div>
          <InputWrapper
            label="Resolve message"
            className={classes.inputWrapper}
          >
            <Textarea
              icon={<ClipboardText />}
              radius="md"
              readOnly
              value={feedback.replyMess}
            />
          </InputWrapper>
        </div>
      </>
    );
  };

  return (
    <Modal
      size="lg"
      centered
      title={<HeaderTitle />}
      padding="lg"
      transition="pop"
      withinPortal
      trapFocus
      withCloseButton
      closeOnClickOutside
      closeOnEscape
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.body}>
        <Infor />
        {feedback.status === 'RESOLVED' && <InforResolved />}
        {feedback.status === 'REJECTED' && <InforRejected />}

        <div className={classes.footer}>
          {feedback.status === 'PENDING' &&
          userInfo.id !== feedback.createdBy &&
          userInfo.role === 'System Admin' ? (
            <>
              <Button
                onClick={() => props.toggleResolveModalShown()}
                variant="outline"
                color={'green'}
                leftIcon={<Checks />}
              >
                Resolve feedback
              </Button>

              <Button
                onClick={() => props.toggleRejectModalShown()}
                variant="outline"
                color={'red'}
                leftIcon={<X />}
              >
                Reject feedback
              </Button>
            </>
          ) : (
            <div></div>
          )}
          <Button
            leftIcon={<X />}
            color="orange"
            onClick={() => props.toggleShown()}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = createStyles({
  headerTitle: { fontWeight: 600, fontSize: 20 },
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    margin: 10,
    '&:nth-of-type(1)': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
    },
    '&:nth-of-type(2)': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
    },
    '&:nth-of-type(3)': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
    },
  },
  pendingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
    fontWeight: 600,
  },
  rejectedDisplay: {
    color: 'red',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#ff00001c',
    fontWeight: 600,
    marginRight: 5,
  },
  resolvedDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
    marginRight: 5,
  },
  resolvedByDiv: {
    backgroundColor: '#00800024',
    padding: '0 5px',
    borderRadius: 10,
    color: '#40c057',
    fontSize: 15,
  },
  rejectedByDiv: {
    backgroundColor: '#ffe3e3',
    padding: '0 5px',
    borderRadius: 10,
    color: 'red',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default InfoModal;
