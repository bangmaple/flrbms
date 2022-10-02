import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  INPUT_GRAY_COLOR,
  RED,
  WHITE,
} from '@app/constants';
import { deviceWidth } from '../utils/device';
import Divider from '../components/text/divider';
import { LockClosedIcon } from 'react-native-heroicons/solid';
import { AuthUser } from '../redux/models/auth-user.model';
import { LOCAL_STORAGE } from '../utils/local-storage';
import { useAppNavigation } from '../hooks/use-app-navigation.hook';

const EditProfile = () => {
  const scrollViewRef = useRef<null | ScrollView>(null);
  const navigate = useAppNavigation();

  const [authUser, setAuthUser] = useState<AuthUser>(
    JSON.parse(LOCAL_STORAGE.getString('user'))
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <ScrollView
          ref={(ref) => {
            scrollViewRef.current = ref;
          }}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.container}>
            <View style={styles.inputWrapper}>
              <Text style={styles.profileTitle}>User ID</Text>
              <Text style={styles.profileValue}>{authUser.id}</Text>
            </View>
            <Divider num={deviceWidth / 10} />
            <View style={styles.inputWrapper}>
              <Text style={styles.profileTitle}>Username</Text>
              <Text style={styles.profileValue}>{authUser.username}</Text>
            </View>
            <Divider num={deviceWidth / 10} />
            <View style={styles.inputWrapper}>
              <Text style={styles.profileTitle}>Email</Text>
              <Text style={styles.profileValue}>{authUser.email}</Text>
            </View>
          </View>

          <View
            style={[
              styles.container,
              {
                height: 90,
              },
            ]}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.profileTitle}>Phone</Text>
              <Text style={styles.profileValue}>{authUser.phone}</Text>
            </View>
            <Divider num={deviceWidth / 10} />
            <View style={styles.inputWrapper}>
              <Text style={styles.profileTitle}>Role</Text>
              <Text style={styles.profileValue}>{authUser.role}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => navigate.navigate('ChangePasswordProfile')}
          >
            <LockClosedIcon color={WHITE} />
            <Text style={styles.changePasswordButtonText}>Change password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default EditProfile;

export const styles = StyleSheet.create({
  deactiveAccountButtonText: {
    marginLeft: 5,
    color: WHITE,
    fontSize: deviceWidth / 21,
    fontWeight: '600',
  },
  deactiveAccountButton: {
    width: deviceWidth / 1.25,
    height: 50,
    backgroundColor: RED,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  changePasswordButtonText: {
    marginLeft: 5,
    color: WHITE,
    fontSize: deviceWidth / 21,
    fontWeight: '600',
  },
  changePasswordButton: {
    width: deviceWidth / 1.25,
    height: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  footerContainer: {
    borderTopColor: INPUT_GRAY_COLOR,
    borderTopWidth: 1,
    marginTop: 20,
    backgroundColor: WHITE,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  container: {
    height: 140,
    marginTop: 10,
    backgroundColor: WHITE,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  profileValue: {
    color: BLACK,
    fontSize: deviceWidth / 24,
    fontWeight: '600',
  },
  profileTitle: {
    fontSize: deviceWidth / 24,
    color: GRAY,
  },
  scrollView: {},
  myHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#ffffff',

    display: 'flex',
    marginTop: 10,
  },
  userInfoIcon: {
    color: '#000',
    fontSize: 20,
  },
  userDetail: {
    backgroundColor: '#ffffff',

    display: 'flex',
    marginTop: 10,
    height: 270,
  },
  active: {
    backgroundColor: '#ffffff',

    display: 'flex',
    marginTop: 10,
    height: 80,
  },
});
