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
import {Check, RotateClockwise, Search, X} from 'tabler-icons-react';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import dayjs from 'dayjs';
import {useDebouncedValue} from '@mantine/hooks';
import NoDataFound from '../no-data-found';
import {fetchDeletedAccounts} from '../../redux/features/account/thunk/fetch-deleted.thunk';
import {fetchAccounts} from '../../redux/features/account/thunk/fetch-accounts.thunk';
import {restoreDeletedAccount} from '../../redux/features/account/thunk/restore-deleted.thunk';
import {showNotification} from "@mantine/notifications";

interface RestoreDeletedModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
}

const RestoreDeletedModal: React.FC<RestoreDeletedModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  const deletedAccounts = useAppSelector((state) => state.account.deletedAccounts);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedAccounts(search));
  }, [searchDebounced]);

  const handleRestoreDeletedAccount = (id: string) => {
    dispatch(restoreDeletedAccount(id))
      .unwrap()
      .catch(
        (e) =>
          showNotification({
              id: 'restore-data',
              color: 'red',
              title: 'Error while activate account',
              message: e.message ?? 'Failed to activate account',
              icon: <X/>,
              autoClose: 3000,
            }
          )).then(() =>
      showNotification({
        id: 'restore-data',
        color: 'teal',
        title: 'This account was activated',
        message: 'This account was successfully activated',
        icon: <Check/>,
        autoClose: 3000,
      })
    )
      .then(() => dispatch(fetchDeletedAccounts('')))
      .then(() => dispatch(fetchAccounts(props.pagination)));
  };
  const rows = deletedAccounts?.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.username}
        </Highlight>
      </td>
      <td>{row.fullname}</td>
      <td>{dayjs(row.deletedAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.deletedBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => handleRestoreDeletedAccount(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise/>}
        >
          Activate
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
        Restore Deleted Accounts
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
      {deletedAccounts?.length > 0 ? (
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
                <th>Username</th>
                <th>Full name</th>
                <th>Delete At</th>
                <th>Delete By</th>
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
