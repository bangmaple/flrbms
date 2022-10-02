import React, { useEffect, useState } from 'react';
import {
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  VirtualizedList,
} from 'react-native';
import { SearchIcon, SortAscendingIcon } from 'react-native-heroicons/solid';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  LIGHT_GRAY,
  WHITE,
} from '@app/constants';
import { deviceWidth } from '../../utils/device';
import {
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
  DeviceMobileIcon,
  ExclamationCircleIcon,
  SortDescendingIcon,
} from 'react-native-heroicons/outline';
import DelayInput from 'react-native-debounce-input';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { Device } from '../../redux/models/device.model';
import { step3ScheduleRoomBooking } from '../../redux/features/room-booking/slice';
import AlertModal from '../../components/modals/alert-modal.component';
import { fetchAllDevices } from '../../redux/features/devices/thunk/fetch-all';
import RequestRoomBookingHeader from './request-room-booking/header';
import { boxShadow } from '../../utils/box-shadow.util';
import NotFound from '../../components/empty.svg';
import { fetchMaxBorrowDevicesQuantity } from '../../redux/features/system/thunk/fetch-max-borrow-devices-quantity.thunk';
import {
  handleSetProvidedDevices,
  updateAutoBookingRequest,
  updateBookingRequestId
} from "../../redux/features/room-booking-v2/slice";
import DeviceRenderItem from "./request-room-booking/device-select/item";

const RoomBooking2: React.FC = () => {
  const navigate = useAppNavigation();

  const devices = useAppSelector((state) => state.device.devices);
  const dispatch = useAppDispatch();
  const [devicesArray, setDevicesArray] = useState([]);
  const [deviceSelectedDevice, setDeviceSelectedDevice] = useState([]);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<'ASC' | 'DESC'>('ASC');
  const [isErrorModalShown, setErrorModalShown] = useState<boolean>(false);


  const providedDevices = useAppSelector((state) => state.bookedRequest.providedDevices);

  useEffect(() => {
    if (providedDevices && providedDevices.length > 0) {
      setDeviceSelectedDevice(providedDevices);
    }
  }, [providedDevices]);


  const isSameDevices = useAppSelector((state) => state.bookedRequest.isAllRequestsSameDevices);



  useEffect(() => {
    dispatch(
      fetchAllDevices({
        search: search,
        dir: sort,
      })
    )
      .unwrap()
      .then((value) => {
        const deviceArrayHaveQuantity = value.map((value) => ({
          ...value,
          quantity: 1,
        }));
        setDevicesArray(deviceArrayHaveQuantity);
      });
  }, [search, sort, dispatch]);

  const payload = useAppSelector((state) => state.bookedRequest.request);






  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RequestRoomBookingHeader />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({



  selectOn: {
    height: 20,
    width: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    position: 'absolute',
    zIndex: 2,
    left: -10,
    top: -10,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectOff: {
    height: 20,
    width: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: GRAY,
    position: 'absolute',
    zIndex: 2,
    left: -10,
    top: -10,
    backgroundColor: WHITE,
  },
  viewDetailButtonText: {
    color: FPT_ORANGE_COLOR,
  },
  viewDetailButton: {
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 1,
    height: 30,
    width: deviceWidth / 4.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },


});

export default RoomBooking2;
