import React, {useEffect, useState} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Modal,
  Text,
  Button,
  InputWrapper,
  TextInput, Highlight,
} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Check, RotateClockwise, Search, Trash, X} from 'tabler-icons-react';
import {restoreDisabledRoom} from '../../redux/features/room/thunk/restore-disabled.thunk';
import {fetchRooms} from '../../redux/features/room/thunk/fetch-rooms';
import {fetchDisabledRooms} from '../../redux/features/room/thunk/fetch-disabled-rooms';
import {deleteRoomById} from '../../redux/features/room/thunk/delete-room-by-id';
import dayjs from 'dayjs';
import {useDebouncedValue} from '@mantine/hooks';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import {fetchDeletedRooms} from '../../redux/features/room/thunk/fetch-deleted-rooms';
import NoDataFound from '../no-data-found';
import RoomUpdateTypeModal from './update-type-modal.component';
import { getRoomById } from '../../redux/features/room/thunk/get-room-by-id';
import { showNotification } from '@mantine/notifications';

interface RestoreDisabledRoomModalProps {
  isShown: boolean;

  toggleShown(): void;
  pagination: PagingParams;
  roomTypes: any[];
}

const RestoreDisabledRoomModal: React.FC<RestoreDisabledRoomModalProps> = (
  props
) => {
  const { classes, cx } = useStyles();
  const disabledRooms = useAppSelector((state) => state.room.disabledRooms);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [isShowUpdateType, setIsShowUpdateType] = useState<boolean>(false);

  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDisabledRooms(search));
  }, [searchDebounced]);

  const handleActiveRoom = (
    id: string,
    roomType: string,
    isDeleted: string
  ) => {
    if (!roomType || isDeleted) {
      dispatch(getRoomById(id));
      setIsShowUpdateType(true);
    } else {
      dispatch(restoreDisabledRoom(id))
        .unwrap()
        .catch((e) =>
        showNotification({
          id: 'restore-room',
          color: 'red',
          title: 'Error while restoring library room',
          message: e.message ?? 'Failed to update library room',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'restore-room',
          color: 'teal',

          title: 'Library room was restored',

          message: 'Library room was successfully restored',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
        .then(() => dispatch(fetchRooms(props.pagination)))
        .then(() =>
          dispatch(fetchDisabledRooms(search))
            .unwrap()
            .then((disabledRooms) =>
              disabledRooms.length < 1 ? props.toggleShown() : null
            )
        );
    }
  };

  const handleDeleteRoom = (id: string) => {
    dispatch(deleteRoomById(id))
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'delete-room',
          color: 'red',
          title: 'Error while deleting library room',
          message: e.message ?? 'Failed to deleting library room',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'delete-room',
          color: 'teal',
          title: 'Library room was deleted',
          message: 'Library room was successfully deleted',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => dispatch(fetchRooms(props.pagination)))
      .then(() =>
        dispatch(fetchDisabledRooms(search))
          .unwrap()
          .then((disabledRooms) =>
            disabledRooms.length < 1 ? props.toggleShown() : null
          )
          .then(() => {
            dispatch(fetchDeletedRooms(''));
          })
      );
  };

  const rows = disabledRooms?.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>
      </td>
      <td>
        {row.roomTypeName}
      </td>
      <td>{dayjs(row.disabledAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.disabledBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() =>
            handleActiveRoom(row.id, row.roomTypeName, row.isTypeDeleted)
          }
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise />}
        >
          Restore
        </Button>
        <Button
          onClick={() => handleDeleteRoom(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="red"
          leftIcon={<Trash />}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text className={classes.modalHeaderTitle}>Restore Disabled Rooms</Text>
    );
  };

  return (
    <Modal
      opened={props.isShown}
      onClose={() => props.toggleShown()}
      centered
      size="70%"
      title={<ModalHeaderTitle />}
      closeOnClickOutside={true}
      closeOnEscape={false}
    >
      <InputWrapper label="Search">
        <TextInput
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search />}
        />
      </InputWrapper>
      {disabledRooms.length > 0 ? (
        <>
          <ScrollArea
            sx={{ height: 500 }}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <div>
              <Table sx={{ minWidth: 700 }}>
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                  <tr>
                    <th style={{ width: 50 }}>STT</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Disabled at</th>
                    <th>Disabled by</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </div>
          </ScrollArea>
        </>
      ) : (
        <NoDataFound />
      )}

      <RoomUpdateTypeModal
        isShown={isShowUpdateType}
        toggleShown={() => setIsShowUpdateType(!isShowUpdateType)}
        pagination={props.pagination}
        roomTypes={props.roomTypes}
      />
    </Modal>
  );
};

const useStyles = createStyles((theme) => ({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
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

export default RestoreDisabledRoomModal;
