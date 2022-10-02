import React, {useEffect, useState} from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {useWindowDimensions} from '../../hooks/use-window-dimensions';
import {
  Check,
  ClipboardText,
  FileDescription,
  Plus,
  X,
} from 'tabler-icons-react';
import {useAppDispatch} from '../../redux/hooks';
import {Form, FormikProvider, useFormik} from 'formik';
import {fetchRooms} from '../../redux/features/room/thunk/fetch-rooms';
import {addRoom} from '../../redux/features/room/thunk/add-room';
import * as Yup from 'yup';
import {showNotification} from '@mantine/notifications';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import {fetchDisabledRooms} from '../../redux/features/room/thunk/fetch-disabled-rooms';
import {fetchDeletedRooms} from '../../redux/features/room/thunk/fetch-deleted-rooms';

interface AddRoomModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
  roomTypes: any[];
}

const AddRoomValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Room name must have at least 1 character.')
    .max(100, 'Room name can only have at most 100 characters.')
    .required('Room name is required!'),
  description: Yup.string().max(
    500,
    'Room description only have at most 500 characters'
  ),
  capacity: Yup.number().max(1000, 'Room capacity limits 1000 participants')
    .min(1, 'Room capacity must have at least 1 participant')
    .required('Room capacity is required!')
});

const AddRoomModal: React.FC<AddRoomModalProps> = (props) => {
  const {classes} = useStyles();
  const [isAddDisabled, setAddDisabled] = useState<boolean>(false);
  const [roomType, setRoomType] = useState<string>('');

  const dispatch = useAppDispatch();
  const dimension = useWindowDimensions();

  const handleAddSubmit = async (values) => {
    if (!Number(values.capacity)) {
      showNotification({
        id: 'Add-capacity',
        color: 'red',
        title: 'Error while adding room',
        message: `Capacity must be a number`,
        icon: <X/>,
        autoClose: 3000,
      });
    }
    dispatch(
      addRoom({
        ...values,
        type: roomType,
        capacity: values.capacity
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Library room was added',
          message: 'Library room was successfully added to the system',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchRooms(props.pagination)).finally(() =>
          formik.resetForm()
        );
        dispatch(fetchDisabledRooms(''))
        dispatch(fetchDeletedRooms(''))
      })
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while adding library room',
          message: e.message ?? 'Failed to add library room',
          icon: <X/>,
          autoClose: 3000,
        })
      )
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      capacity: 1,
      description: '',
      isDisabled: false,
      type: 'Library Room',
    },
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddRoomValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.name === formik.values.name &&
      formik.initialValues.description === formik.values.description &&
      formik.initialValues.capacity === formik.values.capacity
    ) {
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }
  }, [formik.values.name,
    formik.values.description,
    formik.values.type,
    formik.values.capacity
  ]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Add new room</Text>;
  };

  const handleCancelAddModal = () => {
    props.toggleShown();
    formik.resetForm();
  };

  const handleAddAction = () => {
    if (roomType === '') {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'Error while adding library room',
        message: 'Please select the type that exists',
        icon: <X/>,
        autoClose: 3000,
      });
    } else {
      formik.submitForm()
    }
  }

  return (
    <>
      <Modal
        title={<ModalHeaderTitle/>}
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
                label="Room name"
                description="Room name must be unique. Maximum length is 100 characters"
              >
                <TextInput
                  icon={<ClipboardText/>}
                  id="room-name"
                  name="name"
                  error={formik.errors.name}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.name}
                />
              </InputWrapper>
              <InputWrapper
                label="Room description"
                description="(Optional) Maximum length is 500 characters."
              >
                <Textarea
                  icon={<FileDescription/>}
                  className={classes.textInput}
                  id="room-description"
                  name="description"
                  error={formik.errors.description}
                  onChange={formik.handleChange}
                  radius="md"
                  value={formik.values.description}
                />
              </InputWrapper>
              <InputWrapper
                required
                label="Room type"
                description="Room type is to define room separately"
              >
                <Select
                  name="type"
                  id="room-type"
                  onChange={(e) => setRoomType(e)}
                  searchable
                  value={roomType}
                  data={props.roomTypes}
                />
              </InputWrapper>
              <InputWrapper
                required
                label="Room Capacity"
                description="Room capacity contains participants"
              >
                <TextInput
                  icon={<ClipboardText/>}
                  id="room-capacity"
                  name="capacity"
                  error={formik.errors.capacity}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.capacity}
                />
              </InputWrapper>
              <Switch
                label={
                  <div style={{fontSize: 14}}>Make this room disabled</div>
                }
                style={{
                  marginTop: 20,
                  fontWeight: '500',
                }}
                onChange={formik.handleChange}
                size="lg"
                checked={formik.values.isDisabled}
                name="isDisabled"
                id="room-disabled"
              />
            </div>

            <div className={classes.modalFooter}>
              <Button
                onClick={() => handleCancelAddModal()}
                variant="outline"
                color={'red'}
                leftIcon={<X/>}
              >
                Cancel
              </Button>

              <Button
                color="green"
                disabled={isAddDisabled}
                onClick={() => handleAddAction()}
                leftIcon={<Plus/>}
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

export default AddRoomModal;
