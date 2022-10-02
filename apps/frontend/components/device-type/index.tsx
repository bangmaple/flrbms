import React, {useEffect, useState} from 'react';
import {Button} from '@mantine/core';
import AdminLayout from '../../components/layout/admin.layout';
import Header from '../../components/common/header.component';
import {
  BuildingWarehouse,
  Check,
  DeviceTablet,
  Plus,
  TrashOff,
  X,
} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  fetchDeviceTypes,
  fetchDeviceTypeById,
  updateDeviceTypeById,
  addDeviceType,
} from '../../redux/features/device-type';
import {
  defaultPaginationParams,
  PaginationParams,
} from '../../models/pagination-params.model';
import {useDebouncedValue} from '@mantine/hooks';
import TableHeader from '../../components/actions/table-header.component';
import {TableBody} from '../actions/table-body.component';
import TableFooter from '../../components/actions/table-footer.component';
import * as Yup from 'yup';
import AddModal from '../../components/actions/modal/add-modal.component';
import {FormikValues, useFormik} from 'formik';
import {InputAddProps} from '../actions/models/input-add-props.model';
import {InputTypes} from '../actions/models/input-type.constant';
import InfoModal from '../../components/actions/modal/info-modal.component';
import UpdateModal from '../../components/actions/modal/update-modal.component';
import {InputUpdateProps} from '../actions/models/input-update-props.model';
import RestoreDeletedModal from '../../components/device-type/restore-deleted.modal.component';
import DeleteModal from '../device-type/delete-modal.component';
import {showNotification} from '@mantine/notifications';
import dayjs from 'dayjs';
import {fetchDeviceTypeNames} from '../../redux/features/device-type/thunk/fetch-device-type-names.thunk';
import NoDataFound from '../no-data-found';
import {fetchDevicesByDeviceType} from '../../redux/features/devices';

const AddDeviceTypeValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum device type name is 1 character')
    .max(100, 'Maximum device type name is 100 characters.')
    .required('Device type name is required'),
  description: Yup.string().max(
    500,
    'Maximum Device type description is 500 characters'
  ),
});

const UpdateDeviceTypeValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum device type name is 1 character')
    .max(100, 'Maximum device type name is 100 characters.')
    .required('Device type name is required'),
  description: Yup.string()
    .max(500, 'Maximum device type description is 500 characters')
    .nullable(),
});

const ManageDeviceType: React.FC<any> = () => {
  const deviceTypes = useAppSelector((state) => state.deviceType.deviceTypes);
  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams
  );

  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDeviceTypes(pagination));
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

  const handleFetchById = (idVal) => {
    return dispatch(fetchDeviceTypeById(idVal));
  };

  const [id, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const [deviceTypeNames, setDeviceTypeNames] = useState([]);
  const [isListDeviceShown, setListDeviceShown] = useState<boolean>(false);
  const [listDeviceOfType, setListDeviceOfType] = useState<any[]>();
  useEffect(() => {
    if (id) {
      dispatch(fetchDevicesByDeviceType(id))
        .unwrap()
        .then((response) => setListDeviceOfType(response));
    }
  }, [dispatch, id]);

  const deviceType = useAppSelector((state) => state.deviceType.deviceType);

  useEffect(() => {
    if (!isUpdateShown) {
      updateFormik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateShown]);

  useEffect(() => {
    dispatch(fetchDeviceTypeNames())
      .unwrap()
      .then((roomTypes) => setDeviceTypeNames(roomTypes));
  }, []);

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

  const ShowDeviceOfTypeButton: React.FC<any> = () => {
    return (
      <Button onClick={() => setListDeviceShown(!isListDeviceShown)}>
        Devices
      </Button>
    );
  };

  const handleActionsCb = {
    info: (_id: string) => {
      setId(_id);
      handleFetchById(_id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    update: (_id: string) => {
      setId(_id);
      handleFetchById(_id)
        .unwrap()
        .then(() => setUpdateShown(!isUpdateShown));
    },
    delete: (_id: string) => {
      setId(_id);
      handleFetchById(_id)
        .unwrap()
        .then(() => setDeleteShown(!isDeleteShown));
    },
  };

  const infoFields = [
    {
      label: 'Name',
      id: 'name',
      name: 'name',
      value: deviceType.name,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      id: 'description',
      name: 'description',
      value: deviceType.description,
      readOnly: true,
      inputtype: InputTypes.TextArea,
    },
    {
      label: 'Created at',
      id: 'createdAt',
      name: 'createdAt',
      value: dayjs(deviceType.createdAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Created By',
      id: 'createdBy',
      name: 'createdBy',
      value: deviceType.createdBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated At',
      id: 'updatedAt',
      name: 'updatedAt',
      value: dayjs(deviceType.updatedAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated By',
      id: 'updatedBy',
      name: 'updatedBy',
      value: deviceType.updatedBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
  ];

  const addFields: InputAddProps[] = [
    {
      label: 'Name',
      description:
        'Device type name must be unique between others (Max 100 char.)',
      id: 'name',
      name: 'name',
      required: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      description:
        'Device type description describe additional information (Max 500 char.)',
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
      value: deviceType.id,
      disabled: true,
    },
    {
      id: 'name',
      name: 'name',
      inputtype: InputTypes.TextInput,
      label: 'Device type name',
      readOnly: false,
      required: true,
      value: deviceType.name,
      disabled: false,
    },
    {
      id: 'description',
      name: 'description',
      inputtype: InputTypes.TextArea,
      label: 'Description',
      readOnly: false,
      required: false,
      disabled: false,
      value: deviceType.description,
    },
  ];
  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
    addFormik.resetForm();
  };
  const handleAddSubmit = (values: FormikValues) => {
    dispatch(
      addDeviceType({
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Add-device-type',
          color: 'teal',
          title: 'Device type was added',
          message: 'Device type was successfully added',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => handleAddModalClose())
      .catch((e) => {
        showNotification({
          id: 'Add-device-type',
          color: 'red',
          title: 'Error while Add device type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateDeviceTypeById({
        id: values.id,
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Update-device-type',
          color: 'teal',
          title: 'Device type was updated',
          message: 'Device type was successfully updated',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => handleUpdateModalClose())
      .catch((e) => {
        showNotification({
          id: 'Update-device-type',
          color: 'red',
          title: 'Error while update device type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };

  const updateFormik = useFormik({
    validationSchema: UpdateDeviceTypeValidation,
    initialValues: {
      id: deviceType.id,
      name: deviceType.name,
      description: deviceType.description,
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
    setListDeviceShown(false);
  };

  const addFormik = useFormik({
    validationSchema: AddDeviceTypeValidation,
    initialValues: {
      name: '',
      description: '',
    },
    enableReinitialize: true,
    onSubmit: (e) => handleAddSubmit(e),
  });

  return (
    <AdminLayout>
      <Header title="Device Types Management" icon={<DeviceTablet size={50}/>}/>
      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        actions={<ActionsFilter/>}
        actionsLeft={null}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
      />

      <RestoreDeletedModal
        isShown={isRestoreDeletedShown}
        toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
        pagination={pagination}
      />
      {deviceTypes.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={() => toggleSortDirection()}
            data={deviceTypes.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal
            header="Device Type Information"
            fields={infoFields}
            toggleShown={() => handleCloseInfoModal()}
            isShown={isInfoShown}
            itemsOfDataButton={<ShowDeviceOfTypeButton/>}
            isShowListItems={isListDeviceShown}
            itemsOfData={listDeviceOfType}
            title="LIST DEVICE OF TYPE"
          />

          <UpdateModal
            fields={updateFields}
            formik={updateFormik}
            handleSubmit={() => updateFormik.handleSubmit()}
            header="Update current device type"
            isShown={isUpdateShown}
            toggleShown={() => setUpdateShown(!isUpdateShown)}
          />
          <DeleteModal
            isShown={isDeleteShown}
            toggleShown={() => setDeleteShown(!isDeleteShown)}
            pagination={pagination}
            deviceTypes={deviceTypeNames}
          />
        </>
      ) : (
        <NoDataFound/>
      )}
      <AddModal
        header="Add new device type"
        isShown={isAddShown}
        toggleShown={() => handleAddModalClose()}
        formik={addFormik}
        fields={addFields}
        handleSubmit={() => addFormik.handleSubmit()}
      />
      {deviceTypes.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={deviceTypes.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ManageDeviceType;
