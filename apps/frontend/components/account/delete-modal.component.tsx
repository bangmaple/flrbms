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
import { deleteAccountById } from '../../redux/features/account/thunk/delete-by-id';
import { fetchAccounts } from '../../redux/features/account/thunk/fetch-accounts.thunk';
import { fetchDeletedAccounts } from '../../redux/features/account/thunk/fetch-deleted.thunk';
import { fetchRequestByAccountId } from '../../redux/features/room-booking/thunk/fetch-room-booking-by-account';
import { showNotification } from '@mantine/notifications';

interface DeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  toggleInforModalShown(): void;
  pagination: PagingParams;
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { classes, cx } = useStyles();
  const selectedAccountId = useAppSelector((state) => state.account.account.id);
  const [listRequest, setListRequest] = useState([]);
  const [isShownListRequest, setShownListRequest] = useState(false);

  const dispatch = useAppDispatch();

  const handleDeleteAccount = () => {
    dispatch(deleteAccountById(selectedAccountId))
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'delete-account',
          color: 'red',
          title: 'Error while delete account',
          message: e.message ?? 'Failed to delete account',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'delete-account',
          color: 'teal',
          title: 'Account was deleted',
          message: 'Account was successfully deleted',
          icon: <Check />,
          autoClose: 3000,
        })
      )

      .then(() => {
        props.toggleShown();
        props.toggleInforModalShown();
        dispatch(fetchAccounts(props.pagination));
        dispatch(fetchDeletedAccounts(''));
      });
  };

  useEffect(() => {
    if (selectedAccountId) {
      dispatch(fetchRequestByAccountId(selectedAccountId))
        .unwrap()
        .then((response) => setListRequest(response));
    }
  }, [dispatch, selectedAccountId]);

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

  const ListRequestByAccountId = () => {
    const rows =
      listRequest && listRequest.length > 0
        ? listRequest.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.requestedBy}</td>
              <td>{dayjs(row.timeCheckin).format('HH:mm DD/MM/YYYY')}</td>
              <td>{dayjs(row.timeCheckout).format('HH:mm DD/MM/YYYY')}</td>
              <td>
                <RenderStatus status={row.status} />
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
          <thead className={cx(classes.header, [classes.scrolled])}>
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
                Request By
              </Th>

              <Th sorted={null} reversed={null} onSort={null}>
                Time start
              </Th>
              <Th sorted={null} reversed={null} onSort={null}>
                Time end
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
        <h1>Dont have any Account with this type</h1>
      </div>
    );
  };

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Are you sure?</Text>;
  };

  return (
    <Modal
      closeOnClickOutside={true}
      size={isShownListRequest && listRequest.length > 0 ? '50%' : null}
      centered
      zIndex={200}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Delete the account will make the account inaccessible to the system.
          This account&apos;s pending booking requests will be cancelled
        </Text>
        <div className={classes.modalFooter}>
          {listRequest.length > 0 ? (
            <Button
              leftIcon={<ScanEye />}
              style={{ backgroundColor: 'blue', width: '60%', margin: 10 }}
              onClick={() => setShownListRequest(!isShownListRequest)}
            >
              List request of this account
            </Button>
          ) : null}

          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => handleDeleteAccount()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Delete this account
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
        <ListRequestByAccountId />
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
  bookedDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
  pendingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
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

export default DeleteModal;
