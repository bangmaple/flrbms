import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Modal,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
import { Check, ScanEye, Trash, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import Th from '../table/th.table.component';
import dayjs from 'dayjs';
import {
  deleteDeviceById,
  fetchDevices,
  fetchDeletedDevices,
} from '../../redux/features/devices';
import { fetchRequestByDeviceId } from '../../redux/features/room-booking/thunk/fetch-request-by-device';
import { showNotification } from '@mantine/notifications';

interface DeleteDeviceModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleInforModalShown(): void;
  pagination: PagingParams;
}

const DeleteDeviceModal: React.FC<DeleteDeviceModalProps> = (props) => {
  const { classes, cx } = useStyles();
  const selectedDeviceId = useAppSelector((state) => state.device.device.id);
  const [listRequest, setListRequest] = useState([]);
  const [isShownListRequest, setShownListRequest] = useState(false);

  const dispatch = useAppDispatch();

  const handleDeleteDevice = () => {
    if (listRequest.length > 0) {
      showNotification({
        id: 'delete-data',
        color: 'red',
        title: 'Error while deleting device',
        message:
          'There are already request in BOOKED state using this device. You cannot delete it.',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      dispatch(deleteDeviceById(selectedDeviceId))
        .unwrap()
        .catch((e) =>
          showNotification({
            id: 'delete-data',
            color: 'red',
            title: 'Error while deleting device',
            message: e.message ?? 'Failed to delete device',
            icon: <X />,
            autoClose: 3000,
          })
        )
        .then(() =>
          showNotification({
            id: 'delete-data',
            color: 'teal',
            title: 'Device was deleted',
            message: 'Device was successfully deleted',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .then(() => {
          props.toggleShown();
          props.toggleInforModalShown();
          dispatch(fetchDevices(props.pagination));
          dispatch(fetchDeletedDevices(''));
        });
    }
  };

  useEffect(() => {
    if (selectedDeviceId) {
      dispatch(fetchRequestByDeviceId(selectedDeviceId))
        .unwrap()
        .then((response) => setListRequest(response));
    }
  }, [dispatch, selectedDeviceId]);

  useEffect(() => {
    if (!props.isShown) {
      setShownListRequest(false);
    }
  }, [props.isShown]);

  const RenderStatus: React.FC<{ status: string }> = (_props) => {
    switch (_props.status) {
      case 'PENDING':
        return <div className={classes.pendingDisplay}>Pending</div>;
      case 'BOOKED':
        return <div className={classes.bookedDisplay}>Booked</div>;
      default:
        return null;
    }
  };

  const ListRequestByDeviceId = () => {
    const rows =
      listRequest && listRequest.length > 0
        ? listRequest.map((row) => (
            <tr key={row.id}>
              <td>{row.roomName}</td>
              <td>{dayjs(row.checkinDate).format('DD-MM-YYYY')}</td>
              <td>{row.requestedBy}</td>
              <td>{row.checkinSlot}</td>
              <td>{row.checkoutSlot}</td>
              <td>
                <RenderStatus status={row.status} />
              </td>
            </tr>
          ))
        : null;
    return listRequest && listRequest.length > 0 ? (
      <ScrollArea sx={{ height: 340 }}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: 'fixed' }}
        >
          <thead className={cx(classes.header, [classes.scrolled])}>
            <tr>
              <Th sorted={null} reversed={null} onSort={null}>
                Name
              </Th>

              <Th sorted={null} reversed={null} onSort={null}>
                Check in date
              </Th>
              <Th sorted={null} reversed={null} onSort={null}>
                Requested by
              </Th>
              <Th sorted={null} reversed={null} onSort={null}>
                Slot start
              </Th>
              <Th sorted={null} reversed={null} onSort={null}>
                Slot End
              </Th>
              <Th sorted={null} reversed={null} onSort={null}>
                Status
              </Th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    ) : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0px',
        }}
      >
        <h1>Dont have any room with this type</h1>
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
      size={isShownListRequest && listRequest.length > 0 ? '50%' : null}
      zIndex={200}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Once deleted, this device will <b>not be able to restore</b>. If there
          is a booking request that will use this device, the delete action will
          not be possible. Please cancel booking requests then delete this
          device.{' '}
        </Text>
        <div className={classes.modalFooter}>
          {listRequest.length > 0 ? (
            <Button
              leftIcon={<ScanEye />}
              style={{ backgroundColor: 'blue', width: '60%', margin: 10 }}
              onClick={() => setShownListRequest(!isShownListRequest)}
            >
              Requests use this device
            </Button>
          ) : null}

          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => handleDeleteDevice()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Delete this device
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
      {isShownListRequest && listRequest.length > 0 ? (
        <ListRequestByDeviceId />
      ) : null}
    </Modal>
  );
};

const useStyles = createStyles((theme) => ({
  modalTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalContainer: {
    margin: 10,
  },
  modalBody: {
    margin: 10,
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pendingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
    fontWeight: 600,
  },
  bookedDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export default DeleteDeviceModal;
