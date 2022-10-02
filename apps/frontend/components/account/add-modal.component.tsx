import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  PasswordInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useWindowDimensions } from '../../hooks/use-window-dimensions';
import {
  Check,
  ClipboardText,
  FileDescription,
  Plus,
  X,
} from 'tabler-icons-react';
import { useAppDispatch } from '../../redux/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { addAccount } from '../../redux/features/account/thunk/add.thunk';
import { fetchAccounts } from '../../redux/features/account/thunk/fetch-accounts.thunk';

interface AddAccountModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PagingParams;
  listRole: any[];
}

const AddAccountValidation = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(3, 'Username must have at least 3 character.')
    .max(50, 'Username can only have at most 50 characters.')
    .required('Username is required!'),

  password: Yup.string()
    .min(5, 'Password must be between 5-50 characters')
    .max(50, 'Password must be between 5-50 characters')
    .required('Password is required'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
  email: Yup.string()
    .trim()
    .min(8, 'Email must have at least 8 character.')
    .max(50, 'Email can only have at most 50 characters.')
    .required('Email is required!'),
  firstName: Yup.string()
    .trim()
    .min(1, 'First name must have at least 1 character.')
    .max(50, 'First name can only have at most 50 characters.')
    .required('First name is required!'),
  lastName: Yup.string()
    .trim()
    .min(1, 'Last name must have at least 1 character.')
    .max(50, 'Last name can only have at most 50 characters.')
    .required('Last name is required!'),
  phone: Yup.string()
    .trim()
    .min(10, 'Phone must have at least 10 digits.')
    .max(10, 'Phone can only have at most 10 digits.'),
  description: Yup.string().max(
    500,
    'Description only have at most 500 characters'
  ),
});

const AddAccountModal: React.FC<AddAccountModalProps> = (props) => {
  const { classes } = useStyles();
  const [isAddDisabled, setAddDisabled] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');

  const dispatch = useAppDispatch();
  const dimension = useWindowDimensions();

  const handleAddSubmit = async (values) => {
    dispatch(
      addAccount({
        ...values,
        roleId: role,
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while adding new account',
          message: e.message ?? 'Failed to add new account',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'New account was added',
          message: 'New account was successfully added to the system',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchAccounts(props.pagination)).finally(() =>
          formik.resetForm()
        );
      });
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      description: '',
      roleId: '',
    },
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddAccountValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.username === formik.values.username ||
      formik.initialValues.password === formik.values.password ||
      formik.initialValues.confirmPassword === formik.values.confirmPassword ||
      formik.initialValues.email === formik.values.email ||
      formik.initialValues.firstName === formik.values.firstName ||
      formik.initialValues.lastName === formik.values.lastName
    ) {
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.username,
    formik.values.password,
    formik.values.confirmPassword,
    formik.values.email,
    formik.values.firstName,
    formik.values.lastName,
  ]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Add new room</Text>;
  };

  const handleCancelAddModal = () => {
    props.toggleShown();
    formik.resetForm();
  };

  const handleAddAction = () => {
    if (role === '') {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'Error while adding account',
        message: 'Please select the role that exists',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      formik.submitForm();
    }
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size={dimension.width / 2}
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className={classes.modalBody}>
              <InputWrapper required label="Username">
                <TextInput
                  icon={<ClipboardText />}
                  id="username"
                  name="username"
                  error={formik.errors.username}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.username}
                  placeholder="Username"
                />
              </InputWrapper>

              <div className={classes.displayGrid}>
                <PasswordInput
                  id="password"
                  description="Input your new password"
                  onChange={formik.handleChange('password')}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                      ? formik.errors.password
                      : null
                  }
                  value={formik.values.password}
                  label={'New Password'}
                  required
                  name="password"
                  className={classes.textInput}
                  placeholder="New Password"
                />

                <PasswordInput
                  id="confirmPassword"
                  description="Confirm your new password"
                  onChange={formik.handleChange('confirmPassword')}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                      ? formik.errors.confirmPassword
                      : null
                  }
                  value={formik.values.confirmPassword}
                  label={'Confirm Password'}
                  required
                  name="confirmPassword"
                  className={classes.textInput}
                  placeholder="Confirm Password"
                />
              </div>

              <InputWrapper required label="Email">
                <TextInput
                  icon={<ClipboardText />}
                  id="email"
                  name="email"
                  error={formik.errors.email}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.email}
                  placeholder="Email"
                />
              </InputWrapper>
              <div className={classes.displayGrid}>
                <InputWrapper required label="First name">
                  <TextInput
                    icon={<ClipboardText />}
                    id="firstName"
                    name="firstName"
                    error={formik.errors.firstName}
                    onChange={formik.handleChange}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.firstName}
                    placeholder="First name"
                  />
                </InputWrapper>

                <InputWrapper required label="Last name">
                  <TextInput
                    icon={<ClipboardText />}
                    id="lastName"
                    name="lastName"
                    error={formik.errors.lastName}
                    onChange={formik.handleChange}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.lastName}
                    placeholder="Last name"
                  />
                </InputWrapper>
              </div>

              <div className={classes.displayGrid}>
                <InputWrapper label="Phone">
                  <TextInput
                    icon={<ClipboardText />}
                    id="phone"
                    name="phone"
                    error={formik.errors.phone}
                    onChange={formik.handleChange}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.phone}
                    placeholder="Phone"
                  />
                </InputWrapper>

                <InputWrapper required label="Role">
                  <Select
                    name="role"
                    id="role"
                    onChange={(e) => setRole(e)}
                    searchable
                    value={role}
                    data={props.listRole}
                  />
                </InputWrapper>
              </div>

              <InputWrapper
                label="Description"
                description="(Optional) Maximum length is 500 characters."
              >
                <Textarea
                  icon={<FileDescription />}
                  className={classes.textInput}
                  id="description"
                  name="description"
                  error={formik.errors.description}
                  onChange={formik.handleChange}
                  radius="md"
                  value={formik.values.description}
                />
              </InputWrapper>
            </div>

            <div className={classes.modalFooter}>
              <Button
                onClick={() => handleCancelAddModal()}
                variant="outline"
                color={'red'}
                leftIcon={<X />}
              >
                Cancel
              </Button>

              <Button
                color="green"
                disabled={isAddDisabled}
                onClick={() => handleAddAction()}
                leftIcon={<Plus />}
              >
                Add
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </Modal>
    </>
  );
};

const useStyles = createStyles({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  displayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: '5rem',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 10,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
  },
});

export default AddAccountModal;
