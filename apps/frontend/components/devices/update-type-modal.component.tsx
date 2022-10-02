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
import { fetchDevices } from '../../redux/features/devices/thunk/fetch-devices.thunk';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { updateTypeThenRestore } from '../../redux/features/devices/thunk/update-type-then-restore';
import { fetchDisabledDevices } from '../../redux/features/devices/thunk/fetch-disabled.thunk';

interface UpdateTypeModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
  deviceTypes: any[];
}

const DeviceUpdateTypeModal: React.FC<UpdateTypeModalProps> = (props) => {
  const { classes } = useStyles();
  const device = useAppSelector((state) => state.device.device);
  const [isUpdateDisabled, setUpdateDisabled] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<string>('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    setDeviceType(device.deviceTypeId);
  }, [device.deviceTypeId]);

  const handleUpdateSubmit = async (values) => {
    dispatch(
      updateTypeThenRestore({
        id: values.id,
        body: { type: deviceType },
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while updating library device',
          message: e.message ?? 'Failed to update library device',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Library device was restore',
          message: 'Library device was successfully restore',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => props.toggleShown())
      .then(() => {
        props.toggleShown();
        dispatch(fetchDevices(props.pagination));
        dispatch(fetchDisabledDevices(''));
      })
      .finally(() => {
        formik.resetForm();
      });
  };

  const formik = useFormik({
    initialValues: {
      id: device.id,
      type: device.deviceTypeId,
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
      <Text className={classes.modalHeaderTitle}>Update Device Type</Text>
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
                The Device Type of this device was deleted. If you still want to
                restore this device, please change other Device Type
              </div>
              <InputWrapper
                required
                label="Device Type"
                style={{ marginBottom: 20 }}
              >
                <Select
                  onChange={(e) => {
                    setUpdateDisabled(false);
                    setDeviceType(e);
                  }}
                  searchable
                  defaultChecked={true}
                  name="type"
                  id="device-type"
                  data={props.deviceTypes}
                  value={deviceType}
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

export default DeviceUpdateTypeModal;
