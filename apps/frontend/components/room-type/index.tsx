import React, {useEffect, useState} from 'react';
import {Button, createStyles} from '@mantine/core';
import Header from '../common/header.component';
import {
  BuildingWarehouse,
  Check, Door,
  Plus,
  TrashOff,
  X,
} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  fetchRoomTypeById,
  fetchRoomTypeNames,
  fetchRoomTypes,
} from '../../redux/features/room-type';
import {
  defaultPaginationParams,
  PaginationParams,
} from '../../models/pagination-params.model';
import {useDebouncedValue} from '@mantine/hooks';
import TableHeader from '../actions/table-header.component';
import {TableBody} from '../actions/table-body.component';
import TableFooter from '../actions/table-footer.component';
import InfoModal from '../actions/modal/info-modal.component';
import * as Yup from 'yup';
import AddModal from '../actions/modal/add-modal.component';
import {FormikValues, useFormik} from 'formik';
import {addRoomType} from '../../redux/features/room-type/thunk/add-room-type.thunk';
import {InputAddProps} from '../actions/models/input-add-props.model';
import {InputTypes} from '../actions/models/input-type.constant';
import UpdateModal from '../actions/modal/update-modal.component';
import {updateRoomTypeById} from '../../redux/features/room-type/thunk/update-room-type-by-id.thunk';
import {InputUpdateProps} from '../actions/models/input-update-props.model';
import DeleteModal from './delete-modal.component';
import AdminLayout from '../layout/admin.layout';
import RestoreDeletedModal from './restore-deleted.modal.component';
import {showNotification} from '@mantine/notifications';
import dayjs from 'dayjs';
import NoDataFound from '../no-data-found';
import {fetchRoomsByRoomType} from '../../redux/features/room/thunk/fetch-rooms-by-room-type';

const AddRoomTypeValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum room type name is 1 character')
    .max(100, 'Maximum room type name is 100 characters.')
    .required('Room type name is required'),
  description: Yup.string().max(
    500,
    'Maximum room type description is 500 characters'
  ),
});

const UpdateRoomTypeValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum room type name is 1 character')
    .max(100, 'Maximum room type name is 100 characters.')
    .required('Room type name is required'),
  description: Yup.string().max(
    500,
    'Maximum room type description is 500 characters'
  ),
});

const ManageRoomType: React.FC<any> = () => {
  const roomTypes = useAppSelector((state) => state.roomType.roomTypes);
  const [roomTypeNames, setRoomTypeNames] = useState([]);
  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams
  );

  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRoomTypes(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.dir,
    pagination.sort,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchRoomTypeNames())
      .unwrap()
      .then((roomTypes) => setRoomTypeNames(roomTypes));
  }, []);

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
  const [isListRoomShown, setListRoomShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const roomType = useAppSelector((state) => state.roomType.roomType);
  const [listRoomOfType, setListRoomOfType] = useState<any[]>();


  useEffect(() => {
    if (id) {
      dispatch(fetchRoomsByRoomType(id))
        .unwrap()
        .then((response) => setListRoomOfType(response));
    }
  }, [dispatch, id]);

  const handleFetchById = (idVal) => {
    return dispatch(fetchRoomTypeById(idVal));
  };

  const ShowRoomOfTypeButton: React.FC<any> = () => {
    return <Button onClick={() => setListRoomShown(!isListRoomShown)}>Rooms</Button>;
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
        {/* <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDisabledShown(true)}
          style={{ marginRight: 10 }}
        >
          <PencilOff color={'red'} />
        </Button> */}
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
      handleFetchById(id)
        .unwrap()
        .then(() => setDeleteShown(!isDeleteShown));
    },
  };

  const infoFields = [
    {
      label: 'Room type name',
      id: 'name',
      name: 'name',
      value: roomType.name,
      readOnly: true,
      inputtype: InputTypes.TextInput,

    },
    {
      label: 'Room type description',
      id: 'description',
      name: 'description',
      value: roomType.description,
      readOnly: true,
      inputtype: InputTypes.TextArea,
    },
    {
      label: 'Created at',
      id: 'createdAt',
      name: 'createdAt',
      value: dayjs(roomType.createdAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Created by',
      id: 'createdBy',
      name: 'createdBy',
      value: roomType.createdBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated at',
      id: 'updatedAt',
      name: 'updatedAt',
      value: dayjs(roomType.updatedAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated by',
      id: 'updatedBy',
      name: 'updatedBy',
      value: roomType.updatedBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
  ];

  const addFields: InputAddProps[] = [
    {
      label: 'Name',
      description:
        'Room type name must be unique between others (Max 100 char.)',
      id: 'name',
      name: 'name',
      required: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      description:
        'Room type description describe additional information (Max 500 char.)',
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
      value: roomType.id,
      disabled: true,
    },
    {
      id: 'name',
      name: 'name',
      inputtype: InputTypes.TextInput,
      label: 'Room type name',
      readOnly: false,
      required: true,
      value: roomType.name,
      disabled: false,
    },
    {
      id: 'description',
      name: 'description',
      inputtype: InputTypes.TextArea,
      label: 'Description',
      readOnly: false,
      required: false,
      value: roomType.description,
      disabled: false,
    },
  ];
  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
    addFormik.resetForm();
  };
  const handleAddSubmit = (values: FormikValues) => {
    dispatch(
      addRoomType({
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Add-room-type',
          color: 'teal',
          title: 'Room type was added',
          message: 'Room type was successfully added',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then((e) => handleAddModalClose())
      .catch((e) => {
        showNotification({
          id: 'Add-room-type',
          color: 'red',
          title: 'Error while add room type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateRoomTypeById({
        id: values.id,
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Update-room-type',
          color: 'teal',
          title: 'Room type was updated',
          message: 'Room type was successfully updated',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then((e) => handleUpdateModalClose())
      .catch((e) => {
        showNotification({
          id: 'Update-room-type',
          color: 'red',
          title: 'Error while update room type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };

  const updateFormik = useFormik({
    validationSchema: UpdateRoomTypeValidation,
    initialValues: {
      id: roomType.id,
      name: roomType.name,
      description: roomType.description,
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
    setListRoomShown(false);
  };

  const addFormik = useFormik({
    validationSchema: AddRoomTypeValidation,
    initialValues: {
      name: '',
      description: '',
    },
    enableReinitialize: true,
    onSubmit: (e) => handleAddSubmit(e),
  });

  return (
    <AdminLayout>
      <Header title="Room Types Management" icon={<Door size={50}/>}/>
      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        actionsLeft={null}
        actions={<ActionsFilter/>}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
      />
      <RestoreDeletedModal
        isShown={isRestoreDeletedShown}
        toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
        pagination={pagination}
      />
      {roomTypes?.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={() => toggleSortDirection()}
            data={roomTypes.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal
            header="Room Type Information"
            fields={infoFields}
            toggleShown={() => handleCloseInfoModal()}
            isShown={isInfoShown}
            itemsOfDataButton={<ShowRoomOfTypeButton/>}
            isShowListItems={isListRoomShown}
            itemsOfData={listRoomOfType}
            title='LIST ROOM OF TYPE'
          />

          <UpdateModal
            fields={updateFields}
            formik={updateFormik}
            handleSubmit={() => updateFormik.handleSubmit()}
            header="Update current room type"
            isShown={isUpdateShown}
            toggleShown={() => setUpdateShown(!isUpdateShown)}
          />

          <DeleteModal
            isShown={isDeleteShown}
            toggleShown={() => setDeleteShown(!isDeleteShown)}
            pagination={pagination}
            roomTypes={roomTypeNames}
          />
        </>
      ) : (<NoDataFound/>)}
      <AddModal
        header="Add new room type"
        isShown={isAddShown}
        toggleShown={() => handleAddModalClose()}
        formik={addFormik}
        fields={addFields}
        handleSubmit={() => addFormik.handleSubmit()}
      />
      {roomTypes.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={roomTypes.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ManageRoomType;
