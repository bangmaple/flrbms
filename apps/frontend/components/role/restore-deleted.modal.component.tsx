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
  fetchRoles,
  fetchDeletedRoles,
  restoreDeletedRoleById,
} from '../../redux/features/role';
import {PaginationParams} from '../../models/pagination-params.model';
import dayjs from 'dayjs';
import PermanentDeleteModal from '../actions/modal/permanant-delete-modal.component';
import {showNotification} from '@mantine/notifications';
import {permanentlyDeleteRoleById} from '../../redux/features/role/thunk/permanently-delete-role-by-id.thunk';
import NoDataFound from '../no-data-found';
import {useDebouncedValue} from '@mantine/hooks';

interface RestoreDeletedModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PaginationParams;
}

const RestoreDeletedModal: React.FC<RestoreDeletedModalProps> = (props) => {
  const {classes, cx} = useStyles();
  const deletedRoles = useAppSelector((state) => state.role.deletedRoles);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [isPermanentDeleteShown, setPermanentDeleteShown] = useState(false);
  const [id, setId] = useState('');
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedRoles(search));
  }, [searchDebounced]);

  const handelPermanentDeleteButton = (id) => {
    setId(id);
    setPermanentDeleteShown(true);
  };

  const handelPermanentDeleteButtonOut = () => {
    setId('');
    setPermanentDeleteShown(false);
  };

  const handlePermanentDeleted = (id: string) => {
    dispatch(permanentlyDeleteRoleById(id))
      .unwrap()
      .then(() => dispatch(fetchDeletedRoles('')))
      .then(() =>
        showNotification({
          id: 'delete-role',
          color: 'teal',
          title: 'This role was permanent deleted',
          message: 'This role was successfully permanent deleted',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .catch((e) => {
        showNotification({
          id: 'delete-booking-reason',
          color: 'red',
          title: 'Error while permanent deleted role',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
    setPermanentDeleteShown(false);
  };

  const handleRestoreDeletedRole = (id: string) => {
    dispatch(restoreDeletedRoleById(id))
      .unwrap()
      .catch(
        (e) =>
          showNotification({
              id: 'restore-data',
              color: 'red',
              title: 'Error while restore this role',
              message: e.message ?? 'Failed to restore this role',
              icon: <X/>,
              autoClose: 3000,
            }
          )).then(() =>
      showNotification({
        id: 'restore-data',
        color: 'teal',
        title: 'This role was restored',
        message: 'This role was successfully restored',
        icon: <Check/>,
        autoClose: 3000,
      })
    )
      .then(() => dispatch(fetchDeletedRoles('')))
      .then(() => dispatch(fetchRoles(props.pagination)));
  };
  const rows = deletedRoles?.map((row, index) => (
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
          onClick={() => handleRestoreDeletedRole(row.id)}
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
        Restore Deleted Role
      </Text>
    );
  };

  return (
    <>
      <Modal
        opened={props.isShown}
        onClose={() => props.toggleShown()}
        centered
        size="85%"
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
        {deletedRoles.length > 0 ? (
          <>
            <ScrollArea
              sx={{height: 500}}
              onScrollPositionChange={({y}) => setScrolled(y !== 0)}
            >
              <Table sx={{minWidth: 700}}>
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
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
          </>
        ) : (
          <NoDataFound/>
        )}
      </Modal>
      <PermanentDeleteModal
        handleSubmit={() => handlePermanentDeleted(id)}
        isShown={isPermanentDeleteShown}
        toggleShown={() => handelPermanentDeleteButtonOut()}
      />
    </>
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
