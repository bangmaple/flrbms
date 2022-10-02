import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChatAlt2Icon,
  DocumentSearchIcon,
  LogoutIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import * as Icon from 'react-native-heroicons/solid';
import { BLACK, FPT_ORANGE_COLOR, LIGHT_GRAY, WHITE } from '@app/constants';
import { LOCAL_STORAGE, revokeUserSession } from '../../utils/local-storage';
import axios from 'axios';
import { API_URL } from '../../constants/constant';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppNavigation } from '../../hooks/use-app-navigation.hook';
import { FEEDBACK_SCREEN } from '../../route';
import { useAppSelector } from '../../hooks/use-app-selector.hook';
import { deviceWidth } from '../../utils/device';

const SettingsScreen = () => {
  const scrollViewRef = useRef<null | ScrollView>(null);
  const navigate = useAppNavigation();

  const authUser = useAppSelector((state) => state.auth.authUser);

  const handleLogout = () => {
    revokeUserSession();
    setTimeout(() => {
      navigate.replace('LOGIN_SCREEN');
    }, 0);
  };

  const [avatarURL, setAvatarURL] = useState<string>(null);

  useEffect(() => {
    getAvatarURL();
  }, [avatarURL]);

  const getAvatarURL = async () => {
    const response = await axios.get(`${API_URL}/accounts/avatar`, {
      headers: {
        Authorization: LOCAL_STORAGE.getString('accessToken'),
      },
    });
    const data = await response.data;
    setAvatarURL(data);
  };

  const openImageLibrary = async () => {
    const result = await launchImageLibrary({
      maxHeight: 500,
      maxWidth: 500,
      mediaType: 'photo',
    });
    const formData = new FormData();
    formData.append(
      'file',
      JSON.stringify({
        uri: result.assets[0].uri,
        name: '123.png',
        type: 'image/jpeg',
      })
    );

    try {
      const response = await axios.put(
        `${API_URL}/accounts/update/upload-avatar/profile`,
        {
          body: formData,
        },
        {
          headers: {
            Authorization: LOCAL_STORAGE.getString('accessToken'),
          },
        }
      );
      const data = await response.data;
      getAvatarURL();
    } catch (e) {}
  };

  return (
    <SafeAreaView>
      <ScrollView
        ref={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={[styles.header]}>
          <View style={[styles.headerBody]}>
            {avatarURL ? (
              <TouchableOpacity onPress={() => openImageLibrary()}>
                <Image
                  source={{ uri: avatarURL }}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => openImageLibrary()}>
                <Icon.UserCircleIcon size={80} color="#f06e28" />
              </TouchableOpacity>
            )}
            <Text style={[styles.userAvatarname]}>{authUser.fullname}</Text>
            <Text style={[styles.userEmail]}>{authUser.email}</Text>
            <View
              style={{
                width:
                  authUser.role === 'System Admin'
                    ? deviceWidth / 2
                    : deviceWidth / 5,
                height: 30,
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: WHITE,
                  fontWeight: '600',
                  fontSize: deviceWidth / 23,
                }}
              >
                {authUser.role}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigate.navigate('EditUserProfile')}
          >
            <View style={styles.logoutIconContainer}>
              <UserCircleIcon color={BLACK} />
            </View>
            <Text style={styles.logoutText}>My Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigate.navigate(FEEDBACK_SCREEN)}
          >
            <View style={styles.logoutIconContainer}>
              <ChatAlt2Icon color={BLACK} />
            </View>
            <Text style={styles.logoutText}>Send Feedback</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleLogout()}
          >
            <View style={styles.logoutIconContainer}>
              <LogoutIcon color={BLACK} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

export const styles = StyleSheet.create({
  logoutText: {
    color: BLACK,
    fontSize: 20,
  },
  logoutIconContainer: {
    backgroundColor: LIGHT_GRAY,
    padding: 8,
    borderRadius: 10,
    marginRight: 15,
  },
  logoutContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    height: 60,
    backgroundColor: WHITE,
  },
  logoutButton: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    backgroundColor: WHITE,
    display: 'flex',
    marginLeft: 5,
    marginRight: 5,
    height: 160,
  },
  userInfoIcon: {
    color: BLACK,
    fontSize: 20,
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarname: {
    color: BLACK,
    fontWeight: '500',
  },
  userEmail: {
    color: BLACK,
    fontSize: 12,
  },
  editProfileNavigation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 5,
    height: 30,
    marginLeft: 10,
    marginTop: 10,
  },
});
