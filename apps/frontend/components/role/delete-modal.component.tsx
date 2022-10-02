import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Modal,
  Select,
  Table,
  Text,
} from '@mantine/core';
import {
  Check,
  ScanEye,
  Trash,
  X,
} from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchDeletedRoles,
  deleteRoleById,
  fetchRoles,
} from '../../redux/features/role';
import { PaginationParams } from '../../models/pagination-params.model';
import Th from '../../components/table/th.table.component';
import { fetchAccountByRole } from '../../redux/features/account/thunk/fetch-accounts-by-role';
import { showNotification } from '@mantine/notifications';
import { updateAccountById } from '../../redux/features/account/thunk/update-account-by-id';

interface DeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PaginationParams;
  roles: any[];
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { classes } = useStyles();
  const selectedRoleId = useAppSelector((state) => state.role.role.id);
  const [role, setRole] = useState<string>('');
  const [isShownListAccount, setShownListAccount] = useState(false);

  const [listAccount, setListAccount] = useState([]);

  const dispatch = useAppDispatch();

  const handleDeleteRole = () => {
    if (listAccount.length > 0) {
      showNotification({
        id: 'delete-data',
        color: 'red',
        title: 'Error while delete role',
        message:
          'There are still account of this type, please change the type of those accounts before deleting role',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      dispatch(deleteRoleById(selectedRoleId))
        .catch((e) =>
          showNotification({
            id: 'delete-data',
            color: 'red',
            title: 'Error while delete role',
            message: e.message ?? 'Failed to delete role',
            icon: <X />,
            autoClose: 3000,
          })
        )
        .then(() =>
          showNotification({
            id: 'delete-data',
            color: 'teal',
            title: 'Role was deleted',
            message: 'Role was successfully deleted',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .then(() => {
          props.toggleShown();
          dispatch(fetchRoles(props.pagination));
          dispatch(fetchDeletedRoles(''));
        });
    }
  };

  useEffect(() => {
    if (selectedRoleId) {
      dispatch(fetchAccountByRole(selectedRoleId))
        .unwrap()
        .then((response) => setListAccount(response));
    }
  }, [dispatch, selectedRoleId]);

  useEffect(() => {
    if (!props.isShown) {
      setShownListAccount(false);
    }
  }, [props.isShown]);

  useEffect(() => {
    if (!isShownListAccount) {
      setRole('');
    }
  }, [isShownListAccount]);

  const handleUpdateAccount = (account, roleId: string) => {
    dispatch(
      updateAccountById({
        id: account.id,
        payload: {
          ...account,
          roleId: roleId,
        },
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while updating role',
          message: e.message ?? 'Failed to update role',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Role was updated',
          message: 'Role was successfully updated',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      // .then(() => props.toggleShown())
      .then(() =>
        dispatch(fetchAccountByRole(selectedRoleId))
          .unwrap()
          .then((response) => setListAccount(response))
      );
  };

  const ListAccountByRoleId = () => {
    const rows =
      listAccount && listAccount.length > 0
        ? listAccount.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.fullname}</td>
              <td>
                <Select
                  name="role"
                  id="role"
                  onChange={(e) => setRole(e)}
                  searchable
                  value={role || row.roleId}
                  data={props.roles}
                  required
                />
              </td>
              <td className={classes.actionButtonContainer}>
                <Button
                  variant="outline"
                  color="green"
                  disabled={role === row.roleId || role === '' ? true : false}
                  onClick={() => handleUpdateAccount(row, role)}
                >
                  Save
                </Button>
              </td>
            </tr>
          ))
        : null;
    return listAccount && listAccount.length > 0 ? (
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
              Full name
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
        <h1>Dont have any account with this role</h1>
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
      size={isShownListAccount && listAccount.length > 0 ? '50%' : null}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Deleting this role will also delete all members belonging to this
          role. Are you sure you want to delete it?
        </Text>
        <div className={classes.modalFooter}>
          {listAccount.length > 0 ? (
            <Button
              leftIcon={<ScanEye />}
              style={{ backgroundColor: 'blue', width: '65%', margin: 10 }}
              onClick={() => setShownListAccount(!isShownListAccount)}
            >
              List account with this role
            </Button>
          ) : null}

          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => handleDeleteRole()}
            style={{
              width: '65%',
              margin: 10,
            }}
          >
            Delete this role
          </Button>
          <Button
            onClick={() => props.toggleShown()}
            leftIcon={<X />}
            style={{
              backgroundColor: FPT_ORANGE_COLOR,
              width: '65%',
              margin: 10,
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
      {isShownListAccount && listAccount.length > 0 ? (
        <ListAccountByRoleId />
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
