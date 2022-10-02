import React, {useEffect, useState} from 'react';
import {ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View, VirtualizedList} from "react-native";
import AlertModal from "../../../../components/modals/alert-modal.component";
import {deviceHeight, deviceWidth} from "../../../../utils/device";
import {fetchAllDevices} from "../../../../redux/features/devices/thunk/fetch-all";
import {useAppNavigation} from "../../../../hooks/use-app-navigation.hook";
import {useAppDispatch} from "../../../../hooks/use-app-dispatch.hook";
import {useAppSelector} from "../../../../hooks/use-app-selector.hook";
import DeviceSelectFilter from "./filter";
import {Device} from "../../../../redux/models/device.model";
import DeviceRenderItem from "./item";
import NotFound from "../../../../components/empty.svg";
import {BLACK, FPT_ORANGE_COLOR, WHITE} from "@app/constants";
import {ChevronDoubleLeftIcon, ChevronRightIcon} from "react-native-heroicons/outline";
import {handleSetProvidedDevices, updateAutoBookingRequest} from "../../../../redux/features/room-booking-v2/slice";
import {
  fetchMaxBorrowDevicesQuantity
} from "../../../../redux/features/system/thunk/fetch-max-borrow-devices-quantity.thunk";

interface RoomBookingDeviceSelectProps {
  toggleShown(): void;
  isShown: boolean;
  bookingRequests: any[];
  setBookingRequests(val: any[]): void;
  bookingRequestId: number;
}

const RoomBookingDeviceSelect: React.FC<RoomBookingDeviceSelectProps> = (props) => {

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const devices = useAppSelector((state) => state.device.devices);

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<'ASC' | 'DESC'>('ASC');

  const [devicesArray, setDevicesArray] = useState([]);
  const [deviceSelectedDevice, setDeviceSelectedDevice] = useState([]);

  const [maxQuantity, setMaxQuantity] = useState<number>(100);

  useEffect(() => {
    dispatch(fetchMaxBorrowDevicesQuantity())
      .unwrap()
      .then((val) => setMaxQuantity(val));
  }, []);

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

  const handleNextStep = () => {
   // updateAutoBookingRequest({
   //   ...payload,
//
  //  })
    const devices = [];
    for (let i = 0; i < deviceSelectedDevice.length; i++) {
      devices.push({
        id: deviceSelectedDevice[i].id,
        name: deviceSelectedDevice[i].name,
        quantity: deviceSelectedDevice[i].quantity,
      });
    }
    const selectedRequestDevices = {
      ...props.bookingRequests.filter((request) => request.id === props.bookingRequestId)[0],
      devices: devices
    };

    const newRequests = props.bookingRequests.filter((request) => request.id !== props.bookingRequestId);
    newRequests.push(selectedRequestDevices);
    props.setBookingRequests(newRequests);
    setDeviceSelectedDevice([]);
    props.toggleShown();
  //  dispatch(handleSetProvidedDevices(devices));
  //  navigation.pop();
  };

  return (

    <AlertModal isOpened={props.isShown} height={deviceHeight / 1.8} width={deviceWidth / 1.05}
                toggleShown={() => props.toggleShown()}>
      <DeviceSelectFilter search={search} setSearch={(val) => setSearch(val)}
                          sort={sort} setSort={(val: any) => setSort(val)}/>
      <View style={styles.container}>
        {devices.length > 0 ? (
          <VirtualizedList
            showsVerticalScrollIndicator={false}
            data={devicesArray}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
            renderItem={(item: ListRenderItemInfo<Device>) => (
              <DeviceRenderItem
                deviceSelectedDevice={deviceSelectedDevice}
                setDeviceSelectedDevice={(val) => setDeviceSelectedDevice(val)}
                maxQuantity={maxQuantity}
                key={item.index}
                device={item.item}
                index={item.index}
              />
            )}
          />
        ) : (
          <View
            style={{
              display: 'flex',
              flex: 1,
              flexGrow: 0.75,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <NotFound width={deviceWidth / 2} height={250} />
            <Text
              style={{
                color: BLACK,
                fontSize: deviceWidth / 20,
                fontWeight: '500',
              }}
            >
              Data not found!
            </Text>
          </View>
        )}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => props.toggleShown()}
            style={{
              borderRadius: 8,
              borderWidth: 2,
              height: 50,
              width: deviceWidth / 3,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: FPT_ORANGE_COLOR,
            }}
          >
            <ChevronDoubleLeftIcon
              size={deviceWidth / 18}
              color={FPT_ORANGE_COLOR}
            />
            <Text
              style={{
                paddingLeft: 6,
                fontWeight: '600',
                fontSize: deviceWidth / 21,
                color: FPT_ORANGE_COLOR,
              }}
            >
              Return
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNextStep()}
            style={styles.nextStepButton}
          >
            <ChevronRightIcon color={WHITE} />
            <Text style={styles.nextStepButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AlertModal>
  );

};


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    flex: 1,
  },

  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingBottom: 16,
  },
  nextStepButtonText: {
    fontWeight: '600',
    fontSize: deviceWidth / 21,
    color: WHITE,
    paddingLeft: 6,

  },
  nextStepButton: {
    height: 50,
    width: deviceWidth / 2.8,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default RoomBookingDeviceSelect;
