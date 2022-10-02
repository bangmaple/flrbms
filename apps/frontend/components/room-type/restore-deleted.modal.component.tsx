import React, { useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Ban, Check, RotateClockwise, Search, X } from 'tabler-icons-react';
import {
  restoreDeletedRoomTypeById,
  permanentlyDeleteRoomTypeById,
  fetchDeletedRoomTypes,
  fetchRoomTypes,
} from '../../redux/features/room-type';
import { PaginationParams } from '../../models/pagination-params.model';
import dayjs from 'dayjs';
import PermanentDeleteModal from '../actions/modal/permanant-delete-modal.component';
import { showNotification } from '@mantine/notifications';
import NoDataFound from '../no-data-found';
import { useDebouncedValue } from '@mantine/hooks';

interface RestoreDeletedModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PaginationParams;
}

const RestoreDeletedModal: React.FC<RestoreDeletedModalProps> = (props) => {
  const { classes, cx } = useStyles();
  const deletedRoomTypes = useAppSelector(
    (state) => state.roomType.deletedRoomTypes
  );
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [isPermanentDeleteShown, setPermanentDeleteShown] = useState(false);
  const [id, setId] = useState('');
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedRoomTypes(search));
  }, [searchDebounced]);

  const handleRestoreDeletedRoomType = (id: string) => {
    dispatch(restoreDeletedRoomTypeById(id))
      .unwrap()
      .then(() => dispatch(fetchDeletedRoomTypes('')))
      .then(() => dispatch(fetchRoomTypes(props.pagination)))
      .then(() =>
        showNotification({
          id: 'restore-room-type',
          color: 'teal',
          title: 'Room type was restored',
          message: 'Room type was successfully restored',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .catch((e) => {
        showNotification({
          id: 'restore-room-type',
          color: 'red',
          title: 'Error while restore room type',
          message: `${e.message}`,
          icon: <X />,
          autoClose: 3000,
        });
      });
  };

  const handelPermanentDeleteButton = (id) => {
    setId(id);
    setPermanentDeleteShown(true);
  };

  const handelPermanentDeleteButtonOut = () => {
    setId('');
    setPermanentDeleteShown(false);
  };

  const handlePermanentDeleted = (id: string) => {
    dispatch(permanentlyDeleteRoomTypeById(id))
      .unwrap()
      .then(() => dispatch(fetchDeletedRoomTypes('')))
      .then(() =>
        showNotification({
          id: 'delete-room-type',
          color: 'teal',
          title: 'Room type was permanent deleted',
          message: 'Room type was successfully permanent deleted',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .catch((e) => {
        showNotification({
          id: 'delete-room-type',
          color: 'red',
          title: 'Error while permanent deleted room type',
          message: `${e.message}`,
          icon: <X />,
          autoClose: 3000,
        });
      });
    setPermanentDeleteShown(false);
  };
  const rows = deletedRoomTypes?.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>
        </td>
      <td>{dayjs(row.deletedAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.deletedBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => handleRestoreDeletedRoomType(row.id)}
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
          onClick={() => handelPermanentDeleteButton(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="red"
          leftIcon={<Ban />}
        >
          Permanent Delete
        </Button>
      </td>
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
        Restore Deleted Room Type
      </Text>
    );
  };

  return (
    <div>
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
        {deletedRoomTypes?.length > 0 ?  (
        <ScrollArea
          sx={{ height: 500 }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table sx={{ minWidth: 700 }}>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Deleted At</th>
                <th>Deleted By</th>
                <th style={{ width: 100 }}>Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>

        ): <NoDataFound />}
      </Modal>
      <PermanentDeleteModal
        handleSubmit={() => handlePermanentDeleted(id)}
        isShown={isPermanentDeleteShown}
        toggleShown={() => handelPermanentDeleteButtonOut()}
      />
    </div>
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

export default RestoreDeletedModal;
