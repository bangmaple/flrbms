import React, {useEffect, useState} from 'react';
import {Button} from '@mantine/core';
import Header from '../common/header.component';
import {
  BuildingWarehouse,
  Check, Message,
  Plus,
  TrashOff,
  X,
} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  fetchBookingReasonById,
  fetchBookingReasons,
  updateBookingReasonById,
  addBookingReason,
} from '../../redux/features/booking-reason';
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
import dayjs from 'dayjs';
import RestoreDeletedModal from './restore-deleted.modal.component';
import DeleteModal from './delete-modal.component';
import {showNotification} from '@mantine/notifications';
import NoDataFound from '../no-data-found';

const AddBookingReasonValidation = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum booking reason is 1 character ')
    .max(100, 'Maximum booking reason is 100 characters.')
    .required('Booking reason name is required'),
  description: Yup.string().max(
    500,
    'Maximum booking reason description is 500 characters'
  ),
});

const UpdateBookingReasonValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum booking reason is 1 character')
    .max(100, 'Maximum booking reason is 100 characters.')
    .required('Booking reason name is required'),
  description: Yup.string().max(
    500,
    'Maximum booking reason description is 500 characters'
  ),
});

const ManageBookingReason: React.FC<any> = () => {
  const bookingReasons = useAppSelector(
    (state) => state.bookingReason.bookingReasons
  );

  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams
  );

  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);

  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBookingReasons(pagination));
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

  const [_, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const bookingReason = useAppSelector(
    (state) => state.bookingReason.bookingReason
  );

  const handleFetchById = (idVal) => {
    return dispatch(fetchBookingReasonById(idVal));
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
      value: bookingReason.name,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      id: 'description',
      name: 'description',
      value: bookingReason.description,
      readOnly: true,
      inputtype: InputTypes.TextArea,
    },
    {
      label: 'Created at',
      id: 'createdAt',
      name: 'createdAt',
      value: dayjs(bookingReason.createdAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Created By',
      id: 'createdBy',
      name: 'createdBy',
      value: bookingReason.createdBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated At',
      id: 'updatedAt',
      name: 'updatedAt',
      value: dayjs(bookingReason.updatedAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated By',
      id: 'updatedBy',
      name: 'updatedBy',
      value: bookingReason.updatedBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
  ];

  const addFields: InputAddProps[] = [
    {
      label: 'Name',
      description:
        'Booking reason must be unique between others (Max 100 char.)',
      id: 'name',
      name: 'name',
      required: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      description:
        'Booking reason description describe additional information (Max 500 char.)',
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
      value: bookingReason.id,
      disabled: true,
    },
    {
      id: 'name',
      name: 'name',
      inputtype: InputTypes.TextInput,
      label: 'Booking reason name',
      readOnly: false,
      required: true,
      value: bookingReason.name,
      disabled: false,
    },
    {
      id: 'description',
      name: 'description',
      inputtype: InputTypes.TextArea,
      label: 'Description',
      readOnly: false,
      required: false,
      value: bookingReason.description,
      disabled: false,
    },
  ];
  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
    addFormik.resetForm();
  };
  const handleAddSubmit = (values: FormikValues) => {
    dispatch(
      addBookingReason({
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'restore-data',
          color: 'red',
          title: 'Error while adding booking reason',
          message: e.message ?? 'Failed to add booking reason',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'restore-data',
          color: 'teal',
          title: 'New booking reason was added',
          message: 'New booking reason successfully added',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => handleAddModalClose());
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateBookingReasonById({
        id: values.id,
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'restore-data',
          color: 'red',
          title: 'Error while updating booking reason',
          message: e.message ?? 'Failed to update booking reason',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'restore-data',
          color: 'teal',
          title: 'New booking reason was updated',
          message: 'New booking reason successfully updated',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => handleUpdateModalClose());
  };

  const updateFormik = useFormik({
    validationSchema: UpdateBookingReasonValidation,
    initialValues: {
      id: bookingReason.id,
      name: bookingReason.name,
      description: bookingReason.description,
    },
    enableReinitialize: true,
    onSubmit: (e) => handleUpdateSubmit(e),
  });

  const handleUpdateModalClose = () => {
    setUpdateShown(!isUpdateShown);
    updateFormik.resetForm();
  };

  const addFormik = useFormik({
    validationSchema: AddBookingReasonValidation,
    initialValues: {
      name: '',
      description: '',
    },
    enableReinitialize: true,
    onSubmit: (e) => handleAddSubmit(e),
  });
  return (
    <AdminLayout>
      <Header title="Booking Reasons Management" icon={<Message size={50}/>}/>
      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        actions={<ActionsFilter/>}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
        actionsLeft={null}
      />

      <RestoreDeletedModal
        isShown={isRestoreDeletedShown}
        toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
        pagination={pagination}
      />
      {bookingReasons.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={() => toggleSortDirection()}
            data={bookingReasons.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal
            header="Booking Reason Information"
            fields={infoFields}
            toggleShown={() => setInfoShown(!isInfoShown)}
            isShown={isInfoShown}
            itemsOfDataButton={null}
            isShowListItems={null}
            itemsOfData={null}
            title={null}
          />

          <UpdateModal
            fields={updateFields}
            formik={updateFormik}
            handleSubmit={() => updateFormik.handleSubmit()}
            header="Update current booking reason"
            isShown={isUpdateShown}
            toggleShown={() => setUpdateShown(!isUpdateShown)}
          />

          <DeleteModal
            isShown={isDeleteShown}
            toggleShown={() => setDeleteShown(!isDeleteShown)}
            pagination={pagination}
          />
        </>
      ) : (
        <NoDataFound/>
      )}
      <AddModal
        header="Add new booking reason"
        isShown={isAddShown}
        toggleShown={() => handleAddModalClose()}
        formik={addFormik}
        fields={addFields}
        handleSubmit={() => addFormik.handleSubmit()}
      />
      {bookingReasons.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={bookingReasons.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ManageBookingReason;
