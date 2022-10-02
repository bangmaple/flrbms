/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  Check,
  ClipboardText,
  FileDescription,
  Id,
  Pencil,
  X,
} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Form, FormikProvider, useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { updateAccountById } from '../../redux/features/account/thunk/update-account-by-id';
import { fetchAccounts } from '../../redux/features/account/thunk/fetch-accounts.thunk';

interface UpdateModalProps {
  isShown: boolean;

  toggleShown(): void;

  formik: FormikProps<any>;

  handleSubmit(): void;

  pagination: PagingParams;
  role: any[];
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const UpdateAccountValidation = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .min(2, 'Fullname must be at least 2 characters')
    .max(100, 'Fullname can only maximum at 100 characters')
    .required('Fullname is required'),
  description: Yup.string()
    .nullable()
    .max(500, 'Description can only maximum at 500 characters'),
  phone: Yup.string()
    .required()
    .nullable()
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10)
    .max(10),
});

const AccountUpdateModal: React.FC<UpdateModalProps> = (props) => {
  const { classes } = useStyles();
  const account = useAppSelector((state) => state.account.account);
  const [isUpdateDisabled, setUpdateDisabled] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    setRole(account.roleId);
  }, [account.roleId]);

  const handleUpdateSubmit = async (values) => {
    dispatch(
      updateAccountById({
        id: values.id,
        payload: {
          ...values,
          roleId: role,
        },
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while updating account',
          message: e.message ?? 'Failed to update account',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Account was updated',
          message: 'Account was successfully updated',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => props.toggleShown())
      .then(() => dispatch(fetchAccounts(props.pagination)))
      .finally(() => {
        formik.resetForm();
        setRole(account.roleId);
      });
  };

  const formik = useFormik({
    initialValues: {
      id: account.id,
      username: account.username,
      fullname: account.fullname,
      email: account.email,
      phone: account.phone,
      description: account.description,
      roleId: account.role,
    },
    enableReinitialize: true,
    onSubmit: (values) => handleUpdateSubmit(values),
    validationSchema: UpdateAccountValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.fullname === formik.values.fullname &&
      formik.initialValues.description === formik.values.description &&
      formik.initialValues.roleId === formik.values.roleId &&
      formik.initialValues.phone === formik.values.phone &&
      formik.initialValues.email === formik.values.email
    ) {
      setUpdateDisabled(true);
    } else {
      setUpdateDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.description,
    formik.values.fullname,
    formik.values.roleId,
    formik.values.phone,
    formik.values.email,
  ]);

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text className={classes.modalHeaderTitle}>
        Update Account Information
      </Text>
    );
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size="lg"
        centered
        opened={props.isShown}
        onClose={() => {
          formik.resetForm();
          props.toggleShown();
        }}
      >
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className={classes.modalBody}>
              <InputWrapper
                required
                label="Account ID"
                style={{ marginBottom: 20 }}
              >
                <TextInput
                  icon={<Id />}
                  disabled
                  id="account-id"
                  name="id"
                  radius="md"
                  readOnly
                  value={formik.values.id}
                />
              </InputWrapper>
              <div className={classes.displayGrid} style={{ marginBottom: 20 }}>
                <InputWrapper
                  required
                  label="Username"
                  style={{ marginBottom: 20 }}
                >
                  <TextInput
                    icon={<Id />}
                    disabled
                    id="username"
                    name="username"
                    radius="md"
                    readOnly
                    value={formik.values.username}
                  />
                </InputWrapper>
                <InputWrapper
                  required
                  label="Fullname"
                  style={{ marginBottom: 20 }}
                >
                  <TextInput
                    icon={<ClipboardText />}
                    id="fullname"
                    name="fullname"
                    error={formik.errors.fullname}
                    onChange={formik.handleChange}
                    radius="md"
                    value={formik.values.fullname}
                  />
                </InputWrapper>
                <InputWrapper required label="Email">
                  <TextInput
                    icon={<ClipboardText />}
                    id="email"
                    name="email"
                    error={formik.errors.email}
                    onChange={formik.handleChange}
                    radius="md"
                    value={formik.values.email}
                  />
                </InputWrapper>

                <InputWrapper required label="Phone">
                  <TextInput
                    icon={<ClipboardText />}
                    id="phone"
                    name="phone"
                    error={formik.errors.phone}
                    onChange={formik.handleChange}
                    radius="md"
                    value={formik.values.phone}
                  />
                </InputWrapper>
              </div>
              <InputWrapper required label="Role" style={{ marginBottom: 20 }}>
                <Select
                  onChange={(e) => {
                    setUpdateDisabled(false);
                    setRole(e);
                  }}
                  searchable
                  defaultChecked={true}
                  name="role"
                  id="role"
                  data={props.role}
                  value={role}
                />
              </InputWrapper>
              <InputWrapper label="Description">
                <Textarea
                  id="description"
                  name="description"
                  icon={<FileDescription />}
                  error={formik.errors.description}
                  onChange={formik.handleChange}
                  autosize
                  value={formik.values.description || undefined}
                  minRows={4}
                />
              </InputWrapper>
            </div>

            <div className={classes.modalFooter}>
              <Button
                color="green"
                disabled={isUpdateDisabled}
                onClick={() => formik.submitForm()}
                leftIcon={<Pencil />}
              >
                Update
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
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 10,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    columnGap: '20px',
    alignItems: 'start',
  },
});

export default AccountUpdateModal;
