import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, createStyles, Text } from '@mantine/core';
import { Check, ScanEye, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { BookingRequestParams } from '../../models/pagination-params/booking-room-params.model';
import { fetchListRequestWithSameSlot } from '../../redux/features/room-booking/thunk/fetch-list-booking-with-same-slot.thunk';
import dayjs from 'dayjs';
import autoAnimate from '@formkit/auto-animate';
import { fetchRoomBookings } from '../../redux/features/room-booking/thunk/fetch-room-booking-list';
import { acceptRequest } from '../../redux/features/room-booking/thunk/accept-request';
import { showNotification } from '@mantine/notifications';
import { fetchCountRequestBooking } from '../../redux/features/room-booking/thunk/fetch-count-request-booking';
import { io } from 'socket.io-client';

interface AcceptRequestComponentProps {
  isShown: boolean;

  toggleShown(): void;

  toggleInforModalShown(): void;
  setCount(val): void;
  pagination: BookingRequestParams;
}

const AcceptRequestComponent: React.FC<AcceptRequestComponentProps> = (
  props
) => {
  const { classes } = useStyles();
  const request = useAppSelector((state) => state.roomBooking.roomBooking);
  const [listRequest, setListRequest] = useState([]);
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const socket = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => setShow(!show);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (request) {
      dispatch(
        fetchListRequestWithSameSlot({
          roomId: request.roomId,
          requestId: request.id,
          date: dayjs(request.checkinDate).format('YYYY-MM-DD'),
          checkinSlotId: request.checkinSlotId,
          checkoutSlotId: request.checkoutSlotId,
        })
      )
        .unwrap()
        .then((response) => setListRequest(response));
    }
  }, [dispatch, request]);

  const handleAcceptSelectedRequest = () => {
    dispatch(acceptRequest(request.id))
      .unwrap()
      .then((response) => {
        socket.emit('acceptRequest', response.bookedFor);
        showNotification({
          id: 'accept-request',
          color: 'teal',
          title: 'Request was accepted',
          message: 'Request was successfully accepted',
          icon: <Check />,
          autoClose: 3000,
        });
      })
      .then(() => {
        props.toggleShown();
        props.toggleInforModalShown();
        dispatch(fetchRoomBookings(props.pagination));
        dispatch(fetchCountRequestBooking())
          .unwrap()
          .then((val) => props.setCount(val));
      })
      .catch((e) =>
        showNotification({
          id: 'accept-request',
          color: 'red',
          title: 'Error while accept request',
          message: e.message ?? 'Failed to accept request',
          icon: <X />,
          autoClose: 3000,
        })
      );
  };

  const ListRequestPendingAtSameSlot = () => {
    const rows =
      listRequest && listRequest.length > 0
        ? listRequest.map((row, index) => (
            <>
              <li className={classes.tableRow}>
                <div className={classes.col1} data-label="STT">
                  {index + 1}
                </div>
                <div className={classes.col2} data-label="Slot in">
                  {row.slotInName}
                </div>
                <div className={classes.col3} data-label="Slot out">
                  {row.slotOutName}
                </div>
                <div className={classes.col4} data-label="Request by">
                  {row.requestedBy}
                </div>
                <div className={classes.col5} data-label="Reason">
                  {row.reason}
                </div>
              </li>
            </>
          ))
        : null;
    return (
      listRequest &&
      listRequest.length > 0 && (
        <div className={classes.container}>
          <ul>
            <li className={classes.tableHeader}>
              <div className={classes.col1}>STT</div>
              <div className={classes.col2}>Slot in</div>
              <div className={classes.col3}>Slot out</div>
              <div className={classes.col4}>Request By</div>
              <div className={classes.col5}>Reason</div>
            </li>
            {rows}
          </ul>
        </div>
      )
    );
  };

  return (
    <div className={classes.modalContainer} ref={parent}>
      <Text className={classes.modalBody}>
        After accept this request, system will auto cancel all request which use
        same slot will this request.
      </Text>
      <div className={classes.modalFooter}>
        {listRequest && listRequest.length > 0 ? (
          <Button
            leftIcon={<ScanEye />}
            style={{ backgroundColor: 'blue', width: '60%', margin: 10 }}
            onClick={reveal}
          >
            List request same slot
          </Button>
        ) : null}
        <Button
          color="green"
          leftIcon={<Check />}
          onClick={() => handleAcceptSelectedRequest()}
          style={{
            width: '60%',
            margin: 10,
          }}
        >
          Accept this request
        </Button>
        <Button
          onClick={() => props.toggleShown()}
          leftIcon={<X />}
          style={{
            backgroundColor: FPT_ORANGE_COLOR,
            width: '60%',
            margin: 10,
          }}
        >
          Cancel
        </Button>
      </div>
      {show && <ListRequestPendingAtSameSlot />}
    </div>
  );
};

const useStyles = createStyles({
  modalTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  container: {
    width: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  tableHeader: {
    borderRadius: '3px',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '25px',
    backgroundColor: '#0000ff57',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  tableRow: {
    borderRadius: '3px',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 9px 0px rgba(0,0,0,0.1)',
  },
  col1: {
    flexBasis: '10%',
  },
  col2: {
    flexBasis: '20%',
  },
  col3: {
    flexBasis: '20%',
  },
  col4: {
    flexBasis: '25%',
  },
  col5: {
    flexBasis: '35%',
  },
  modalBody: {
    margin: 10,
    width: 355,
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 355,
  },
});

export default AcceptRequestComponent;
