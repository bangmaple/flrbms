import React, {useState} from 'react';
import {
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  VirtualizedList
} from "react-native";
import AlertModal from "../../../../components/modals/alert-modal.component";
import {deviceHeight, deviceWidth} from "../../../../utils/device";
import {BLACK, FPT_ORANGE_COLOR, GRAY, INPUT_GRAY_COLOR, WHITE} from "@app/constants";
import {UsersIcon, SelectorIcon, CheckIcon, XIcon} from "react-native-heroicons/outline";
import {CurrentBookingRoom} from "../../../../redux/models/current-booking-room.model";
import AlreadyBookItem from "../../AlreadyBook/AlreadyBookItem";

interface SelectCapacityModalProps {
  capacityData: number[];
  selectedCapacity: number;
  isShown: boolean;

  toggleShown(): void;

  handleChoose(val): void;
}

const SelectCapacityModal: React.FC<SelectCapacityModalProps> = (props) => {

  const [capacity, setCapacity] = useState(props.selectedCapacity);

  const handleSetCapacity = (val: string) => {
    if (val.length === 0 ) {
      setCapacity(0);
      return;
    }
    if (!val || isNaN(parseInt(val)) || parseInt(val) < 1) {
      setCapacity(props.selectedCapacity);
      return alert("Capacity number is invalid. Please try again with capacity greater than 1.")
    }
    setCapacity(parseInt(val));
  }

  return (
    <AlertModal isOpened={props.isShown} height={deviceHeight / 1.8} width={deviceWidth / 1.15}
                toggleShown={() => props.toggleShown()}>
      <View style={{
        paddingTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: deviceWidth / 1.15,
        paddingLeft: 10,
        paddingRight: 10,
      }}>
        <Text style={{color: BLACK, fontSize: deviceWidth / 23, fontWeight: '600'}}>
          Choose your expected capacity
        </Text>
        <TouchableOpacity onPress={() => props.toggleShown()}>
          <XIcon color={INPUT_GRAY_COLOR} size={deviceWidth / 16}/>
        </TouchableOpacity>
      </View>

      <VirtualizedList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        getItemCount={(capacityData) => capacityData.length}
        getItem={(capacityData, index) => capacityData[index]}
        renderItem={({item}) => (
          <TouchableOpacity style={[styles.item, capacity === item ? {
            backgroundColor: FPT_ORANGE_COLOR,
            borderWidth: undefined,
          } : undefined]} onPress={() => handleSetCapacity(String(item))}>
            <View style={[styles.itemContainer]}>
              <View style={[styles.itemIcon, capacity === item ? {borderColor: WHITE} : undefined]}>
                <UsersIcon color={capacity === item ? WHITE : FPT_ORANGE_COLOR} size={deviceWidth / 16}/>
              </View>
              <Text style={[styles.itemText, capacity === item ? {
                color: WHITE,
              } : undefined]}>Up to {item} people</Text>
            </View>
            {/* <View style={styles.itemChooseButton}>
              <CheckIcon color={WHITE} size={deviceWidth / 20}/>
              <Text style={styles.itemChooseButtonText}>Choose</Text>
            </View>*/}
          </TouchableOpacity>
        )}
        data={props.capacityData}
      />
      <Text style={{
        color: BLACK,
        fontWeight: '600',
        fontSize: deviceWidth / 23,
        alignSelf: 'flex-start',
        paddingLeft: 16,
        paddingTop: 10,
      }}>Or you can specify</Text>
      <View style={{
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
      }}>
        <View style={{
          height: 50,
          width: 50,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          backgroundColor: 'rgba(240, 110, 40, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <UsersIcon color={FPT_ORANGE_COLOR} size={deviceWidth / 16}/>
        </View>
        <TextInput value={String(capacity)} onChangeText={(val) => handleSetCapacity(val)}
                   style={{
                     height: 50, width: deviceWidth / 1.49,
                     backgroundColor: 'rgba(240, 110, 40, 0.2)',
                     borderTopRightRadius: 8,
                     borderBottomRightRadius: 8,

                   }}/>
      </View>
      <View style={{
        paddingBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        width: deviceWidth / 1.25,
        alignItems: 'center',
        paddingTop: 10,
        flexDirection: 'row'
      }}>
        <TouchableOpacity style={{
          height: 45,
          width: deviceWidth / 2.8,
          backgroundColor: FPT_ORANGE_COLOR,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }} onPress={() => props.toggleShown()}>
          <XIcon size={deviceWidth / 16} color={WHITE}/>
          <Text style={{color: WHITE, fontWeight: '600', fontSize: deviceWidth / 23, paddingLeft: 10}}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          height: 45,
          width: deviceWidth / 2.8,
          backgroundColor: FPT_ORANGE_COLOR,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={() => props.handleChoose(capacity)}>
          <CheckIcon size={deviceWidth / 16} color={WHITE}/>
          <Text style={{color: WHITE, fontWeight: '600', fontSize: deviceWidth / 23, paddingLeft: 10}}>Choose</Text>
        </TouchableOpacity>
      </View>
    </AlertModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    marginTop: 10,
    marginBottom: 6,
    height: 60,
    borderRadius: 8,
    width: deviceWidth / 1.25,
    borderColor: FPT_ORANGE_COLOR,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemChooseButton: {
    height: 35,
    width: deviceWidth / 4.2,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  itemChooseButtonText: {color: WHITE, fontWeight: '600', fontSize: deviceWidth / 28, paddingLeft: 4,},
  itemIcon: {
    height: 35,
    width: 35,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: FPT_ORANGE_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontWeight: '600',
    size: deviceWidth / 21,
    color: BLACK,
    paddingLeft: 10,
  }
});

export default SelectCapacityModal;
