import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Modal,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
import { Archive, Check, ScanEye, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { disableRoomById } from '../../redux/features/room/thunk/disable-room-by-id';
import { fetchRooms } from '../../redux/features/room/thunk/fetch-rooms';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { fetchDisabledRooms } from '../../redux/features/room/thunk/fetch-disabled-rooms';
import Th from '../table/th.table.component';
import dayjs from 'dayjs';
import { fetchRequestByRoomId } from '../../redux/features/room-booking/thunk/fetch-request-by-room';
import { showNotification } from '@mantine/notifications';

interface DisableRoomModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PagingParams;
}
const DisableRoomModal: React.FC<DisableRoomModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedRoomId = useAppSelector((state) => state.room.room.id);
  const [listRequest, setListRequest] = useState([]);
  const [isShownListRequest, setShownListRequest] = useState(false);

  const dispatch = useAppDispatch();

  const handleDisableSelectedRoom = () => {
    // if (listRequest.length > 0) {
    //   showNotification({
    //     id: 'disable-data',
    //     color: 'red',
    //     title: 'Error while disable room',
    //     message: 'Chưa xử lý vụ disable room đã có người book',
    //     icon: <X />,
    //     autoClose: 3000,
    //   });
    // } else {
      dispatch(disableRoomById(selectedRoomId))
        .catch((e) =>
          showNotification({
            id: 'disable-data',
            color: 'red',
            title: 'Error while disable room',
            message: e.message ?? 'Failed to disable room',
            icon: <X />,
            autoClose: 3000,
          })
        )
        .then(() =>
          showNotification({
            id: 'disable-data',
            color: 'teal',
            title: 'Room was disabled',
            message: 'Room was successfully disabled',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .then(() => {
          props.toggleShown();
          dispatch(fetchDisabledRooms(''));
          dispatch(fetchRooms(props.pagination));
        });
    // }
  };
  useEffect(() => {
    if (selectedRoomId) {
      dispatch(fetchRequestByRoomId(selectedRoomId))
        .unwrap()
        .then((response) => setListRequest(response));
    }
  }, [dispatch, selectedRoomId]);

  const ListRequestByRoomId = () => {
    const rows =
      listRequest && listRequest.length > 0
        ? listRequest.map((row, index) => (
            <tr key={row.id}>
              <td>{row.roomName}</td>
              <td>{dayjs(row.checkinDate).format('DD-MM-YYYY')}</td>
              <td>{row.requestedBy}</td>
              <td>{row.checkinTime?.slice(0, 5)}</td>
              <td>{row.checkoutTime?.slice(0, 5)}</td>
              <td>
                {row.status === 'PENDING' ? (
                  <div className={classes.pendingDisplay}>{row.status}</div>
                ) : row.status === 'BOOKED' ? (
                  <div className={classes.bookedDisplay}>{row.status}</div>
                ) : null}
              </td>
            </tr>
          ))
        : null;
    return listRequest && listRequest.length > 0 ? (
      <ScrollArea sx={{ height: 200 }}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: 'fixed' }}
        >
          <thead className={classes.header}>
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
                Time start
              </Th>
              <Th sorted={null} reversed={null} onSort={null}>
                Time End
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
      zIndex={200}
      title={<ModalHeaderTitle />}
      size={isShownListRequest && listRequest.length > 0 ? '50%' : null}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Disable this will make this room <b>unusable</b> even it has been
          booked before.
          <b> Users who booked this room</b> will receive the notification about
          this and that associated booking will also be <b>cancelled</b>!
        </Text>
        <div className={classes.modalFooter}>
          {listRequest.length > 0 ? (
            <Button
              leftIcon={<ScanEye />}
              style={{ backgroundColor: 'blue', width: '60%', margin: 10 }}
              onClick={() => setShownListRequest(!isShownListRequest)}
            >
              Requests use this room
            </Button>
          ) : null}

          <Button
            color="red"
            leftIcon={<Archive />}
            onClick={() => handleDisableSelectedRoom()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Disable this room
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
        <ListRequestByRoomId />
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
}));

export default DisableRoomModal;
