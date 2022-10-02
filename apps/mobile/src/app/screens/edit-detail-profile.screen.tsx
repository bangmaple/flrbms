import React, { Ref, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Asterik from '../components/text/asterik';
import { FormikProps, FormikProvider, useFormik } from 'formik';
import { RootState } from '../redux/store';

import * as Yup from 'yup';

import {
  IdentificationIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  UserIcon,
  ViewListIcon,
} from 'react-native-heroicons/outline';
import { BLACK, FPT_ORANGE_COLOR, WHITE } from '@app/constants';
import { deviceWidth } from '../utils/device';
import { AuthUser } from '../redux/models/auth-user.model';
import { LOCAL_STORAGE } from '../utils/local-storage';
import { doUpdateProfile } from '../redux/features/account/thunk/update.thunk';
import { useAppDispatch } from '../hooks/use-app-dispatch.hook';
import { useAppSelector } from '../hooks/use-app-selector.hook';
import { useAppNavigation } from '../hooks/use-app-navigation.hook';

interface EditDetailProfileProps {
  formikRef: Ref<FormikProps<any>>;
}

const EditDetailProfile = (props: EditDetailProfileProps) => {
  const scrollViewRef = useRef<null | ScrollView>(null);

  const userState = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useAppNavigation();

  const [authUser, setAuthUser] = useState<AuthUser>(
    JSON.parse(LOCAL_STORAGE.getString('user'))
  );

  const [birthdate, setBirthdate] = useState(new Date('01/01/2000'));
  const [isBirthdatePickerShown, setBirthdatePickerShown] =
    useState<boolean>(false);

  useEffect(() => {
    if (birthdate.getTime() >= new Date().getTime()) {
      alert(1);
    }
  }, [birthdate]);

  const handleUserProfileUpdate = async (values) => {
    dispatch(
      doUpdateProfile({
        fullname: values.fullname,
        phone: values.phone,
        email: values.email,
      })
    )
      .unwrap()
      .then(() => navigate.pop())
      .catch((e) => {
        alert(e.message);
      });
  };

  const initialValues = {
    id: authUser.id,
    username: authUser.username,
    fullname: authUser.fullname,
    phone: authUser.phone,
    email: authUser.email,
  };

  const UpdateSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    fullname: Yup.string()
      .min(5, 'Too short!')
      .max(50, 'Too long!')
      .required('Required'),
    phone: Yup.string()
      .min(10, 'Invalid Phone Number')
      .max(50, 'Too long!')
      .required('Required'),
  });

  const handleSetBirthdate = (date) => {
    setBirthdate(date);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleUserProfileUpdate(values),
    enableReinitialize: true,
    validationSchema: UpdateSchema,
  });

  const UserProfileInput = () => {
    // @ts-ignore
    // @ts-ignore
    return (
      <ScrollView style={styles.scrollView}>
        <FormikProvider value={formik}>
          <View>
            <View
              style={{
                display: 'flex',
                backgroundColor: WHITE,
                marginTop: 10,
                height: 410,
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  width: deviceWidth / 1.1,
                }}
              >
                <Text style={[styles.textInputHeader]}>Id</Text>
                <View style={styles.textInput}>
                  <View style={styles.iconContainer}>
                    <IdentificationIcon color={BLACK} />
                  </View>
                  <TextInput
                    editable={false}
                    autoFocus={false}
                    value={formik.values.id}
                  />
                </View>
              </View>

              <View
                style={{
                  marginLeft: 10,
                  width: deviceWidth / 1.1,
                }}
              >
                <Text style={[styles.textInputHeader]}>Username</Text>
                <View style={styles.textInput}>
                  <View style={styles.iconContainer}>
                    <UserIcon color={BLACK} />
                  </View>

                  <TextInput
                    editable={false}
                    value={formik.values.username}
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View
                style={{
                  marginLeft: 10,
                  width: deviceWidth / 1.1,
                }}
              >
                <Text style={[styles.textInputHeader]}>
                  Full name
                  <Asterik />
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  width: deviceWidth / 1.1,
                }}
              >
                <View style={styles.textInput}>
                  <View style={styles.iconContainer}>
                    <ViewListIcon color={BLACK} />
                  </View>
                  <TextInput
                    onChange={() => formik.handleChange('fullname')}
                    value={formik.values.fullname}
                    placeholder={'Please enter your fullname'}
                    onBlur={formik.handleBlur('fullname')}
                    onChangeText={formik.handleChange('fullname')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    // @ts-ignore
                    error={formik.errors.fullname}
                    touched={formik.touched.fullname}
                  />
                </View>
                {formik.errors.fullname && formik.touched.fullname ? (
                  <Text style={{ color: '#DC143C', fontWeight: '600' }}>
                    {formik.errors.fullname}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  marginLeft: 10,
                  width: deviceWidth / 1.1,
                }}
              >
                <Text style={[styles.textInputHeader]}>
                  Phone number
                  <Asterik />
                </Text>
                <View style={styles.textInput}>
                  <View style={styles.iconContainer}>
                    <PhoneIcon color={BLACK} />
                  </View>
                  <TextInput
                    onChange={() => formik.handleChange('phone')}
                    keyboardType={'phone-pad'}
                    value={formik.values.phone}
                    placeholder={'Please enter your phone number'}
                    onBlur={formik.handleBlur('phone')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={formik.handleChange('phone')}
                    // @ts-ignore
                    error={formik.errors.phone}
                    touched={formik.touched.phone}
                  />
                </View>
                {formik.errors.phone && formik.touched.phone ? (
                  <Text style={{ color: '#DC143C', fontWeight: '600' }}>
                    {formik.errors.phone}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  marginLeft: 10,
                  width: deviceWidth / 1.1,
                }}
              >
                <Text style={[styles.textInputHeader]}>
                  Email
                  <Asterik />
                </Text>
                <View style={styles.textInput}>
                  <View style={styles.iconContainer}>
                    <MailIcon color={BLACK} />
                  </View>
                  <TextInput
                    keyboardType={'email-address'}
                    placeholder={'Please enter your email'}
                    onBlur={formik.handleBlur('email')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                    // @ts-ignore
                    error={formik.errors.email}
                    touched={formik.touched.email}
                  />
                </View>
                {formik.errors.email && formik.touched.email ? (
                  <Text style={{ color: '#DC143C', fontWeight: '600' }}>
                    {formik.errors.email}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </FormikProvider>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <UserProfileInput />

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.updateProfileButton}
            onPress={() => formik.handleSubmit()}
          >
            <PencilIcon color={WHITE} />
            <Text style={styles.updateProfileButtonText}>Update profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditDetailProfile;

export const styles = StyleSheet.create({
  iconContainer: {
    height: 50,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderRadius: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgb(206, 212, 218)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  scrollView: {},
  shadowBox: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  header: {
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  myHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textInputHeader: {
    marginLeft: 10,
    fontSize: deviceWidth / 23,
    fontWeight: '600',
  },
  footerContainer: {
    backgroundColor: WHITE,
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateProfileButton: {
    width: deviceWidth / 1.25,
    height: 50,
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  updateProfileButtonText: {
    color: WHITE,
    fontSize: deviceWidth / 20,
    fontWeight: '600',
    marginLeft: 10,
  },
});
