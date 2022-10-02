import {
  BellIcon,
  ChatAlt2Icon,
  ClipboardCheckIcon,
  ClipboardCopyIcon,
  ClipboardIcon,
  ClipboardListIcon,
  HeartIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
// @ts-ignore
import React from 'react';
// @ts-ignore
import {WHITE} from '@app/constants';
// @ts-ignore
import {deviceWidth} from '../utils/device';

// @ts-ignore
export const QUICK_ACCESS_NAVIGATION_DATA = [
  {
    id: 1,
    name: 'Check-in room booking',
    icon: <ClipboardIcon color={WHITE} size={deviceWidth / 16} />,
    path: '',
  },
  {
    id: 2,
    name: 'My profile',
    icon: <UserIcon color={WHITE} size={deviceWidth / 16} />,
    path: '',
  },
  {
    id: 3,
    name: 'Booking rooms wishlist',
    icon: <HeartIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'BOOKING_ROOM_WISHLIST',
  },
  {
    id: 4,
    name: 'My notifications',
    icon: <BellIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'NOTIFICATION',
  },
  {
    id: 5,
    name: 'Request for room booking',
    icon: <ClipboardCopyIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'ROOM_BOOKING',
  },
  {
    id: 6,
    name: 'Check-out room booking',
    icon: <ClipboardCheckIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'ROOM_CHECKOUT',
  },
  {
    id: 7,
    name: 'Track for booking requests',
    icon: <ClipboardListIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'TRACK_BOOKING_ROOM',
  },
  {
    id: 8,
    name: 'Track feedbacks',
    icon: <ChatAlt2Icon color={WHITE} size={deviceWidth / 16} />,
    path: 'FEEDBACK',
  },
];

// @ts-ignore
export const DEFAULT_QUICK_ACCESS = [
  {
    id: 5,
    name: 'Request for room booking',
    icon: <ClipboardCopyIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'ROOM_BOOKING',
  },
  {
    id: 6,
    name: 'Check-out room booking',
    icon: <ClipboardCheckIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'ROOM_CHECKOUT',
  },
  {
    id: 7,
    name: 'Track for booking requests',
    icon: <ClipboardListIcon color={WHITE} size={deviceWidth / 16} />,
    path: 'TRACK_BOOKING_ROOM',
  },
  {
    id: 8,
    name: 'Track feedbacks',
    icon: <ChatAlt2Icon color={WHITE} size={deviceWidth / 16} />,
    path: 'FEEDBACK',
  },
];
// @ts-ignore
