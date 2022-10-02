import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {BLACK, FPT_ORANGE_COLOR, GRAY, WHITE} from "@app/constants";
import {boxShadow} from "../../../../utils/box-shadow.util";
import {DeviceMobileIcon} from "react-native-heroicons/outline";
import {deviceWidth} from "../../../../utils/device";

interface DeviceRenderItemProps {
  device: any;
  index: number;
  deviceSelectedDevice: any[];

  setDeviceSelectedDevice(val: any): void;

  maxQuantity: number;
}

const DeviceRenderItem: React.FC<DeviceRenderItemProps> = (props) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleSelectedDevice = () => {
    props.deviceSelectedDevice?.filter((device) => device.id === props.device.id)[0]
      ? props.setDeviceSelectedDevice(
        props.deviceSelectedDevice.filter(
          (device) => device.id !== props.device.id
        )
      )
      : props.setDeviceSelectedDevice([...props.deviceSelectedDevice, props.device]);
  };


  const handlePlusQuantity = () => {
    if (quantity >= 0 && quantity < props.maxQuantity) {
      const copyArray = props.deviceSelectedDevice;
      const itemSelectedIndex = copyArray.findIndex(
        (device) => device.id === props.device.id
      );
      copyArray[itemSelectedIndex].quantity += 1;
      props.setDeviceSelectedDevice(copyArray);
      setQuantity(quantity + 1);
    }
  };

  const handleReduceQuantity = () => {
    if (quantity - 1 === 0) {
      return props.setDeviceSelectedDevice(
        props.deviceSelectedDevice?.filter((device) => device.id !== props.device.id)
      );
    }
    setQuantity(quantity - 1);
    const copyArray = props.deviceSelectedDevice;
    const itemSelectedIndex = copyArray.findIndex(
      (device) => device.id === props.device.id
    );
    copyArray[itemSelectedIndex].quantity -= 1;
    props.setDeviceSelectedDevice(copyArray);
  };

  const handleQuantityChange = (val: string) => {
    if (parseInt(val) <= props.maxQuantity) {
      setQuantity(parseInt(val));
      const copyArray = props.deviceSelectedDevice;
      const itemSelectedIndex = copyArray.findIndex(
        (device) => device.id === props.device.id
      );
      copyArray[itemSelectedIndex].quantity = parseInt(val);
      props.setDeviceSelectedDevice(copyArray);
    } else {
      alert(
        'You already reached the maximum limit of this quantity. Please contact the librarians to get support.'
      );
    }

  }

  const QuantitySelect = () => {
    return         <View
      style={{
        backgroundColor: WHITE,
        position: 'absolute',
        top: -10,
        right: 10,
        flexDirection: 'column',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}
    >
      {props.deviceSelectedDevice.find(
        (device) => device.id === props.device.id
      ) ? (
        <View style={{flexDirection: 'row',}}>
          <TouchableOpacity onPress={() => handleReduceQuantity()} style={styles.reduceQuantity}>
            <Text style={{
              color: FPT_ORANGE_COLOR,
              fontWeight: '600',
              fontSize: deviceWidth / 26,
            }}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityInput}>{props.device.quantity}</Text>
          <TouchableOpacity onPress={() => handlePlusQuantity()} style={styles.quantityPlus}>
            <Text style={styles.quantityPlusText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>;
  }

  return (
    <TouchableOpacity
      key={props.device}
      onPress={() => {
        handleSelectedDevice();
      }}
      style={[
        styles.selectCircleButton,
        props.deviceSelectedDevice.filter(
          (device) => device.id === props.device.id
        )[0]
          ? {
            borderWidth: 1,
            borderColor: FPT_ORANGE_COLOR,
          }
          : null,
        boxShadow(styles),
      ]}
    >
      <QuantitySelect/>
      <View style={styles.deviceIconContainer}>
        <DeviceMobileIcon color={FPT_ORANGE_COLOR}/>
      </View>

      <View style={styles.deviceContainer}>
        <View style={styles.deviceDescriptionContainer}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={styles.title}>Name:</Text>
              <Text style={{color: BLACK, fontSize: deviceWidth / 26, fontWeight: '600'}}>{props.device.name}</Text>
            </View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.title}>Type:</Text>
            <Text style={{color: BLACK, fontSize: deviceWidth / 26, fontWeight: '600'}}>{props.device.type}</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    title: {
      color: GRAY,
      fontSize: deviceWidth / 26,
      fontWeight: '500',
      paddingRight: 6,
    },
    deviceDescriptionContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      paddingLeft: 8,
    },
    deviceContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexGrow: 1,
    },
    deviceIconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      height: 50,
      width: 50,
      borderWidth: 2,
      borderColor: FPT_ORANGE_COLOR,
      marginLeft: 10,
    },
    selectCircleButton: {
      backgroundColor: WHITE,
      display: 'flex',
      width: deviceWidth / 1.15,
      marginTop: 6,
      marginBottom: 6,
      height: 70,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
  reduceQuantity: {
    height: 20,
    width: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
    quantityPlus: {
      height: 20,
      width: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: FPT_ORANGE_COLOR,
      borderWidth: 1,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    quantityPlusText: {
      color: FPT_ORANGE_COLOR,
      fontWeight: '600',
      fontSize: deviceWidth / 26,
    },
    quantityInput: {
      textAlignVertical: 'center',
      textAlign: 'center',
      color: FPT_ORANGE_COLOR,
      width: 25,
      height: 20,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderTopColor: FPT_ORANGE_COLOR,
      borderBottomColor: FPT_ORANGE_COLOR,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    }
  }
)

export default DeviceRenderItem;
