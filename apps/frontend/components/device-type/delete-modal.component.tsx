import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Modal,
  Select,
  Table,
  Text,
} from '@mantine/core';
import { Check, ScanEye, Trash, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchDeletedDeviceTypes,
  fetchDeviceTypes,
  deleteDeviceTypeById,
} from '../../redux/features/device-type/';
import { PaginationParams } from '../../models/pagination-params.model';
import Th from '../../components/table/th.table.component';
import {
  fetchDevicesByDeviceType,
  updateDeviceById,
} from '../../redux/features/devices/';
import { showNotification } from '@mantine/notifications';

interface DeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PaginationParams;
  deviceTypes: any[];
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedDeviceTypeId = useAppSelector(
    (state) => state.deviceType.deviceType.id
  );
  const [deviceType, setDeviceType] = useState<string>('');
  const [isShownListDevice, setShownListDevice] = useState(false);

  const [listDevice, setListDevice] = useState([]);

  const dispatch = useAppDispatch();

  const handleDeleteDeviceType = () => {
    if (listDevice.length > 0) {
      showNotification({
        id: 'delete-data',
        color: 'red',
        title: 'Error while deleting device type',
        message:
          'There are still devices of this type, please change the type of those devices before deleting type',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      dispatch(deleteDeviceTypeById(selectedDeviceTypeId))
        .unwrap()
        .then(() =>
          showNotification({
            id: 'delete-data',
            color: 'teal',
            title: 'Device type was deleted',
            message: 'Device type was successfully deleted',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .then(() => {
          props.toggleShown();
          dispatch(fetchDeviceTypes(props.pagination));
          dispatch(fetchDeletedDeviceTypes(''));
        })
        .catch((e) =>
          showNotification({
            id: 'delete-data',
            color: 'red',
            title: 'Error while deleting device type',
            message: e.message ?? 'Failed to delete device type',
            icon: <X />,
            autoClose: 3000,
          })
        );
    }
  };

  useEffect(() => {
    if (selectedDeviceTypeId) {
      dispatch(fetchDevicesByDeviceType(selectedDeviceTypeId))
        .unwrap()
        .then((response) => setListDevice(response));
    }
  }, [dispatch, selectedDeviceTypeId]);

  useEffect(() => {
    if (!props.isShown) {
      setShownListDevice(false);
    }
  }, [props.isShown]);

  const handleUpdateType = (device, deviceTypeId: string) => {
    dispatch(
      updateDeviceById({
        id: device.id,
        payload: {
          ...device,
          type: deviceTypeId,
        },
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
          title: 'Library device was updated',
          message: 'Library device was successfully updated',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      // .then(() => props.toggleShown())
      .then(() =>
        dispatch(fetchDevicesByDeviceType(selectedDeviceTypeId))
          .unwrap()
          .then((response) => setListDevice(response))
      );
  };

  const ListDeviceByDeviceType = () => {
    const rows =
      listDevice && listDevice.length > 0
        ? listDevice.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.name}</td>
              <td>
                <Select
                  name="type"
                  id="device-type"
                  onChange={(e) => setDeviceType(e)}
                  searchable
                  value={deviceType || row.type}
                  data={props.deviceTypes}
                  required
                />
              </td>
              <td className={classes.actionButtonContainer}>
                <Button
                  variant="outline"
                  color="green"
                  disabled={
                    deviceType === row.type || deviceType === '' ? true : false
                  }
                  onClick={() => handleUpdateType(row, deviceType)}
                >
                  Save
                </Button>
              </td>
            </tr>
          ))
        : null;
    return listDevice && listDevice.length > 0 ? (
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr>
            <Th
              style={{
                width: '60px',
              }}
              sorted={null}
              reversed={null}
              onSort={null}
            >
              STT
            </Th>

            <Th sorted={null} reversed={null} onSort={null}>
              Name
            </Th>

            <Th sorted={null} reversed={null} onSort={null}>
              Type
            </Th>

            <Th
              style={{
                width: '100px',
              }}
              sorted={null}
              reversed={null}
              onSort={null}
            >
              Actions
            </Th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    ) : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0px',
        }}
      >
        <h1>Don't have any device with this type</h1>
      </div>
    );
  };

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Are you sure?</Text>;
  };

  return (
    <Modal
      closeOnClickOutside={true}
      centered
      zIndex={100}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
      size={isShownListDevice && listDevice.length > 0 ? '70%' : null}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Deleting this device type will{' '}
          <b>also delete devices of this device type</b>. And make that devices
          unusable even if it has been booked before. Users who booked this
          device will receive a notification about this!
        </Text>
        <div className={classes.modalFooter}>
          {listDevice.length > 0 ? (
            <Button
              leftIcon={<ScanEye />}
              style={{ backgroundColor: 'blue', width: '60%', margin: 10 }}
              onClick={() => setShownListDevice(!isShownListDevice)}
            >
              List device with this type
            </Button>
          ) : null}

          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => handleDeleteDeviceType()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Delete this type
          </Button>
          <Button
            onClick={() => props.toggleShown()}
            leftIcon={<X />}
            style={{
              backgroundColor: FPT_ORANGE_COLOR,
              width: '60%',
              margin: 10,
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
      {isShownListDevice && listDevice.length > 0 ? (
        <ListDeviceByDeviceType />
      ) : null}
    </Modal>
  );
};

const useStyles = createStyles({
  modalTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalContainer: {
    margin: 10,
  },
  modalBody: {
    margin: 10,
    textAlign: 'justify',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DeleteModal;
