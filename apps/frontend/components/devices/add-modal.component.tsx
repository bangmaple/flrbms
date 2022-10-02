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
import {
  addDevice,
  fetchDeletedDevices,
  fetchDevices,
  fetchDisabledDevices,
} from '../../redux/features/devices';

interface AddDeviceModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PagingParams;
  deviceTypes: any[];
}

const AddDeviceValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Device name must have at least 1 character.')
    .max(100, 'Device name can only have at most 100 characters.')
    .required('Device name is required!'),
  description: Yup.string().max(
    500,
    'Device description only have at most 500 characters'
  ),
});

const AddDeviceModal: React.FC<AddDeviceModalProps> = (props) => {
  const { classes } = useStyles();
  const [isAddDisabled, setAddDisabled] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<string>('');

  const dispatch = useAppDispatch();
  const dimension = useWindowDimensions();

  const handleAddSubmit = async (values) => {
    dispatch(
      addDevice({
        ...values,
        type: deviceType,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Device was added',
          message: 'Device was successfully added to the system',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchDevices(props.pagination)).finally(() =>
          formik.resetForm()
        );
        dispatch(fetchDisabledDevices(''));
        dispatch(fetchDeletedDevices(''));
      })
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while adding device',
          message: e.message ?? 'Failed to add device',
          icon: <X />,
          autoClose: 3000,
        })
      );
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: 'Library Device',
    },
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddDeviceValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.name === formik.values.name &&
      formik.initialValues.description === formik.values.description
    ) {
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }
  }, [formik.values.name, formik.values.description]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Add new device</Text>;
  };

  const handleCancelAddModal = () => {
    props.toggleShown();
    formik.resetForm();
  };

  const handleAddAction = () => {
    if (deviceType === '') {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'Error while adding library device',
        message: 'Please select the type that exists',
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
              <InputWrapper
                required
                label="Device name"
                description="Device name must be unique. Maximum length is 100 characters"
              >
                <TextInput
                  icon={<ClipboardText />}
                  id="device-name"
                  name="name"
                  error={formik.errors.name}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.name}
                />
              </InputWrapper>
              <InputWrapper
                label="Device description"
                description="(Optional) Maximum length is 500 characters."
              >
                <Textarea
                  icon={<FileDescription />}
                  className={classes.textInput}
                  id="device-description"
                  name="description"
                  error={formik.errors.description}
                  onChange={formik.handleChange}
                  radius="md"
                  value={formik.values.description}
                />
              </InputWrapper>
              <InputWrapper
                required
                label="Device type"
                description="Device type is to define device separately"
              >
                <Select
                  name="type"
                  id="device-type"
                  onChange={(e) => setDeviceType(e)}
                  searchable
                  value={deviceType}
                  data={props.deviceTypes}
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

export default AddDeviceModal;
