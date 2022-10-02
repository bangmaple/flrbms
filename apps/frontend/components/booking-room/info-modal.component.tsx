import React, { useEffect, useRef } from 'react';
import { createStyles, Modal, Text } from '@mantine/core';
import { useAppSelector } from '../../redux/hooks';
import autoAnimate from '@formkit/auto-animate';
import RequestInfoComponent from './info-component.component';

interface RequestInfoModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleCancelModalShown(): void;
  toggleRejectModalShown(): void;
  toggleAcceptModalShown(): void;
  toggleCheckinModalShown(): void;
  toggleCheckoutModalShown(): void;
  toggleSendFeedbackModalShown(): void;
}

const RequestInfoModal: React.FC<RequestInfoModalProps> = (props) => {
  const { classes } = useStyles();

  const requestBooking = useAppSelector(
    (state) => state.roomBooking.roomBooking
  );
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const RenderStatus: React.FC = () => {
    switch (requestBooking.status) {
      case 'PENDING':
        return <div className={classes.pendingDisplay}>Pending</div>;
      case 'BOOKED':
        return <div className={classes.bookedDisplay}>Booked</div>;
      case 'CHECKED_IN':
        return <div className={classes.checkedInDisplay}>Checked in</div>;
      case 'CHECKED_OUT':
        return <div className={classes.checkedOutDisplay}>Checked out</div>;
      case 'CANCELLED':
        return (
          <div style={{ display: 'flex' }}>
            <div className={classes.canceledDisplay}>Cancelled</div>
            <span className={classes.cancelledByDiv}>
              by <b>{requestBooking.cancelledBy || "System"}</b>
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const ModalHeaderTitle: React.FC = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: 500,
        }}
      >
        <Text className={classes.modalHeaderTitle}>
          Room Booking Information
        </Text>

        <div style={{ marginLeft: 10 }}>
          <RenderStatus />
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size="auto"
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <RequestInfoComponent
          toggleCancelModalShown={props.toggleCancelModalShown}
          toggleRejectModalShown={props.toggleRejectModalShown}
          toggleAcceptModalShown={props.toggleAcceptModalShown}
          toggleCheckinModalShown={props.toggleCheckinModalShown}
          toggleCheckoutModalShown={props.toggleCheckoutModalShown}
          toggleSendFeedbackModalShown={props.toggleSendFeedbackModalShown}
        />
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
    width: 460,
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
  inputWrapper: {
    margin: 10,
  },
  pendingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
    fontWeight: 600,
  },
  checkedOutDisplay: {
    color: '#7950f2',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#7950f240',
    fontWeight: 600,
  },
  canceledDisplay: {
    color: 'red',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#ff00001c',
    fontWeight: 600,
    marginRight: 5,
  },
  bookedDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
    marginRight: 5,
  },
  checkedInDisplay: {
    color: '#fd7e14',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#fd7e1430',
    fontWeight: 600,
  },
  cancelledByDiv: {
    backgroundColor: '#ffe3e3',
    padding: '0 5px',
    borderRadius: 10,
    color: 'red',
  },
  acceptedByDiv: {
    backgroundColor: '#00800024',
    padding: '0 5px',
    borderRadius: 10,
    color: '#40c057',
    fontSize: 15,
  },
  deviceRow: {
    borderRadius: '3px',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 9px 0px rgba(0,0,0,0.1)',
    width: 200,
  },
  col1: {
    flexBasis: '80%',
  },
  col2: {
    flexBasis: '20%',
  },
});

export default RequestInfoModal;
