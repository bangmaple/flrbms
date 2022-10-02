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
import {Ban, Check, RotateClockwise, Search, X} from 'tabler-icons-react';
import {
  restoreDeletedDeviceTypeById,
  permanentlyDeleteDeviceTypeById,
  fetchDeletedDeviceTypes,
  fetchDeviceTypes,
} from '../../redux/features/device-type';
import {PaginationParams} from '../../models/pagination-params.model';
import dayjs from 'dayjs';
import {showNotification} from '@mantine/notifications';
import PermanentDeleteModal from '../actions/modal/permanant-delete-modal.component';
import NoDataFound from '../no-data-found';
import {useDebouncedValue} from '@mantine/hooks';

interface RestoreDeletedModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PaginationParams;
}

const RestoreDeletedModal: React.FC<RestoreDeletedModalProps> = (props) => {
  const {classes, cx} = useStyles();
  const deletedDeviceTypes = useAppSelector(
    (state) => state.deviceType.deletedDeviceTypes
  );
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [isPermanentDeleteShown, setPermanentDeleteShown] = useState(false);
  const [id, setId] = useState('');
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedDeviceTypes(search));
  }, [searchDebounced]);

  const handleRestoreDeletedDeviceType = (_id: string) => {
    dispatch(restoreDeletedDeviceTypeById(_id))
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'restore-data',
          color: 'red',
          title: 'Error while restore device type',
          message: e.message ?? 'Failed to restore device type',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'restore-data',
          color: 'teal',
          title: 'Device type was restored',
          message: 'Device type was successfully restored',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchDeletedDeviceTypes(''));
        dispatch(fetchDeviceTypes(props.pagination));
      });
  };

  const handelPermanentDeleteButton = (_id) => {
    setId(_id);
    setPermanentDeleteShown(true);
  };

  const handelPermanentDeleteButtonOut = () => {
    setId('');
    setPermanentDeleteShown(false);
  };

  const handlePermanentDeleted = (_id: string) => {
    dispatch(permanentlyDeleteDeviceTypeById(_id))
      .unwrap()
      .then(() => dispatch(fetchDeletedDeviceTypes('')))
      .then(() =>
        showNotification({
          id: 'delete-device-type',
          color: 'teal',
          title: 'Device type was permanently deleted',
          message: 'Device type was successfully permanently deleted',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .catch((e) => {
        showNotification({
          id: 'delete-device-type',
          color: 'red',
          title: 'Error while permanent deleted device type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
    setPermanentDeleteShown(false);
  };
  const rows = deletedDeviceTypes?.map((row, index) => (
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
          onClick={() => handleRestoreDeletedDeviceType(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise/>}
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
          leftIcon={<Ban/>}
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
        Restore Deleted Device Type
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
        {deletedDeviceTypes?.length > 0 ? (
          <ScrollArea
            sx={{height: 500}}
            onScrollPositionChange={({y}) => setScrolled(y !== 0)}
          >
            <Table>
              <thead
                className={cx(classes.header, {[classes.scrolled]: scrolled})}
              >
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Deleted At</th>
                <th>Deleted By</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        ) : (
          <NoDataFound/>
        )}
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
