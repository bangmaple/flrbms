import { GetServerSideProps } from 'next';
import AdminLayout from '../layout/admin.layout';
import { Button, createStyles, ScrollArea, Text } from '@mantine/core';
import { Ban, CircleCheck, Dots, Notification } from 'tabler-icons-react';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNotifications } from '../../redux/features/notification/';
import moment from 'moment';
import { fetchDetailNotification } from '../../redux/features/notification/thunk/fetch-detail-noti';
import { setDetailNull } from '../../redux/features/notification/notification.slice';
import dayjs from 'dayjs';
import autoAnimate from '@formkit/auto-animate';
import {fetchRoomBookings} from "../../redux/features/room-booking/thunk/fetch-room-booking-list";
import {fetchCountRequestBooking} from "../../redux/features/room-booking/thunk/fetch-count-request-booking";
import {io} from "socket.io-client";

function NotificationManagement(props: any) {
  const { classes } = useStyles();
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  const detail = useAppSelector((state) => state.notification.notification);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const parent = useRef(null);
  const socket = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchNotifications()).unwrap();
    //   .then((roomTypes) => setRoomTypeNames(roomTypes));
  }, []);

  useEffect(() => {
    socket.on('updateDevicesForOthers', (bookedFor) => {
      console.log(bookedFor)
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        bookedFor &&
        bookedFor === _userInfor.id
      ) {
        dispatch(fetchNotifications());
      }
    });
  }, [socket]);

  const handelGetDetailNoti = (id) => {
    if (detail?.id === id) {
      dispatch(setDetailNull(null));
      setShowDetail(false);
    } else {
      dispatch(fetchDetailNotification(id)).then(() => {
        setShowDetail(true);
      });
    }
  };

  const NotificationDiv: React.FC = () => {
    return (
      <ScrollArea style={{ height: '70vh', borderRadius: 5 }}>
        {notifications?.length > 0
          ? notifications.map((notification) => (
              <div
                className={
                  detail?.id === notification?.id
                    ? classes.notificationChoosedDiv
                    : classes.notificationDiv
                }
                key={notification.id}
                onClick={() => handelGetDetailNoti(notification.id)}
              >
                <div style={{ marginRight: 10 }}>
                  {notification.title.includes('accepted') ||
                  notification.title.includes('resolved') ? (
                    <CircleCheck size={48} strokeWidth={2} color={'#40bf59'} />
                  ) : notification.title.includes('cancelled') ||
                    notification.title.includes('rejected') ? (
                    <Ban size={48} strokeWidth={2} color={'#bf4040'} />
                  ) : (
                    <Notification size={48} strokeWidth={2} color={'#1e194d'} />
                  )}
                </div>

                <div style={{flex: 1}}>
                  <b>{notification.title}</b>
                  <Text size="sm" lineClamp={1} style={{minWidth: '100%'}}>
                    {notification.message}
                  </Text>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <p
                      style={{
                        color: 'blue',
                        fontSize: '0.8rem',
                        marginTop: 5,
                      }}
                    >
                      {moment(notification.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : null}
      </ScrollArea>
    );
  };

  return (
    <>
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center' }} ref={parent}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={classes.mainDiv}>
              <div className={classes.headerDiv}>
                <h1 className={classes.header}>Notification</h1>
                <Dots size={20} strokeWidth={2} color={'black'} />
              </div>
              {/* <div style={{ margin: '10px 0' }}>
                <Button variant="light" style={{ borderRadius: 50 }}>
                  All
                </Button>
                <Button
                  variant="subtle"
                  color="dark"
                  style={{ borderRadius: 50 }}
                >
                  Not read
                </Button>
              </div>
              <b style={{ margin: '10px 0' }}>Before</b> */}
              <NotificationDiv />
            </div>
          </div>
          {showDetail && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className={classes.detailDiv}>
                <div className={classes.headerDiv}>
                  <h1 className={classes.header}>{detail?.title}</h1>
                </div>
                <p style={{ fontSize: 13 }}>
                  {dayjs(detail?.createdAt).format('HH:mm DD-MM-YYYY')}
                </p>
                <div className={classes.messageDiv}>{detail.message}</div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}

const useStyles = createStyles({
  tableContainer: {
    margin: 10,
  },
  table: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  mainDiv: {
    boxShadow: '#0000003d 0px 3px 8px;',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    maxHeight: '80vh',
    width: '600px',
  },
  detailDiv: {
    boxShadow: '#0000003d 0px 3px 8px;',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    maxHeight: '80vh',
    width: '400px',
  },
  messageDiv: {
    padding: '20px 0',
  },
  headerDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    fontSize: '1.5rem',
    color: 'inherit',
    outline: 'none',
  },
  notificationDiv: {
    // backgroundColor: '#f3f3f3',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: 10,
    '&:hover': {
      backgroundColor: '#b1dfff',
    },
  },
  notificationChoosedDiv: {
    backgroundColor: '#b1dfff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: 10,
  },
});

export default NotificationManagement;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      assa: null,
    },
  };
};
