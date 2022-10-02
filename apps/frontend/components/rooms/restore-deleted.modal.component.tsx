import React, {useEffect, useState} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Modal,
  Text,
  InputWrapper,
  TextInput, Highlight,
} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Search} from 'tabler-icons-react';
import {fetchDeletedRooms} from '../../redux/features/room/thunk/fetch-deleted-rooms';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import dayjs from 'dayjs';
import {useDebouncedValue} from '@mantine/hooks';
import NoDataFound from '../no-data-found';

interface RestoreDeletedRoomModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
}

const RestoreDeletedRoomModal: React.FC<RestoreDeletedRoomModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  const deletedRooms = useAppSelector((state) => state.room.deletedRooms);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedRooms(search));
  }, [searchDebounced]);

  // const handleRestoreDeletedRoom = (id: string) => {
  //   dispatch(restoreDeletedRoom(id))
  //     .unwrap()
  //     .then(() => dispatch(fetchDeletedRooms('')))
  //     .then(() => dispatch(fetchRooms(props.pagination)))
  //     .then(() =>
  //       showNotification({
  //         id: 'restore-room',
  //         color: 'teal',
  //         title: 'Library room was restored',
  //         message: 'Library room was successfully restored',
  //         icon: <Check/>,
  //         autoClose: 3000,
  //       })
  //     )
  //     .catch((e) => {
  //       showNotification({
  //         id: 'restore-room',
  //         color: 'red',
  //         title: 'Error while restore room',
  //         message: `${e.message}`,
  //         icon: <X/>,
  //         autoClose: 3000,
  //       });
  //     });
  // };
  const rows = deletedRooms?.map((row, index) => (
    <tr key={row.id} style={{height: 60}}>
      <td>
        {index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>
      </td>
      <td>{row.roomTypeName}</td>
      <td>{dayjs(row.deletedAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.deletedBy}</td>
      {/* <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => handleRestoreDeletedRoom(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise/>}
        >
          Restore
        </Button>
      </td> */}
    </tr>
  ));

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text
        style={{
          fontWeight: '600',
          fontSize: 22,
        }}
      >
        Restore Deleted Rooms
      </Text>
    );
  };

  return (
    <Modal
      opened={props.isShown}
      onClose={() => props.toggleShown()}
      centered
      size="70%"
      title={<ModalHeaderTitle/>}
      closeOnClickOutside={true}
      closeOnEscape={false}
    >
      <InputWrapper label="Search">
        <TextInput
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search/>}
        />
      </InputWrapper>
      {deletedRooms?.length > 0 ? (
        <>
          <ScrollArea
            sx={{height: 500}}
            onScrollPositionChange={({y}) => setScrolled(y !== 0)}
          >
            <Table sx={{minWidth: 700}}>
              <thead
                className={cx(classes.header, {[classes.scrolled]: scrolled})}
              >
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Type</th>
                <th>Deleted At</th>
                <th>Deleted By</th>
                {/* <th>Action</th> */}
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </>
      ) : (
        <NoDataFound/>
      )}
    </Modal>
  );
};

const useStyles = createStyles((theme) => ({
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

export default RestoreDeletedRoomModal;
