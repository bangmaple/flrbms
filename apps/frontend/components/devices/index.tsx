import {GetServerSideProps} from 'next';
import AdminLayout from '../../components/layout/admin.layout';
import {Button} from '@mantine/core';
import {
  ArchiveOff,
  BuildingWarehouse, Devices,
  Download,
  Plus,
  TrashOff,
} from 'tabler-icons-react';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {useDebouncedValue} from '@mantine/hooks';
import NoDataFound from '../../components/no-data-found';
import TableHeader from '../../components/actions/table-header.component';
import { TableBody } from './table-body.component';
import TableFooter from '../../components/actions/table-footer.component';
import DisableDeviceModal from '../../components/devices/disable-modal.component';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import {FormikValues, useFormik} from 'formik';
import Header from '../../components/common/header.component';
import UpdateModal from '../../components/devices/update-modal.component';

import * as Yup from 'yup';
import {fetchDevices} from '../../redux/features/devices/thunk/fetch-devices.thunk';
import {fetchDeviceById} from '../../redux/features/devices/thunk/fetch-by-id.thunk';
import {fetchDeviceTypeNames} from '../../redux/features/device-type/thunk/fetch-device-type-names.thunk';
import {updateDeviceById} from '../../redux/features/devices/thunk/update-by-id';
import DeviceInfoModal from './info-modal.component';
import RestoreDisabledDeviceModal from './restore-disabled.modal.component';
import DeleteDeviceModal from './delete-modal.component';
import RestoreDeletedDeviceModal from './restore-deleted.modal.component';
import AddDeviceModal from './add-modal.component';

const UpdateDeviceValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum device type name is 1 character')
    .max(100, 'Maximum device type name is 100 characters.')
    .required('Device type name is required'),
  description: Yup.string().max(
    500,
    'Maximum device type description is 500 characters'
  ),
});

const defaultPagination = {
  limit: 5,
  page: 1,
  name: '',
  search: '',
  type: '',
  sort: 'name',
  dir: 'ASC',
};

function DevicesManagement() {
  const devices = useAppSelector((state) => state.device.devices);
  const [deviceTypeNames, setDeviceTypeNames] = useState([]);
  const [pagination, setPagination] = useState<PagingParams>(defaultPagination);
  const [debounceSearchValue] = useDebouncedValue(pagination.name, 400);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDevices(pagination));
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
    dispatch(fetchDeviceTypeNames())
      .unwrap()
      .then((deviceTypes) => setDeviceTypeNames(deviceTypes));
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
    return dispatch(fetchDeviceById(idVal));
  };

  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const [isDisableShown, setDisableShown] = useState<boolean>(false);
  const [isRestoreDisabledShown, setRestoreDisabledShown] =
    useState<boolean>(false);
  const device = useAppSelector((state) => state.device.device);

  const ActionsFilter: React.FC = () => {
    return (
      <>
        <Button
          leftIcon={<Plus/>}
          color="green"
          onClick={() => setAddShown(true)}
          style={{marginRight: 10}}
        >
          Add
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDisabledShown(true)}
          style={{marginRight: 10}}
        >
          <ArchiveOff color={'red'}/>
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDeletedShown(true)}
          style={{marginRight: 10}}
        >
          <TrashOff/>
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
        .then(() => setDisableShown(!isDisableShown));
    },
  };

  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateDeviceById({
        id: values.id,
        payload: values.payload,
      })
    )
      .unwrap()
      .then((e) => handleUpdateModalClose());
  };

  const updateFormik = useFormik({
    validationSchema: UpdateDeviceValidation,
    initialValues: {
      id: device.id,
      name: device.name,
      description: device.description,
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
          title="Devices Management"
          icon={<Devices size={50}/>}
        />
        <TableHeader
          actionsLeft={null}
          handleResetFilter={() => handleResetFilter()}
          actions={<ActionsFilter/>}
          setSearch={(val) => handleSearchValue(val)}
          search={pagination.search}
        />

        <RestoreDisabledDeviceModal
          isShown={isRestoreDisabledShown}
          toggleShown={() => setRestoreDisabledShown(!isRestoreDisabledShown)}
          pagination={pagination}
          deviceTypes={deviceTypeNames}
        />
        <RestoreDeletedDeviceModal
          isShown={isRestoreDeletedShown}
          toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
          pagination={pagination}
        />

        {devices?.items ? (
          <>
            <TableBody
              actionButtonCb={handleActionsCb}
              toggleSortDirection={(field) => toggleSortDirection(field)}
              data={devices.items}
              page={pagination.page}
              itemsPerPage={pagination.limit}
              search={pagination.search}
            />
            <DeviceInfoModal
              // header="Room Information"
              // fields={infoFields}
              toggleShown={() => setInfoShown(!isInfoShown)}
              isShown={isInfoShown}
              toggleDeleteModalShown={() => setDeleteShown(!isDeleteShown)}
            />
            <DisableDeviceModal
              isShown={isDisableShown}
              toggleShown={() => setDisableShown(!isDisableShown)}
              pagination={pagination}
            />
            <DeleteDeviceModal
              isShown={isDeleteShown}
              toggleShown={() => setDeleteShown(!isDeleteShown)}
              toggleInforModalShown={() => setInfoShown(!isInfoShown)}
              pagination={pagination}
            />
            <UpdateModal
              // formik={updateFormik}
              // handleSubmit={() => updateFormik.handleSubmit()}
              isShown={isUpdateShown}
              toggleShown={() => setUpdateShown(!isUpdateShown)}
              pagination={pagination}
              deviceTypes={deviceTypeNames}
            />
          </>
        ) : (
          <NoDataFound/>
        )}

        <AddDeviceModal
          isShown={isAddShown}
          pagination={pagination}
          toggleShown={() => handleAddModalClose()}
          deviceTypes={deviceTypeNames}
        />
        {devices?.meta ? (
          <TableFooter
            handlePageChange={(val) => handlePageChange(val)}
            handleLimitChange={(val) => handleLimitChange(val)}
            metadata={devices.meta}
          />
        ) : null}
      </AdminLayout>
    </>
  )
}

export default DevicesManagement;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      assa: null,
    },
  };
};


