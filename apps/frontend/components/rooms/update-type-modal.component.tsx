import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Select,
  Text,
} from '@mantine/core';
import { Check, Pencil, X } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import { fetchRooms } from '../../redux/features/room/thunk/fetch-rooms';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { updateTypeThenRestore } from '../../redux/features/room/thunk/update-type-then-restore';
import { fetchDisabledRooms } from '../../redux/features/room/thunk/fetch-disabled-rooms';

interface UpdateTypeModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
  roomTypes: any[];
}

const RoomUpdateTypeModal: React.FC<UpdateTypeModalProps> = (props) => {
  const { classes } = useStyles();
  const room = useAppSelector((state) => state.room.room);
  const [isUpdateDisabled, setUpdateDisabled] = useState<boolean>(false);
  const [roomType, setRoomType] = useState<string>('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    setRoomType(room.roomTypeId);
  }, [room.roomTypeId]);

  const handleUpdateSubmit = async (values) => {
    dispatch(
      updateTypeThenRestore({
        id: values.id,
        body: { type: roomType },
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while updating library room',
          message: e.message ?? 'Failed to update library room',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Library room was restore',
          message: 'Library room was successfully restore',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => props.toggleShown())
      .then(() => {
        props.toggleShown();
        dispatch(fetchRooms(props.pagination));
        dispatch(fetchDisabledRooms(''));
      })
      .finally(() => {
        formik.resetForm();
      });
  };

  const formik = useFormik({
    initialValues: {
      id: room.id,
      type: room.roomTypeId,
    },
    enableReinitialize: true,
    onSubmit: (values) => handleUpdateSubmit(values),
  });

  useEffect(() => {
    if (formik.initialValues.type === formik.values.type) {
      setUpdateDisabled(true);
    } else {
      setUpdateDisabled(false);
    }
  }, [formik.values.type, formik.initialValues.type]);

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text className={classes.modalHeaderTitle}>Update Room Type</Text>
    );
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size={400}
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
              <div style={{ marginBottom: 35 }}>
                The Room Type of this room was deleted. If you still want to
                restore this room, please change other Room Type
              </div>
              <InputWrapper
                required
                label="Room Type"
                style={{ marginBottom: 20 }}
              >
                <Select
                  onChange={(e) => {
                    setUpdateDisabled(false);
                    setRoomType(e);
                  }}
                  searchable
                  defaultChecked={true}
                  name="type"
                  id="room-type"
                  data={props.roomTypes}
                  value={roomType}
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
                Restore
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
  textInput: {
    marginTop: 10,
  },
});

export default RoomUpdateTypeModal;
