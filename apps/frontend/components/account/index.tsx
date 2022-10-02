import { GetServerSideProps } from 'next';
import AdminLayout from '../layout/admin.layout';
import { Button } from '@mantine/core';
import {BuildingWarehouse, Plus, TrashOff, Users} from 'tabler-icons-react';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useDebouncedValue } from '@mantine/hooks';
import NoDataFound from '../no-data-found';
import TableHeader from '../actions/table-header.component';
import { TableBody } from './table-body.component';
import TableFooter from '../actions/table-footer.component';
import DisableModal from './disable-modal.component';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { FormikValues, useFormik } from 'formik';
import Header from '../common/header.component';
import { fetchRoleNames } from '../../redux/features/role';
import * as Yup from 'yup';
import { fetchAccounts } from '../../redux/features/account/thunk/fetch-accounts.thunk';
import InfoModal from './info-modal.component';
import { fetchAccountById } from '../../redux/features/account/thunk/fetch-by-id.thunk';
import AccountUpdateModal from './update-modal.component';
import { updateAccountById } from '../../redux/features/account/thunk/update-account-by-id';
import AddAccountModal from './add-modal.component';
import RestoreDeletedModal from './restore-deleted.modal.component';
import DeleteModal from './delete-modal.component';
import RestoreModal from './restore-modal.component';

const UpdateAccountValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum name is 1 character')
    .max(100, 'Maximum name is 100 characters.')
    .required('Name is required'),
  description: Yup.string().max(500, 'Maximum description is 500 characters'),
});

const defaultPagination = {
  limit: 5,
  page: 1,
  name: '',
  search: '',
  type: '',
  sort: 'fullname',
  dir: 'ASC',
};

function AccountsManagement() {
  const accounts = useAppSelector((state) => state.account.accounts);
  const [roleNames, setRoleNames] = useState([]);
  const [pagination, setPagination] = useState<PagingParams>(defaultPagination);
  const [debounceSearchValue] = useDebouncedValue(pagination.name, 400);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAccounts(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.name,
    pagination.type,
    pagination.sort,
    pagination.dir,
    pagination.search,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchRoleNames())
      .unwrap()
      .then((listRoleName) => {
        const formatListRole = listRoleName.filter(
          (role) => role.label !== 'Staff'
        );
        setRoleNames(formatListRole)
      });
  }, []);

  const toggleSortDirection = (field) => {
    setPagination({
      ...pagination,
      sort: field,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...defaultPagination,
      search: val,
    });
  };

  const handleLimitChange = (val: number) => {
    setPagination({
      ...pagination,
      page: 1,
      limit: val,
    });
  };

  const handlePageChange = (val: number) => {
    setPagination({
      ...pagination,
      page: val,
    });
  };

  const handleResetFilter = () => {
    setPagination(defaultPagination);
  };

  const handleFetchById = (idVal) => {
    return dispatch(fetchAccountById(idVal));
  };

  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isRestoreShown, setRestoreShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const [isDisableShown, setDisableShown] = useState<boolean>(false);
  const account = useAppSelector((state) => state.account.account);

  const ActionsFilter: React.FC = () => {
    return (
      <>
        <Button
          leftIcon={<Plus />}
          color="green"
          onClick={() => setAddShown(true)}
          style={{ marginRight: 10 }}
        >
          Add
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDeletedShown(true)}
          style={{ marginRight: 10 }}
        >
          <TrashOff />
        </Button>
      </>
    );
  };

  const handleActionsCb = {
    info: (id) => {
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    update: (id) => {
      handleFetchById(id)
        .unwrap()
        .then(() => setUpdateShown(!isUpdateShown));
    },
    disable: (id) => {
      handleFetchById(id)
        .unwrap()
        .then(() => setDisableShown(!isDeleteShown));
    },
    restore: (id) => {
      handleFetchById(id)
        .unwrap()
        .then(() => setRestoreShown(!isRestoreShown));
    },
  };

  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateAccountById({
        id: values.id,
        payload: values.payload,
      })
    )
      .unwrap()
      .then(() => handleUpdateModalClose());
  };

  const updateFormik = useFormik({
    validationSchema: UpdateAccountValidation,
    initialValues: {
      id: account.id,
      name: account.username,
      description: account.description,
    },
    enableReinitialize: true,
    onSubmit: (e) => handleUpdateSubmit(e),
  });

  const handleUpdateModalClose = () => {
    setUpdateShown(!isUpdateShown);
    updateFormik.resetForm();
  };

  return (
    <>
      <AdminLayout>
        <Header
          title="Accounts Management"
          icon={<Users size={50} />}
        />
        <TableHeader
          actionsLeft={null}
          handleResetFilter={() => handleResetFilter()}
          actions={<ActionsFilter />}
          setSearch={(val) => handleSearchValue(val)}
          search={pagination.search}
        />
        <RestoreDeletedModal
          isShown={isRestoreDeletedShown}
          toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
          pagination={pagination}
        />

        {accounts?.items ? (
          <>
            <TableBody
              actionButtonCb={handleActionsCb}
              toggleSortDirection={(field) => toggleSortDirection(field)}
              data={accounts.items}
              page={pagination.page}
              itemsPerPage={pagination.limit}
              search={pagination.search}
            />
            <InfoModal
              toggleShown={() => setInfoShown(!isInfoShown)}
              isShown={isInfoShown}
              toggleDeleteModalShown={() => setDeleteShown(!isDeleteShown)}
            />
            <DisableModal
              isShown={isDisableShown}
              toggleShown={() => setDisableShown(!isDisableShown)}
              toggleInforModalShown={() => setInfoShown(!isInfoShown)}
              pagination={pagination}
            />

            <RestoreModal
              isShown={isRestoreShown}
              toggleShown={() => setRestoreShown(!isRestoreShown)}
              toggleInforModalShown={() => setInfoShown(!isInfoShown)}
              pagination={pagination}
            />

            <DeleteModal
              isShown={isDeleteShown}
              toggleShown={() => setDeleteShown(!isDeleteShown)}
              pagination={pagination}
              toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            />
            <AccountUpdateModal
              formik={updateFormik}
              handleSubmit={() => updateFormik.handleSubmit()}
              isShown={isUpdateShown}
              toggleShown={() => setUpdateShown(!isUpdateShown)}
              pagination={pagination}
              role={roleNames}
            />
          </>
        ) : (
          <NoDataFound />
        )}

        <AddAccountModal
          isShown={isAddShown}
          pagination={pagination}
          toggleShown={() => handleAddModalClose()}
          listRole={roleNames}
        />
        {accounts?.meta ? (
          <TableFooter
            handlePageChange={(val) => handlePageChange(val)}
            handleLimitChange={(val) => handleLimitChange(val)}
            metadata={accounts.meta}
          />
        ) : null}
      </AdminLayout>
    </>
  );
}

export default AccountsManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      assa: null,
    },
  };
};
