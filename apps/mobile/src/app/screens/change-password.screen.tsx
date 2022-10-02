import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Background from '../components/blob-scene-haikei.svg';
import FPTULogo from '../components/LogoFPTU.svg';
import Asterik from '../components/text/asterik';
import { Formik } from 'formik';
import LoginErrorModal from '../components/modals/login-error.component';
import { BLACK, FPT_ORANGE_COLOR } from '@app/constants';
import { deviceWidth } from '../utils/device';
import { useAppDispatch } from '../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../hooks/use-app-navigation.hook';
import { doChangePassword } from '../redux/features/account/thunk/changePassword.thunk';
import { LOCAL_STORAGE } from '../utils/local-storage';

const ChangePasswordScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const [isChangePasswordFailure, setChangePasswordFailure] =
    React.useState<boolean>(false);
  const [errorChangePasswordMessage, setErrorChangePasswordMessage] =
    useState<string>();
  const authUser = JSON.parse(LOCAL_STORAGE.getString('user'));
  const initialValues = {
    currentPassword: '',
    newPassword: '',
    retypeNewPassword: '',
  };

  const handleSubmit = async (values) => {
    if (
      values.currentPassword.length < 1 ||
      values.newPassword.length < 1 ||
      values.retypeNewPassword.length < 1
    ) {
      setErrorChangePasswordMessage(
        'Current password or new password cannot be blank!'
      );
      setChangePasswordFailure(true);
      return;
    }
    if (values.currentPassword === values.newPassword) {
      setErrorChangePasswordMessage(
        'The Current password and the New password cannot be the same'
      );
      setChangePasswordFailure(true);
      return;
    }
    if (values.newPassword !== values.retypeNewPassword) {
      setErrorChangePasswordMessage(
        'New password and Retype new password do not match!'
      );
      setChangePasswordFailure(true);
      return;
    }
    setChangePasswordFailure(false);

    dispatch(
      doChangePassword({
        username: authUser.username,
        password: values.currentPassword,
        newPassword: values.newPassword,
      })
    )
      .unwrap()
      .then(() => {
        navigate.pop();
      })
      .catch((e) => {
        setChangePasswordFailure(true);
        setErrorChangePasswordMessage('Your current password is wrong!');
      });
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Background style={[styles.background]} />
      <View style={[styles.loginContainer, styles.shadowProp]}>
        <View style={[styles.logoContainer]}>
          <FPTULogo height={deviceWidth / 3} width={deviceWidth / 3} />
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <View>
                <View style={[styles.inputFieldTitleContainer]}>
                  <Text style={[styles.inputFieldTitle]}>Current Password</Text>
                  <Asterik />
                </View>
                <TextInput
                  onBlur={handleBlur('currentPassword')}
                  onChangeText={handleChange('currentPassword')}
                  autoCapitalize="none"
                  value={values.currentPassword}
                  autoCorrect={false}
                  secureTextEntry={true}
                  placeholder="Current Password"
                  style={[styles.inputField]}
                />
              </View>
              <View>
                <View style={[styles.inputFieldTitleContainer]}>
                  <Text style={[styles.inputFieldTitle]}>New Password</Text>
                  <Asterik />
                </View>
                <TextInput
                  onBlur={handleBlur('newPassword')}
                  onChangeText={handleChange('newPassword')}
                  autoCapitalize="none"
                  value={values.newPassword}
                  autoCorrect={false}
                  secureTextEntry={true}
                  placeholder="New Password"
                  style={[styles.inputField]}
                />
              </View>
              <View>
                <View style={[styles.inputFieldTitleContainer]}>
                  <Text style={[styles.inputFieldTitle]}>
                    Retype New Password
                  </Text>
                  <Asterik />
                </View>
                <TextInput
                  onBlur={handleBlur('retypeNewPassword')}
                  onChangeText={handleChange('retypeNewPassword')}
                  autoCapitalize="none"
                  value={values.retypeNewPassword}
                  autoCorrect={false}
                  secureTextEntry={true}
                  placeholder="Retype New Password"
                  style={[styles.inputField]}
                />
              </View>
              <TouchableOpacity
                style={[styles.loginBtn]}
                onPress={() => handleSubmit()}
              >
                <Text style={[styles.loginBtnText]}>Change Password</Text>
              </TouchableOpacity>
              {isChangePasswordFailure ? (
                <LoginErrorModal
                  isFailure={isChangePasswordFailure}
                  title={errorChangePasswordMessage}
                  description={''}
                  handleCancelModal={setChangePasswordFailure}
                />
              ) : null}
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgb(248, 249, 250)',
    width: 350,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 16,
    bottom: 0,
  },
  inputFieldTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
  },
  inputFieldTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputField: {
    margin: 10,
    paddingLeft: 10,
    width: 270,
    height: 35,
    borderWidth: 1,
    borderColor: 'rgb(206, 212, 218)',
    borderRadius: 5,
    fontSize: 13,
  },
  loginBtn: {
    margin: 10,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    width: 280,
    height: 40,
    borderColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
  },
  loginBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  loginGoogleBtn: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 120,
    height: 40,
    borderColor: 'rgb(206, 212, 218)',
    borderRadius: 50,
    borderWidth: 1,
  },
  loginGoogleBtnTextContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  googleIcon: {
    marginTop: 2,
    marginRight: 6,
  },
  loginGoogleBtnText: {
    fontSize: 14,
    color: BLACK,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginDividerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  loginDividerText: {
    fontSize: 10,
    color: 'rgb(134, 142, 150)',
    marginTop: 10,
    marginLeft: 6,
    marginRight: 6,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'rgb(206, 212, 218)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: FPT_ORANGE_COLOR,
    fontSize: deviceWidth / 32,
  },
});

export default ChangePasswordScreen;
