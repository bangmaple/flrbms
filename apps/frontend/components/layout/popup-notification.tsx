import React, { useEffect, useMemo } from 'react';
import { Check, X } from 'tabler-icons-react';

import { showNotification } from '@mantine/notifications';

import { io } from 'socket.io-client';

const PopupNotification = () => {
  const socketFeedback = useMemo(() => {
    return io('ws://localhost:5000/feedback');
  }, []);

  const socketRequest = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);

  useEffect(() => {
    socketFeedback.on('sendFeedback', (createdBy) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        createdBy &&
        createdBy !== _userInfor.id &&
        _userInfor.role !== 'Staff'
      ) {
        showNotification({
          id: 'new-data',
          color: 'teal',
          title: 'New feedback',
          message: 'Received a new feedback, please check',
          icon: <Check />,
          autoClose: 3000,
        });
      }
    });
  }, [socketFeedback]);

  useEffect(() => {
    socketFeedback.on('resolveFeedback', (createdBy) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (createdBy && createdBy === _userInfor.id) {
        showNotification({
          id: 'resolve-feedback',
          color: 'teal',
          title: 'Feedback was resolved',
          message: 'Your feedback was resolved, please check it!',
          icon: <Check />,
          autoClose: 3000,
        });
      }
    });
  }, [socketFeedback]);

  useEffect(() => {
    socketFeedback.on('rejectFeedback', (createdBy) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (createdBy && createdBy === _userInfor.id) {
        showNotification({
          id: 'rejected-feedback',
          color: 'red',
          title: 'Feedback was rejected',
          message: 'Your feedback was rejected, please check it!',
          icon: <X />,
          autoClose: 3000,
        });
      }
    });
  }, [socketFeedback]);

  useEffect(() => {
    socketRequest.on('sendRequestForOther', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (bookedFor && bookedFor === _userInfor.id) {
        showNotification({
          id: 'new-request',
          color: 'teal',
          title: 'Admin was booked room for you',
          message: 'Admin was booked room for you, please check it!',
          icon: <Check />,
          autoClose: 3000,
        });
      }
    });
  }, [socketRequest]);

  useEffect(() => {
    socketRequest.on('sendRequestForSelf', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        bookedFor &&
        bookedFor !== _userInfor.id &&
        _userInfor.role !== 'Staff'
      ) {
        showNotification({
          id: 'new-request',
          color: 'teal',
          title: 'Have new request',
          message: 'Have new request room booking , please check it!',
          icon: <Check />,
          autoClose: 3000,
        });
      }
    });
  }, [socketRequest]);

  useEffect(() => {
    socketRequest.on('cancelRequest', (payload) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));
      if (
        payload &&
        payload.cancelledBy !== _userInfor.id &&
        payload.bookedFor === _userInfor.id
      ) {
        showNotification({
          id: 'new-request',
          color: 'red',
          title: 'Your request was canceled',
          message: 'Your booking request was canceled, please check it!',
          icon: <X />,
          autoClose: 3000,
        });
      }
    });
  }, [socketRequest]);

  useEffect(() => {
    socketRequest.on('rejectRequest', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));
      if (
        bookedFor &&
        bookedFor === _userInfor.id
      ) {
        showNotification({
          id: 'new-request',
          color: 'red',
          title: 'Your request was rejected',
          message: 'Your booking request was rejected, please check it!',
          icon: <X />,
          autoClose: 3000,
        });
      }
    });
  }, [socketRequest]);

  useEffect(() => {
    socketRequest.on('acceptRequest', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));
      if (
        bookedFor &&
        bookedFor === _userInfor.id
      ) {
        showNotification({
          id: 'accepted-request',
          color: 'teal',
          title: 'Your request was accepted',
          message: 'Your booking request was accepted, please check it!',
          icon: <X />,
          autoClose: 3000,
        });
      }
    });
  }, [socketRequest]);
};

export default PopupNotification;
