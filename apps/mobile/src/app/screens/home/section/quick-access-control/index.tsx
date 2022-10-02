import {
  BLACK,
  FPT_ORANGE_COLOR,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { deviceWidth } from '../../../../utils/device';
import { PlusIcon, XIcon } from 'react-native-heroicons/outline';
import Divider from '../../../../components/text/divider';
import { LOCAL_STORAGE } from '../../../../utils/local-storage';
import {
  setQuickAccessData,
  toggleNotification,
} from '../../../../redux/features/system/system.slice';
import { useAppDispatch } from '../../../../hooks/use-app-dispatch.hook';
import { QUICK_ACCESS_NAVIGATION_DATA } from '../../../../constants/quick-access-navigation.constant';

const QuickAccessControlScreen: React.FC<any> = () => {
  const dispatch = useAppDispatch();

  const [selectedActions, _] = useState(
    JSON.parse(LOCAL_STORAGE.getString('QUICK_ACCESS'))
  );

  const availableData = useMemo(() => QUICK_ACCESS_NAVIGATION_DATA, []);

  const handleAddQuickAccess = (id: number) => {
    dispatch(
      setQuickAccessData([
        ...selectedActions,
        availableData.find((data) => data.id === id),
      ])
    );
  };

  const handleRemoveQuickAccess = (id: number) => {
    if (selectedActions.length < 2) {
      return alert(
        'There must be at least one quick access. Please add another quick access so as to remove this.'
      );
    }
    dispatch(
      setQuickAccessData(selectedActions.filter((data) => data.id !== id))
    );
  };

  const [isNotificationBellShown, setNotificationBellShown] = useState<boolean>(
    LOCAL_STORAGE.getBoolean('NOTIFICATION_BELL').valueOf()
  );

  useEffect(() => {
    LOCAL_STORAGE.set('NOTIFICATION_BELL', isNotificationBellShown);
    dispatch(toggleNotification(isNotificationBellShown));
  }, [isNotificationBellShown]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.includedQAContainer]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: 10,
              }}
            >
              <Text
                style={{
                  fontSize: deviceWidth / 25,
                  fontWeight: '500',
                }}
              >
                Show notification bell icon
              </Text>
              <Switch
                value={isNotificationBellShown}
                onValueChange={(e) => setNotificationBellShown(e)}
              />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.headerTitle}>Included Quick Accesses</Text>
          <View style={styles.includedQAContainer}>
            {selectedActions.map((data, index) => (
              <>
                <View
                  key={index}
                  style={[
                    styles.includedQARow,
                    selectedActions.length - 1 === index
                      ? { marginBottom: 10 }
                      : null,
                  ]}
                >
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRemoveQuickAccess(data.id)}
                    style={styles.removeQAIcon}
                  >
                    <XIcon color={WHITE} size={deviceWidth / 20} />
                  </TouchableOpacity>
                  <View style={styles.QAIcon}>{data.icon}</View>
                  <Text style={styles.QAName}>{data.name}</Text>
                </View>
                {selectedActions.length > 0 &&
                selectedActions.length - 1 !== index ? (
                  <Divider num={deviceWidth / 9} />
                ) : null}
              </>
            ))}
          </View>
        </View>

        <View style={[styles.container, { marginBottom: 30 }]}>
          <Text style={styles.headerTitle}>Available Quick Accesses</Text>
          <View style={styles.includedQAContainer}>
            {availableData
              .filter(
                (data, index) =>
                  !selectedActions.some((val) => val.name === data.name)
              )
              .map((data, index) => (
                <>
                  <View
                    key={index}
                    style={[
                      styles.includedQARow,
                      availableData.length - 1 === index
                        ? { marginBottom: 10 }
                        : null,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleAddQuickAccess(data.id)}
                      style={styles.removeQAIcon}
                    >
                      <PlusIcon color={WHITE} size={deviceWidth / 20} />
                    </TouchableOpacity>
                    <View style={styles.QAIcon}>{data.icon}</View>
                    <Text style={styles.QAName}>{data.name}</Text>
                  </View>
                  {availableData.length > 0 &&
                  availableData.length - 1 !== index ? (
                    <Divider num={deviceWidth / 9} />
                  ) : null}
                </>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  headerTitle: {
    marginBottom: 10,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
  },
  includedQAContainer: {
    borderColor: INPUT_GRAY_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: WHITE,
  },
  includedQARow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  removeQAIcon: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  QAIcon: {
    borderRadius: 8,
    backgroundColor: FPT_ORANGE_COLOR,
    height: 35,
    width: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  QAName: {
    marginLeft: 10,
    color: BLACK,
    fontWeight: '500',
    fontSize: deviceWidth / 26,
  },
});

export default QuickAccessControlScreen;
