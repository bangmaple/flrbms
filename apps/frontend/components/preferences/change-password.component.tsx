import {
  Button,
  createStyles,
  PasswordInput,
  Text,
} from '@mantine/core';
import { useFormik } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { Check, X } from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import { showNotification } from '@mantine/notifications';
import { changePassword } from '../../redux/features/account/thunk/change-password.thunk';

export default function ChangePassword({ username }) {
  const { classes } = useStyles();
  const initialFormValues = {
    oldPass: '',
    newPass: '',
    confirmPass: '',
  };

  const dispatch = useAppDispatch();

  const ChangePassSchema = Yup.object().shape({
    oldPass: Yup.string().required('Input your current password'),
    newPass: Yup.string()
      .min(5, 'Password must be between 5-50 characters')
      .max(50, 'Password must be between 5-50 characters')
      .required('New Password is required'),
    confirmPass: Yup.string().oneOf(
      [Yup.ref('newPass'), null],
      'Passwords must match'
    ),
  });

  const handleChangePassSubmit = async (value, {resetForm}) => {
    dispatch(
      changePassword({
        username: username,
        password: value.oldPass,
        newPassword: value.newPass,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Data was updated',
          message: 'Your profile was updated successfully',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => resetForm({value: ''}))
      .catch((e) => {
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Have error',
          message: `${e.message}`,
          icon: <X />,
          autoClose: 3000,
        });
      });
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: ChangePassSchema,
    onSubmit: (values, {resetForm}) => handleChangePassSubmit(values, {resetForm}),
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={classes.header}>
        <Text
          size="lg"
          sx={{ textTransform: 'uppercase' }}
          weight={500}
          color="blue"
        >
          Change password for {username}
        </Text>
      </div>

      <PasswordInput
        id="oldPass"
        description="Input your current password"
        onChange={formik.handleChange('oldPass')}
        error={
          formik.touched.oldPass && Boolean(formik.errors.oldPass)
            ? formik.errors.oldPass
            : null
        }
        value={formik.values.oldPass}
        label={'Current Password'}
        required
        name="oldPass"
        className={classes.inputText}
        placeholder="Current Password"
      />

      <PasswordInput
        id="newPass"
        description="Input your new password"
        onChange={formik.handleChange('newPass')}
        error={
          formik.touched.newPass && Boolean(formik.errors.newPass)
            ? formik.errors.newPass
            : null
        }
        value={formik.values.newPass}
        label={'New Password'}
        required
        name="newPass"
        className={classes.inputText}
        placeholder="New Password"
      />

      <PasswordInput
        id="confirmPass"
        description="Confirm your new password"
        onChange={formik.handleChange('confirmPass')}
        error={
          formik.touched.confirmPass && Boolean(formik.errors.confirmPass)
            ? formik.errors.confirmPass
            : null
        }
        value={formik.values.confirmPass}
        label={'Confirm Password'}
        required
        name="confirmPass"
        className={classes.inputText}
        placeholder="Confirm Password"
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '50px',
          width: '100%',
        }}
      >
        <Button color="green" type="submit" name="change">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
const useStyles = createStyles(() => {
  return {
    header: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 20,
    },
    inputText: {
      marginTop: 10,
    },
  };
});
