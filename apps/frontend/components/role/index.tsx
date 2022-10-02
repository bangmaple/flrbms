import React, {useEffect, useState} from 'react';
import {Button} from '@mantine/core';
import Header from '../common/header.component';
import {
  BuildingWarehouse,
  Check,
  Plus,
  TrashOff, UserCircle,
  X,
} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  fetchRoleById,
  fetchRoles,
  updateRoleById,
  addRole,
} from '../../redux/features/role';
import {
  defaultPaginationParams,
  PaginationParams,
} from '../../models/pagination-params.model';
import {useDebouncedValue} from '@mantine/hooks';
import {TableBody} from '../actions/table-body.component';
import TableFooter from '../actions/table-footer.component';
import TableHeader from '../actions/table-header.component';
import InfoModal from '../actions/modal/info-modal.component';
import * as Yup from 'yup';
import AddModal from '../actions/modal/add-modal.component';
import {FormikValues, useFormik} from 'formik';
import {InputAddProps} from '../actions/models/input-add-props.model';
import {InputTypes} from '../actions/models/input-type.constant';
import UpdateModal from '../actions/modal/update-modal.component';
import {InputUpdateProps} from '../actions/models/input-update-props.model';
import AdminLayout from '../layout/admin.layout';
import RestoreDeletedModal from '../role/restore-deleted.modal.component';
import DeleteModal from '../role/delete-modal.component';
import dayjs from 'dayjs';
import {showNotification} from '@mantine/notifications';
import NoDataFound from '../no-data-found';
import {fetchAccountByRole} from '../../redux/features/account/thunk/fetch-accounts-by-role';

const AddRoleValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum role name is 1 character ')
    .max(100, 'Maximum role name is 100 characters.')
    .required('Role name is required'),
  description: Yup.string().max(
    500,
    'Maximum role description is 500 characters'
  ),
});

const UpdateRoleValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum role name is 1 character')
    .max(100, 'Maximum role name is 100 characters.')
    .required('Role name is required'),
  description: Yup.string().max(
    500,
    'Maximum role description is 500 characters'
  ),
});

const ManageRole: React.FC<any> = () => {
  const roles = useAppSelector((state) => state.role.roles);
  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams
  );

  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const [roleNames, setRoleNames] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (roles.items) {
      const tmp = roles.items.map((row, index) => ({
        value: row.id,
        label: row.name,
      }));
      setRoleNames(tmp);
    }
  }, [roles]);

  useEffect(() => {
    dispatch(fetchRoles(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.dir,
    pagination.sort,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  const toggleSortDirection = () => {
    setPagination({
      ...pagination,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...defaultPaginationParams,
      search: val,
    });
  };

  const handleLimitChange = (val: number) => {
    setPagination({
      ...pagination,
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
    setPagination(defaultPaginationParams);
  };

  const [id, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isListAccountShown, setListAccountShown] = useState<boolean>(false);
  const [listAccountOfRole, setListAccountOfRole] = useState<any[]>();
  const role = useAppSelector((state) => state.role.role);

  const handleFetchById = (idVal) => {
    return dispatch(fetchRoleById(idVal));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchAccountByRole(id))
        .unwrap()
        .then((response) => setListAccountOfRole(response));
    }
  }, [dispatch, id]);

  const ShowAccountOfRoleButton: React.FC<any> = () => {
    return (
      <Button onClick={() => setListAccountShown(!isListAccountShown)}>
        Accounts
      </Button>
    );
  };

  const ActionsFilter: React.FC = () => {
    return (
      <div>
        <Button
          leftIcon={<Plus/>}
          color="green"
          onClick={() => setAddShown(!isAddShown)}
          style={{marginRight: 10}}
        >
          Add
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDeletedShown(true)}
        >
          <TrashOff/>
        </Button>
      </div>
    );
  };

  const handleActionsCb = {
    info: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    update: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setUpdateShown(!isUpdateShown));
    },
    delete: (id) => {
      setId(id);
      handleFetchById(id);
      setDeleteShown(!isDeleteShown);
    },
  };

  const infoFields = [
    {
      label: 'Name',
      id: 'name',
      name: 'name',
      value: role.name,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      id: 'description',
      name: 'description',
      value: role.description,
      readOnly: true,
      inputtype: InputTypes.TextArea,
    },
    {
      label: 'Created at',
      id: 'createdAt',
      name: 'createdAt',
      value: dayjs(role.createdAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Created By',
      id: 'createdBy',
      name: 'createdBy',
      value: role.createdBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated At',
      id: 'updatedAt',
      name: 'updatedAt',
      value: dayjs(role.updatedAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Update By',
      id: 'updatedBy',
      name: 'updatedBy',
      value: role.updatedBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
  ];

  const addFields: InputAddProps[] = [
    {
      label: 'Name',
      description: 'Role must be unique between others (Max 100 char.)',
      id: 'name',
      name: 'name',
      required: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      description:
        'Role description describe additional information (Max 500 char.)',
      id: 'description',
      name: 'description',
      required: false,
      inputtype: InputTypes.TextArea,
    },
  ];

  const updateFields: InputUpdateProps[] = [
    {
      id: 'id',
      name: 'id',
      inputtype: InputTypes.TextInput,
      label: 'Id',
      readOnly: true,
      required: false,
      value: role.id,
      disabled: true,
    },
    {
      id: 'name',
      name: 'name',
      inputtype: InputTypes.TextInput,
      label: 'Role name',
      readOnly: true,
      required: true,
      value: role.name,
      disabled: false,
    },
    {
      id: 'description',
      name: 'description',
      inputtype: InputTypes.TextArea,
      label: 'Description',
      readOnly: false,
      required: false,
      value: role.description,
      disabled: false,
    },
  ];
  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
    addFormik.resetForm();
  };
  const handleAddSubmit = (values: FormikValues) => {
    dispatch(
      addRole({
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'add-role',
          color: 'teal',
          title: 'Role was added',
          message: 'Role was successfully added to the system',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => handleAddModalClose())
      .catch((e) =>
        showNotification({
          id: 'add-role',
          color: 'red',
          title: 'Error while adding role',
          message: e.message ?? 'Failed to add role',
          icon: <X/>,
          autoClose: 3000,
        })
      );
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateRoleById({
        id: values.id,
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'update-data',
          color: 'red',
          title: 'Error while update role',
          message: e.message ?? 'Failed to update role',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'update-data',
          color: 'teal',
          title: 'Role was updated',
          message: 'Role was successfully updated',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => handleUpdateModalClose());
  };

  const updateFormik = useFormik({
    validationSchema: UpdateRoleValidation,
    initialValues: {
      id: role.id,
      name: role.name,
      description: role.description,
    },
    enableReinitialize: true,
    onSubmit: (e) => handleUpdateSubmit(e),
  });

  const handleUpdateModalClose = () => {
    setUpdateShown(!isUpdateShown);
    updateFormik.resetForm();
  };

  const handleCloseInfoModal = () => {
    setInfoShown(!isInfoShown);
    setListAccountShown(false);
  };

  const addFormik = useFormik({
    validationSchema: AddRoleValidation,
    initialValues: {
      name: '',
      description: '',
    },
    enableReinitialize: true,
    onSubmit: (e) => handleAddSubmit(e),
  });
  return (
    <AdminLayout>
      <Header title="Roles Management" icon={<UserCircle size={50}/>}/>
      <TableHeader
        actionsLeft={null}
        handleResetFilter={() => handleResetFilter()}
        actions={<ActionsFilter/>}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
      />
      <RestoreDeletedModal
        isShown={isRestoreDeletedShown}
        toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
        pagination={pagination}
      />
      {roles.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={() => toggleSortDirection()}
            data={roles.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal
            header="Role Information"
            fields={infoFields}
            toggleShown={() => handleCloseInfoModal()}
            isShown={isInfoShown}
            itemsOfDataButton={<ShowAccountOfRoleButton/>}
            isShowListItems={isListAccountShown}
            itemsOfData={listAccountOfRole}
            title="LIST ACCOUNTS OF ROLE"
          />

          <UpdateModal
            fields={updateFields}
            formik={updateFormik}
            handleSubmit={() => updateFormik.handleSubmit()}
            header="Update current role"
            isShown={isUpdateShown}
            toggleShown={() => setUpdateShown(!isUpdateShown)}
          />

          <DeleteModal
            isShown={isDeleteShown}
            toggleShown={() => setDeleteShown(!isDeleteShown)}
            pagination={pagination}
            roles={roleNames}
          />
        </>
      ) : (
        <NoDataFound/>
      )}
      <AddModal
        header="Add new role"
        isShown={isAddShown}
        toggleShown={() => handleAddModalClose()}
        formik={addFormik}
        fields={addFields}
        handleSubmit={() => addFormik.handleSubmit()}
      />
      {roles.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={roles.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ManageRole;
