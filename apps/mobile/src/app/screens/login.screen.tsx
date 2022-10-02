import React, { useEffect, useState } from 'react';

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
import Divider from '../components/text/divider';
import GoogleIcon from '../components/google-icon.svg';
import CheckAlive from '../components/check-alive.component';
import { Formik } from 'formik';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  INPUT_GRAY_COLOR,
  WHITE,
} from '@app/constants';
import { doLogin } from '../redux/features/auth/thunk/login.thunk';
import { isUserSessionExisted, LOCAL_STORAGE } from '../utils/local-storage';
import { validateAccessToken } from '../redux/features/auth/thunk/validate-access-token.thunk';
import { deviceHeight, deviceWidth } from '../utils/device';
import { useAppDispatch } from '../hooks/use-app-dispatch.hook';
import { useAppNavigation } from '../hooks/use-app-navigation.hook';
import BookLogo from '../components/book-logo';
import { doGoogleLogin } from '../redux/features/auth/thunk/google-login.thunk';
import { boxShadow } from '../utils/box-shadow.util';
import AlertModal from '../components/modals/alert-modal.component';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { saveFCMToken } from '../redux/features/auth/thunk/firebase-token.thunk';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const [isError, setError] = React.useState<boolean>(false);
  const [isLoginFailure, setLoginFailure] = React.useState<boolean>(false);
  const [loginErrMsg, setLoginErrMsg] = useState<string>();
  const fcmToken = LOCAL_STORAGE.getString('fcmToken');

  useEffect(() => {
    if (isUserSessionExisted()) {
      dispatch(validateAccessToken())
        .unwrap()
        .then(() => {
          navigate.navigate('MAIN');
        });
    }
  }, []);

  const handleLoginWithGoogle = async () => {
    dispatch(doGoogleLogin())
      .unwrap()
      .then(() => {
        dispatch(
          saveFCMToken({
            fcmToken: fcmToken,
          })
        )
          .unwrap();
      })
      .then(() => {
        setTimeout(() => {
          navigate.navigate('MAIN');
        }, 0);
      });
  };

  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    if (
      values.password.trim().length < 1 ||
      values.username.trim().length < 1
    ) {
      setLoginErrMsg('Username or password cannot be blank!');
      setLoginFailure(true);
      return;
    }
    dispatch(
      doLogin({
        username: values.username.trim(),
        password: values.password.trim(),
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          saveFCMToken({
            fcmToken: fcmToken,
          })
        )
          .unwrap();
      })
      .then(() => {
        navigate.navigate('MAIN');
      })
      .catch((e) => {
        setLoginErrMsg(e);
        setLoginFailure(true);
      });
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Background style={[styles.background]} />
      <View style={[styles.loginContainer, boxShadow(styles)]}>
        <View style={[styles.logoContainer]}>
          <FPTULogo height={deviceWidth / 4} width={deviceWidth / 3} />
          <BookLogo />
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <View>
                <View style={[styles.inputFieldTitleContainer]}>
                  <Text style={[styles.inputFieldTitle]}>Username </Text>
                  <Asterik />
                </View>
                <TextInput
                  onBlur={handleBlur('username')}
                  onChangeText={handleChange('username')}
                  autoCapitalize="none"
                  autoComplete={null}
                  autoCorrect={false}
                  value={values.username}
                  placeholderTextColor={INPUT_GRAY_COLOR}
                  placeholder="Username"
                  style={[styles.inputField]}
                  maxLength={100}
                />
              </View>
              <View>
                <View style={[styles.inputFieldTitleContainer]}>
                  <Text style={[styles.inputFieldTitle]}>Password </Text>
                  <Asterik />
                </View>
                <TextInput
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  autoCapitalize="none"
                  autoComplete={null}
                  value={values.password}
                  autoCorrect={false}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor={INPUT_GRAY_COLOR}
                  style={[styles.inputField]}
                  maxLength={100}
                />
              </View>
              <TouchableOpacity
                style={[styles.loginBtn]}
                onPress={() => handleSubmit()}
              >
                <Text style={[styles.loginBtnText]}>Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        {/*<TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>*/}

        <View style={[styles.loginDividerContainer]}>
          <Divider num={10} />
          <Text style={[styles.loginDividerText]}>Or continue with</Text>
          <Divider num={10} />
        </View>

        <TouchableOpacity
          style={[styles.loginGoogleBtn]}
          onPress={() => handleLoginWithGoogle()}
        >
          <View style={[styles.loginGoogleBtnTextContainer]}>
            <GoogleIcon style={[styles.googleIcon]} />
            <Text style={[styles.loginGoogleBtnText]}>Google</Text>
          </View>
        </TouchableOpacity>
      </View>
      {isLoginFailure ? (
        <AlertModal
          height={deviceHeight / 4}
          width={deviceWidth / 1.15}
          toggleShown={() => setLoginFailure(!isLoginFailure)}
          isOpened={isLoginFailure}
        >
          <View
            style={{
              flex: 0.85,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 0.8,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ExclamationCircleIcon
                size={deviceWidth / 8}
                color={FPT_ORANGE_COLOR}
              />
              <Text
                style={{
                  color: BLACK,
                  fontSize: deviceWidth / 19,
                  fontWeight: '600',
                }}
              >
                Error encountered while signing in
              </Text>
              <Text
                style={{
                  color: BLACK,
                  fontSize: deviceWidth / 23,
                  fontWeight: '400',
                }}
              >
                {loginErrMsg}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setLoginFailure(!isLoginFailure);
              }}
              style={{
                height: 50,
                backgroundColor: FPT_ORANGE_COLOR,
                borderRadius: 50,
                width: deviceWidth / 1.35,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: WHITE,
                  fontSize: deviceWidth / 19,
                  fontWeight: '600',
                }}
              >
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </AlertModal>
      ) : null}
      {isError ? <CheckAlive /> : null}
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
    width: deviceWidth / 1.1,
    height: 400,
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
    fontSize: 12,
    fontWeight: '500',
  },
  inputField: {
    margin: 10,
    width: deviceWidth / 1.3,
    height: 35,
    borderWidth: 1,
    borderColor: 'rgb(206, 212, 218)',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loginBtn: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    width: deviceWidth / 1.3,
    height: 50,
    borderRadius: 50,
  },
  loginBtnText: {
    fontSize: deviceWidth / 20,
    color: WHITE,
    fontWeight: '500',
  },
  loginGoogleBtn: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: deviceWidth / 3.3,
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

export default LoginScreen;
